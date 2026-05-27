// 파일 경로: src/pages/FindIdPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 아이디 / 가입 이메일 찾기 페이지
// - 일반회원 / 소상공인 / 지자체·기관 유형별 아이디 찾기 흐름 제공
// - 일반회원은 이름 + 휴대폰 번호로 profiles에서 가입 이메일 / 아이디 확인
// - 소상공인은 사업자번호 + 대표자명 또는 휴대폰 번호로 owner_profiles / profiles에서 가입 이메일 확인
// - 지자체·기관은 기관명 + 담당자명 + 휴대폰 번호로 gov_profiles에서 담당자 이메일 확인
// - 소상공인은 사업자번호 또는 이메일로 로그인할 수 있도록 안내
// - 원본 회원 정보는 수정하지 않고 조회만 수행
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./LoginPage.css";

const ACCOUNT_TYPES = [
  {
    key: "user",
    label: "일반회원",
    desc: "이름 + 휴대폰",
  },
  {
    key: "business",
    label: "소상공인",
    desc: "사업자번호 + 대표자명",
  },
  {
    key: "gov",
    label: "지자체 / 기관",
    desc: "기관명 + 담당자",
  },
];

const INITIAL_FORM = {
  name: "",
  phone: "",
  businessNumber: "",
  ownerName: "",
  organizationName: "",
  managerName: "",
  managerPhone: "",
};

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeLower(value) {
  return normalizeText(value).toLowerCase();
}

function cleanDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizePhoneInput(value) {
  return String(value || "").replace(/[^\d+\-\s()]/g, "").slice(0, 20);
}

function normalizeBusinessNumber(value) {
  return cleanDigits(value).slice(0, 10);
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function sameText(a, b) {
  return normalizeLower(a) === normalizeLower(b);
}

function samePhone(a, b) {
  const left = cleanDigits(a);
  const right = cleanDigits(b);

  return Boolean(left && right && left === right);
}

function getRowEmail(row) {
  return (
    normalizeEmail(row?.email) ||
    normalizeEmail(row?.login_email) ||
    normalizeEmail(row?.auth_email) ||
    normalizeEmail(row?.store_email) ||
    normalizeEmail(row?.manager_email)
  );
}

function getRowPhone(row) {
  return (
    normalizeText(row?.phone) ||
    normalizeText(row?.mobile_phone) ||
    normalizeText(row?.store_phone) ||
    normalizeText(row?.manager_phone) ||
    normalizeText(row?.rep_phone)
  );
}

function maskEmail(email) {
  const safeEmail = normalizeEmail(email);

  if (!safeEmail || !safeEmail.includes("@")) {
    return safeEmail;
  }

  const [id, domain] = safeEmail.split("@");
  if (id.length <= 2) {
    return `${id[0] || "*"}*@${domain}`;
  }

  return `${id.slice(0, 2)}${"*".repeat(Math.max(2, id.length - 2))}@${domain}`;
}

function getUserLoginId(row) {
  return getRowEmail(row) || normalizeText(row?.username);
}

function getBusinessLoginId(row, businessNumber) {
  return businessNumber || normalizeText(row?.business_number) || normalizeText(row?.biz_no);
}

async function loadRowsByColumn(tableName, columnName, value, limit = 30) {
  const safeValue = normalizeText(value);

  if (!safeValue) return [];

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq(columnName, safeValue)
      .limit(limit);

    if (error) {
      console.warn(`[FindIdPage] ${tableName}.${columnName} 조회 확인 필요:`, error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`[FindIdPage] ${tableName}.${columnName} 조회 실패:`, error);
    return [];
  }
}

async function loadProfileByUserId(userId) {
  const safeUserId = normalizeText(userId);

  if (!safeUserId) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", safeUserId)
      .maybeSingle();

    if (error) {
      console.warn("[FindIdPage] profiles.user_id 조회 확인 필요:", error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.warn("[FindIdPage] profiles.user_id 조회 실패:", error);
    return null;
  }
}

function uniqueRows(rows) {
  const seen = new Set();
  const result = [];

  rows.forEach((row) => {
    const key = [
      row?.id,
      row?.user_id,
      row?.email,
      row?.username,
      row?.business_number,
      row?.biz_no,
      row?.manager_email,
    ]
      .filter(Boolean)
      .join("|");

    if (!key || seen.has(key)) return;

    seen.add(key);
    result.push(row);
  });

  return result;
}

export default function FindIdPage({ defaultAccountType = "user" }) {
  const [selectedAccountType, setSelectedAccountType] = useState(defaultAccountType);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [foundResult, setFoundResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setSelectedAccountType(defaultAccountType);
  }, [defaultAccountType]);

  const canSubmit = useMemo(() => {
    if (submitting) return false;

    if (selectedAccountType === "business") {
      return Boolean(normalizeBusinessNumber(form.businessNumber));
    }

    if (selectedAccountType === "gov") {
      return Boolean(
        normalizeText(form.organizationName) &&
          normalizeText(form.managerName) &&
          normalizePhoneInput(form.managerPhone)
      );
    }

    return Boolean(normalizeText(form.name) && normalizePhoneInput(form.phone));
  }, [form, selectedAccountType, submitting]);

  function updateForm(key, value) {
    let nextValue = value;

    if (key === "phone" || key === "managerPhone") {
      nextValue = normalizePhoneInput(value);
    }

    if (key === "businessNumber") {
      nextValue = normalizeBusinessNumber(value);
    }

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    setResultMessage("");
    setFoundResult(null);
    setErrorMessage("");
  }

  function selectAccountType(type) {
    if (submitting) return;

    setSelectedAccountType(type);
    setResultMessage("");
    setFoundResult(null);
    setErrorMessage("");
  }

  async function findUserAccount() {
    const safeName = normalizeText(form.name);
    const safePhone = normalizeText(form.phone);

    const rows = await loadRowsByColumn("profiles", "name", safeName);
    const matchedRows = rows.filter((row) => samePhone(getRowPhone(row), safePhone));
    const found = matchedRows[0];

    if (!found) {
      throw new Error("입력하신 이름과 휴대폰 번호로 가입 정보를 찾지 못했습니다.");
    }

    const loginId = getUserLoginId(found);

    return {
      title: "일반회원 가입 정보",
      loginIdLabel: "로그인 이메일 / 아이디",
      loginId,
      email: getRowEmail(found),
      maskedEmail: maskEmail(getRowEmail(found)),
      help: "일반회원은 가입한 이메일로 로그인할 수 있습니다.",
    };
  }

  async function findBusinessAccount() {
    const businessNumber = normalizeBusinessNumber(form.businessNumber);
    const ownerName = normalizeText(form.ownerName);
    const phone = normalizeText(form.phone);

    const ownerRows = uniqueRows([
      ...(await loadRowsByColumn("owner_profiles", "business_number", businessNumber)),
      ...(await loadRowsByColumn("owner_profiles", "biz_no", businessNumber)),
    ]);

    const profileRows = await loadRowsByColumn("profiles", "username", businessNumber);

    const checkedOwnerRows = ownerRows.filter((row) => {
      const ownerMatched = ownerName
        ? sameText(row?.owner_name, ownerName) || sameText(row?.name, ownerName)
        : true;

      const phoneMatched = phone ? samePhone(getRowPhone(row), phone) : true;

      return ownerMatched && phoneMatched;
    });

    let foundOwner = checkedOwnerRows[0] || ownerRows[0] || null;
    let foundProfile = profileRows[0] || null;

    if (!foundProfile && foundOwner?.user_id) {
      foundProfile = await loadProfileByUserId(foundOwner.user_id);
    }

    if (!foundOwner && !foundProfile) {
      throw new Error("입력하신 사업자번호로 소상공인 가입 정보를 찾지 못했습니다.");
    }

    const email = getRowEmail(foundOwner) || getRowEmail(foundProfile);
    const loginId = getBusinessLoginId(foundOwner || foundProfile, businessNumber);

    return {
      title: "소상공인 가입 정보",
      loginIdLabel: "로그인 가능 아이디",
      loginId: loginId || email,
      email,
      maskedEmail: maskEmail(email),
      help: "소상공인은 사업자번호 또는 이메일로 로그인할 수 있습니다.",
    };
  }

  async function findGovAccount() {
    const organizationName = normalizeText(form.organizationName);
    const managerName = normalizeText(form.managerName);
    const managerPhone = normalizeText(form.managerPhone);

    const rows = uniqueRows([
      ...(await loadRowsByColumn("gov_profiles", "manager_name", managerName)),
      ...(await loadRowsByColumn("gov_profiles", "manager", managerName)),
    ]);

    const matchedRows = rows.filter((row) => {
      const organizationMatched =
        sameText(row?.organization_name, organizationName) ||
        sameText(row?.org_name, organizationName) ||
        sameText(row?.gov_name, organizationName);

      const phoneMatched = samePhone(
        row?.manager_phone || row?.phone || row?.rep_phone,
        managerPhone
      );

      return organizationMatched && phoneMatched;
    });

    const found = matchedRows[0];

    if (!found) {
      throw new Error("입력하신 기관명, 담당자명, 휴대폰 번호로 가입 정보를 찾지 못했습니다.");
    }

    const email = getRowEmail(found);

    return {
      title: "지자체 / 기관 가입 정보",
      loginIdLabel: "담당자 로그인 이메일",
      loginId: email,
      email,
      maskedEmail: maskEmail(email),
      help: "지자체 / 기관은 담당자 이메일로 로그인할 수 있습니다.",
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setResultMessage("");
    setFoundResult(null);
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
      return;
    }

    if (!canSubmit) {
      setErrorMessage("필수 정보를 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      let result = null;

      if (selectedAccountType === "business") {
        result = await findBusinessAccount();
      } else if (selectedAccountType === "gov") {
        result = await findGovAccount();
      } else {
        result = await findUserAccount();
      }

      setFoundResult(result);
      setResultMessage("가입 정보를 확인했습니다.");
    } catch (error) {
      const message = error?.message || "아이디 찾기 중 문제가 발생했습니다.";
      setErrorMessage(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-wrap">
        <div className="login-hero">
          <Link to="/login" className="login-back">
            ← 로그인 화면으로 돌아가기
          </Link>

          <p className="login-badge">감성여행2 아이디 찾기</p>

          <h1>
            가입 유형에 맞춰
            <br />
            로그인 아이디를 확인하세요
          </h1>

          <p className="login-desc">
            일반회원은 이름과 휴대폰 번호, 소상공인은 사업자번호, 지자체는
            기관명과 담당자 정보로 가입 이메일을 확인합니다.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-type-box">
            <p className="login-type-label">가입 유형 선택</p>

            <div className="login-type-grid">
              {ACCOUNT_TYPES.map((type) => {
                const active = selectedAccountType === type.key;

                return (
                  <button
                    key={type.key}
                    type="button"
                    className={
                      active ? "login-type-btn active" : "login-type-btn"
                    }
                    onClick={() => selectAccountType(type.key)}
                    disabled={submitting}
                    aria-pressed={active}
                  >
                    <strong>{type.label}</strong>
                    <span>{type.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedAccountType === "business" ? (
            <>
              <label className="login-field">
                <span>사업자번호 10자리</span>
                <input
                  type="text"
                  name="findBusinessNumber"
                  autoComplete="off"
                  inputMode="numeric"
                  value={form.businessNumber}
                  onChange={(event) =>
                    updateForm("businessNumber", event.target.value)
                  }
                  placeholder="하이픈 없이 입력"
                  disabled={submitting}
                />
              </label>

              <label className="login-field">
                <span>대표자명</span>
                <input
                  type="text"
                  name="findOwnerName"
                  autoComplete="name"
                  value={form.ownerName}
                  onChange={(event) => updateForm("ownerName", event.target.value)}
                  placeholder="선택 입력"
                  disabled={submitting}
                />
              </label>

              <label className="login-field">
                <span>휴대폰 번호</span>
                <input
                  type="tel"
                  name="findBusinessPhone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder="선택 입력"
                  disabled={submitting}
                />
              </label>
            </>
          ) : selectedAccountType === "gov" ? (
            <>
              <label className="login-field">
                <span>기관명 / 지자체명</span>
                <input
                  type="text"
                  name="findOrganizationName"
                  autoComplete="organization"
                  value={form.organizationName}
                  onChange={(event) =>
                    updateForm("organizationName", event.target.value)
                  }
                  placeholder="예: 함양군청"
                  disabled={submitting}
                />
              </label>

              <label className="login-field">
                <span>담당자명</span>
                <input
                  type="text"
                  name="findManagerName"
                  autoComplete="name"
                  value={form.managerName}
                  onChange={(event) => updateForm("managerName", event.target.value)}
                  placeholder="담당자명을 입력해주세요"
                  disabled={submitting}
                />
              </label>

              <label className="login-field">
                <span>담당자 휴대폰 번호</span>
                <input
                  type="tel"
                  name="findManagerPhone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.managerPhone}
                  onChange={(event) =>
                    updateForm("managerPhone", event.target.value)
                  }
                  placeholder="010-0000-0000"
                  disabled={submitting}
                />
              </label>
            </>
          ) : (
            <>
              <label className="login-field">
                <span>이름</span>
                <input
                  type="text"
                  name="findUserName"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="가입한 이름을 입력해주세요"
                  disabled={submitting}
                />
              </label>

              <label className="login-field">
                <span>휴대폰 번호</span>
                <input
                  type="tel"
                  name="findUserPhone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder="010-0000-0000"
                  disabled={submitting}
                />
              </label>
            </>
          )}

          {errorMessage ? (
            <p className="login-result error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {resultMessage ? (
            <p className="login-result success">{resultMessage}</p>
          ) : null}

          {foundResult ? (
            <section className="login-type-box" aria-label="아이디 찾기 결과">
              <p className="login-type-label">{foundResult.title}</p>
              <p className="login-field-help">
                {foundResult.loginIdLabel}:{" "}
                <strong>{foundResult.loginId || "확인 필요"}</strong>
              </p>
              {foundResult.email ? (
                <p className="login-field-help">
                  가입 이메일: <strong>{foundResult.email}</strong>{" "}
                  <span>({foundResult.maskedEmail})</span>
                </p>
              ) : null}
              <p className="login-field-help">{foundResult.help}</p>
            </section>
          ) : null}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={!canSubmit}
          >
            {submitting ? "가입 정보 확인 중..." : "아이디 / 가입 이메일 찾기"}
          </button>

          <div className="login-links">
            <Link to="/login">로그인하기</Link>
            <Link to="/reset-password">비밀번호 찾기</Link>
            <Link to="/signup">회원가입하기</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
