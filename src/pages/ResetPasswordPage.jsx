// 파일 경로: src/pages/ResetPasswordPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 비밀번호 찾기 / 재설정 페이지
// - 일반회원 / 소상공인 / 지자체·기관 유형별 비밀번호 재설정 요청 제공
// - 일반회원과 지자체는 가입 이메일로 재설정 메일 발송
// - 소상공인은 사업자번호 또는 이메일로 가입 이메일을 찾아 재설정 메일 발송
// - Supabase Auth resetPasswordForEmail / updateUser 흐름 사용
// - 이메일 링크로 돌아온 경우 새 비밀번호 입력 화면으로 전환
// - 원본 회원 정보는 수정하지 않고 비밀번호 재설정 요청과 Auth 비밀번호 변경만 수행
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./LoginPage.css";

const ACCOUNT_TYPES = [
  {
    key: "user",
    label: "일반회원",
    desc: "가입 이메일",
  },
  {
    key: "business",
    label: "소상공인",
    desc: "사업자번호 / 이메일",
  },
  {
    key: "gov",
    label: "지자체 / 기관",
    desc: "담당자 이메일",
  },
];

const INITIAL_FORM = {
  loginId: "",
  newPassword: "",
  newPasswordConfirm: "",
};

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function cleanBusinessNumber(value) {
  return String(value || "").replace(/[^0-9]/g, "");
}

function looksLikeEmail(value) {
  const text = normalizeText(value);
  return text.includes("@") && text.includes(".");
}

function looksLikeBusinessNumber(value) {
  const cleaned = cleanBusinessNumber(value);
  return cleaned.length >= 8 && cleaned.length <= 13;
}

function buildInternalBusinessEmail(businessNumber) {
  const safeNumber = cleanBusinessNumber(businessNumber);

  if (!safeNumber) return "";

  return `biz-${safeNumber}@gamsung-biz.com`;
}

function getProfileEmail(profile) {
  return (
    normalizeEmail(profile?.email) ||
    normalizeEmail(profile?.login_email) ||
    normalizeEmail(profile?.auth_email)
  );
}

function getOwnerProfileEmail(ownerProfile) {
  return (
    normalizeEmail(ownerProfile?.email) ||
    normalizeEmail(ownerProfile?.store_email) ||
    normalizeEmail(ownerProfile?.login_email) ||
    normalizeEmail(ownerProfile?.auth_email)
  );
}

async function loadFirstRowByColumn(tableName, columnName, value) {
  if (!value) return null;

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq(columnName, value)
      .limit(1);

    if (error) {
      console.warn(
        `[ResetPasswordPage] ${tableName}.${columnName} 조회 확인 필요:`,
        error
      );
      return null;
    }

    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.warn(
      `[ResetPasswordPage] ${tableName}.${columnName} 조회 실패:`,
      error
    );
    return null;
  }
}

async function findBusinessLoginEmailByNumber(businessNumber) {
  const safeBusinessNumber = cleanBusinessNumber(businessNumber);

  if (!safeBusinessNumber) {
    return "";
  }

  const profileByUsername = await loadFirstRowByColumn(
    "profiles",
    "username",
    safeBusinessNumber
  );

  const profileEmail = getProfileEmail(profileByUsername);

  if (profileEmail) {
    return profileEmail;
  }

  const ownerByBusinessNumber = await loadFirstRowByColumn(
    "owner_profiles",
    "business_number",
    safeBusinessNumber
  );

  const ownerBusinessEmail = getOwnerProfileEmail(ownerByBusinessNumber);

  if (ownerBusinessEmail) {
    return ownerBusinessEmail;
  }

  if (ownerByBusinessNumber?.user_id) {
    const ownerProfile = await loadFirstRowByColumn(
      "profiles",
      "user_id",
      ownerByBusinessNumber.user_id
    );

    const ownerProfileEmail = getProfileEmail(ownerProfile);

    if (ownerProfileEmail) {
      return ownerProfileEmail;
    }
  }

  const ownerByBizNo = await loadFirstRowByColumn(
    "owner_profiles",
    "biz_no",
    safeBusinessNumber
  );

  const ownerBizNoEmail = getOwnerProfileEmail(ownerByBizNo);

  if (ownerBizNoEmail) {
    return ownerBizNoEmail;
  }

  if (ownerByBizNo?.user_id) {
    const ownerProfile = await loadFirstRowByColumn(
      "profiles",
      "user_id",
      ownerByBizNo.user_id
    );

    const ownerProfileEmail = getProfileEmail(ownerProfile);

    if (ownerProfileEmail) {
      return ownerProfileEmail;
    }
  }

  return buildInternalBusinessEmail(safeBusinessNumber);
}

function getLoginFieldLabel(accountType) {
  if (accountType === "business") {
    return "사업자번호 또는 이메일";
  }

  if (accountType === "gov") {
    return "담당자 이메일";
  }

  return "가입 이메일";
}

function getLoginFieldPlaceholder(accountType) {
  if (accountType === "business") {
    return "사업자번호 또는 이메일을 입력해주세요";
  }

  if (accountType === "gov") {
    return "agency@example.com";
  }

  return "example@email.com";
}

function getResetErrorMessage(error) {
  const message = error?.message || "";

  if (message.includes("User not found")) {
    return "입력한 정보로 가입된 계정을 찾지 못했습니다.";
  }

  if (message.includes("rate limit")) {
    return "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }

  if (message.includes("Password")) {
    return "비밀번호 조건을 다시 확인해주세요.";
  }

  return message || "비밀번호 재설정 처리 중 문제가 발생했습니다.";
}

export default function ResetPasswordPage() {
  const [selectedAccountType, setSelectedAccountType] = useState("user");
  const [form, setForm] = useState(INITIAL_FORM);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const safeLoginId = normalizeText(form.loginId);
  const isPasswordValid = form.newPassword.length >= 8;
  const isPasswordSame =
    form.newPassword.length > 0 &&
    form.newPassword === form.newPasswordConfirm;

  const canSendReset = Boolean(safeLoginId && !submitting);
  const canUpdatePassword = Boolean(
    hasRecoverySession &&
      isPasswordValid &&
      isPasswordSame &&
      !submitting
  );

  const loginFieldLabel = getLoginFieldLabel(selectedAccountType);
  const loginFieldPlaceholder = getLoginFieldPlaceholder(selectedAccountType);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCheckingSession(false);
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      setHasRecoverySession(Boolean(data?.session?.user?.id));
      setCheckingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || session?.user?.id) {
          setHasRecoverySession(Boolean(session?.user?.id));
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  function updateForm(key, value) {
    let nextValue = value;

    if (key === "loginId" && selectedAccountType === "business") {
      nextValue = value.replace(/[^\d@._+\-\sA-Za-z]/g, "");
    }

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
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

  async function resolveResetEmail() {
    if (!safeLoginId) {
      throw new Error(`${loginFieldLabel}을 입력해주세요.`);
    }

    if (looksLikeEmail(safeLoginId)) {
      return normalizeEmail(safeLoginId);
    }

    if (selectedAccountType !== "business") {
      throw new Error(`${loginFieldLabel}은 이메일 형식으로 입력해주세요.`);
    }

    if (!looksLikeBusinessNumber(safeLoginId)) {
      throw new Error("사업자번호는 숫자 기준 8~13자리로 입력해주세요.");
    }

    const businessEmail = await findBusinessLoginEmailByNumber(safeLoginId);

    if (!businessEmail) {
      throw new Error(
        "사업자번호와 연결된 로그인 이메일을 찾지 못했습니다. 아이디 찾기에서 먼저 확인해주세요."
      );
    }

    return businessEmail;
  }

  async function handleSendResetEmail(event) {
    event.preventDefault();

    if (submitting) return;

    setResultMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
      return;
    }

    if (!canSendReset) {
      setErrorMessage(`${loginFieldLabel}을 입력해주세요.`);
      return;
    }

    setSubmitting(true);

    try {
      const authEmail = await resolveResetEmail();
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
        redirectTo,
      });

      if (error) {
        throw error;
      }

      setResultMessage(
        "비밀번호 재설정 메일을 발송했습니다. 메일함에서 재설정 링크를 눌러주세요."
      );
    } catch (error) {
      const message = getResetErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdatePassword(event) {
    event.preventDefault();

    if (submitting) return;

    setResultMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
      return;
    }

    if (!canUpdatePassword) {
      setErrorMessage("새 비밀번호는 8자 이상이며 확인 값과 같아야 합니다.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: form.newPassword,
      });

      if (error) {
        throw error;
      }

      setForm(INITIAL_FORM);
      setResultMessage(
        "비밀번호가 변경되었습니다. 이제 새 비밀번호로 로그인할 수 있습니다."
      );
    } catch (error) {
      const message = getResetErrorMessage(error);
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

          <p className="login-badge">감성여행2 비밀번호 찾기</p>

          <h1>
            가입 이메일로
            <br />
            비밀번호를 재설정하세요
          </h1>

          <p className="login-desc">
            일반회원과 지자체는 가입 이메일을 입력하고, 소상공인은
            사업자번호 또는 이메일로 비밀번호 재설정 메일을 받을 수 있습니다.
          </p>
        </div>

        <form
          className="login-card"
          onSubmit={handleSendResetEmail}
          autoComplete="off"
        >
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
          </div>

          <label className="login-field">
            <span>{loginFieldLabel}</span>
            <input
              type={selectedAccountType === "business" ? "text" : "email"}
              name="resetLoginId"
              autoComplete="off"
              inputMode={selectedAccountType === "business" ? "text" : "email"}
              value={form.loginId}
              onChange={(event) => updateForm("loginId", event.target.value)}
              placeholder={loginFieldPlaceholder}
              disabled={submitting}
            />
            <em className="login-field-help">
              재설정 메일은 Supabase Auth에 등록된 이메일로 발송됩니다.
            </em>
          </label>

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
            disabled={!canSendReset}
          >
            {submitting ? "재설정 메일 발송 중..." : "비밀번호 재설정 메일 받기"}
          </button>

          <div className="login-links">
            <Link to="/find-id">아이디 / 가입 이메일 찾기</Link>
            <Link to="/login">로그인하기</Link>
            <Link to="/signup">회원가입하기</Link>
          </div>
        </form>

        <form
          className="login-card"
          onSubmit={handleUpdatePassword}
          autoComplete="off"
        >
          <div className="login-type-box">
            <p className="login-type-label">새 비밀번호 설정</p>
            <p className="login-field-help">
              이메일의 재설정 링크를 눌러 이 화면으로 돌아온 경우에만 새
              비밀번호를 저장할 수 있습니다.
            </p>
          </div>

          <label className="login-field">
            <span>새 비밀번호</span>
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={(event) =>
                updateForm("newPassword", event.target.value)
              }
              placeholder="8자 이상 입력"
              disabled={submitting || checkingSession}
            />
          </label>

          <label className="login-field">
            <span>새 비밀번호 확인</span>
            <input
              type="password"
              name="newPasswordConfirm"
              autoComplete="new-password"
              value={form.newPasswordConfirm}
              onChange={(event) =>
                updateForm("newPasswordConfirm", event.target.value)
              }
              placeholder="한 번 더 입력"
              disabled={submitting || checkingSession}
            />
          </label>

          {!hasRecoverySession ? (
            <p className="login-result error">
              아직 비밀번호 재설정 세션이 확인되지 않았습니다. 먼저 메일의
              재설정 링크를 열어주세요.
            </p>
          ) : null}

          <button
            type="submit"
            className="login-submit-btn"
            disabled={!canUpdatePassword}
          >
            {submitting ? "비밀번호 변경 중..." : "새 비밀번호 저장하기"}
          </button>
        </form>
      </section>
    </main>
  );
}
