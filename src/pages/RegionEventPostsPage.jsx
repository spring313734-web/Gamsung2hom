// 파일 경로: src/pages/RegionEventPostsPage.jsx
// ========================================
// 📌 감성여행2 지역별 후기 / 참여글 전용 페이지
// - URL slug 기준 지역 데이터 조회
// - 앱/홈페이지 공용 데이터 구조(regionEvents.js)를 그대로 읽음
// - 전체 후기 / 참여글 목록 표시
// - 작성자 표시는 nickname 우선, 없으면 userId 표시
// - nickname 과 userId가 둘 다 있으면 "닉네임 (userId)" 형태로 함께 표시
// - 후기 카드에 좋아요 수 / 댓글 수 / 참여유형 / 연결 이벤트명 표시
// - 전체 / 후기 / 참여글 / 내 글 필터 + 최신순 / 인기순 정렬 기능 포함
// - AuthContext 로그인 사용자 기준으로 내 글 표시
// - 후기 상세 페이지 라우트로 실제 이동 연결
// - 후기 데이터가 없어도 빈 상태 화면이 깨지지 않도록 방어 처리
// ========================================

import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { getRegionBySlug } from "../data/regionEvents";
import { useAuth } from "../contect/AuthContext";
import "./RegionEventPostsPage.css";

const DEFAULT_REGION_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function toSafeCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toSafeTime(value) {
  const safeText = toSafeText(value, "");
  if (!safeText) return 0;

  const parsed = Date.parse(safeText);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDateText(value, fallback = "등록일 준비중") {
  const safeValue = toSafeText(value, "");

  if (!safeValue) {
    return fallback;
  }

  const date = new Date(safeValue);

  if (Number.isNaN(date.getTime())) {
    return safeValue;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDisplayAuthorInfo(item, fallbackName = "참여자") {
  const nickname = toSafeText(item?.nickname, "");
  const userId = toSafeText(item?.userId, "");
  const authorDisplayName = toSafeText(item?.authorDisplayName, "");
  const authorName = toSafeText(item?.authorName, "");
  const author = toSafeText(item?.author, "");
  const writer = toSafeText(item?.writer, "");

  const primaryName =
    nickname ||
    authorDisplayName ||
    userId ||
    authorName ||
    author ||
    writer ||
    fallbackName;

  const secondaryUserId =
    nickname && userId && nickname !== userId ? userId : "";

  const fullLabel = secondaryUserId
    ? `${primaryName} (${secondaryUserId})`
    : primaryName;

  return {
    nickname,
    userId,
    primaryName,
    secondaryUserId,
    fullLabel,
  };
}

function getEventStatus(item) {
  return item?.status ?? "준비중";
}

function getPostTypeLabel(type) {
  const safeType = toSafeText(type, "").toLowerCase();

  if (safeType === "review") return "후기";
  if (safeType === "participation") return "참여글";
  if (safeType === "post") return "참여글";
  return "후기 / 참여글";
}

function getPostTypeKey(type) {
  const safeType = toSafeText(type, "").toLowerCase();

  if (safeType === "review") return "review";
  if (safeType === "participation" || safeType === "post") {
    return "participation";
  }

  return "all";
}

function getEventTitleById(region, eventId) {
  const safeEventId = toSafeText(eventId, "");
  if (!safeEventId) return "";

  const allEvents = [
    ...normalizeArray(region?.events),
    ...normalizeArray(region?.festivalEvents),
    ...normalizeArray(region?.tourEvents),
  ];

  const matchedEvent = allEvents.find((event) => event?.id === safeEventId);
  return toSafeText(matchedEvent?.title, "");
}

function getSafeCommentItems(item) {
  if (Array.isArray(item?.commentItems)) return item.commentItems;
  if (Array.isArray(item?.comments)) return item.comments;
  return [];
}

function getCommentCount(item) {
  const commentItems = getSafeCommentItems(item);

  if (commentItems.length > 0) {
    return commentItems.length;
  }

  return toSafeCount(item?.commentCount);
}

function buildPostItems(region, festivalEvents, tourEvents, currentUserId) {
  const explicitPosts = normalizeArray(
    region?.postItems ?? region?.posts ?? region?.userPosts
  );

  if (explicitPosts.length > 0) {
    return explicitPosts.map((item, index) => {
      const authorInfo = getDisplayAuthorInfo(item, "참여자");
      const linkedEventTitle =
        toSafeText(item?.eventTitle, "") ||
        getEventTitleById(region, item?.eventId);

      const commentItems = getSafeCommentItems(item);
      const authorUserId = toSafeText(item?.userId ?? authorInfo.userId, "");

      return {
        id: item?.id ?? `region-post-${index}`,
        title: toSafeText(item?.title, `${region?.name ?? "지역"} 참여 후기`),
        summary: toSafeText(
          item?.summary ?? item?.description ?? item?.content,
          "참여글 내용을 준비중입니다."
        ),
        content: toSafeText(item?.content, ""),
        status: toSafeText(item?.status, "참여글"),

        postType: toSafeText(item?.type, "post"),
        postTypeKey: getPostTypeKey(item?.type),
        postTypeLabel: getPostTypeLabel(item?.type),

        eventId: toSafeText(item?.eventId, ""),
        eventTitle: linkedEventTitle,

        likeCount: toSafeCount(item?.likeCount),
        commentCount: getCommentCount(item),
        commentItems,

        authorName: authorInfo.fullLabel,
        authorPrimaryName: authorInfo.primaryName,
        authorUserId,
        authorNickname: authorInfo.nickname,

        createdAt: toSafeText(
          item?.createdAt ?? item?.date ?? item?.createdDate,
          "등록일 준비중"
        ),
        updatedAt: toSafeText(
          item?.updatedAt ?? item?.modifiedAt ?? item?.createdAt,
          ""
        ),
        isEdited: Boolean(item?.isEdited),

        createdAtValue: toSafeTime(
          item?.createdAt ?? item?.date ?? item?.createdDate
        ),

        isMine: Boolean(currentUserId && authorUserId === currentUserId),
      };
    });
  }

  const baseEvents = [...tourEvents, ...festivalEvents];

  return baseEvents.slice(0, 12).map((event, index) => {
    const authorInfo = getDisplayAuthorInfo(event, "참여자");
    const authorUserId = toSafeText(event?.userId ?? authorInfo.userId, "");

    return {
      id: event?.id ?? `event-post-${index}`,
      title: `${event?.title ?? "이벤트"} 참여 후기`,
      summary: toSafeText(
        event?.summary ?? event?.description,
        "참여 후기 데이터가 연결되면 이 영역에 표시됩니다."
      ),
      content: "",
      status: getEventStatus(event),

      postType: "post",
      postTypeKey: "participation",
      postTypeLabel: "참여글",

      eventId: toSafeText(event?.id, ""),
      eventTitle: toSafeText(event?.title, ""),

      likeCount: 0,
      commentCount: 0,
      commentItems: [],

      authorName: authorInfo.fullLabel,
      authorPrimaryName: authorInfo.primaryName,
      authorUserId,
      authorNickname: authorInfo.nickname,

      createdAt: "등록일 준비중",
      updatedAt: "",
      isEdited: false,

      createdAtValue: 0,

      isMine: Boolean(currentUserId && authorUserId === currentUserId),
    };
  });
}

function filterPostItems(items, filterType, isLoggedIn) {
  if (filterType === "review") {
    return items.filter((item) => item?.postTypeKey === "review");
  }

  if (filterType === "participation") {
    return items.filter((item) => item?.postTypeKey === "participation");
  }

  if (filterType === "mine") {
    if (!isLoggedIn) {
      return [];
    }

    return items.filter((item) => item?.isMine);
  }

  return items;
}

function sortPostItems(items, sortType) {
  const copied = [...items];

  if (sortType === "popular") {
    return copied.sort((a, b) => {
      const popularityA =
        toSafeCount(a?.likeCount) * 2 + toSafeCount(a?.commentCount);
      const popularityB =
        toSafeCount(b?.likeCount) * 2 + toSafeCount(b?.commentCount);

      if (popularityB !== popularityA) {
        return popularityB - popularityA;
      }

      return toSafeTime(b?.createdAt) - toSafeTime(a?.createdAt);
    });
  }

  return copied.sort((a, b) => {
    const timeDiff = toSafeTime(b?.createdAt) - toSafeTime(a?.createdAt);
    if (timeDiff !== 0) return timeDiff;

    const popularityA =
      toSafeCount(a?.likeCount) * 2 + toSafeCount(a?.commentCount);
    const popularityB =
      toSafeCount(b?.likeCount) * 2 + toSafeCount(b?.commentCount);

    return popularityB - popularityA;
  });
}

function PostListCard({ item, onOpenPostDetail }) {
  const isEditedLabel = item?.isEdited ? "수정됨" : "";

  return (
    <article className="region-posts-card">
      <div className="region-posts-card-top">
        <div className="region-posts-card-top-left">
          <span className="region-posts-chip">
            {item?.postTypeLabel ?? "후기 / 참여글"}
          </span>

          {item?.eventTitle ? (
            <span className="region-posts-event-chip">{item.eventTitle}</span>
          ) : null}

          {item?.isMine ? (
            <span className="region-posts-event-chip">내 글</span>
          ) : null}
        </div>

        <span className="region-posts-author">
          {item?.authorName ?? "참여자"}
        </span>
      </div>

      <h3>{item?.title ?? "참여 후기"}</h3>

      <p className="region-posts-summary">
        {item?.summary ?? "참여글 내용을 준비중입니다."}
      </p>

      <div className="region-posts-social">
        <span className="region-posts-social-item">
          좋아요 {item?.likeCount ?? 0}
        </span>
        <span className="region-posts-social-item">
          댓글 {item?.commentCount ?? 0}
        </span>
        {isEditedLabel ? (
          <span className="region-posts-social-item">{isEditedLabel}</span>
        ) : null}
      </div>

      <div className="region-posts-meta">
        <span>상태: {item?.status ?? "참여글"}</span>
        <span>등록일: {formatDateText(item?.createdAt)}</span>
      </div>

      <div className="region-posts-card-actions">
        <button
          type="button"
          className="region-posts-card-button"
          onClick={() => onOpenPostDetail(item)}
        >
          댓글 보기 / 상세 보기
        </button>
      </div>
    </article>
  );
}

export default function RegionEventPostsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const region = getRegionBySlug(slug);
  const { currentUser, isLoggedIn } = useAuth();

  const [filterType, setFilterType] = useState("all");
  const [sortType, setSortType] = useState("latest");

  const currentUserId = toSafeText(currentUser?.id, "");
  const currentUserName = getDisplayAuthorInfo(
    {
      nickname: currentUser?.nickname,
      userId: currentUser?.id,
    },
    "로그인 사용자"
  ).fullLabel;

  function handleGoDetail() {
    navigate(`/events/region/${slug}`);
  }

  function handleGoEventsHub() {
    navigate("/events");
  }

  function handleOpenPostDetail(item) {
    if (!item?.id) {
      window.alert("후기 상세 정보를 찾을 수 없습니다.");
      return;
    }

    navigate(`/events/region/${slug}/posts/${item.id}`);
  }

  if (!region) {
    return (
      <div className="region-posts-page">
        <div className="region-posts-empty">
          <p className="region-posts-empty-badge">POSTS</p>
          <h1>지역 정보를 찾을 수 없습니다.</h1>
          <p>
            선택한 지역 후기 / 참여글 페이지 정보가 아직 준비되지 않았거나 주소가
            잘못되었습니다.
          </p>

          <div className="region-posts-empty-actions">
            <button
              type="button"
              className="region-posts-secondary-button"
              onClick={handleGoEventsHub}
            >
              이벤트 허브 메인으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  const festivalEvents = normalizeArray(region?.festivalEvents);
  const tourEvents = normalizeArray(region?.tourEvents);

  const postItems = useMemo(
    () => buildPostItems(region, festivalEvents, tourEvents, currentUserId),
    [region, festivalEvents, tourEvents, currentUserId]
  );

  const visiblePostItems = useMemo(() => {
    const filteredItems = filterPostItems(postItems, filterType, isLoggedIn);
    return sortPostItems(filteredItems, sortType);
  }, [postItems, filterType, sortType, isLoggedIn]);

  const myPostCount = useMemo(
    () => postItems.filter((item) => item?.isMine).length,
    [postItems]
  );

  const heroBadge = "PARTICIPANT POSTS";
  const heroTitle = `${region?.name ?? "지역"} 후기 / 참여글`;
  const heroDescription =
    region?.postSection?.description ??
    "참여자들이 남긴 후기와 참여글을 한곳에서 모아볼 수 있도록 구성한 전용 페이지입니다.";
  const heroImage = region?.heroImage ?? region?.image ?? DEFAULT_REGION_IMAGE;

  return (
    <>
      <PageHero
        badge={heroBadge}
        title={heroTitle}
        description={heroDescription}
        backgroundImage={heroImage}
      />

      <div className="region-posts-page">
        <section className="region-posts-shell">
          <div className="region-posts-header">
            <div>
              <p className="region-posts-label">PARTICIPANT POSTS</p>
              <h2>{region?.name ?? "지역"} 후기 / 참여글 전체 보기</h2>
              <p className="region-posts-description">{heroDescription}</p>
            </div>

            <div className="region-posts-actions">
              <button
                type="button"
                className="region-posts-secondary-button"
                onClick={handleGoDetail}
              >
                상세페이지로 돌아가기
              </button>

              <button
                type="button"
                className="region-posts-primary-button"
                onClick={handleGoEventsHub}
              >
                전체 지역 다시 보기
              </button>
            </div>
          </div>

          <div className="region-posts-toolbar">
            <div className="region-posts-filter-group">
              <button
                type="button"
                className={`region-posts-filter-button${
                  filterType === "all" ? " is-active" : ""
                }`}
                onClick={() => setFilterType("all")}
              >
                전체
              </button>
              <button
                type="button"
                className={`region-posts-filter-button${
                  filterType === "review" ? " is-active" : ""
                }`}
                onClick={() => setFilterType("review")}
              >
                후기
              </button>
              <button
                type="button"
                className={`region-posts-filter-button${
                  filterType === "participation" ? " is-active" : ""
                }`}
                onClick={() => setFilterType("participation")}
              >
                참여글
              </button>
              <button
                type="button"
                className={`region-posts-filter-button${
                  filterType === "mine" ? " is-active" : ""
                }`}
                onClick={() => setFilterType("mine")}
              >
                내 글
              </button>
            </div>

            <div className="region-posts-sort-group">
              <button
                type="button"
                className={`region-posts-sort-button${
                  sortType === "latest" ? " is-active" : ""
                }`}
                onClick={() => setSortType("latest")}
              >
                최신순
              </button>
              <button
                type="button"
                className={`region-posts-sort-button${
                  sortType === "popular" ? " is-active" : ""
                }`}
                onClick={() => setSortType("popular")}
              >
                인기순
              </button>
            </div>
          </div>

          <div className="region-posts-count-box">
            총 <strong>{visiblePostItems.length}</strong>개의 후기 / 참여글
            {isLoggedIn ? (
              <span> · 내 글 {myPostCount}개 · {currentUserName}</span>
            ) : (
              <span> · 로그인 후 내 글만 모아볼 수 있습니다.</span>
            )}
          </div>

          {visiblePostItems.length > 0 ? (
            <div className="region-posts-list">
              {visiblePostItems.map((item) => (
                <PostListCard
                  key={item?.id ?? item?.title}
                  item={item}
                  onOpenPostDetail={handleOpenPostDetail}
                />
              ))}
            </div>
          ) : (
            <div className="region-posts-empty">
              <p className="region-posts-empty-badge">EMPTY</p>
              <h3>
                {filterType === "mine"
                  ? "내가 작성한 글이 아직 없습니다."
                  : "조건에 맞는 후기 / 참여글이 없습니다."}
              </h3>
              <p>
                필터를 바꾸거나 전체 보기로 돌아가면 다른 후기 / 참여글을 확인할 수
                있습니다.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}