// 파일 경로: src/pages/StoreMiniHomePage.jsx
// ========================================
// 📌 공통 소상공인 미니홈피 보기 화면
// - stores 테이블의 가게 기본 정보를 불러와 홈페이지에서 표시
// - store_menus 테이블의 상품/메뉴 정보를 우선 표시하고, 필요 시 store_products도 함께 확인
// - 상품/메뉴 관리 화면에서 브라우저 임시 저장한 메뉴도 같은 브라우저에서는 미니홈피에 표시
// - store_events 테이블의 가게 이벤트 / 혜택 정보를 함께 표시
// - 같은 가게 데이터를 감성여행2에서는 예약형 미니홈피로 표시
// - 같은 가게 데이터를 감성배달에서는 배달형 미니홈피로 표시
// - 메뉴 데이터는 공통으로 쓰고, 감성여행2는 예약 메뉴 담기 / 방문 예약 중심으로 표시
// - 메뉴 데이터는 공통으로 쓰고, 감성배달은 장바구니 / 배달 주문 중심으로 표시
// - 감성여행2 가게 담기 선택은 앱과 서버 명칭에 맞춰 '나만의 여행' / '나만의 버킷'으로 통일
// - 가게 상단 담기 선택 버튼을 누르면 나만의 여행 / 나만의 버킷 선택 패널을 표시
// - 메뉴 카드에는 나만의 여행 / 나만의 버킷 선택을 넣지 않고 예약 메뉴 담기만 표시
// - 선택 전에는 둘 다 연한색, 마우스 hover 때만 주황 테두리/연한 주황 배경으로 표시
// - 담기 성공한 항목은 체크 표시와 함께 주황색으로 고정하고 버튼 문구를 담기 성공으로 변경
// - 같은 곳에 다시 담으면 카드 바로 아래에 중복 저장 안내를 표시
// - V8: 드롭다운에서 이미 담긴 항목을 다시 누르면 담기 취소로 동작
// - V9: 메뉴 카드의 방문 예약하기 / 예약 메뉴 담기도 다시 누르면 취소되는 토글 방식으로 동작
// - 메뉴 예약 버튼은 선택 전 / 선택 완료 / 취소 상태를 버튼 글자와 안내문으로 바로 구분
// - 담기 선택 패널은 버튼을 눌렀을 때만 작게 열리고, 선택 완료/취소 안내만 짧게 표시
// - 데이터가 비어 있어도 준비중 안내가 자연스럽게 보이도록 구성
// - 배달 가능 메뉴는 고객 오해를 줄이기 위해 '가능 · 배달료 별도'로 표시
// - 이벤트가 없으면 고객 미니홈피에서 이벤트 영역 자체를 숨김
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./StoreMiniHomePage.css";

const MENU_TABLE_NAME = "store_menus";
const PRODUCT_TABLE_NAME = "store_products";
const EVENT_TABLE_NAME = "store_events";
const MENU_STORAGE_PREFIX = "gamsung2.business-menu.v1";
const TRAVEL_SAVE_STORAGE_PREFIX = "gamsung2.travel-save.v1";

const TRAVEL_SAVE_OPTIONS = [
  {
    key: "my-travel",
    destination: "나만의 여행",
    label: "나만의 여행에 담기",
    savedLabel: "나만의 여행 담기 성공",
    description: "감성여행2의 내 여행 일정에 이 가게를 추가합니다.",
    savedDescription: "담김 완료 · 다시 누르면 취소됩니다.",
  },
  {
    key: "my-bucket",
    destination: "나만의 버킷",
    label: "나만의 버킷에 담기",
    savedLabel: "나만의 버킷 담기 성공",
    description: "언젠가 가고 싶은 장소로 나만의 버킷에 저장합니다.",
    savedDescription: "담김 완료 · 다시 누르면 취소됩니다.",
  },
];

function getDisplayValue(value, fallback = "준비중") {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function formatPrice(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return "가격 문의";
  }

  return `${new Intl.NumberFormat("ko-KR").format(numberValue)}원`;
}

function isUsableImageUrl(value) {
  const text = String(value || "").trim();

  if (!text) return false;
  if (text.startsWith("file://")) return false;

  return (
    text.startsWith("http://") ||
    text.startsWith("https://") ||
    text.startsWith("data:image/") ||
    text.startsWith("blob:")
  );
}

function normalizeImageUrl(value) {
  const text = String(value || "").trim();
  return isUsableImageUrl(text) ? text : "";
}

function getStoreName(store) {
  return (
    store?.store_name ||
    store?.name ||
    store?.title ||
    store?.place_name ||
    "가게 미니홈피"
  );
}

function getStoreCategory(store) {
  return (
    store?.category ||
    store?.store_category ||
    store?.business_type ||
    store?.type ||
    "지역 소상공인"
  );
}

function getStoreSummary(store) {
  return (
    store?.summary ||
    store?.intro ||
    store?.description ||
    store?.short_description ||
    "사장님이 등록한 가게 정보가 이곳에 표시됩니다."
  );
}

function getStoreAddress(store) {
  return (
    store?.address ||
    store?.store_address ||
    store?.road_address ||
    store?.jibun_address ||
    ""
  );
}

function getStorePhone(store) {
  return store?.phone || store?.store_phone || store?.tel || "";
}

function getStoreImageUrl(store) {
  const candidates = [
    store?.image_url,
    store?.photo_url,
    store?.thumbnail_url,
    store?.main_image_url,
    store?.cover_image_url,
    store?.photo_uri,
  ];

  return candidates.find(isUsableImageUrl) || "";
}

function getStoreStatus(store) {
  const status = String(store?.status || store?.store_status || "").toLowerCase();

  if (status === "active" || status === "open" || status === "approved") {
    return "운영중";
  }

  if (status === "pending" || status === "ready") {
    return "입점 준비중";
  }

  if (status === "hidden" || status === "closed") {
    return "비공개";
  }

  return "입점 준비중";
}

function getMenuName(menu) {
  return (
    menu?.menu_name ||
    menu?.name ||
    menu?.product_name ||
    menu?.title ||
    "메뉴 / 상품"
  );
}

function getMenuSummary(menu) {
  return (
    menu?.description ||
    menu?.menu_description ||
    menu?.summary ||
    menu?.intro ||
    menu?.detail_text ||
    "사장님이 등록한 메뉴 또는 상품입니다."
  );
}

function getMenuPrice(menu) {
  return (
    menu?.price ||
    menu?.sale_price ||
    menu?.product_price ||
    menu?.menu_price ||
    menu?.amount ||
    0
  );
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
    menu?.photo_uri,
  ];

  return normalizeImageUrl(candidates.find((value) => String(value || "").trim()));
}

function getMenuCategory(menu) {
  return menu?.category || menu?.menu_category || menu?.group_name || "대표 메뉴";
}

function getMenuOrigin(menu) {
  return (
    menu?.origin ||
    menu?.ingredient_origin ||
    menu?.country_of_origin ||
    menu?.menu_origin ||
    "미입력"
  );
}

function getMenuTargetCustomer(menu) {
  return (
    menu?.target_customer ||
    menu?.recommended_for ||
    menu?.recommend_target ||
    menu?.targetCustomer ||
    "미입력"
  );
}

function getAvailabilityText(value, fallback = "가능") {
  if (value === true) return "가능";
  if (value === false) return "불가";

  const text = String(value || "").trim();

  if (!text) return fallback;
  if (text === "true") return "가능";
  if (text === "false") return "불가";

  return text;
}

function getMenuTakeoutAvailable(menu) {
  return getAvailabilityText(
    menu?.takeout_available ??
      menu?.is_takeout_available ??
      menu?.packing_available ??
      menu?.takeoutAvailable,
    "가능"
  );
}

function getMenuDeliveryAvailable(menu) {
  const deliveryText = getAvailabilityText(
    menu?.delivery_available ??
      menu?.is_delivery_available ??
      menu?.deliveryAvailable,
    "가능"
  );

  if (deliveryText === "가능" || deliveryText === "배달 가능") {
    return "가능 · 배달료 별도";
  }

  return deliveryText;
}

function getMenuEventLabel(menu) {
  const eventText =
    menu?.event_label ||
    menu?.eventLabel ||
    menu?.discount_label ||
    menu?.promotion_label ||
    "이벤트 없음";

  const cleanText = String(eventText || "").trim();

  return cleanText || "이벤트 없음";
}

function shouldShowMenuEvent(menu) {
  const eventLabel = getMenuEventLabel(menu);

  return Boolean(eventLabel && eventLabel !== "이벤트 없음");
}

function getEventTitle(event) {
  return event?.title || event?.event_title || "가게 이벤트";
}

function getEventSummary(event) {
  return (
    event?.summary ||
    event?.benefit_text ||
    event?.detail_text ||
    "사장님이 등록한 가게 이벤트입니다."
  );
}

function getEventImageUrl(event) {
  const candidates = [
    event?.image_url,
    event?.photo_url,
    event?.thumbnail_url,
    event?.main_image_url,
  ];

  return candidates.find(isUsableImageUrl) || "";
}

function buildMapSearchUrl(store) {
  const address = getStoreAddress(store);
  const name = getStoreName(store);
  const query = encodeURIComponent(address || name);

  return `https://map.naver.com/p/search/${query}`;
}

function buildPhoneHref(phone) {
  const safePhone = String(phone || "").replace(/[^0-9+]/g, "");

  if (!safePhone) return "";

  return `tel:${safePhone}`;
}

function buildMenuStorageKey({ storeId, businessNumber }) {
  const rawKey = storeId || businessNumber || "guest";
  const safeKey = String(rawKey).replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  return `${MENU_STORAGE_PREFIX}.${safeKey}`;
}

function buildTravelSaveStorageKey(storeId) {
  const safeKey = String(storeId || "guest").replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  return `${TRAVEL_SAVE_STORAGE_PREFIX}.${safeKey}`;
}

function buildTravelSaveItemKey(dropdownKey, optionKey) {
  const safeDropdownKey = String(dropdownKey || "store").replace(
    /[^a-zA-Z0-9가-힣_-]/g,
    "_"
  );

  return `${safeDropdownKey}::${optionKey}`;
}

function buildMenuReservationItemKey(menu, index) {
  const rawKey =
    menu?.id ||
    `${getMenuName(menu)}-${getMenuPrice(menu)}-${index}` ||
    `menu-${index}`;

  return String(rawKey).replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}

function readLocalTravelSaveMap(storageKey) {
  if (typeof window === "undefined" || !storageKey) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn("[StoreMiniHomePage] 담기 선택 임시 저장 읽기 실패:", error);
    return {};
  }
}

function writeLocalTravelSaveMap(storageKey, saveMap) {
  if (typeof window === "undefined" || !storageKey) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(saveMap || {}));
  } catch (error) {
    console.warn("[StoreMiniHomePage] 담기 선택 임시 저장 실패:", error);
  }
}

function readLocalMenuState(storageKey) {
  if (typeof window === "undefined" || !storageKey) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;

    return parsed;
  } catch (error) {
    console.warn("[StoreMiniHomePage] 브라우저 임시 메뉴 읽기 실패:", error);
    return null;
  }
}

function mergeMenus(menuRows, productRows, localRows) {
  const merged = [];
  const seen = new Set();

  [...(localRows || []), ...(menuRows || []), ...(productRows || [])].forEach(
    (menu, index) => {
      if (!menu) return;

      const menuKey =
        menu.id ||
        `${menu.store_id || "local"}-${getMenuName(menu)}-${getMenuPrice(menu)}-${index}`;

      if (seen.has(menuKey)) return;

      seen.add(menuKey);
      merged.push(menu);
    }
  );

  return merged;
}

function sortMenus(a, b) {
  const aOrder = Number(a?.sort_order ?? a?.order_no ?? 9999);
  const bOrder = Number(b?.sort_order ?? b?.order_no ?? 9999);

  if (aOrder !== bOrder) return aOrder - bOrder;

  return String(getMenuName(a)).localeCompare(String(getMenuName(b)), "ko");
}

function getModeInfo(mode) {
  if (mode === "delivery") {
    return {
      badge: "감성배달 미니홈피",
      title: "배달 주문 중심 화면",
      desc: "같은 가게 정보를 감성배달에서는 배달 주문, 메뉴 담기, 장바구니 흐름으로 보여줍니다.",
      primaryButton: "배달 주문하기",
      secondaryButton: "장바구니 담기",
      menuTitle: "배달 메뉴",
      menuDesc: "감성배달에서는 같은 메뉴 데이터를 배달 주문과 장바구니 흐름으로 연결합니다.",
      emptyAction: "상품이 등록되면 배달 주문 화면으로 연결됩니다.",
      modeClass: "delivery-mode",
    };
  }

  return {
    badge: "감성여행2 미니홈피",
    title: "방문 예약 중심 화면",
    desc: "같은 가게 정보를 감성여행2에서는 나만의 여행 / 나만의 버킷 담기, 방문 예약, 길찾기 흐름으로 보여줍니다.",
    primaryButton: "방문 예약하기",
    secondaryButton: "담기 선택",
    menuTitle: "방문 예약 메뉴",
    menuDesc: "감성여행2에서는 메뉴를 예약 메뉴에 담은 뒤 방문 예약 흐름으로 연결합니다.",
    emptyAction: "예약 기능은 다음 단계에서 여행 일정과 연결됩니다.",
    modeClass: "travel-mode",
  };
}

export default function StoreMiniHomePage({ mode = "travel" }) {
  const { storeId } = useParams();

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [menus, setMenus] = useState([]);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [usedLocalMenus, setUsedLocalMenus] = useState(false);
  const [storeSavePanelOpen, setStoreSavePanelOpen] = useState(false);
  const [travelSaveTargetName, setTravelSaveTargetName] = useState("");
  const [savedTravelItems, setSavedTravelItems] = useState({});
  const [travelSaveFeedbackMap, setTravelSaveFeedbackMap] = useState({});
  const [visitReservationItems, setVisitReservationItems] = useState({});
  const [reservationMenuItems, setReservationMenuItems] = useState({});

  const modeInfo = useMemo(() => getModeInfo(mode), [mode]);

  const storeName = useMemo(() => getStoreName(store), [store]);
  const storeCategory = useMemo(() => getStoreCategory(store), [store]);
  const storeSummary = useMemo(() => getStoreSummary(store), [store]);
  const storeAddress = useMemo(() => getStoreAddress(store), [store]);
  const storePhone = useMemo(() => getStorePhone(store), [store]);
  const storeImageUrl = useMemo(() => getStoreImageUrl(store), [store]);
  const storeStatus = useMemo(() => getStoreStatus(store), [store]);
  const sortedMenus = useMemo(() => [...menus].sort(sortMenus), [menus]);
  const mapUrl = useMemo(() => buildMapSearchUrl(store), [store]);
  const phoneHref = useMemo(() => buildPhoneHref(storePhone), [storePhone]);
  const travelSaveStorageKey = useMemo(
    () => buildTravelSaveStorageKey(storeId),
    [storeId]
  );

  const storeTravelSavedOption = useMemo(() => {
    const savedOptions = TRAVEL_SAVE_OPTIONS
      .map((option) => {
        const itemKey = buildTravelSaveItemKey("store", option.key);
        const savedItem = savedTravelItems[itemKey];

        return savedItem ? { option, savedAt: savedItem.savedAt || "" } : null;
      })
      .filter(Boolean)
      .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));

    return savedOptions[0]?.option || null;
  }, [savedTravelItems]);

  const storeTravelSaveButtonLabel =
    mode === "travel" && storeTravelSavedOption
      ? `${storeTravelSavedOption.destination} 담기 성공`
      : modeInfo.secondaryButton;

  useEffect(() => {
    let mounted = true;

    async function safeLoadTable(tableName, nextStoreId) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("store_id", nextStoreId)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn(`[StoreMiniHomePage] ${tableName} 조회 확인 필요:`, error);
        return [];
      }

      return Array.isArray(data) ? data : [];
    }

    async function loadStoreMiniHome() {
      setLoading(true);
      setErrorMessage("");
      setNoticeMessage("");
      setUsedLocalMenus(false);
      setStoreSavePanelOpen(false);
      setTravelSaveTargetName("");
      setSavedTravelItems({});
      setTravelSaveFeedbackMap({});
      setVisitReservationItems({});
      setReservationMenuItems({});

      if (!isSupabaseConfigured) {
        setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
        setLoading(false);
        return;
      }

      if (!storeId) {
        setErrorMessage("가게 미니홈피 주소가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      try {
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("*")
          .eq("id", storeId)
          .maybeSingle();

        if (storeError) {
          throw storeError;
        }

        if (!storeData) {
          if (!mounted) return;

          setStore(null);
          setMenus([]);
          setEvents([]);
          setErrorMessage("해당 가게 미니홈피를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const [menuRows, productRows, eventRows] = await Promise.all([
          safeLoadTable(MENU_TABLE_NAME, storeId),
          safeLoadTable(PRODUCT_TABLE_NAME, storeId),
          safeLoadTable(EVENT_TABLE_NAME, storeId),
        ]);

        const localStorageKey = buildMenuStorageKey({
          storeId,
          businessNumber: storeData?.business_number,
        });
        const localState = readLocalMenuState(localStorageKey);
        const localMenus = Array.isArray(localState?.menus) ? localState.menus : [];
        const nextMenus = mergeMenus(menuRows, productRows, localMenus);

        if (!mounted) return;

        setStore(storeData);
        setMenus(nextMenus);
        setEvents(eventRows || []);
        setUsedLocalMenus(localMenus.length > 0);
        setSavedTravelItems(readLocalTravelSaveMap(travelSaveStorageKey));

        if (localMenus.length > 0) {
          setNoticeMessage(
            "소상공인 상품/메뉴 관리 화면에서 브라우저 임시 저장한 메뉴를 함께 표시하고 있습니다. 서버 저장 연결 후에는 모든 고객에게 같은 메뉴가 보입니다."
          );
        }
      } catch (error) {
        console.error("[StoreMiniHomePage] 미니홈피 조회 실패:", error);

        if (!mounted) return;

        setErrorMessage(
          error?.message || "가게 미니홈피를 불러오는 중 문제가 발생했습니다."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStoreMiniHome();

    return () => {
      mounted = false;
    };
  }, [storeId, travelSaveStorageKey]);

  function handlePrimaryAction(menuName = "", menuKey = "") {
    if (mode === "delivery") {
      setNoticeMessage(
        `${menuName ? `${menuName} ` : ""}배달 주문 기능은 다음 단계에서 장바구니 / 주문서와 연결할 예정입니다.`
      );
      return;
    }

    const safeMenuKey = menuKey || menuName || "menu";
    const alreadySelected = Boolean(visitReservationItems[safeMenuKey]);

    if (alreadySelected) {
      setVisitReservationItems((prev) => {
        const nextItems = { ...prev };
        delete nextItems[safeMenuKey];
        return nextItems;
      });
      setNoticeMessage(`${menuName} 방문 예약 선택 취소`);
      return;
    }

    setVisitReservationItems((prev) => ({
      ...prev,
      [safeMenuKey]: {
        menuName,
        selectedAt: new Date().toISOString(),
      },
    }));
    setNoticeMessage(`${menuName} 방문 예약 선택 완료`);
  }

  function handleStoreSecondaryAction() {
    if (mode === "delivery") {
      setNoticeMessage(
        `${storeName} 장바구니 담기 기능은 다음 단계에서 감성배달 장바구니와 연결할 예정입니다.`
      );
      return;
    }

    setTravelSaveTargetName(storeName);
    setStoreSavePanelOpen((prev) => !prev);

    if (storeSavePanelOpen) {
      setNoticeMessage("");
      return;
    }

    if (storeTravelSavedOption) {
      setNoticeMessage(
        `${storeName}은 현재 ${storeTravelSavedOption.destination}에 담겨 있습니다. 드롭다운에서 같은 항목을 다시 누르면 담기가 취소됩니다.`
      );
      return;
    }

    setNoticeMessage(`${storeName}을 나만의 여행 또는 나만의 버킷 중 어디에 담을지 선택해주세요.`);
  }

  function handleMenuSecondaryAction(menuName = "", menuKey = "") {
    if (mode === "delivery") {
      setNoticeMessage(
        `${menuName ? `${menuName} ` : ""}장바구니 담기 기능은 다음 단계에서 감성배달 장바구니와 연결할 예정입니다.`
      );
      return;
    }

    const safeMenuKey = menuKey || menuName || "menu";
    const alreadySaved = Boolean(reservationMenuItems[safeMenuKey]);

    if (alreadySaved) {
      setReservationMenuItems((prev) => {
        const nextItems = { ...prev };
        delete nextItems[safeMenuKey];
        return nextItems;
      });
      setNoticeMessage(`${menuName} 예약 메뉴 담기 취소`);
      return;
    }

    setReservationMenuItems((prev) => ({
      ...prev,
      [safeMenuKey]: {
        menuName,
        savedAt: new Date().toISOString(),
      },
    }));
    setNoticeMessage(`${menuName} 예약 메뉴 담기 성공`);
  }

  function setTravelSaveFeedback(dropdownKey, message, type = "saved") {
    setTravelSaveFeedbackMap((prev) => ({
      ...prev,
      [dropdownKey]: { message, type },
    }));
  }

  function handleTravelSaveChoice(option, dropdownKey, targetName = "") {
    const nextTargetName = targetName || travelSaveTargetName || storeName;
    const itemKey = buildTravelSaveItemKey(dropdownKey, option.key);
    const alreadySaved = Boolean(savedTravelItems[itemKey]);

    if (alreadySaved) {
      const nextSavedItems = { ...savedTravelItems };
      delete nextSavedItems[itemKey];

      const cancelMessage = `${nextTargetName} ${option.destination} 담기 취소`;

      setSavedTravelItems(nextSavedItems);
      writeLocalTravelSaveMap(travelSaveStorageKey, nextSavedItems);
      setStoreSavePanelOpen(true);
      setNoticeMessage(cancelMessage);
      setTravelSaveFeedback(dropdownKey, cancelMessage, "cancelled");
      return;
    }

    const nextSavedItems = {
      ...savedTravelItems,
      [itemKey]: {
        optionKey: option.key,
        destination: option.destination,
        targetName: nextTargetName,
        savedAt: new Date().toISOString(),
      },
    };

    const savedMessage = `${nextTargetName} ${option.destination} 담기 성공`;

    setSavedTravelItems(nextSavedItems);
    writeLocalTravelSaveMap(travelSaveStorageKey, nextSavedItems);
    setStoreSavePanelOpen(true);
    setNoticeMessage(savedMessage);
    setTravelSaveFeedback(dropdownKey, savedMessage, "saved");
  }

  function handleTravelChoiceKeyDown(event, option, dropdownKey, targetName = "") {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleTravelSaveChoice(option, dropdownKey, targetName);
  }

  function renderStoreTravelSavePanel(targetName = "") {
    if (mode !== "travel" || !storeSavePanelOpen) {
      return null;
    }

    const dropdownKey = "store";
    const panelId = "travel-save-panel-store";
    const displayTargetName = targetName || travelSaveTargetName || storeName;
    const feedback = travelSaveFeedbackMap[dropdownKey];
    const savedDestinations = TRAVEL_SAVE_OPTIONS.filter((option) => {
      const itemKey = buildTravelSaveItemKey(dropdownKey, option.key);
      return Boolean(savedTravelItems[itemKey]);
    }).map((option) => option.destination);
    const savedSummary = savedDestinations.length
      ? `현재: ${savedDestinations.join(", ")}`
      : "아직 담긴 곳 없음";

    return (
      <div id={panelId} className="g2-place-save-panel g2-place-save-panel--dropdown">
        <div className="g2-place-save-dropdown-head">
          <strong>담기 선택</strong>
          <span>{savedSummary}</span>
        </div>

        <div className="g2-place-save-list" aria-label="담기 위치 선택">
          {TRAVEL_SAVE_OPTIONS.map((option) => {
            const itemKey = buildTravelSaveItemKey(dropdownKey, option.key);
            const isSaved = Boolean(savedTravelItems[itemKey]);

            return (
              <button
                key={option.key}
                type="button"
                className={`g2-place-save-button ${
                  isSaved ? "g2-place-save-saved" : "g2-place-save-ready"
                }`}
                aria-pressed={isSaved}
                onClick={() =>
                  handleTravelSaveChoice(option, dropdownKey, displayTargetName)
                }
              >
                <span className="g2-place-save-button-title">
                  {isSaved ? option.savedLabel : option.label}
                  {isSaved ? <em>다시 누르면 취소</em> : null}
                </span>
              </button>
            );
          })}
        </div>

        {feedback?.message ? (
          <p
            className={`g2-place-save-feedback ${
              feedback.type === "cancelled"
                ? "is-cancelled"
                : feedback.type === "duplicate"
                  ? "is-duplicate"
                  : "is-saved"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>
    );
  }

  if (loading) {
    return (
      <main className="store-mini-home-page">
        <section className="store-mini-loading">
          <p>가게 미니홈피를 불러오는 중입니다...</p>
        </section>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="store-mini-home-page">
        <section className="store-mini-empty">
          <p className="store-mini-badge">가게 미니홈피</p>
          <h1>미니홈피를 불러올 수 없습니다</h1>
          <p>{errorMessage}</p>

          <div className="store-mini-empty-actions">
            <Link to="/" className="store-mini-main-link">
              홈으로 이동
            </Link>
            <Link to="/business/dashboard" className="store-mini-sub-link">
              소상공인 관리로 이동
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={`store-mini-home-page ${modeInfo.modeClass}`}>
      <section className="store-mini-hero">
        <div className="store-mini-hero-image">
          {storeImageUrl ? (
            <img src={storeImageUrl} alt={`${storeName} 대표 이미지`} />
          ) : (
            <div className="store-mini-image-placeholder">
              <span>감성</span>
              <strong>MINI HOME</strong>
              <p>사장님이 대표 사진을 등록하면 이곳에 표시됩니다.</p>
            </div>
          )}
        </div>

        <div className="store-mini-hero-content">
          <p className="store-mini-badge">{modeInfo.badge}</p>

          <h1>{storeName}</h1>

          <p className="store-mini-summary">{storeSummary}</p>

          <div className="store-mini-meta">
            <span>{storeCategory}</span>
            <span>{storeStatus}</span>
            <span>{getDisplayValue(store?.business_number, "사업자번호 준비중")}</span>
          </div>

          <div className="store-mini-actions">
            <button type="button" onClick={() => handlePrimaryAction()}>
              {modeInfo.primaryButton}
            </button>

            <button
              type="button"
              className={storeTravelSavedOption ? "store-mini-save-success-button" : ""}
              onClick={handleStoreSecondaryAction}
              aria-expanded={mode === "travel" ? storeSavePanelOpen : undefined}
              aria-controls={mode === "travel" ? "travel-save-panel-store" : undefined}
            >
              {storeTravelSaveButtonLabel}
            </button>

            {phoneHref ? (
              <a href={phoneHref} className="store-mini-outline-link">
                전화하기
              </a>
            ) : null}

            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="store-mini-outline-link"
            >
              길찾기
            </a>
          </div>

          {renderStoreTravelSavePanel(storeName)}

          {noticeMessage ? <p className="store-mini-notice">{noticeMessage}</p> : null}
        </div>
      </section>

      <section className="store-mini-mode-card">
        <div>
          <span>MODE</span>
          <h2>{modeInfo.title}</h2>
          <p>{modeInfo.desc}</p>
        </div>

        <div className="store-mini-mode-switch">
          <Link
            to={`/store/${storeId}`}
            className={mode === "travel" ? "active" : ""}
          >
            감성여행2 예약형
          </Link>

          <Link
            to={`/delivery/store/${storeId}`}
            className={mode === "delivery" ? "active" : ""}
          >
            감성배달 배달형
          </Link>
        </div>
      </section>

      <section className="store-mini-info-grid">
        <article className="store-mini-card">
          <span className="store-mini-label">STORE INFO</span>
          <h2>가게 정보</h2>

          <dl className="store-mini-info-list">
            <div>
              <dt>가게명</dt>
              <dd>{storeName}</dd>
            </div>

            <div>
              <dt>업종</dt>
              <dd>{storeCategory}</dd>
            </div>

            <div>
              <dt>주소</dt>
              <dd>{getDisplayValue(storeAddress)}</dd>
            </div>

            <div>
              <dt>전화번호</dt>
              <dd>{getDisplayValue(storePhone)}</dd>
            </div>

            <div>
              <dt>대표자</dt>
              <dd>
                {getDisplayValue(
                  store?.owner_name || store?.representative_name
                )}
              </dd>
            </div>

            <div>
              <dt>영업 상태</dt>
              <dd>{storeStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="store-mini-card map-card">
          <span className="store-mini-label">MAP</span>
          <h2>지도 / 길찾기</h2>

          <div className="store-mini-map-box">
            <strong>{storeName}</strong>
            <p>{getDisplayValue(storeAddress, "주소가 등록되면 지도 검색에 연결됩니다.")}</p>

            <a href={mapUrl} target="_blank" rel="noreferrer">
              네이버 지도에서 보기
            </a>
          </div>
        </article>
      </section>

      <section className="store-mini-section">
        <div className="store-mini-section-head">
          <div>
            <span className="store-mini-label">MENU</span>
            <h2>{modeInfo.menuTitle}</h2>
          </div>

          <p>{modeInfo.menuDesc}</p>
        </div>

        {usedLocalMenus ? (
          <p className="store-mini-local-note">
            현재 같은 브라우저에서 임시 저장한 메뉴도 함께 보입니다.
          </p>
        ) : null}

        {sortedMenus.length > 0 ? (
          <div className="store-product-grid">
            {sortedMenus.map((menu, index) => {
              const menuImageUrl = getMenuImageUrl(menu);
              const menuName = getMenuName(menu);
              const deliveryAvailable = getMenuDeliveryAvailable(menu);
              const isDeliveryUnavailable =
                mode === "delivery" && deliveryAvailable === "불가";
              const reservationMenuKey = buildMenuReservationItemKey(menu, index);
              const isVisitReservationSelected = Boolean(
                visitReservationItems[reservationMenuKey]
              );
              const isReservationMenuSaved = Boolean(
                reservationMenuItems[reservationMenuKey]
              );

              return (
                <article key={menu.id || `${menuName}-${index}`} className="store-product-card">
                  <div className="store-product-image-box">
                    {menuImageUrl ? (
                      <img src={menuImageUrl} alt={menuName} />
                    ) : (
                      <div className="store-product-placeholder">상품 사진</div>
                    )}
                  </div>

                  <div className="store-product-body">
                    <span className="store-product-category">
                      {getMenuCategory(menu)}
                    </span>

                    {shouldShowMenuEvent(menu) ? (
                      <span className="store-product-category">
                        {getMenuEventLabel(menu)}
                      </span>
                    ) : null}

                    <h3>{menuName}</h3>

                    <strong>{formatPrice(getMenuPrice(menu))}</strong>

                    <dl className="store-product-meta-list">
                      <div>
                        <dt>원산지</dt>
                        <dd>{getDisplayValue(getMenuOrigin(menu))}</dd>
                      </div>

                      <div>
                        <dt>추천 대상</dt>
                        <dd>{getDisplayValue(getMenuTargetCustomer(menu))}</dd>
                      </div>

                      <div>
                        <dt>포장</dt>
                        <dd>{getMenuTakeoutAvailable(menu)}</dd>
                      </div>

                      <div>
                        <dt>배달</dt>
                        <dd>{deliveryAvailable}</dd>
                      </div>
                    </dl>

                    <p>{getMenuSummary(menu)}</p>

                    <div className="store-product-actions">
                      <button
                        type="button"
                        className={
                          mode === "travel" && isVisitReservationSelected
                            ? "is-visit-reservation-selected"
                            : ""
                        }
                        onClick={() =>
                          handlePrimaryAction(menuName, reservationMenuKey)
                        }
                        disabled={isDeliveryUnavailable}
                      >
                        {isDeliveryUnavailable
                          ? "배달 불가"
                          : mode === "travel" && isVisitReservationSelected
                            ? "방문 예약 선택됨"
                            : modeInfo.primaryButton}
                      </button>

                      <button
                        type="button"
                        className={
                          mode === "travel" && isReservationMenuSaved
                            ? "is-reservation-saved"
                            : ""
                        }
                        onClick={() =>
                          handleMenuSecondaryAction(menuName, reservationMenuKey)
                        }
                      >
                        {mode === "travel"
                          ? isReservationMenuSaved
                            ? "예약 메뉴 담기 성공"
                            : "예약 메뉴 담기"
                          : modeInfo.secondaryButton}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="store-mini-ready-box">
            <strong>아직 등록된 메뉴 / 상품이 없습니다</strong>
            <p>
              사장님이 상품/메뉴 관리 화면에서 메뉴와 사진을 등록하면 이곳에
              표시됩니다. {modeInfo.emptyAction}
            </p>
          </div>
        )}
      </section>

      {events.length > 0 ? (
        <section className="store-mini-section">
          <div className="store-mini-section-head">
            <div>
              <span className="store-mini-label">EVENT</span>
              <h2>가게 이벤트 / 혜택</h2>
            </div>

            <p>
              사장님이 할인, 혜택, 관광객 대상 이벤트를 등록하면 이곳에 함께
              표시됩니다.
            </p>
          </div>

          <div className="store-event-grid">
            {events.map((event) => {
              const eventImageUrl = getEventImageUrl(event);

              return (
                <article key={event.id} className="store-event-card">
                  {eventImageUrl ? (
                    <img src={eventImageUrl} alt={getEventTitle(event)} />
                  ) : null}

                  <div>
                    <span>{event?.date_text || event?.time_text || "상시 이벤트"}</span>
                    <h3>{getEventTitle(event)}</h3>
                    <p>{getEventSummary(event)}</p>

                    {event?.benefit_text ? (
                      <strong>{event.benefit_text}</strong>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="store-mini-bottom-card">
        <div>
          <span>COMMON DATA</span>
          <h2>사장님은 한 번만 만들면 됩니다</h2>
          <p>
            가게 정보, 메뉴, 사진, 이벤트는 공통 데이터로 저장됩니다. 감성여행2는
            예약 중심, 감성배달은 배달 중심으로 같은 미니홈피를 다르게 보여줍니다.
          </p>
        </div>

        <Link to="/" className="store-mini-main-link">
          홈페이지로 돌아가기
        </Link>
      </section>
    </main>
  );
}
