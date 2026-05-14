// 파일 경로: src/pages/AdminInquiriesPage.jsx
// ========================================
// 📌 감성여행2 관리자 문의함 페이지
// - 감성문의 쪽지로 들어온 문의를 카드형 쪽지함처럼 확인
// - Supabase Auth 로그인 후 관리자 이메일만 문의 목록 조회
// - 문의 상태를 접수 / 확인중 / 답변완료 / 보류로 변경
// - 관리자 메모를 저장할 수 있는 기본 관리 화면
// - 개인정보가 포함되므로 공개 메뉴에는 노출하지 않는 숨은 관리자 경로로 사용
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  adminEmail,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabase";
import "./AdminInquiriesPage.css";

const STATUS_OPTIONS = ["접수", "확인중", "답변완료", "보류"];

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getStatusClass(status) {
  if (status === "답변완료") return "done";
  if (status === "확인중") return "checking";
  if (status === "보류") return "hold";
  return "new";
}

export default function AdminInquiriesPage() {
  const [session, setSession] = useState(null);
  const [loginEmail, setLoginEmail] = useState(adminEmail);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginError, setLoginError] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [memoDrafts, setMemoDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const currentEmail = session?.user?.email || "";
  const isAdmin = useMemo(
    () => Boolean(currentEmail && currentEmail === adminEmail),
    [currentEmail]
  );

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("[관리자 문의함] 세션 확인 실패:", error);
        setErrorMessage("관리자 로그인 상태를 확인하지 못했습니다.");
      }

      setSession(data?.session || null);
      setLoading(false);
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session && isAdmin) {
      fetchInquiries();
    }

    if (session && !isAdmin) {
      setErrorMessage(
        `현재 로그인 이메일(${currentEmail})은 관리자 이메일(${adminEmail})과 다릅니다.`
      );
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isAdmin, currentEmail]);

  async function handleSendLoginLink(event) {
    event.preventDefault();

    const safeEmail = loginEmail.trim();

    if (!safeEmail) {
      setLoginError("관리자 이메일을 입력해주세요.");
      return;
    }

    setLoginError("");
    setLoginMessage("로그인 링크를 보내는 중입니다...");

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/admin/inquiries`
        : undefined;

    const { error } = await supabase.auth.signInWithOtp({
      email: safeEmail,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error("[관리자 문의함] 로그인 링크 전송 실패:", error);
      setLoginMessage("");
      setLoginError(
        "로그인 링크 전송에 실패했습니다. Supabase Auth 설정을 확인해주세요."
      );
      return;
    }

    setLoginMessage(
      "관리자 이메일로 로그인 링크를 보냈습니다. 메일을 열어 로그인해주세요."
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setInquiries([]);
    setMemoDrafts({});
    setErrorMessage("");
  }

  async function fetchInquiries() {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("inquiries")
      .select(
        "id, inquiry_type, name, phone, email, message, status, source_path, source_url, admin_memo, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[관리자 문의함] 문의 목록 조회 실패:", error);
      setErrorMessage(
        "문의 목록을 불러오지 못했습니다. Supabase RLS select 정책을 확인해주세요."
      );
      setLoading(false);
      return;
    }

    const rows = data || [];
    const drafts = {};

    rows.forEach((item) => {
      drafts[item.id] = item.admin_memo || "";
    });

    setInquiries(rows);
    setMemoDrafts(drafts);
    setLoading(false);
  }

  async function handleStatusChange(id, nextStatus) {
    setActionLoadingId(id);
    setErrorMessage("");

    const { error } = await supabase
      .from("inquiries")
      .update({ status: nextStatus })
      .eq("id", id);

    if (error) {
      console.error("[관리자 문의함] 상태 변경 실패:", error);
      setErrorMessage(
        "상태 변경에 실패했습니다. Supabase RLS update 정책을 확인해주세요."
      );
      setActionLoadingId("");
      return;
    }

    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );

    setActionLoadingId("");
  }

  function handleMemoChange(id, value) {
    setMemoDrafts((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSaveMemo(id) {
    setActionLoadingId(id);
    setErrorMessage("");

    const nextMemo = (memoDrafts[id] || "").trim();

    const { error } = await supabase
      .from("inquiries")
      .update({ admin_memo: nextMemo || null })
      .eq("id", id);

    if (error) {
      console.error("[관리자 문의함] 관리자 메모 저장 실패:", error);
      setErrorMessage(
        "관리자 메모 저장에 실패했습니다. Supabase RLS update 정책을 확인해주세요."
      );
      setActionLoadingId("");
      return;
    }

    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, admin_memo: nextMemo } : item
      )
    );

    setActionLoadingId("");
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-inquiries-page">
        <section className="admin-inquiries-notice">
          <p className="admin-inquiries-kicker">ADMIN MESSAGE</p>
          <h1>Supabase 연결 정보가 없습니다</h1>
          <p>
            VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 환경변수가 설정되어야
            관리자 문의함을 사용할 수 있습니다.
          </p>
          <Link to="/" className="admin-inquiries-home-link">
            홈으로 돌아가기
          </Link>
        </section>
      </div>
    );
  }

  if (loading && !session) {
    return (
      <div className="admin-inquiries-page">
        <section className="admin-inquiries-notice">
          <p className="admin-inquiries-kicker">ADMIN MESSAGE</p>
          <h1>관리자 상태 확인 중</h1>
          <p>잠시만 기다려주세요.</p>
        </section>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="admin-inquiries-page">
        <section className="admin-login-card">
          <p className="admin-inquiries-kicker">GAMSUNG ADMIN</p>
          <h1>감성문의 관리자 로그인</h1>
          <p>
            감성문의에는 이름, 연락처, 이메일이 포함되므로 관리자 이메일로
            로그인한 경우에만 확인할 수 있습니다.
          </p>

          <form className="admin-login-form" onSubmit={handleSendLoginLink}>
            <label>
              <span>관리자 이메일</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => {
                  setLoginEmail(event.target.value);
                  setLoginError("");
                  setLoginMessage("");
                }}
                placeholder="관리자 이메일"
              />
            </label>

            {loginError ? (
              <p className="admin-login-error">{loginError}</p>
            ) : null}

            {loginMessage ? (
              <p className="admin-login-message">{loginMessage}</p>
            ) : null}

            <button type="submit">로그인 링크 받기</button>
          </form>

          <p className="admin-login-help">
            현재 관리자 이메일 기준: <strong>{adminEmail}</strong>
          </p>
        </section>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-inquiries-page">
        <section className="admin-inquiries-notice">
          <p className="admin-inquiries-kicker">ACCESS DENIED</p>
          <h1>관리자 권한이 없습니다</h1>
          <p>{errorMessage}</p>

          <div className="admin-inquiries-actions">
            <button type="button" onClick={handleLogout}>
              로그아웃
            </button>
            <Link to="/" className="admin-inquiries-home-link">
              홈으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="admin-inquiries-page">
      <section className="admin-inquiries-hero">
        <div>
          <p className="admin-inquiries-kicker">GAMSUNG MESSAGE BOX</p>
          <h1>감성문의 쪽지함</h1>
          <p>
            홈페이지 오른쪽 아래 감성문의로 들어온 문의를 확인하고 처리 상태를
            관리하는 관리자 화면입니다.
          </p>
        </div>

        <div className="admin-inquiries-hero-actions">
          <button type="button" onClick={fetchInquiries}>
            새로고침
          </button>
          <button type="button" className="ghost" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </section>

      {errorMessage ? (
        <div className="admin-inquiries-alert">{errorMessage}</div>
      ) : null}

      <section className="admin-inquiries-summary">
        <article>
          <span>전체 문의</span>
          <strong>{inquiries.length}</strong>
        </article>
        <article>
          <span>접수</span>
          <strong>
            {inquiries.filter((item) => item.status === "접수").length}
          </strong>
        </article>
        <article>
          <span>확인중</span>
          <strong>
            {inquiries.filter((item) => item.status === "확인중").length}
          </strong>
        </article>
        <article>
          <span>답변완료</span>
          <strong>
            {inquiries.filter((item) => item.status === "답변완료").length}
          </strong>
        </article>
      </section>

      {loading ? (
        <section className="admin-inquiries-empty">
          문의 목록을 불러오는 중입니다.
        </section>
      ) : inquiries.length === 0 ? (
        <section className="admin-inquiries-empty">
          아직 접수된 감성문의가 없습니다.
        </section>
      ) : (
        <section className="admin-inquiries-list">
          {inquiries.map((item) => (
            <article key={item.id} className="admin-inquiry-card">
              <div className="admin-inquiry-card-head">
                <div>
                  <span
                    className={`admin-inquiry-status ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status || "접수"}
                  </span>
                  <h2>{item.name || "이름 없음"}</h2>
                  <p>{item.inquiry_type || "문의 유형 없음"}</p>
                </div>

                <div className="admin-inquiry-date">
                  {formatDate(item.created_at)}
                </div>
              </div>

              <div className="admin-inquiry-grid">
                <div>
                  <span>연락처</span>
                  <strong>{item.phone || "-"}</strong>
                </div>
                <div>
                  <span>이메일</span>
                  <strong>{item.email || "-"}</strong>
                </div>
                <div>
                  <span>접수 페이지</span>
                  <strong>{item.source_path || "-"}</strong>
                </div>
              </div>

              <div className="admin-inquiry-message">
                <span>문의 내용</span>
                <p>{item.message}</p>
              </div>

              <div className="admin-inquiry-controls">
                <label>
                  <span>처리 상태</span>
                  <select
                    value={item.status || "접수"}
                    onChange={(event) =>
                      handleStatusChange(item.id, event.target.value)
                    }
                    disabled={actionLoadingId === item.id}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                {item.source_url ? (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-inquiry-source-link"
                  >
                    문의 페이지 열기
                  </a>
                ) : null}
              </div>

              <div className="admin-inquiry-memo">
                <label>
                  <span>관리자 메모</span>
                  <textarea
                    value={memoDrafts[item.id] || ""}
                    onChange={(event) =>
                      handleMemoChange(item.id, event.target.value)
                    }
                    placeholder="예: 전화 완료, 재연락 필요, 입점 상담 예정"
                    rows={3}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleSaveMemo(item.id)}
                  disabled={actionLoadingId === item.id}
                >
                  {actionLoadingId === item.id ? "저장 중..." : "메모 저장"}
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}