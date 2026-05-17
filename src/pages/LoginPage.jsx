// 파일 경로: src/pages/LoginPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 로그인 페이지
// - 감성여행2 / 감성배달 / 홈페이지 공통 Supabase Auth 로그인
// - 로그인 후 profiles(공통 회원 기본정보)
//   + owner_profiles(소상공인 기본정보)
//   + gov_profiles(지자체 기본정보)를 함께 확인
// - 소상공인은 /business/dashboard 이동
// - 지자체는 /gov/dashboard 이동
// - 관리자는 /admin/inquiries 이동
// - 일반회원은 홈으로 이동
// - AuthContext가 세션과 profiles 정보를 다시 읽을 수 있도록 로그인 후 refreshUserProfile 호출
// ========================================

import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./LoginPage.css";

const INITIAL_FORM = {
  email: "",
  password: "",
};

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
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

function hasRow(row) {
  return Boolean(row && (row.id || row.user_id));
}

function resolveNextPath(loginProfile, fallbackPath) {
  const profile = loginProfile?.profile || null;
  const ownerProfile = loginProfile?.ownerProfile || null;
  const govProfile = loginProfile?.govProfile || null;

  const role = normalizeText(profile?.role);
  const memberType = normalizeText(profile?.member_type);

  const isAdmin = role === "admin" || memberType === "admin";

  const isBusiness =
    hasRow(ownerProfile) ||
    role === "business" ||
    role === "biz" ||
    role === "owner" ||
    memberType === "business" ||
    memberType === "biz" ||
    memberType === "owner";

  const isGov =
    hasRow(govProfile) ||
    role === "gov" ||
    role === "government" ||
    role === "local_government" ||
    role === "agency" ||
    memberType === "gov" ||
    memberType === "government" ||
    memberType === "local_government" ||
    memberType === "agency";

  if (isAdmin) {
    return "/admin/inquiries";
  }

  if (isBusiness) {
    return "/business/dashboard";
  }

  if (isGov) {
    return "/gov/dashboard";
  }

  return fallbackPath || "/";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUserProfile } = useAuth();

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const safeEmail = normalizeEmail(form.email);
  const canSubmit = Boolean(safeEmail && form.password && !submitting);

  const submitLabel = useMemo(() => {
    if (submitting) return "로그인 중...";
    return "로그인";
  }, [submitting]);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setResultMessage("");
    setErrorMessage("");
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

      const userId = data?.user?.id || "";
      const loginProfile = await loadLoginProfile(userId);

      await refreshUserProfile();

      setResultMessage("로그인되었습니다.");

      const fallbackPath = getSafeFallbackPath(location.state?.from?.pathname);
      const nextPath = resolveNextPath(loginProfile, fallbackPath);

      window.setTimeout(() => {
        navigate(nextPath);
      }, 500);
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
            일반회원, 소상공인, 지자체 / 기관 계정은 같은 Supabase 회원
            구조를 사용합니다. 로그인 후 계정 권한에 맞는 화면으로 이동합니다.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit} autoComplete="on">
          <label className="login-field">
            <span>이메일</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
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
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateForm("password", event.target.value)}
              placeholder="비밀번호를 입력해주세요"
              disabled={submitting}
            />
          </label>

          {errorMessage ? (
            <p className="login-result error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {resultMessage ? (
            <p className="login-result success">{resultMessage}</p>
          ) : null}

          <button type="submit" className="login-submit-btn" disabled={!canSubmit}>
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