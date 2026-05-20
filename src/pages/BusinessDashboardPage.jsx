// 파일 경로: src/pages/BusinessDashboardPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 소상공인 내 가게 관리 준비 화면
// - 소상공인 무료 가입 후 처음 도착하는 전용 관리 화면
// - 현재 로그인 세션 기준으로 profiles / owner_profiles 정보를 불러옴
// - owner_profiles의 사업자번호 기준으로 stores에 생성된 가게 미니홈피 정보를 함께 확인
// - 미니홈피 미리보기 버튼을 /store/:storeId 화면으로 연결
// - 일반회원이 직접 URL로 접근하면 차단 안내
// - 관리자 계정은 확인용으로 접근 가능
// - 가입은 무료 상태로 표시
// - 결제 전에도 가게 정보 / 상품·메뉴 / 사진 등록 준비와 미리보기는 가능하게 안내
// - 미니홈피 공개 / 예약 접수 / 배달 주문 접수는 결제 후 활성화되는 구조로 안내
// - owner_subscriptions는 이 화면에서도 아직 저장하지 않음
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function getStoreName(store, ownerProfile, profile, currentUser) {
  return (
    store?.store_name ||
    store?.name ||
    store?.title ||
    ownerProfile?.store_name ||
    profile?.nickname ||
    profile?.name ||
    currentUser?.displayName ||
    "내 가게"
  );
}

function getStoreAddress(store, ownerProfile) {
  return (
    store?.address ||
    store?.store_address ||
    store?.road_address ||
    ownerProfile?.store_address ||
    ""
  );
}

function getStorePhone(store, ownerProfile, profile) {
  return (
    store?.phone ||
    store?.store_phone ||
    store?.tel ||
    ownerProfile?.store_phone ||
    profile?.phone ||
    ""
  );
}

export default function BusinessDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const userId = currentUser?.id || "";
  const accountType = currentUser?.accountType || "guest";
  const canUseDashboard = accountType === "business" || accountType === "admin";
  const isAdminView = accountType === "admin";

  const storeName = useMemo(() => {
    return getStoreName(store, ownerProfile, profile, currentUser);
  }, [store, ownerProfile, profile, currentUser]);

  const ownerName = useMemo(() => {
    return (
      store?.owner_name ||
      store?.representative_name ||
      ownerProfile?.owner_name ||
      profile?.name ||
      "대표자"
    );
  }, [store, ownerProfile, profile]);

  const businessNumber = useMemo(() => {
    return (
      store?.business_number ||
      ownerProfile?.business_number ||
      profile?.username ||
      ""
    );
  }, [store, ownerProfile, profile]);

  const storeAddress = useMemo(() => {
    return getStoreAddress(store, ownerProfile);
  }, [store, ownerProfile]);

  const storePhone = useMemo(() => {
    return getStorePhone(store, ownerProfile, profile);
  }, [store, ownerProfile, profile]);

  const hasStoreInfo = hasMeaningfulOwnerProfile(ownerProfile) || Boolean(store?.id);
  const hasStoreMiniHome = Boolean(store?.id);

  useEffect(() => {
    let mounted = true;

    async function loadStoreByBusinessNumber(nextBusinessNumber) {
      if (!nextBusinessNumber) return null;

      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("business_number", nextBusinessNumber)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("[소상공인 관리] stores 조회 확인 필요:", error);
        return null;
      }

      return data || null;
    }

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
        setStore(null);
        setLoading(false);
        return;
      }

      if (!canUseDashboard) {
        setProfile(currentUser?.profile || null);
        setOwnerProfile(null);
        setStore(null);
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

        const nextProfile = profileData || currentUser?.profile || null;
        const nextOwnerProfile = ownerData || null;
        const nextBusinessNumber =
          nextOwnerProfile?.business_number || nextProfile?.username || "";

        const storeData = await loadStoreByBusinessNumber(nextBusinessNumber);

        if (!mounted) return;

        setProfile(nextProfile);
        setOwnerProfile(nextOwnerProfile);
        setStore(storeData || null);
      } catch (error) {
        console.error("[소상공인 관리] 정보 불러오기 실패:", error);

        if (!mounted) return;

        setProfile(currentUser?.profile || null);
        setOwnerProfile(null);
        setStore(null);
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
        "아직 가게 기본 정보가 부족합니다. 가게명, 사업자번호, 주소 같은 기본 정보를 먼저 채워야 미니홈피를 확인할 수 있습니다."
      );
      return;
    }

    if (!hasStoreMiniHome) {
      setNoticeMessage(
        "owner_profiles에는 가입 정보가 있지만 stores에 연결된 가게 미니홈피가 아직 없습니다. 다음 단계에서 가게 생성/동기화 작업을 연결해야 합니다."
      );
      return;
    }

    navigate(`/store/${store.id}`);
  }

  function handleDeliveryPreviewClick() {
    if (!hasStoreMiniHome) {
      setNoticeMessage(
        "감성배달형 미니홈피를 보려면 stores에 연결된 가게 데이터가 먼저 필요합니다."
      );
      return;
    }

    navigate(`/delivery/store/${store.id}`);
  }

  function handleStoreEditClick() {
    setNoticeMessage(
      "가게 기본정보 수정 화면은 다음 단계에서 연결합니다. 현재는 가입 시 저장된 가게 정보를 확인하는 단계입니다."
    );
  }

  function handleMenuManageClick() {
    if (!hasStoreInfo) {
      setNoticeMessage(
        "상품/메뉴를 등록하려면 가게명과 사업자번호 같은 기본 정보가 먼저 필요합니다."
      );
      return;
    }

    navigate("/business/menu");
  }

  function handleStartClick() {
    if (!hasStoreInfo) {
      setNoticeMessage(
        "미니홈피를 공개하려면 가게명, 사업자번호, 주소 같은 기본 정보를 먼저 채워야 합니다."
      );
      return;
    }

    if (!hasStoreMiniHome) {
      setNoticeMessage(
        "먼저 stores에 가게 미니홈피 데이터를 생성한 뒤 운영 시작 결제 흐름으로 연결하면 됩니다."
      );
      return;
    }

    setNoticeMessage(
      `상품/메뉴 등록과 미리보기는 무료 가입 상태에서도 가능합니다. 실제 공개, 예약 접수, 배달 주문 접수는 ${SUBSCRIPTION_DAYS}일 이용권 결제 후 활성화되는 구조로 연결하면 됩니다.`
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
            가입은 무료로 완료되었습니다. 결제 전에도 가게 정보, 상품/메뉴,
            메뉴 사진을 준비하고 미니홈피 미리보기를 확인할 수 있습니다. 실제
            공개와 예약·배달 주문 접수만 운영 시작 결제 후 활성화됩니다.
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

        {hasStoreInfo && !hasStoreMiniHome ? (
          <div className="business-dashboard-alert warning">
            소상공인 가입 정보는 확인되었지만, stores에 연결된 가게 미니홈피
            데이터가 아직 없습니다. 가게 생성/동기화 작업을 다음 단계에서
            연결하면 됩니다.
          </div>
        ) : null}

        <div className="business-dashboard-grid">
          <section className="business-dashboard-card store-card">
            <div className="business-dashboard-card-head">
              <div>
                <span>STORE INFO</span>
                <h2>내 가게 정보</h2>
              </div>

              <strong>{hasStoreMiniHome ? "미니홈피 연결됨" : "입점 준비중"}</strong>
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
                <dd>
                  {getDisplayValue(
                    store?.category ||
                      store?.store_category ||
                      ownerProfile?.business_type
                  )}
                </dd>
              </div>

              <div>
                <dt>주소</dt>
                <dd>{getDisplayValue(storeAddress)}</dd>
              </div>

              <div>
                <dt>대표 전화</dt>
                <dd>{getDisplayValue(storePhone)}</dd>
              </div>

              <div>
                <dt>이메일</dt>
                <dd>
                  {getDisplayValue(
                    store?.email ||
                      store?.store_email ||
                      ownerProfile?.store_email ||
                      profile?.email ||
                      currentUser?.email
                  )}
                </dd>
              </div>

              <div>
                <dt>한 줄 소개</dt>
                <dd>
                  {getDisplayValue(
                    store?.summary ||
                      store?.intro ||
                      store?.description ||
                      ownerProfile?.intro
                  )}
                </dd>
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
              <strong>{hasStoreMiniHome ? "미리보기 가능" : "아직 공개 전"}</strong>
              <p>
                감성여행2에서는 예약형으로, 감성배달에서는 배달형으로 같은
                가게 데이터를 다르게 보여줍니다.
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


        <section className="business-dashboard-card prepare-card">
          <div className="business-dashboard-card-head">
            <div>
              <span>FREE PREPARE</span>
              <h2>결제 전에도 준비할 수 있는 기능</h2>
            </div>

            <strong>무료 준비 가능</strong>
          </div>

          <p className="business-prepare-intro">
            사장님이 먼저 가게를 꾸며보고 마음에 들 때 운영을 시작할 수 있도록,
            등록과 미리보기는 무료 상태에서도 열어둡니다. 고객에게 실제로
            공개되거나 예약·배달 주문을 받는 기능만 결제 후 활성화됩니다.
          </p>

          <div className="business-prepare-grid">
            <button type="button" onClick={handleStoreEditClick}>
              <span>🏪</span>
              <strong>가게 기본정보 준비</strong>
              <small>상호, 주소, 전화번호, 한 줄 소개 확인</small>
            </button>

            <button type="button" onClick={handleMenuManageClick}>
              <span>🍲</span>
              <strong>상품/메뉴 관리</strong>
              <small>메뉴명, 가격, 설명, 사진 등록과 미리보기</small>
            </button>

            <button type="button" onClick={handlePreviewClick}>
              <span>🌿</span>
              <strong>감성여행2 미리보기</strong>
              <small>방문 예약형 미니홈피 화면 확인</small>
            </button>

            <button type="button" onClick={handleDeliveryPreviewClick}>
              <span>🛵</span>
              <strong>감성배달 미리보기</strong>
              <small>배달 주문형 미니홈피 화면 확인</small>
            </button>
          </div>

          <div className="business-paid-lock-box">
            <div>
              <span>PAYMENT LOCK</span>
              <strong>운영 시작 후 활성화</strong>
            </div>

            <p>
              미니홈피 공개, 지도/검색 노출, 감성여행2 예약 접수, 감성배달
              주문 접수는 365일 이용권 결제 후 열리는 구조로 두면 됩니다.
            </p>
          </div>
        </section>

        <section className="business-dashboard-card next-card">
          <div>
            <span className="next-label">NEXT STEP</span>

            <h2>다음 단계</h2>

            <p>
              먼저 상품/메뉴와 사진을 등록해 미니홈피를 꾸며본 뒤, 마음에 들면
              운영 시작 결제로 공개하면 됩니다. 준비는 무료, 공개와 주문·예약
              접수는 결제 후 활성화되는 흐름입니다.
            </p>
          </div>

          <div className="business-next-actions">
            <button type="button" onClick={handleMenuManageClick}>
              상품/메뉴 관리하기
            </button>

            <button type="button" onClick={handlePreviewClick}>
              감성여행2 미니홈피 보기
            </button>

            <button type="button" onClick={handleDeliveryPreviewClick}>
              감성배달 미니홈피 보기
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