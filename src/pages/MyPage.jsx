// 파일 경로: src/pages/MyPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 권한별 마이페이지
// - 로그인한 회원 유형에 따라 개인회원 / 소상공인 / 지자체 / 관리자 화면을 다르게 표시
// - 개인회원은 감성친구 / 내 여행 / 버킷 / 앨범 / 이벤트 참여 흐름 중심
// - 소상공인은 내 가게 미니홈피 / 감성여행2 예약형 / 감성배달 배달형 / 상품 / 이벤트 관리 중심
// - 지자체는 지역축제 / 관광이벤트 / 데이터보고서 / 등록 콘텐츠 관리 중심
// - 소상공인 계정은 owner_profiles와 stores를 조회해 미니홈피 바로가기 연결
// - 현재 없는 기능은 준비중 카드로 표시하여 흐름만 먼저 잡음
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./MyPage.css";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
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
      row.biz_name ||
      row.business_number ||
      row.biz_no ||
      row.owner_name ||
      row.store_address ||
      row.address ||
      row.store_phone ||
      row.mobile_phone ||
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
      row.phone ||
      row.email
  );
}

function resolveAccountType(currentUser, profile, ownerProfile, govProfile) {
  const accountType = normalizeText(currentUser?.accountType);
  const role = normalizeText(profile?.role || currentUser?.role);
  const memberType = normalizeText(profile?.member_type || currentUser?.memberType);

  if (
    accountType === "admin" ||
    role === "admin" ||
    role === "administrator" ||
    memberType === "admin"
  ) {
    return "admin";
  }

  if (
    accountType === "business" ||
    accountType === "biz" ||
    accountType === "owner" ||
    role === "biz" ||
    role === "business" ||
    role === "owner" ||
    role === "store_owner" ||
    memberType === "business" ||
    memberType === "biz" ||
    memberType === "owner" ||
    hasMeaningfulOwnerProfile(ownerProfile)
  ) {
    return "business";
  }

  if (
    accountType === "gov" ||
    accountType === "government" ||
    accountType === "local_government" ||
    accountType === "agency" ||
    accountType === "institution" ||
    role === "gov" ||
    role === "government" ||
    role === "local_government" ||
    role === "agency" ||
    role === "institution" ||
    memberType === "gov" ||
    memberType === "government" ||
    memberType === "agency" ||
    memberType === "institution" ||
    hasMeaningfulGovProfile(govProfile)
  ) {
    return "gov";
  }

  return "user";
}

function getAccountLabel(accountType) {
  if (accountType === "business") return "소상공인 회원";
  if (accountType === "gov") return "지자체 / 기관 회원";
  if (accountType === "admin") return "관리자";
  return "개인회원";
}

function getUserName(currentUser, profile, ownerProfile, govProfile, accountType) {
  if (accountType === "business") {
    return (
      ownerProfile?.store_name ||
      ownerProfile?.biz_name ||
      profile?.nickname ||
      profile?.name ||
      currentUser?.displayName ||
      currentUser?.email ||
      "소상공인"
    );
  }

  if (accountType === "gov") {
    return (
      govProfile?.org_name ||
      govProfile?.organization_name ||
      govProfile?.gov_name ||
      profile?.nickname ||
      profile?.name ||
      currentUser?.displayName ||
      "지자체 / 기관"
    );
  }

  return (
    profile?.nickname ||
    profile?.display_name ||
    profile?.name ||
    currentUser?.displayName ||
    currentUser?.nickname ||
    currentUser?.username ||
    currentUser?.email ||
    "감성회원"
  );
}

function getBusinessNumber(profile, ownerProfile, store) {
  return (
    store?.business_number ||
    ownerProfile?.business_number ||
    ownerProfile?.biz_no ||
    profile?.username ||
    ""
  );
}

function getStoreName(store, ownerProfile, profile, currentUser) {
  return (
    store?.store_name ||
    store?.name ||
    store?.title ||
    ownerProfile?.store_name ||
    ownerProfile?.biz_name ||
    profile?.nickname ||
    profile?.name ||
    currentUser?.displayName ||
    "내 가게"
  );
}

function buildShareUrl(path) {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

function MyActionCard({
  icon,
  title,
  desc,
  to,
  buttonText = "바로가기",
  disabled = false,
  badge,
  onClick,
}) {
  const content = (
    <>
      <div className="my-action-icon">{icon}</div>

      <div className="my-action-content">
        <div className="my-action-title-row">
          <h3>{title}</h3>
          {badge ? <span>{badge}</span> : null}
        </div>

        <p>{desc}</p>

        <strong>{disabled ? "준비중" : buttonText}</strong>
      </div>
    </>
  );

  if (disabled) {
    return <article className="my-action-card disabled">{content}</article>;
  }

  if (onClick) {
    return (
      <button type="button" className="my-action-card as-button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to || "/"} className="my-action-card">
      {content}
    </Link>
  );
}

export default function MyPage() {
  const { currentUser, loading: authLoading, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [govProfile, setGovProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userId = currentUser?.id || "";

  const accountType = useMemo(() => {
    return resolveAccountType(currentUser, profile, ownerProfile, govProfile);
  }, [currentUser, profile, ownerProfile, govProfile]);

  const accountLabel = useMemo(() => getAccountLabel(accountType), [accountType]);

  const userName = useMemo(() => {
    return getUserName(currentUser, profile, ownerProfile, govProfile, accountType);
  }, [currentUser, profile, ownerProfile, govProfile, accountType]);

  const storeName = useMemo(() => {
    return getStoreName(store, ownerProfile, profile, currentUser);
  }, [store, ownerProfile, profile, currentUser]);

  const businessNumber = useMemo(() => {
    return getBusinessNumber(profile, ownerProfile, store);
  }, [profile, ownerProfile, store]);

  const storeTravelPath = store?.id ? `/store/${store.id}` : "";
  const storeDeliveryPath = store?.id ? `/delivery/store/${store.id}` : "";

  useEffect(() => {
    let mounted = true;

    async function loadRow(tableName, nextUserId) {
      if (!nextUserId) return null;

      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", nextUserId)
        .maybeSingle();

      if (error) {
        console.warn(`[MyPage] ${tableName} 조회 확인 필요:`, error);
        return null;
      }

      return data || null;
    }

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
        console.warn("[MyPage] stores 조회 확인 필요:", error);
        return null;
      }

      return data || null;
    }

    async function loadMyPageData() {
      if (authLoading) return;

      setLoading(true);
      setErrorMessage("");
      setNoticeMessage("");

      if (!isLoggedIn || !userId) {
        setProfile(null);
        setOwnerProfile(null);
        setGovProfile(null);
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
        const [profileData, ownerData, govData] = await Promise.all([
          loadRow("profiles", userId),
          loadRow("owner_profiles", userId),
          loadRow("gov_profiles", userId),
        ]);

        const nextBusinessNumber =
          ownerData?.business_number ||
          ownerData?.biz_no ||
          profileData?.username ||
          "";

        const storeData = await loadStoreByBusinessNumber(nextBusinessNumber);

        if (!mounted) return;

        setProfile(profileData || currentUser?.profile || null);
        setOwnerProfile(ownerData || null);
        setGovProfile(govData || null);
        setStore(storeData || null);
      } catch (error) {
        console.error("[MyPage] 마이페이지 정보 조회 실패:", error);

        if (!mounted) return;

        setErrorMessage(
          error?.message || "마이페이지 정보를 불러오는 중 문제가 발생했습니다."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMyPageData();

    return () => {
      mounted = false;
    };
  }, [authLoading, isLoggedIn, userId, currentUser?.profile]);

  async function handleCopyStoreLink(path) {
    if (!path) {
      setNoticeMessage("아직 연결된 미니홈피 주소가 없습니다.");
      return;
    }

    const url = buildShareUrl(path);

    try {
      await navigator.clipboard.writeText(url);
      setNoticeMessage("미니홈피 주소를 복사했습니다.");
    } catch (error) {
      console.warn("[MyPage] 링크 복사 실패:", error);
      setNoticeMessage(url);
    }
  }

  if (authLoading || loading) {
    return (
      <main className="my-page">
        <section className="my-page-loading">
          <p>마이페이지 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="my-page">
        <section className="my-page-empty">
          <p className="my-page-badge">감성여행2 마이페이지</p>
          <h1>로그인이 필요합니다</h1>
          <p>마이페이지는 로그인 후 이용할 수 있습니다.</p>

          <Link to="/login" className="my-main-link">
            로그인하기
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className={`my-page my-page-${accountType}`}>
      <section className="my-page-hero">
        <div>
          <p className="my-page-badge">{accountLabel}</p>

          <h1>
            {userName}님,
            <br />
            필요한 관리를 여기서 시작하세요
          </h1>

          <p>
            감성여행2 홈페이지에서 회원 유형별로 필요한 화면을 모아둔
            마이페이지입니다. 수정, 공유, 관리 화면으로 빠르게 이동할 수
            있습니다.
          </p>
        </div>

        <div className="my-profile-summary">
          <span>MY PROFILE</span>
          <strong>{getDisplayValue(userName)}</strong>
          <p>{accountLabel}</p>

          {accountType === "business" ? (
            <dl>
              <div>
                <dt>가게명</dt>
                <dd>{getDisplayValue(storeName)}</dd>
              </div>
              <div>
                <dt>사업자번호</dt>
                <dd>{getDisplayValue(businessNumber)}</dd>
              </div>
              <div>
                <dt>미니홈피</dt>
                <dd>{store?.id ? "연결됨" : "준비중"}</dd>
              </div>
            </dl>
          ) : null}

          {accountType === "gov" ? (
            <dl>
              <div>
                <dt>기관명</dt>
                <dd>
                  {getDisplayValue(
                    govProfile?.org_name ||
                      govProfile?.organization_name ||
                      govProfile?.gov_name
                  )}
                </dd>
              </div>
              <div>
                <dt>담당 지역</dt>
                <dd>
                  {getDisplayValue(
                    govProfile?.region_name ||
                      govProfile?.region ||
                      govProfile?.area
                  )}
                </dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>{getDisplayValue(govProfile?.status, "승인 대기 / 확인 필요")}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </section>

      {errorMessage ? (
        <section className="my-page-alert error">{errorMessage}</section>
      ) : null}

      {noticeMessage ? (
        <section className="my-page-alert">{noticeMessage}</section>
      ) : null}

      {accountType === "business" ? (
        <section className="my-section">
          <div className="my-section-head">
            <span>BUSINESS</span>
            <h2>소상공인 마이페이지</h2>
            <p>
              사장님은 가게 미니홈피를 한 번만 만들고, 감성여행2에서는 예약형,
              감성배달에서는 배달형으로 다르게 보여줄 수 있습니다.
            </p>
          </div>

          <div className="my-action-grid">
            <MyActionCard
              icon="🏠"
              title="내 가게 관리"
              desc="가게 기본정보, 입점 상태, 미니홈피 연결 상태를 확인합니다."
              to="/business/dashboard"
              buttonText="관리 화면 열기"
              badge="필수"
            />

            <MyActionCard
              icon="🌿"
              title="감성여행2 미니홈피"
              desc="여행자가 보는 방문 예약 중심 미니홈피를 확인합니다."
              to={storeTravelPath || "/business/dashboard"}
              buttonText={storeTravelPath ? "예약형 보기" : "가게 연결 필요"}
              disabled={!storeTravelPath}
            />

            <MyActionCard
              icon="🛵"
              title="감성배달 미니홈피"
              desc="지역 생활고객이 보는 배달 주문 중심 미니홈피를 확인합니다."
              to={storeDeliveryPath || "/business/dashboard"}
              buttonText={storeDeliveryPath ? "배달형 보기" : "가게 연결 필요"}
              disabled={!storeDeliveryPath}
            />

            <MyActionCard
              icon="🍲"
              title="상품 / 메뉴 관리"
              desc="메뉴명, 가격, 설명, 사진은 앱에서 등록하고 홈페이지 미니홈피에 함께 표시합니다."
              to="/business/dashboard"
              buttonText="관리 바로가기"
            />

            <MyActionCard
              icon="🎁"
              title="가게 이벤트 관리"
              desc="할인, 혜택, 관광객 대상 이벤트를 등록해 미니홈피에 노출합니다."
              to="/business/dashboard"
              buttonText="이벤트 준비"
            />

            <MyActionCard
              icon="🔗"
              title="미니홈피 주소 복사"
              desc="외부 홍보나 지자체 확인용으로 미니홈피 주소를 복사합니다."
              buttonText="주소 복사"
              disabled={!storeTravelPath}
              onClick={() => handleCopyStoreLink(storeTravelPath)}
            />
          </div>
        </section>
      ) : null}

      {accountType === "gov" ? (
        <section className="my-section">
          <div className="my-section-head">
            <span>GOVERNMENT</span>
            <h2>지자체 / 기관 마이페이지</h2>
            <p>
              지역축제, 관광이벤트, 참여 후기, 지역상권 반응 데이터를 관리하는
              공간입니다.
            </p>
          </div>

          <div className="my-action-grid">
            <MyActionCard
              icon="🏛️"
              title="지자체 대시보드"
              desc="지역축제와 관광이벤트 운영 상태를 한눈에 확인합니다."
              to="/gov/dashboard"
              buttonText="대시보드 열기"
              badge="관리"
            />

            <MyActionCard
              icon="🎪"
              title="지역축제 / 관광이벤트 등록"
              desc="지자체가 운영할 축제와 관광 이벤트 콘텐츠를 등록합니다."
              to="/gov/contents/new"
              buttonText="새 콘텐츠 등록"
            />

            <MyActionCard
              icon="📋"
              title="등록 콘텐츠 관리"
              desc="등록한 지역축제와 관광이벤트 목록을 확인하고 관리합니다."
              to="/gov/contents"
              buttonText="목록 보기"
            />

            <MyActionCard
              icon="📊"
              title="데이터 보고서"
              desc="참여자 수, 후기, 소상공인 연계 반응, 관광 데이터 보고서를 확인합니다."
              disabled
            />

            <MyActionCard
              icon="🤝"
              title="지역 소상공인 연계"
              desc="이벤트와 연결된 지역 상권, 소상공인 참여 현황을 확인합니다."
              disabled
            />

            <MyActionCard
              icon="💬"
              title="문의 / 협약 관리"
              desc="제휴문의, 협약, 승인 상태를 확인하는 공간입니다."
              to="/partner"
              buttonText="제휴문의 보기"
            />
          </div>
        </section>
      ) : null}

      {accountType === "admin" ? (
        <section className="my-section">
          <div className="my-section-head">
            <span>ADMIN</span>
            <h2>관리자 마이페이지</h2>
            <p>문의, 회원, 소상공인, 지자체 운영 상태를 확인하는 관리자 공간입니다.</p>
          </div>

          <div className="my-action-grid">
            <MyActionCard
              icon="📨"
              title="관리자 문의함"
              desc="홈페이지 감성문의와 제휴 문의를 확인합니다."
              to="/admin/inquiries"
              buttonText="문의함 열기"
              badge="관리자"
            />

            <MyActionCard
              icon="🏪"
              title="소상공인 화면 확인"
              desc="소상공인 대시보드와 미니홈피 연결 상태를 확인합니다."
              to="/business/dashboard"
              buttonText="소상공인 화면"
            />

            <MyActionCard
              icon="🏛️"
              title="지자체 화면 확인"
              desc="지자체 대시보드와 콘텐츠 관리 흐름을 확인합니다."
              to="/gov/dashboard"
              buttonText="지자체 화면"
            />
          </div>
        </section>
      ) : null}

      {accountType === "user" ? (
        <section className="my-section">
          <div className="my-section-head">
            <span>USER</span>
            <h2>개인회원 마이페이지</h2>
            <p>
              감성친구, 내 여행, 버킷리스트, 감성앨범, 지역축제 참여 흐름을
              모아둔 개인회원 공간입니다.
            </p>
          </div>

          <div className="my-action-grid">
            <MyActionCard
              icon="👥"
              title="감성친구"
              desc="가족, 친구, 연인, 회사동료와 여행 기록과 위치 공유를 관리합니다."
              disabled
            />

            <MyActionCard
              icon="🧳"
              title="내 여행"
              desc="담아둔 여행지, 여행 코스, 방문 예정 장소를 확인합니다."
              disabled
            />

            <MyActionCard
              icon="⭐"
              title="버킷리스트"
              desc="가보고 싶은 장소와 인증한 여행지를 관리합니다."
              disabled
            />

            <MyActionCard
              icon="🖼️"
              title="감성앨범"
              desc="가족앨범, 친구앨범, 연인앨범 등 공유 앨범을 관리합니다."
              disabled
            />

            <MyActionCard
              icon="🎪"
              title="지역축제 / 관광이벤트"
              desc="참여 가능한 이벤트와 지역별 후기를 확인합니다."
              to="/events"
              buttonText="이벤트 보기"
            />

            <MyActionCard
              icon="📱"
              title="앱 다운로드"
              desc="감성여행2 앱에서 개인회원 기능을 더 편하게 이용합니다."
              to="/app"
              buttonText="앱 안내 보기"
            />
          </div>
        </section>
      ) : null}

      <section className="my-bottom-guide">
        <div>
          <span>GAMSUNG2</span>
          <h2>하나의 계정으로 목적에 맞게 이동합니다</h2>
          <p>
            개인회원은 여행과 친구 공유, 소상공인은 미니홈피와 상품 관리,
            지자체는 지역축제와 관광이벤트 관리에 집중하도록 마이페이지를
            분리했습니다.
          </p>
        </div>

        <Link to="/" className="my-main-link">
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  );
}