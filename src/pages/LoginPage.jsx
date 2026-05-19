// 파일 경로: src/pages/LoginPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 로그인 페이지
// - 일반회원 / 소상공인 / 지자체 계정 유형 선택 UI 제공
// - 아이디 기억하기를 체크했을 때만 이메일을 localStorage에 저장
// - 체크하지 않으면 이메일/비밀번호가 자동으로 남지 않도록 처리
// - 감성여행2 / 감성배달 / 홈페이지 공통 Supabase Auth 로그인
// - 로그인 후 profiles(공통 회원 기본정보)
//   + owner_profiles(소상공인 기본정보)
//   + gov_profiles(지자체 기본정보)를 함께 확인
// - 빈 owner_profiles row 때문에 일반회원이 소상공인으로 오인되지 않도록 방지
// - 소상공인은 /business/dashboard 이동
// - 지자체는 /gov/dashboard 이동
// - 관리자는 /admin/inquiries 이동
// - 일반회원은 홈으로 이동
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./LoginPage.css";

const REMEMBER_EMAIL_STORAGE_KEY = "gamsung2.rememberLoginEmail";

const INITIAL_FORM = {
  email: "",
  password: "",
};

const ACCOUNT_TYPES = [
  {
    key: "user",
    label: "일반회원",
    desc: "여행자 / 일반 고객",
  },
  {
    key: "business",
    label: "소상공인",
    desc: "가게 / 미니홈피 운영",
  },
  {
    key: "gov",
    label: "지자체 / 기관",
    desc: "축제 / 관광이벤트 관리",
  },
];

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function getRememberedEmail() {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(REMEMBER_EMAIL_STORAGE_KEY) || "";
  } catch (error) {
    console.warn("[LoginPage] 저장된 이메일 읽기 실패:", error);
    return "";
  }
}

function saveRememberedEmail(email) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(REMEMBER_EMAIL_STORAGE_KEY, email);
  } catch (error) {
    console.warn("[LoginPage] 이메일 저장 실패:", error);
  }
}

function clearRememberedEmail() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(REMEMBER_EMAIL_STORAGE_KEY);
  } catch (error) {
    console.warn("[LoginPage] 저장된 이메일 삭제 실패:", error);
  }
}

function getLoginErrorMessage(error) {
  const message = error?.message || "";

  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }

  if (message.includes("Email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.";
  }

  if (message.includes("rate limit")) {
    return "로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }

  return message || "로그인 처리 중 문제가 발생했습니다.";
}

function getSafeFallbackPath(pathname) {
  if (!pathname || pathname === "/login") {
    return "/";
  }

  return pathname;
}

function hasMeaningfulOwnerProfile(row) {
  if (!row) return false;

  return Boolean(
    row.store_name ||
      row.business_number ||
      row.owner_name ||
      row.store_address ||
      row.store_phone ||
      row.business_type ||
      row.intro
  );
}

function hasMeaningfulGovProfile(row) {
  if (!row) return false;

  return Boolean(
    row.org_name ||
      row.organization_name ||
      row.gov_name ||
      row.department_name ||
      row.manager_name ||
      row.region_name ||
      row.phone
  );
}

function getAccountTypeLabel(type) {
  if (type === "admin") return "관리자";

  const found = ACCOUNT_TYPES.find((item) => item.key === type);
  return found?.label || "회원";
}

function getActualAccountType(loginProfile) {
  const profile = loginProfile?.profile || null;
  const ownerProfile = loginProfile?.ownerProfile || null;
  const govProfile = loginProfile?.govProfile || null;

  const role = normalizeText(profile?.role);
  const memberType = normalizeText(profile?.member_type);

  if (
    role === "admin" ||
    role === "administrator" ||
    role === "super_admin" ||
    memberType === "admin" ||
    memberType === "administrator" ||
    memberType === "super_admin"
  ) {
    return "admin";
  }

  if (
    role === "business" ||
    role === "biz" ||
    role === "owner" ||
    role === "store_owner" ||
    role === "merchant" ||
    memberType === "business" ||
    memberType === "biz" ||
    memberType === "owner" ||
    memberType === "store_owner" ||
    memberType === "merchant" ||
    hasMeaningfulOwnerProfile(ownerProfile)
  ) {
    return "business";
  }

  if (
    role === "gov" ||
    role === "government" ||
    role === "local_government" ||
    role === "agency" ||
    role === "institution" ||
    role === "public" ||
    memberType === "gov" ||
    memberType === "government" ||
    memberType === "local_government" ||
    memberType === "agency" ||
    memberType === "institution" ||
    memberType === "public" ||
    hasMeaningfulGovProfile(govProfile)
  ) {
    return "gov";
  }

  return "user";
}

function isManagePath(pathname) {
  return (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/business") ||
    pathname?.startsWith("/gov")
  );
}

function resolveNextPath(accountType, fallbackPath) {
  if (accountType === "admin") {
    return "/admin/inquiries";
  }

  if (accountType === "business") {
    return "/business/dashboard";
  }

  if (accountType === "gov") {
    return "/gov/dashboard";
  }

  if (isManagePath(fallbackPath)) {
    return "/";
  }

  return fallbackPath || "/";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserProfile } = useAuth();

  const [selectedAccountType, setSelectedAccountType] = useState("user");
  const [form, setForm] = useState(INITIAL_FORM);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const safeEmail = normalizeEmail(form.email);
  const canSubmit = Boolean(safeEmail && form.password && !submitting);

  const submitLabel = useMemo(() => {
    if (submitting) return "로그인 중...";
    return `${getAccountTypeLabel(selectedAccountType)} 로그인`;
  }, [selectedAccountType, submitting]);

  useEffect(() => {
    const rememberedEmail = getRememberedEmail();

    if (!rememberedEmail) return;

    setRememberEmail(true);
    setForm((prev) => ({
      ...prev,
      email: rememberedEmail,
      password: "",
    }));
  }, []);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setResultMessage("");
    setErrorMessage("");
  }

  function selectAccountType(type) {
    if (submitting) return;

    setSelectedAccountType(type);
    setResultMessage("");
    setErrorMessage("");
  }

  function toggleRememberEmail(checked) {
    setRememberEmail(checked);

    if (!checked) {
      clearRememberedEmail();
    }
  }

  async function loadTableRow(tableName, userId) {
    if (!userId) return null;

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error(`[LoginPage] ${tableName} 조회 실패:`, error);
      return null;
    }

    return data || null;
  }

  async function loadLoginProfile(userId) {
    if (!userId) {
      return {
        profile: null,
        ownerProfile: null,
        govProfile: null,
      };
    }

    const [profile, ownerProfile, govProfile] = await Promise.all([
      loadTableRow("profiles", userId),
      loadTableRow("owner_profiles", userId),
      loadTableRow("gov_profiles", userId),
    ]);

    return {
      profile,
      ownerProfile,
      govProfile,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setResultMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
      return;
    }

    if (!canSubmit) {
      setErrorMessage("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password: form.password,
      });

      if (error) {
        throw error;
      }

      if (rememberEmail) {
        saveRememberedEmail(safeEmail);
      } else {
        clearRememberedEmail();
      }

      const userId = data?.user?.id || "";
      const loginProfile = await loadLoginProfile(userId);
      const actualAccountType = getActualAccountType(loginProfile);

      await refreshUserProfile(data?.session || null);

      if (
        actualAccountType !== "admin" &&
        selectedAccountType !== actualAccountType
      ) {
        setResultMessage(
          `선택하신 유형은 ${getAccountTypeLabel(
            selectedAccountType
          )}이지만, 실제 가입 정보는 ${getAccountTypeLabel(
            actualAccountType
          )} 계정으로 확인되었습니다. 해당 화면으로 이동합니다.`
        );
      } else {
        setResultMessage(
          `${getAccountTypeLabel(actualAccountType)} 계정으로 로그인되었습니다.`
        );
      }

      const fallbackPath = getSafeFallbackPath(location.state?.from?.pathname);
      const nextPath = resolveNextPath(actualAccountType, fallbackPath);

      window.setTimeout(() => {
        navigate(nextPath, { replace: true });
      }, 600);
    } catch (error) {
      const message = getLoginErrorMessage(error);
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
          <Link to="/" className="login-back">
            ← 홈으로 돌아가기
          </Link>

          <p className="login-badge">감성여행2 통합 로그인</p>

          <h1>
            하나의 계정으로
            <br />
            감성여행2와 감성배달을 이용하세요
          </h1>

          <p className="login-desc">
            먼저 계정 유형을 선택한 뒤 로그인해주세요. 로그인 후 실제 가입
            정보에 맞는 화면으로 이동합니다.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit} autoComplete="off">
          <div className="login-type-box">
            <p className="login-type-label">계정 유형 선택</p>

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

            <p className="login-type-help">
              선택한 유형은 안내용입니다. 최종 권한은 Supabase 가입 정보로
              다시 확인합니다.
            </p>
          </div>

          <label className="login-field">
            <span>이메일</span>
            <input
              type="email"
              name="gamsung2-login-email"
              autoComplete="off"
              inputMode="email"
              value={form.email}
              onChange={(event) => updateForm("email", event.target.value)}
              placeholder="example@email.com"
              disabled={submitting}
            />
          </label>

          <label className="login-field">
            <span>비밀번호</span>
            <input
              type="password"
              name="gamsung2-login-password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateForm("password", event.target.value)}
              placeholder="비밀번호를 입력해주세요"
              disabled={submitting}
            />
          </label>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(event) => toggleRememberEmail(event.target.checked)}
                disabled={submitting}
              />
              <span>아이디 기억하기</span>
            </label>

            {rememberEmail ? (
              <span className="login-remember-note">
                체크한 경우에만 이메일이 저장됩니다.
              </span>
            ) : null}
          </div>

          {errorMessage ? (
            <p className="login-result error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {resultMessage ? (
            <p className="login-result success">{resultMessage}</p>
          ) : null}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={!canSubmit}
          >
            {submitLabel}
          </button>

          <div className="login-links">
            <Link to="/signup">아직 계정이 없어요</Link>
            <Link to="/signup/business">소상공인 무료 입점</Link>
            <Link to="/signup/gov">지자체 / 기관 가입</Link>
          </div>
        </form>
      </section>
    </main>
  );
}