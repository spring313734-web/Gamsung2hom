// 파일 경로: src/lib/govEventApi.js
// ========================================
// 📌 감성여행2 홈페이지용 지자체 이벤트 공용 API
// - Supabase의 gov_contents 테이블을 읽어 홈페이지 이벤트 허브 메인/상세 데이터를 구성
// - 앱 지자체 등록 데이터와 홈페이지가 같은 콘텐츠 서버 데이터를 바라보도록 정리
// - regionEvents.js 로컬 더미 구조를 최대한 흉내 내는 normalize 계층 포함
// - 후기/참여글 실데이터는 아직 Firebase gov_posts 기반이므로 이 파일에서는 placeholder/fallback 위주로 구성
// ========================================

import { supabase } from "./supabase";

const DEFAULT_REGION_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

const REGION_SLUG_MAP = {
  서울: "seoul",
  부산: "busan",
  대구: "daegu",
  인천: "incheon",
  광주: "gwangju",
  대전: "daejeon",
  울산: "ulsan",
  세종: "sejong",
  경기: "gyeonggi",
  강원: "gangwon",
  충북: "chungbuk",
  충남: "chungnam",
  전북: "jeonbuk",
  전남: "jeonnam",
  경북: "gyeongbuk",
  경남: "gyeongnam",
  제주: "jeju",
};

const REGION_TYPE_MAP = {
  서울: "special_city",
  부산: "metropolitan_city",
  대구: "metropolitan_city",
  인천: "metropolitan_city",
  광주: "metropolitan_city",
  대전: "metropolitan_city",
  울산: "metropolitan_city",
  세종: "special_self_governing_city",
  경기: "province",
  강원: "province",
  충북: "province",
  충남: "province",
  전북: "province",
  전남: "province",
  경북: "province",
  경남: "province",
  제주: "special_self_governing_province",
};

const FESTIVAL_CATEGORY_SET = new Set([
  "축제",
  "지역축제",
  "festival",
  "FESTIVAL",
]);

function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function toBoolean(value, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function toSlug(regionName) {
  const safeRegionName = toSafeText(regionName, "지역");
  return REGION_SLUG_MAP[safeRegionName] ?? safeRegionName;
}

function toRegionType(regionName) {
  const safeRegionName = toSafeText(regionName, "기타");
  return REGION_TYPE_MAP[safeRegionName] ?? "other";
}

function getTypeValue(item) {
  return (
    item?.type ??
    item?.contentType ??
    item?.content_type ??
    item?.eventType ??
    item?.event_type ??
    ""
  );
}

function inferEventType(item) {
  const rawType = toSafeText(getTypeValue(item)).toLowerCase();

  if (
    rawType === "festival" ||
    rawType === "지역축제" ||
    rawType === "festivals"
  ) {
    return "festival";
  }

  if (
    rawType === "tour_event" ||
    rawType === "tour-event" ||
    rawType === "tour event" ||
    rawType === "tour" ||
    rawType === "관광이벤트"
  ) {
    return "tourEvent";
  }

  const category = toSafeText(item?.category ?? item?.categoryLabel).toLowerCase();
  if (FESTIVAL_CATEGORY_SET.has(category)) {
    return "festival";
  }

  return "tourEvent";
}

function getTypeLabel(type) {
  return type === "festival" ? "지역축제" : "관광이벤트";
}

function getIsVisible(item) {
  if (typeof item?.isVisible === "boolean") return item.isVisible;
  if (typeof item?.is_visible === "boolean") return item.is_visible;
  return true;
}

function getUpdatedAt(item) {
  return (
    item?.updatedAt ??
    item?.updated_at ??
    item?.createdAt ??
    item?.created_at ??
    ""
  );
}

function getStartDate(item) {
  return toSafeText(item?.startDate ?? item?.start_date);
}

function getEndDate(item) {
  return toSafeText(item?.endDate ?? item?.end_date);
}

function buildPeriodText(startDate, endDate) {
  if (startDate || endDate) {
    return `${startDate || "-"} ~ ${endDate || "-"}`;
  }
  return "일정 준비중";
}

function normalizeSimpleItem(item, fallbackPrefix, index) {
  if (typeof item === "string") {
    return {
      id: `${fallbackPrefix}-${index + 1}`,
      title: item,
      summary: item,
      description: item,
      content: item,
      image: "",
    };
  }

  return {
    id: toSafeText(item?.id, `${fallbackPrefix}-${index + 1}`),
    title: toSafeText(item?.title ?? item?.label, "안내"),
    summary: toSafeText(item?.summary ?? item?.description ?? item?.content),
    description: toSafeText(item?.description ?? item?.summary ?? item?.content),
    content: toSafeText(item?.content ?? item?.description ?? item?.summary),
    image: toSafeText(item?.image ?? item?.thumbnailUrl ?? item?.imageUrl),
    creatorName: toSafeText(
      item?.creatorName ?? item?.winnerName ?? item?.authorName ?? item?.name
    ),
    authorName: toSafeText(item?.authorName ?? item?.name),
    status: toSafeText(item?.status),
  };
}

function normalizeAnnouncementItems(item) {
  const announcementInfo = item?.announcementInfo ?? item?.announcement_info ?? {};
  const noticeItems = toSafeArray(item?.notices ?? item?.noticeItems);

  const normalizedNotices = noticeItems.map((notice, index) =>
    normalizeSimpleItem(notice, `${item?.id ?? "content"}-notice`, index)
  );

  const announcementItems = [];

  if (toBoolean(announcementInfo?.isPublished ?? announcementInfo?.is_published)) {
    announcementItems.push({
      id: `${item?.id ?? "content"}-announcement-main`,
      title: toSafeText(
        announcementInfo?.title,
        `${toSafeText(item?.title, "이벤트")} 발표`
      ),
      summary: toSafeText(
        announcementInfo?.body,
        "발표 내용을 준비중입니다."
      ),
      description: toSafeText(announcementInfo?.body),
      status: "발표",
    });
  }

  normalizedNotices.forEach((notice) => {
    const typeLabel = toSafeText(notice?.typeLabel ?? notice?.title);
    if (typeLabel.includes("발표")) {
      announcementItems.push({
        ...notice,
        status: notice?.status || "발표",
      });
    }
  });

  return announcementItems;
}

function normalizeFeaturedWorks(item) {
  const winnerInfo = item?.winnerInfo ?? item?.winner_info ?? {};
  const result = [];

  if (
    toSafeText(winnerInfo?.title) ||
    toSafeText(winnerInfo?.winnerName) ||
    toSafeText(winnerInfo?.summary)
  ) {
    result.push({
      id: `${item?.id ?? "content"}-winner-main`,
      title: toSafeText(winnerInfo?.title, "대표 참여작"),
      summary: buildWinnerSummary(winnerInfo),
      description: buildWinnerSummary(winnerInfo),
      image: toSafeText(winnerInfo?.imageUrl ?? winnerInfo?.image_url),
      creatorName: toSafeText(winnerInfo?.winnerName, "참여자"),
    });
  }

  return result;
}

function buildWinnerSummary(winnerInfo) {
  const parts = [
    toSafeText(winnerInfo?.prizeLabel),
    toSafeText(winnerInfo?.winnerName),
    toSafeText(winnerInfo?.summary),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "당선작 소개를 준비중입니다.";
}

function normalizeInterviews(item) {
  const interviewInfo = item?.interviewInfo ?? item?.interview_info ?? {};
  const result = [];

  if (
    toSafeText(interviewInfo?.title) ||
    toSafeText(interviewInfo?.body) ||
    toSafeText(interviewInfo?.authorName)
  ) {
    result.push({
      id: `${item?.id ?? "content"}-interview-main`,
      title: toSafeText(interviewInfo?.title, "참여자 인터뷰"),
      summary: toSafeText(interviewInfo?.body, "인터뷰 내용을 준비중입니다."),
      description: toSafeText(interviewInfo?.body),
      name: toSafeText(interviewInfo?.authorName, "참여자"),
      authorName: toSafeText(interviewInfo?.authorName, "참여자"),
    });
  }

  return result;
}

function normalizeEvent(item) {
  const type = inferEventType(item);
  const regionName = toSafeText(item?.regionName ?? item?.region_name, "지역");
  const startDate = getStartDate(item);
  const endDate = getEndDate(item);
  const description = toSafeText(
    item?.description ?? item?.summary ?? item?.content,
    "상세 설명 준비중입니다."
  );
  const thumbnailUrl = toSafeText(
    item?.thumbnailUrl ?? item?.thumbnail_url ?? item?.image
  );
  const title = toSafeText(item?.title, "이벤트 준비중");

  return {
    id: toSafeText(item?.id),
    regionSlug: toSlug(regionName),
    regionName,
    type,
    isFestival: type === "festival",
    isTourEvent: type === "tourEvent",
    contentTypeLabel: getTypeLabel(type),

    title,
    badge: getTypeLabel(type),
    category: getTypeLabel(type),
    categoryLabel: getTypeLabel(type),

    status: toSafeText(item?.status, "진행중"),
    isVisible: getIsVisible(item),

    startDate,
    endDate,
    period: buildPeriodText(startDate, endDate),
    periodLabel: buildPeriodText(startDate, endDate),

    place: toSafeText(item?.placeName ?? item?.place_name, "장소 준비중"),
    placeName: toSafeText(item?.placeName ?? item?.place_name, "장소 준비중"),
    location: toSafeText(item?.placeName ?? item?.place_name, "장소 준비중"),
    venue: toSafeText(item?.placeName ?? item?.place_name, "장소 준비중"),
    address: toSafeText(item?.address),

    summary: description,
    description,
    intro: description,
    content: description,

    image: thumbnailUrl,
    thumbnailUrl,
    thumbnail: thumbnailUrl,
    coverImage: thumbnailUrl,

    hostName: toSafeText(item?.hostName ?? item?.host_name),
    contactNumber: toSafeText(item?.contactNumber ?? item?.contact_number),

    announcementItems: normalizeAnnouncementItems(item),
    featuredWorks: normalizeFeaturedWorks(item),
    interviews: normalizeInterviews(item),

    raw: item,
    updatedAt: getUpdatedAt(item),
  };
}

function buildRegionHeroDescription(regionName, events) {
  const first = events[0];
  if (!first) {
    return `${regionName} 지역의 지역축제와 관광이벤트 정보를 준비중입니다.`;
  }

  return `${regionName} 지역의 지역축제와 관광이벤트를 한눈에 모아보고, 기간 · 장소 · 주관 · 문의 정보를 함께 확인할 수 있는 감성여행2 지역 허브입니다.`;
}

function buildRegionShortDescription(regionName, count) {
  if (count > 0) {
    return `${regionName} 대표 이벤트 ${count}개를 모아보는 지역 허브`;
  }
  return `${regionName} 지역 이벤트 허브`;
}

function buildRegionBadge(events) {
  const hasFestival = events.some((event) => event.isFestival);
  const hasTourEvent = events.some((event) => event.isTourEvent);

  if (hasFestival && hasTourEvent) return "축제 + 관광";
  if (hasFestival) return "지역축제";
  if (hasTourEvent) return "관광이벤트";
  return "EVENT";
}

function buildRegionTags(events) {
  const tags = new Set();

  events.forEach((event) => {
    const place = toSafeText(event?.placeName);
    const typeLabel = toSafeText(event?.contentTypeLabel);
    if (place) tags.add(place);
    if (typeLabel) tags.add(typeLabel);
  });

  return Array.from(tags).slice(0, 4);
}

function buildRegionSummary(regionName, events) {
  const sorted = [...events].sort((a, b) =>
    String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
  );
  const heroImage =
    sorted.find((item) => toSafeText(item?.thumbnailUrl))?.thumbnailUrl ||
    DEFAULT_REGION_IMAGE;

  return {
    slug: toSlug(regionName),
    name: regionName,
    regionType: toRegionType(regionName),
    badge: buildRegionBadge(sorted),
    eventCount: sorted.length,
    totalEventCount: sorted.length,
    shortDescription: buildRegionShortDescription(regionName, sorted.length),
    heroDescription: buildRegionHeroDescription(regionName, sorted),
    image: heroImage,
    heroImage,
    tags: buildRegionTags(sorted),
    noticeCount: sorted.reduce(
      (acc, event) => acc + toSafeArray(event.announcementItems).length,
      0
    ),
    userPostCount: 0,
    photoCount: sorted.length,
    festivalEvents: sorted.filter((event) => event.isFestival),
    tourEvents: sorted.filter((event) => event.isTourEvent),
    events: sorted,
    postItems: [],
    photoItems: [],
    courses: [],
  };
}

async function fetchGovContentsFromSupabase() {
  const { data, error } = await supabase.from("gov_contents").select("*");

  if (error) {
    throw error;
  }

  return toSafeArray(data)
    .filter((item) => getIsVisible(item))
    .map(normalizeEvent)
    .filter((item) => toSafeText(item?.id) && toSafeText(item?.regionName));
}

export async function getGovEventHubRegions() {
  const contents = await fetchGovContentsFromSupabase();

  const groupedMap = new Map();

  contents.forEach((item) => {
    const key = item.regionName;
    const current = groupedMap.get(key) ?? [];
    current.push(item);
    groupedMap.set(key, current);
  });

  return Array.from(groupedMap.entries())
    .map(([regionName, items]) => buildRegionSummary(regionName, items))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

export async function getGovRegionBySlug(slug) {
  const safeSlug = toSafeText(slug);
  if (!safeSlug) return null;

  const regions = await getGovEventHubRegions();
  return regions.find((region) => region.slug === safeSlug) ?? null;
}