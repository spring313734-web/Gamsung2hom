// 파일 경로: src/pages/BusinessMenuManagePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 소상공인 상품/메뉴 관리 화면
// - 소상공인이 결제 전에도 상품/메뉴와 사진을 준비할 수 있는 화면
// - 로그인 세션 기준으로 profiles / owner_profiles / stores 정보를 조회
// - stores에 연결된 가게가 있으면 store_menus 테이블에서 메뉴 목록을 불러옴
// - 사진 파일 선택만 사용하고 주소 입력칸은 제거하여 사장님이 사진만 고르면 바로 미리보기로 표시
// - 가격 입력 시 숫자만 받아 천 단위 콤마를 자동 표시
// - 사장님 입력 부담을 줄이기 위해 원산지 / 추천 대상 / 포장 / 배달 4개 기본 정보만 사용
// - 상품/메뉴 추가 버튼을 누르면 먼저 화면과 브라우저 임시 저장에 즉시 추가
// - Supabase store_menus 테이블과 store-menu-images Storage가 연결되어 있으면 메뉴와 사진을 서버에 저장
// - 서버 저장 실패 시에도 브라우저 임시 저장으로 입력 내용이 사라지지 않도록 보호
// - 실제 공개 / 예약 접수 / 배달 주문 접수는 운영 시작 결제 후 활성화된다는 안내 표시
// - 배달 가능 메뉴는 고객 오해를 줄이기 위해 '가능 · 배달료 별도'로 표시
// ========================================

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./BusinessMenuManagePage.css";

const MENU_TABLE_NAME = "store_menus";
const STORAGE_BUCKET_NAME = "store-menu-images";
const STORAGE_PREFIX = "gamsung2.business-menu.v1";

const emptyDraft = {
  menuName: "",
  price: "",
  description: "",
  imagePreviewUrl: "",
  imageFileName: "",
  category: "",
  origin: "",
  targetCustomer: "",
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

function buildStorageKey({ userId, storeId, businessNumber }) {
  const rawKey = storeId || businessNumber || userId || "guest";
  const safeKey = String(rawKey).replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
  return `${STORAGE_PREFIX}.${safeKey}`;
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
    console.warn("[상품/메뉴 관리] 브라우저 임시 저장 데이터 읽기 실패:", error);
    return null;
  }
}

function writeLocalMenuState(storageKey, state) {
  if (typeof window === "undefined" || !storageKey) {
    return { ok: false, savedAt: "" };
  }

  const savedAt = new Date().toISOString();

  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...state,
        savedAt,
      })
    );

    return { ok: true, savedAt };
  } catch (error) {
    console.warn("[상품/메뉴 관리] 브라우저 임시 저장 실패:", error);
    return { ok: false, savedAt: "" };
  }
}

function sanitizeDraft(value) {
  if (!value || typeof value !== "object") {
    return emptyDraft;
  }

  return {
    ...emptyDraft,
    ...value,
    price: formatPriceInput(value.price),
    takeoutAvailable: value.takeoutAvailable || "가능",
    deliveryAvailable: value.deliveryAvailable || "가능",
  };
}

function mergeMenus(serverMenus, localMenus) {
  const merged = [];
  const seen = new Set();

  [...(localMenus || []), ...(serverMenus || [])].forEach((menu, index) => {
    if (!menu) return;

    const menuKey =
      menu.id ||
      `${menu.store_id || "local"}-${getMenuName(menu)}-${getMenuPrice(menu)}-${index}`;

    if (seen.has(menuKey)) return;

    seen.add(menuKey);
    merged.push(menu);
  });

  return merged;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

async function createCompressedImageDataUrl(file) {
  const originalDataUrl = await readFileAsDataUrl(file);

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const maxSide = 1200;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");

      if (!context) {
        resolve(originalDataUrl);
        return;
      }

      context.drawImage(image, 0, 0, width, height);

      try {
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (error) {
        console.warn("[상품/메뉴 관리] 사진 압축 실패:", error);
        resolve(originalDataUrl);
      }
    };

    image.onerror = () => {
      resolve(originalDataUrl);
    };

    image.src = originalDataUrl;
  });
}

function formatSavedAt(value) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function getSafeFileExtension(file) {
  const nameExtension = String(file?.name || "")
    .split(".")
    .pop()
    ?.toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(nameExtension)) {
    return nameExtension === "jpg" ? "jpeg" : nameExtension;
  }

  const mimeExtension = String(file?.type || "").split("/").pop()?.toLowerCase();

  if (["jpeg", "png", "webp", "gif"].includes(mimeExtension)) {
    return mimeExtension;
  }

  return "jpeg";
}

function sanitizeFileName(value) {
  const text = String(value || "menu")
    .trim()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9가-힣_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return text || "menu";
}

async function uploadMenuImageToStorage({ file, userId, storeId, menuName }) {
  if (!file || !userId || !storeId) {
    return { imageUrl: "", imagePath: "" };
  }

  const extension = getSafeFileExtension(file);
  const safeName = sanitizeFileName(menuName);
  const randomText = Math.random().toString(36).slice(2, 8);
  const imagePath = `${userId}/${storeId}/${Date.now()}-${randomText}-${safeName}.${extension}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET_NAME)
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || `image/${extension}`,
    });

  if (error) {
    throw error;
  }

  const savedPath = data?.path || imagePath;
  const { data: publicData } = supabase.storage
    .from(STORAGE_BUCKET_NAME)
    .getPublicUrl(savedPath);

  return {
    imageUrl: publicData?.publicUrl || "",
    imagePath: savedPath,
  };
}

export default function BusinessMenuManagePage() {
  const navigate = useNavigate();
  const imageInputRef = useRef(null);
  const { currentUser, loading: authLoading, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [store, setStore] = useState(null);
  const [menus, setMenus] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [localOnlyMode, setLocalOnlyMode] = useState(false);
  const [storageKey, setStorageKey] = useState("");
  const [localStateReady, setLocalStateReady] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState("");

  const userId = currentUser?.id || "";

  const storeName = useMemo(() => {
    return getStoreName(store, ownerProfile, profile, currentUser);
  }, [store, ownerProfile, profile, currentUser]);

  const businessNumber = useMemo(() => {
    return getBusinessNumber(profile, ownerProfile, store);
  }, [profile, ownerProfile, store]);

  const hasStoreMiniHome = Boolean(store?.id);
  const canUsePage = canUseBusinessMenu(currentUser, ownerProfile);

  const sortedMenus = useMemo(() => {
    return [...menus].sort(sortMenus);
  }, [menus]);

  const previewGridClassName = useMemo(() => {
    if (sortedMenus.length === 1) return "business-menu-grid is-single";
    if (sortedMenus.length === 2) return "business-menu-grid is-double";
    return "business-menu-grid";
  }, [sortedMenus.length]);

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
        .eq("store_id", nextStoreId)
        .order("sort_order", { ascending: true });

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
      setLocalStateReady(false);
      setErrorMessage("");
      setNoticeMessage("");

      if (!isLoggedIn || !userId) {
        setProfile(null);
        setOwnerProfile(null);
        setStore(null);
        setMenus([]);
        setDraft(emptyDraft);
        setStorageKey("");
        setSelectedImageFile(null);
        setLoading(false);
        setLocalStateReady(true);
        return;
      }

      if (!isSupabaseConfigured) {
        setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
        setLoading(false);
        setLocalStateReady(true);
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
        const nextStorageKey = buildStorageKey({
          userId,
          storeId: storeData?.id,
          businessNumber: nextBusinessNumber,
        });
        const localState = readLocalMenuState(nextStorageKey);
        const localMenus = Array.isArray(localState?.menus) ? localState.menus : [];

        if (!mounted) return;

        setProfile(nextProfile);
        setOwnerProfile(nextOwnerProfile);
        setStore(storeData || null);
        setStorageKey(nextStorageKey);
        setDraft(sanitizeDraft(localState?.draft));
        setMenus(mergeMenus(menuData, localMenus));
        setLastSavedAt(localState?.savedAt || "");

        if (localMenus.length > 0 || localState?.draft) {
          setNoticeMessage(
            "브라우저에 임시 저장된 상품/메뉴 내용을 다시 불러왔습니다. 서버 저장이 완료된 메뉴는 고객 미니홈피와 앱에서도 사용할 수 있습니다."
          );
        }
      } catch (error) {
        console.error("[상품/메뉴 관리] 정보 불러오기 실패:", error);

        if (!mounted) return;

        setErrorMessage(
          error?.message || "상품/메뉴 관리 정보를 불러오는 중 문제가 발생했습니다."
        );
      } finally {
        if (mounted) {
          setLoading(false);
          setLocalStateReady(true);
        }
      }
    }

    loadPageData();

    return () => {
      mounted = false;
    };
  }, [authLoading, isLoggedIn, userId, currentUser?.profile]);

  useEffect(() => {
    if (!localStateReady || !storageKey || !isLoggedIn) {
      return;
    }

    const result = writeLocalMenuState(storageKey, {
      draft,
      menus,
    });

    if (result.ok) {
      setLastSavedAt(result.savedAt);
      return;
    }

    setNoticeMessage(
      "사진 용량이 커서 브라우저 임시 저장이 어려울 수 있습니다. 사진을 조금 더 작은 용량으로 선택하거나, Supabase Storage 저장 상태를 확인해주세요."
    );
  }, [draft, menus, isLoggedIn, localStateReady, storageKey]);

  function updateDraft(key, value) {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleImageFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setNoticeMessage("선택한 사진을 미리보기용으로 준비하는 중입니다...");

    try {
      const previewUrl = await createCompressedImageDataUrl(file);

      setSelectedImageFile(file);
      setDraft((prev) => ({
        ...prev,
        imagePreviewUrl: previewUrl,
        imageFileName: file.name,
      }));

      setNoticeMessage(
        "선택한 사진을 아래 미리보기로 표시했습니다. 상품/메뉴 추가 시 Supabase Storage에 저장을 시도합니다."
      );
    } catch (error) {
      console.warn("[상품/메뉴 관리] 사진 미리보기 생성 실패:", error);
      setNoticeMessage("사진 미리보기를 만들지 못했습니다. 다른 사진 파일로 다시 선택해주세요.");
    }
  }

  async function handleAddMenu(event) {
    event.preventDefault();

    const menuName = draft.menuName.trim();

    if (!menuName) {
      setNoticeMessage("메뉴명을 먼저 입력해주세요.");
      return;
    }

    const localId = `local-${Date.now()}`;
    const price = parsePrice(draft.price);
    const imageFileToUpload = selectedImageFile;
    const previewImageUrl = normalizeImageUrl(draft.imagePreviewUrl);

    const nextMenu = {
      id: localId,
      store_id: store?.id || null,
      menu_name: menuName,
      name: menuName,
      price,
      description: draft.description.trim(),
      image_url: previewImageUrl,
      image_path: "",
      category: draft.category.trim() || "대표 메뉴",
      origin: draft.origin.trim(),
      ingredient_origin: draft.origin.trim(),
      target_customer: draft.targetCustomer.trim(),
      recommended_for: draft.targetCustomer.trim(),
      takeout_available: draft.takeoutAvailable,
      delivery_available: draft.deliveryAvailable,
      is_takeout_available: draft.takeoutAvailable === "가능",
      is_delivery_available: draft.deliveryAvailable === "가능",
      is_available: true,
      sort_order: menus.length + 1,
      created_by: userId || null,
    };

    // ✅ 먼저 화면과 브라우저 임시저장에 바로 추가합니다.
    // Supabase 저장이 실패해도 사장님이 입력한 내용이 사라지지 않게 하기 위한 구조입니다.
    setMenus((prev) => [nextMenu, ...prev]);
    setDraft(emptyDraft);
    setSelectedImageFile(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setNoticeMessage(
      "상품/메뉴를 미리보기 목록에 추가했습니다. Supabase 저장을 확인하는 중입니다."
    );

    if (!hasStoreMiniHome || localOnlyMode) {
      setNoticeMessage(
        "상품/메뉴를 브라우저 임시 저장으로 유지했습니다. store_menus 테이블과 Storage 연결 후 서버 저장까지 이어집니다."
      );
      return;
    }

    setSaving(true);

    try {
      let uploadedImageUrl = "";
      let uploadedImagePath = "";

      if (imageFileToUpload) {
        const uploadResult = await uploadMenuImageToStorage({
          file: imageFileToUpload,
          userId,
          storeId: store.id,
          menuName,
        });

        uploadedImageUrl = uploadResult.imageUrl;
        uploadedImagePath = uploadResult.imagePath;
      }

      const { data, error } = await supabase
        .from(MENU_TABLE_NAME)
        .insert({
          store_id: store.id,
          menu_name: menuName,
          name: menuName,
          price,
          description: draft.description.trim(),
          image_url: uploadedImageUrl,
          image_path: uploadedImagePath,
          category: draft.category.trim() || "대표 메뉴",
          origin: draft.origin.trim(),
          ingredient_origin: draft.origin.trim(),
          target_customer: draft.targetCustomer.trim(),
          recommended_for: draft.targetCustomer.trim(),
          takeout_available: draft.takeoutAvailable,
          delivery_available: draft.deliveryAvailable,
          is_takeout_available: draft.takeoutAvailable === "가능",
          is_delivery_available: draft.deliveryAvailable === "가능",
          is_available: true,
          sort_order: menus.length + 1,
          created_by: userId || null,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setMenus((prev) =>
          prev.map((menu) =>
            menu.id === localId
              ? {
                  ...nextMenu,
                  ...data,
                  image_url: data.image_url || uploadedImageUrl || previewImageUrl,
                  image_path: data.image_path || uploadedImagePath,
                }
              : menu
          )
        );
      }

      setNoticeMessage(
        "상품/메뉴와 사진을 Supabase에 저장했습니다. 이제 미니홈피와 앱에서 같은 데이터를 사용할 수 있습니다."
      );
    } catch (error) {
      console.warn("[상품/메뉴 관리] 메뉴 서버 저장 실패:", error);
      setLocalOnlyMode(true);
      setNoticeMessage(
        "상품/메뉴는 브라우저 임시 저장으로 유지했습니다. Supabase SQL 테이블, Storage bucket, RLS 정책을 먼저 적용해야 서버 저장이 됩니다."
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
            등록하고 미니홈피에서 어떻게 보일지 확인할 수 있습니다. 실제 고객 공개와
            예약·배달 주문 접수는 운영 시작 결제 후 활성화됩니다.
          </p>
        </div>

        {errorMessage ? (
          <div className="business-menu-alert error" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? <div className="business-menu-alert">{noticeMessage}</div> : null}

        {lastSavedAt ? (
          <div className="business-menu-alert">
            브라우저 임시 저장 완료: {formatSavedAt(lastSavedAt)}
          </div>
        ) : null}

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

              <label className="full">
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
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                <small>
                  사진을 선택하면 아래에 바로 미리보기로 표시됩니다. 상품/메뉴 추가 시
                  Supabase Storage에 저장을 시도합니다.
                </small>
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

              <div className="business-menu-basic-box">
                <div className="business-menu-basic-head">
                  <span>BASIC INFO</span>
                  <h3>메뉴 기본 정보</h3>
                  <p>고객이 꼭 확인하는 정보만 간단하게 입력합니다.</p>
                </div>

                <div className="business-menu-basic-grid">
                  <label>
                    <span>원산지</span>
                    <input
                      type="text"
                      value={draft.origin}
                      onChange={(event) => updateDraft("origin", event.target.value)}
                      placeholder="예: 국내산 복어"
                    />
                  </label>

                  <label>
                    <span>추천 대상</span>
                    <input
                      type="text"
                      value={draft.targetCustomer}
                      onChange={(event) =>
                        updateDraft("targetCustomer", event.target.value)
                      }
                      placeholder="예: 모임, 가족 식사, 관광객"
                    />
                  </label>

                  <div className="business-menu-choice-group">
                    <span>포장 가능 여부</span>
                    <div className="business-menu-choice-row">
                      {["가능", "불가"].map((value) => (
                        <button
                          type="button"
                          key={`takeout-${value}`}
                          className={
                            draft.takeoutAvailable === value ? "selected" : ""
                          }
                          onClick={() => updateDraft("takeoutAvailable", value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="business-menu-choice-group">
                    <span>배달 가능 여부</span>
                    <div className="business-menu-choice-row">
                      {["가능", "불가"].map((value) => (
                        <button
                          type="button"
                          key={`delivery-${value}`}
                          className={
                            draft.deliveryAvailable === value ? "selected" : ""
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
                  placeholder="메뉴 특징이나 추천 이유를 짧게 적어주세요."
                  rows={4}
                />
              </label>

              <button type="submit" disabled={saving}>
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
            <div className={previewGridClassName}>
              {sortedMenus.map((menu, index) => {
                const imageUrl = getMenuImageUrl(menu);

                return (
                  <article
                    className="business-menu-item"
                    key={menu.id || `${getMenuName(menu)}-${index}`}
                  >
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

                      <dl className="business-menu-meta-list">
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
                          <dd>{getMenuDeliveryAvailable(menu)}</dd>
                        </div>
                      </dl>

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
                위 입력창에서 메뉴명, 가격, 사진, 원산지, 추천 대상, 포장·배달
                가능 여부를 넣으면 이곳에서 미니홈피에 보일 모습을 먼저 확인할 수 있습니다.
              </p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
