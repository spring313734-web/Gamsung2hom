// 파일 경로: src/pages/BusinessMenuManagePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 소상공인 상품/메뉴 관리 화면
// - 소상공인이 결제 전에도 상품/메뉴와 사진을 준비할 수 있는 화면
// - 로그인 세션 기준으로 profiles / owner_profiles / stores 정보를 조회
// - stores에 연결된 가게가 있으면 store_menus 테이블에서 메뉴 목록을 불러옴
// - store_menus 테이블이 없거나 저장 실패 시에도 화면 미리보기용으로 메뉴를 추가할 수 있음
// - 사진 파일 선택만 사용하고 주소 입력칸은 제거하여 사장님이 사진만 고르면 바로 미리보기로 표시
// - 가격 입력 시 숫자만 받아 천 단위 콤마를 자동 표시
// - 원산지 / 추천 대상 / 포장 가능 / 배달 가능 4개 기본 정보만 추가해 입력 부담을 줄임
// - 설명은 제일 아래에 두어 메뉴 특징을 자유롭게 작성할 수 있게 구성
// - 실제 공개 / 예약 접수 / 배달 주문 접수는 운영 시작 결제 후 활성화된다는 안내 표시
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./BusinessMenuManagePage.css";

const MENU_TABLE_NAME = "store_menus";

const emptyDraft = {
  menuName: "",
  price: "",
  description: "",
  imagePreviewUrl: "",
  imageFileName: "",
  category: "",
  origin: "",
  recommendedFor: "",
  takeoutAvailable: "가능",
  deliveryAvailable: "가능",
};

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

function getBusinessNumber(profile, ownerProfile, store) {
  return (
    store?.business_number ||
    ownerProfile?.business_number ||
    ownerProfile?.biz_no ||
    profile?.username ||
    ""
  );
}

function parsePrice(value) {
  const text = String(value || "").replace(/[^\d]/g, "");
  if (!text) return 0;
  return Number(text);
}

function formatPriceInput(value) {
  const text = String(value || "").replace(/[^\d]/g, "");

  if (!text) return "";

  return new Intl.NumberFormat("ko-KR").format(Number(text));
}

function formatPrice(value) {
  const numberValue = Number(value || 0);
  if (!Number.isFinite(numberValue) || numberValue <= 0) return "가격 미입력";
  return `${new Intl.NumberFormat("ko-KR").format(numberValue)}원`;
}

function normalizeImageUrl(value) {
  const text = String(value || "").trim();

  if (!text) return "";

  if (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("data:image") ||
    text.startsWith("blob:") ||
    text.startsWith("/")
  ) {
    return text;
  }

  return text;
}

function getMenuName(menu) {
  return (
    menu?.menu_name ||
    menu?.name ||
    menu?.title ||
    menu?.product_name ||
    "이름 없는 메뉴"
  );
}

function getMenuDescription(menu) {
  return (
    menu?.description ||
    menu?.menu_description ||
    menu?.summary ||
    menu?.intro ||
    "메뉴 설명을 입력하면 미니홈피에서 고객이 더 쉽게 선택할 수 있습니다."
  );
}

function getMenuPrice(menu) {
  return menu?.price || menu?.menu_price || menu?.sale_price || menu?.amount || 0;
}

function getMenuImageUrl(menu) {
  const candidates = [
    menu?.image_url,
    menu?.imageUrl,
    menu?.photo_url,
    menu?.photoUrl,
    menu?.thumbnail_url,
    menu?.thumbnailUrl,
    menu?.main_image_url,
    menu?.menu_image_url,
    menu?.image,
    menu?.image_path,
  ];

  const found = candidates.find((value) => String(value || "").trim());
  return normalizeImageUrl(found);
}

function getMenuCategory(menu) {
  return menu?.category || menu?.menu_category || menu?.group_name || "대표 메뉴";
}

function getMenuOrigin(menu) {
  return menu?.origin || menu?.origin_info || menu?.country_of_origin || "";
}

function getMenuRecommendedFor(menu) {
  return menu?.recommended_for || menu?.recommendedFor || menu?.target_customer || "";
}

function getMenuTakeoutAvailable(menu) {
  return menu?.takeout_available || menu?.takeoutAvailable || menu?.takeout || "";
}

function getMenuDeliveryAvailable(menu) {
  return menu?.delivery_available || menu?.deliveryAvailable || menu?.delivery || "";
}

function buildMenuDetailText(menu) {
  const rows = [
    ["원산지", getMenuOrigin(menu)],
    ["추천 대상", getMenuRecommendedFor(menu)],
    ["포장", getMenuTakeoutAvailable(menu)],
    ["배달", getMenuDeliveryAvailable(menu)],
  ].filter(([, value]) => String(value || "").trim());

  return rows;
}


function sortMenus(a, b) {
  const aOrder = Number(a?.sort_order ?? a?.order_no ?? 9999);
  const bOrder = Number(b?.sort_order ?? b?.order_no ?? 9999);

  if (aOrder !== bOrder) return aOrder - bOrder;

  return String(getMenuName(a)).localeCompare(String(getMenuName(b)), "ko");
}

function canUseBusinessMenu(currentUser, ownerProfile) {
  const accountType = normalizeText(currentUser?.accountType);
  const role = normalizeText(currentUser?.role || currentUser?.profile?.role);

  return (
    accountType === "business" ||
    accountType === "biz" ||
    accountType === "owner" ||
    accountType === "admin" ||
    role === "business" ||
    role === "biz" ||
    role === "owner" ||
    role === "store_owner" ||
    role === "admin" ||
    hasMeaningfulOwnerProfile(ownerProfile)
  );
}

export default function BusinessMenuManagePage() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [menus, setMenus] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localOnlyMode, setLocalOnlyMode] = useState(false);

  const userId = currentUser?.id || "";

  const storeName = useMemo(() => {
    return getStoreName(store, ownerProfile, profile, currentUser);
  }, [store, ownerProfile, profile, currentUser]);

  const businessNumber = useMemo(() => {
    return getBusinessNumber(profile, ownerProfile, store);
  }, [profile, ownerProfile, store]);

  const hasStoreInfo = hasMeaningfulOwnerProfile(ownerProfile) || Boolean(store?.id);
  const hasStoreMiniHome = Boolean(store?.id);
  const canUsePage = canUseBusinessMenu(currentUser, ownerProfile);

  const sortedMenus = useMemo(() => {
    return [...menus].sort(sortMenus);
  }, [menus]);

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
        console.warn(`[상품/메뉴 관리] ${tableName} 조회 확인 필요:`, error);
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
        console.warn("[상품/메뉴 관리] stores 조회 확인 필요:", error);
        return null;
      }

      return data || null;
    }

    async function loadMenusByStoreId(nextStoreId) {
      if (!nextStoreId) return [];

      const { data, error } = await supabase
        .from(MENU_TABLE_NAME)
        .select("*")
        .eq("store_id", nextStoreId);

      if (error) {
        console.warn("[상품/메뉴 관리] store_menus 조회 확인 필요:", error);
        setLocalOnlyMode(true);
        setNoticeMessage(
          "아직 store_menus 테이블 연결이 확인되지 않았습니다. 지금은 화면 미리보기용으로 메뉴를 추가할 수 있습니다."
        );
        return [];
      }

      setLocalOnlyMode(false);
      return Array.isArray(data) ? data : [];
    }

    async function loadPageData() {
      if (authLoading) return;

      setLoading(true);
      setErrorMessage("");
      setNoticeMessage("");

      if (!isLoggedIn || !userId) {
        setProfile(null);
        setOwnerProfile(null);
        setStore(null);
        setMenus([]);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured) {
        setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
        setLoading(false);
        return;
      }

      try {
        const [profileData, ownerData] = await Promise.all([
          loadRow("profiles", userId),
          loadRow("owner_profiles", userId),
        ]);

        const nextProfile = profileData || currentUser?.profile || null;
        const nextOwnerProfile = ownerData || null;
        const nextBusinessNumber =
          nextOwnerProfile?.business_number ||
          nextOwnerProfile?.biz_no ||
          nextProfile?.username ||
          "";

        const storeData = await loadStoreByBusinessNumber(nextBusinessNumber);
        const menuData = await loadMenusByStoreId(storeData?.id);

        if (!mounted) return;

        setProfile(nextProfile);
        setOwnerProfile(nextOwnerProfile);
        setStore(storeData || null);
        setMenus(menuData);
      } catch (error) {
        console.error("[상품/메뉴 관리] 정보 불러오기 실패:", error);

        if (!mounted) return;

        setErrorMessage(
          error?.message || "상품/메뉴 관리 정보를 불러오는 중 문제가 발생했습니다."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      mounted = false;
    };
  }, [authLoading, isLoggedIn, userId, currentUser?.profile]);

  useEffect(() => {
    return () => {
      if (draft.imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(draft.imagePreviewUrl);
      }
    };
  }, [draft.imagePreviewUrl]);

  function updateDraft(key, value) {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleImageFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setDraft((prev) => ({
      ...prev,
      imagePreviewUrl: previewUrl,
      imageFileName: file.name,
    }));

    setNoticeMessage(
      "선택한 사진을 아래 미리보기로 표시했습니다. 현재는 브라우저 미리보기용이며, 실제 저장용 Supabase Storage 업로드는 다음 단계에서 연결하면 됩니다."
    );
  }

  async function handleAddMenu(event) {
    event.preventDefault();

    const menuName = draft.menuName.trim();

    if (!menuName) {
      setNoticeMessage("메뉴명을 먼저 입력해주세요.");
      return;
    }

    const price = parsePrice(draft.price);
    const previewImageUrl = normalizeImageUrl(draft.imagePreviewUrl);
    const hasLocalFilePreview = previewImageUrl.startsWith("blob:");

    const nextMenu = {
      id: `local-${Date.now()}`,
      store_id: store?.id || null,
      menu_name: menuName,
      name: menuName,
      price,
      description: draft.description.trim(),
      image_url: previewImageUrl,
      category: draft.category.trim() || "대표 메뉴",
      origin: draft.origin.trim(),
      recommended_for: draft.recommendedFor.trim(),
      takeout_available: draft.takeoutAvailable,
      delivery_available: draft.deliveryAvailable,
      is_available: true,
      sort_order: menus.length + 1,
    };

    if (!hasStoreMiniHome || localOnlyMode || hasLocalFilePreview) {
      setMenus((prev) => [nextMenu, ...prev]);
      setDraft(emptyDraft);
      setNoticeMessage(
        hasLocalFilePreview
          ? "사진이 포함된 메뉴를 화면 미리보기용으로 추가했습니다. 실제 저장은 Supabase Storage 업로드 연결 후 가능합니다."
          : "화면 미리보기용 메뉴를 추가했습니다. stores와 store_menus 저장 구조가 연결되면 실제 저장까지 이어집니다."
      );
      return;
    }

    setSaving(true);
    setNoticeMessage("");

    try {
      const { data, error } = await supabase
        .from(MENU_TABLE_NAME)
        .insert({
          store_id: store.id,
          menu_name: menuName,
          name: menuName,
          price,
          description: draft.description.trim(),
          image_url: "",
          category: draft.category.trim() || "대표 메뉴",
          is_available: true,
          sort_order: menus.length + 1,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setMenus((prev) => [data ? { ...data, ...nextMenu, id: data.id || nextMenu.id } : nextMenu, ...prev]);
      setDraft(emptyDraft);
      setNoticeMessage("상품/메뉴를 저장했습니다.");
    } catch (error) {
      console.warn("[상품/메뉴 관리] 메뉴 저장 실패:", error);
      setMenus((prev) => [nextMenu, ...prev]);
      setLocalOnlyMode(true);
      setNoticeMessage(
        "store_menus 저장 연결을 확인해야 합니다. 우선 화면 미리보기용으로 메뉴를 추가했습니다."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleTravelPreviewClick() {
    if (!hasStoreMiniHome) {
      setNoticeMessage(
        "감성여행2 미니홈피 미리보기는 stores에 연결된 가게 데이터가 있어야 열 수 있습니다."
      );
      return;
    }

    navigate(`/store/${store.id}`);
  }

  function handleDeliveryPreviewClick() {
    if (!hasStoreMiniHome) {
      setNoticeMessage(
        "감성배달 미니홈피 미리보기는 stores에 연결된 가게 데이터가 있어야 열 수 있습니다."
      );
      return;
    }

    navigate(`/delivery/store/${store.id}`);
  }

  if (authLoading || loading) {
    return (
      <main className="business-menu-page">
        <section className="business-menu-loading">
          <p>상품/메뉴 관리 정보를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="business-menu-page">
        <section className="business-menu-empty">
          <p className="business-menu-badge">상품/메뉴 관리</p>
          <h1>로그인 후 이용할 수 있습니다</h1>
          <p>소상공인 계정으로 로그인하면 결제 전에도 상품/메뉴를 준비할 수 있습니다.</p>

          <div className="business-menu-actions">
            <Link to="/login">로그인하기</Link>
            <Link to="/signup/business">소상공인 무료 입점</Link>
          </div>
        </section>
      </main>
    );
  }

  if (!canUsePage) {
    return (
      <main className="business-menu-page">
        <section className="business-menu-empty">
          <p className="business-menu-badge">상품/메뉴 관리</p>
          <h1>소상공인 계정만 이용할 수 있습니다</h1>
          <p>상품/메뉴 관리는 소상공인 회원의 가게 미니홈피 준비 화면입니다.</p>

          <div className="business-menu-actions">
            <Link to="/my">마이페이지로 이동</Link>
            <Link to="/">홈으로 이동</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="business-menu-page">
      <section className="business-menu-wrap">
        <div className="business-menu-hero">
          <p className="business-menu-badge">무료 준비 가능</p>

          <h1>
            {getDisplayValue(storeName)}
            <br />
            상품/메뉴와 사진을 준비하세요
          </h1>

          <p>
            결제 전에도 메뉴명, 가격, 사진, 원산지, 추천 대상, 포장·배달 가능 여부를
            간단히 등록하고 미니홈피에서 어떻게 보일지 확인할 수 있습니다. 실제 고객
            공개와 예약·배달 주문 접수는 운영 시작 결제 후 활성화됩니다.
          </p>
        </div>

        {errorMessage ? (
          <div className="business-menu-alert error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? <div className="business-menu-alert">{noticeMessage}</div> : null}

        <div className="business-menu-layout">
          <section className="business-menu-card form-card">
            <div className="business-menu-card-head">
              <div>
                <span>MENU FORM</span>
                <h2>상품/메뉴 등록</h2>
              </div>

              <strong>{localOnlyMode ? "미리보기 모드" : "저장 가능"}</strong>
            </div>

            <form onSubmit={handleAddMenu} className="business-menu-form">
              <label>
                <span>메뉴명</span>
                <input
                  type="text"
                  value={draft.menuName}
                  onChange={(event) => updateDraft("menuName", event.target.value)}
                  placeholder="예: 복지리, 복매운탕, 대표 정식"
                />
              </label>

              <label>
                <span>가격</span>
                <input
                  type="text"
                  value={draft.price}
                  onChange={(event) =>
                    updateDraft("price", formatPriceInput(event.target.value))
                  }
                  placeholder="예: 12,000"
                  inputMode="numeric"
                />
              </label>

              <label>
                <span>분류</span>
                <input
                  type="text"
                  value={draft.category}
                  onChange={(event) => updateDraft("category", event.target.value)}
                  placeholder="예: 대표 메뉴, 점심 메뉴, 계절 메뉴"
                />
              </label>

              <label className="image-file-label">
                <span>사진 파일 선택</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} />
                <small>사진을 선택하면 아래에 바로 미리보기로 표시됩니다. 실제 업로드는 다음 단계에서 Storage와 연결합니다.</small>
              </label>

              {draft.imagePreviewUrl ? (
                <div className="business-menu-draft-preview">
                  <div className="business-menu-draft-image-box">
                    <img
                      src={draft.imagePreviewUrl}
                      alt={draft.menuName || "선택한 메뉴 사진 미리보기"}
                    />
                  </div>

                  <div>
                    <span>선택한 사진 미리보기</span>
                    <strong>{draft.imageFileName || "선택한 사진"}</strong>
                    <p>이 사진은 상품/메뉴 추가 후 아래 미니홈피 미리보기 카드에도 표시됩니다.</p>
                  </div>
                </div>
              ) : null}

              <div className="business-menu-basic-info full">
                <div className="business-menu-basic-head">
                  <span>기본 정보</span>
                  <p>사장님이 부담 없이 입력할 수 있도록 꼭 필요한 4개만 넣었습니다.</p>
                </div>

                <div className="business-menu-basic-grid">
                  <label>
                    <span>원산지</span>
                    <input
                      type="text"
                      value={draft.origin}
                      onChange={(event) => updateDraft("origin", event.target.value)}
                      placeholder="예: 복어 국내산, 쌀 국내산"
                    />
                  </label>

                  <label>
                    <span>추천 대상</span>
                    <input
                      type="text"
                      value={draft.recommendedFor}
                      onChange={(event) => updateDraft("recommendedFor", event.target.value)}
                      placeholder="예: 가족 식사, 모임, 담백한 음식 선호 고객"
                    />
                  </label>

                  <div className="business-menu-choice-field">
                    <span>포장 가능</span>
                    <div className="business-menu-choice-row">
                      {["가능", "불가"].map((value) => (
                        <button
                          key={`takeout-${value}`}
                          type="button"
                          className={
                            draft.takeoutAvailable === value
                              ? "business-menu-choice-button active"
                              : "business-menu-choice-button"
                          }
                          onClick={() => updateDraft("takeoutAvailable", value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="business-menu-choice-field">
                    <span>배달 가능</span>
                    <div className="business-menu-choice-row">
                      {["가능", "불가"].map((value) => (
                        <button
                          key={`delivery-${value}`}
                          type="button"
                          className={
                            draft.deliveryAvailable === value
                              ? "business-menu-choice-button active"
                              : "business-menu-choice-button"
                          }
                          onClick={() => updateDraft("deliveryAvailable", value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <label className="full">
                <span>설명</span>
                <textarea
                  value={draft.description}
                  onChange={(event) => updateDraft("description", event.target.value)}
                  placeholder="메뉴 특징, 맛, 구성, 사장님이 추천하는 이유를 자유롭게 적어주세요."
                  rows={4}
                />
              </label>

              <button type="submit" className="business-menu-submit-btn" disabled={saving}>
                {saving ? "저장 중..." : "상품/메뉴 추가"}
              </button>
            </form>
          </section>

          <aside className="business-menu-card menu-status-card">
            <div className="business-menu-card-head">
              <div>
                <span>STORE STATUS</span>
                <h2>가게 연결 상태</h2>
              </div>

              <strong>{hasStoreMiniHome ? "미니홈피 연결됨" : "준비중"}</strong>
            </div>

            <dl className="business-menu-store-info">
              <div>
                <dt>가게명</dt>
                <dd>{getDisplayValue(storeName)}</dd>
              </div>

              <div>
                <dt>사업자번호</dt>
                <dd>{getDisplayValue(businessNumber)}</dd>
              </div>

              <div>
                <dt>현재 공개 상태</dt>
                <dd>무료 준비 단계</dd>
              </div>
            </dl>

            <div className="business-menu-lock">
              <span>결제 후 활성화</span>
              <p>지도/검색 노출, 예약 접수, 배달 주문 접수는 운영 시작 결제 후 열립니다.</p>
            </div>

            <div className="business-menu-side-actions">
              <button type="button" onClick={handleTravelPreviewClick}>
                감성여행2 미리보기
              </button>

              <button type="button" onClick={handleDeliveryPreviewClick}>
                감성배달 미리보기
              </button>

              <Link to="/business/dashboard">내 가게 관리로 이동</Link>
            </div>
          </aside>
        </div>

        <section className="business-menu-card preview-card">
          <div className="business-menu-card-head">
            <div>
              <span>MINI HOME PREVIEW</span>
              <h2>미니홈피 상품/메뉴 미리보기</h2>
            </div>

            <strong>{sortedMenus.length}개</strong>
          </div>

          {sortedMenus.length > 0 ? (
            <div className="business-menu-grid">
              {sortedMenus.map((menu, index) => {
                const imageUrl = getMenuImageUrl(menu);
                const detailRows = buildMenuDetailText(menu);

                return (
                  <article className="business-menu-item" key={menu.id || `${getMenuName(menu)}-${index}`}>
                    <div className="business-menu-image-box">
                      {imageUrl ? (
                        <img src={imageUrl} alt={getMenuName(menu)} />
                      ) : (
                        <div className="business-menu-image-empty">
                          <span>🍲</span>
                          <p>사진 준비중</p>
                        </div>
                      )}
                    </div>

                    <div className="business-menu-item-body">
                      <span>{getMenuCategory(menu)}</span>
                      <h3>{getMenuName(menu)}</h3>
                      <strong>{formatPrice(getMenuPrice(menu))}</strong>

                      {detailRows.length > 0 ? (
                        <dl className="business-menu-meta-list">
                          {detailRows.map(([label, value]) => (
                            <div key={`${getMenuName(menu)}-${label}`}>
                              <dt>{label}</dt>
                              <dd>{value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}

                      <p>{getMenuDescription(menu)}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="business-menu-empty-preview">
              <span>🍽️</span>
              <h3>아직 등록된 상품/메뉴가 없습니다</h3>
              <p>
                위 입력창에서 메뉴명, 가격, 사진, 원산지, 추천 대상, 포장·배달 가능 여부를
                넣으면 이곳에서 미니홈피에 보일 모습을 먼저 확인할 수 있습니다.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
