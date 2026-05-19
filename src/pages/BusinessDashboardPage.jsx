// 파일 경로: src/pages/BusinessDashboardPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 소상공인 내 가게 관리 준비 화면
// - 소상공인 무료 가입 후 처음 도착하는 전용 관리 화면
// - 현재 로그인 세션 기준으로 profiles / owner_profiles 정보를 불러옴
// - 일반회원이 직접 URL로 접근하면 차단 안내
// - 관리자 계정은 확인용으로 접근 가능
// - 가입은 무료 상태로 표시
// - 미니홈피 공개 / 운영 시작 버튼은 결제 연결 예정 상태로 안내
// - owner_subscriptions는 이 화면에서도 아직 저장하지 않음
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./BusinessDashboardPage.css";

const SUBSCRIPTION_PRICE = 100000;
const SUBSCRIPTION_DAYS = 365;

function formatPrice(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function getDisplayValue(value, fallback = "미입력") {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
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

export default function BusinessDashboardPage() {
  const { currentUser, loading: authLoading, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const userId = currentUser?.id || "";
  const accountType = currentUser?.accountType || "guest";
  const canUseDashboard = accountType === "business" || accountType === "admin";
  const isAdminView = accountType === "admin";

  const storeName = useMemo(() => {
    return (
      ownerProfile?.store_name ||
      profile?.nickname ||
      profile?.name ||
      currentUser?.displayName ||
      "내 가게"
    );
  }, [ownerProfile, profile, currentUser]);

  const ownerName = useMemo(() => {
    return ownerProfile?.owner_name || profile?.name || "대표자";
  }, [ownerProfile, profile]);

  const businessNumber = useMemo(() => {
    return ownerProfile?.business_number || profile?.username || "";
  }, [ownerProfile, profile]);

  const hasStoreInfo = hasMeaningfulOwnerProfile(ownerProfile);

  useEffect(() => {
    let mounted = true;

    async function loadBusinessInfo() {
      if (authLoading) {
        return;
      }

      setLoading(true);
      setErrorMessage("");
      setNoticeMessage("");

      if (!isLoggedIn || !userId) {
        setProfile(null);
        setOwnerProfile(null);
        setLoading(false);
        return;
      }

      if (!canUseDashboard) {
        setProfile(currentUser?.profile || null);
        setOwnerProfile(null);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
        setLoading(false);
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        const { data: ownerData, error: ownerError } = await supabase
          .from("owner_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (ownerError) {
          console.warn("[소상공인 관리] owner_profiles 조회 확인 필요:", ownerError);
        }

        if (!mounted) return;

        setProfile(profileData || currentUser?.profile || null);
        setOwnerProfile(ownerData || null);
      } catch (error) {
        console.error("[소상공인 관리] 정보 불러오기 실패:", error);

        if (!mounted) return;

        setProfile(currentUser?.profile || null);
        setOwnerProfile(null);
        setErrorMessage(
          error?.message || "소상공인 정보를 불러오는 중 문제가 발생했습니다."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBusinessInfo();

    return () => {
      mounted = false;
    };
  }, [
    authLoading,
    isLoggedIn,
    userId,
    canUseDashboard,
    currentUser?.profile,
  ]);

  function handlePreviewClick() {
    if (!hasStoreInfo) {
      setNoticeMessage(
        "아직 가게 기본 정보가 부족합니다. 다음 단계에서 가게 정보 수정 화면을 연결한 뒤 미리보기를 사용할 수 있게 하면 좋습니다."
      );
      return;
    }

    setNoticeMessage(
      "미니홈피 미리보기 화면은 다음 단계에서 연결할 예정입니다. 지금은 가입 정보 확인 단계입니다."
    );
  }

  function handleStartClick() {
    if (!hasStoreInfo) {
      setNoticeMessage(
        "미니홈피를 공개하려면 가게명, 사업자번호, 주소 같은 기본 정보를 먼저 채워야 합니다."
      );
      return;
    }

    setNoticeMessage(
      `운영 시작은 ${SUBSCRIPTION_DAYS}일 이용권 결제 후 공개되는 구조로 연결할 예정입니다. 현재 단계에서는 결제를 진행하지 않습니다.`
    );
  }

  if (authLoading || loading) {
    return (
      <main className="business-dashboard-page">
        <section className="business-dashboard-loading">
          <p>소상공인 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="business-dashboard-page">
        <section className="business-dashboard-empty">
          <p className="business-dashboard-badge">소상공인 관리</p>

          <h1>로그인 후 이용할 수 있습니다</h1>

          <p>
            소상공인 가입을 완료했지만 현재 로그인 세션이 없으면 내 가게
            관리 화면을 바로 불러올 수 없습니다.
          </p>

          <div className="business-dashboard-actions">
            <Link to="/login" className="business-main-btn">
              로그인하기
            </Link>

            <Link to="/signup/business" className="business-sub-btn">
              소상공인 가입하기
            </Link>

            <Link to="/" className="business-sub-btn">
              홈으로 이동
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!canUseDashboard) {
    return (
      <main className="business-dashboard-page">
        <section className="business-dashboard-empty">
          <p className="business-dashboard-badge">소상공인 관리</p>

          <h1>소상공인 계정만 이용할 수 있습니다</h1>

          <p>
            현재 로그인된 계정은 소상공인 계정으로 확인되지 않았습니다.
            소상공인 미니홈피를 운영하려면 소상공인 무료 입점을 먼저 진행해
            주세요.
          </p>

          <div className="business-dashboard-actions">
            <Link to="/signup/business" className="business-main-btn">
              소상공인 무료 입점
            </Link>

            <Link to="/" className="business-sub-btn">
              홈으로 이동
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="business-dashboard-page">
      <section className="business-dashboard-wrap">
        <div className="business-dashboard-hero">
          <p className="business-dashboard-badge">
            {isAdminView ? "관리자 확인 모드" : "소상공인 전용 관리 화면"}
          </p>

          <h1>
            {getDisplayValue(storeName)}
            <br />
            미니홈피 준비를 시작하세요
          </h1>

          <p>
            가입은 무료로 완료되었습니다. 지금은 가게 정보를 확인하고,
            미니홈피 공개 또는 운영 시작 버튼을 누를 때 결제 안내가 연결되는
            구조로 준비합니다.
          </p>
        </div>

        {errorMessage ? (
          <div className="business-dashboard-alert error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? (
          <div className="business-dashboard-alert">{noticeMessage}</div>
        ) : null}

        {isAdminView ? (
          <div className="business-dashboard-alert">
            관리자 계정으로 접속 중입니다. 소상공인 화면 확인용으로 접근이
            허용되었습니다.
          </div>
        ) : null}

        {!hasStoreInfo ? (
          <div className="business-dashboard-alert warning">
            아직 가게 기본 정보가 충분하지 않습니다. 다음 단계에서 가게 정보
            수정 화면을 연결하면 미니홈피 공개 전 정보를 채울 수 있습니다.
          </div>
        ) : null}

        <div className="business-dashboard-grid">
          <section className="business-dashboard-card store-card">
            <div className="business-dashboard-card-head">
              <div>
                <span>STORE INFO</span>
                <h2>내 가게 정보</h2>
              </div>

              <strong>{hasStoreInfo ? "입점 준비중" : "정보 입력 필요"}</strong>
            </div>

            <dl className="business-info-list">
              <div>
                <dt>가게명</dt>
                <dd>{getDisplayValue(storeName)}</dd>
              </div>

              <div>
                <dt>대표자명</dt>
                <dd>{getDisplayValue(ownerName)}</dd>
              </div>

              <div>
                <dt>사업자번호</dt>
                <dd>{getDisplayValue(businessNumber)}</dd>
              </div>

              <div>
                <dt>업종 / 품목</dt>
                <dd>{getDisplayValue(ownerProfile?.business_type)}</dd>
              </div>

              <div>
                <dt>주소</dt>
                <dd>{getDisplayValue(ownerProfile?.store_address)}</dd>
              </div>

              <div>
                <dt>대표 전화</dt>
                <dd>
                  {getDisplayValue(ownerProfile?.store_phone || profile?.phone)}
                </dd>
              </div>

              <div>
                <dt>이메일</dt>
                <dd>
                  {getDisplayValue(
                    ownerProfile?.store_email ||
                      profile?.email ||
                      currentUser?.email
                  )}
                </dd>
              </div>

              <div>
                <dt>한 줄 소개</dt>
                <dd>{getDisplayValue(ownerProfile?.intro)}</dd>
              </div>
            </dl>
          </section>

          <aside className="business-dashboard-card status-card">
            <div className="business-dashboard-card-head">
              <div>
                <span>STATUS</span>
                <h2>현재 상태</h2>
              </div>

              <strong>무료 가입</strong>
            </div>

            <div className="business-status-box free">
              <span>가입 상태</span>
              <strong>무료 가입 완료</strong>
              <p>지금은 결제 없이 내 가게 정보를 준비하는 단계입니다.</p>
            </div>

            <div className="business-status-box">
              <span>미니홈피 상태</span>
              <strong>아직 공개 전</strong>
              <p>
                공개 버튼을 누르면 나중에 365일 이용권 결제창으로 연결할
                예정입니다.
              </p>
            </div>

            <div className="business-status-box price">
              <span>운영 시작 이용권</span>
              <strong>
                {SUBSCRIPTION_DAYS}일 / {formatPrice(SUBSCRIPTION_PRICE)}원
              </strong>
              <p>가입 단계에서는 owner_subscriptions에 저장하지 않습니다.</p>
            </div>
          </aside>
        </div>

        <section className="business-dashboard-card next-card">
          <div>
            <span className="next-label">NEXT STEP</span>

            <h2>다음 단계</h2>

            <p>
              사장님은 먼저 가게 정보를 확인하고, 미니홈피가 어떻게 보일지
              미리 본 뒤, 실제 공개하거나 운영을 시작할 때 결제하도록 만들면
              됩니다.
            </p>
          </div>

          <div className="business-next-actions">
            <button type="button" onClick={handlePreviewClick}>
              미니홈피 미리보기
            </button>

            <button type="button" onClick={handleStartClick}>
              미니홈피 공개 / 운영 시작
            </button>

            <Link to="/" className="business-home-link">
              홈으로 이동
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}