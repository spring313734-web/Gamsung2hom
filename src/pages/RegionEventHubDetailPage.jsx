// 파일 경로: src/pages/RegionEventHubDetailPage.jsx
// ========================================
// 📌 감성여행2 지역별 이벤트 허브 상세 페이지
// - URL slug 기준 지역 데이터를 Supabase 기반 홈페이지 공용 API에서 조회
// - 상세페이지 흐름을 지역 소개 → 진행 이벤트 → 참여 사진 → 후기/참여글 미리보기 → 발표/당선작/인터뷰 → 추천 코스로 재정리
// - 참여 사진 섹션은 갤러리형으로 표시
// - 데스크톱 기준 가로 6개 × 세로 3줄(페이지당 18개) + 페이지네이션 적용
// - 현재 1차 버전에서는 지역축제/관광이벤트 서버 데이터를 기준으로 우선 연결
// - 후기/참여글 실데이터는 이후 Firebase gov_posts 연결 또는 별도 이전 단계에서 확장
// ========================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { getGovRegionBySlug } from "../lib/govEventApi";
import "./RegionEventHubDetailPage.css";

const DEFAULT_REGION_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

const PHOTO_ITEMS_PER_PAGE = 18;
const POST_PREVIEW_COUNT = 4;

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function getDisplayAuthorName(item, fallback = "참여자") {
  return toSafeText(
    item?.nickname ??
      item?.userId ??
      item?.authorName ??
      item?.author ??
      item?.writer,
    fallback
  );
}

function getEventStatus(item) {
  return item?.status ?? "준비중";
}

function getEventPeriod(item) {
  if (item?.startDate || item?.endDate) {
    return `${item?.startDate || "-"} ~ ${item?.endDate || "-"}`;
  }

  return (
    item?.periodLabel ??
    item?.period ??
    item?.dateRange ??
    item?.scheduleText ??
    "일정 준비중"
  );
}

function getEventPlace(item) {
  return (
    item?.placeName ??
    item?.place ??
    item?.location ??
    item?.venue ??
    item?.address ??
    "장소 준비중"
  );
}

function getEventSummary(item) {
  return (
    item?.description ??
    item?.summary ??
    item?.intro ??
    item?.content ??
    "상세 설명 준비중입니다."
  );
}

function getEventImage(item, regionImage) {
  return (
    item?.thumbnailUrl ??
    item?.image ??
    item?.thumbnail ??
    item?.coverImage ??
    regionImage ??
    DEFAULT_REGION_IMAGE
  );
}

function getEventHostName(item) {
  return typeof item?.hostName === "string" ? item.hostName.trim() : "";
}

function getEventContactNumber(item) {
  return typeof item?.contactNumber === "string"
    ? item.contactNumber.trim()
    : "";
}

function normalizeCourseTitle(course, index) {
  if (typeof course === "string") {
    return course.trim() || `추천 코스 ${index + 1}`;
  }

  return course?.title ?? `추천 코스 ${index + 1}`;
}

function normalizeCourseSummary(course) {
  if (typeof course === "string") {
    return course.trim() || "추천 코스 정보를 준비중입니다.";
  }

  return (
    course?.summary ??
    course?.description ??
    course?.title ??
    "추천 코스 정보를 준비중입니다."
  );
}

function flattenAnnouncementItems(tourEvents = []) {
  return tourEvents.flatMap((event, eventIndex) => {
    const items = normalizeArray(event?.announcementItems);

    return items.map((item, index) => ({
      ...item,
      id:
        item?.id ??
        `${event?.id ?? event?.title ?? "tour"}-announcement-${eventIndex}-${index}`,
      sourceEventTitle: event?.title ?? "관광이벤트",
    }));
  });
}

function flattenFeaturedWorks(
  tourEvents = [],
  heroImage = DEFAULT_REGION_IMAGE
) {
  return tourEvents.flatMap((event, eventIndex) => {
    const items = normalizeArray(event?.featuredWorks);

    return items.map((item, index) => ({
      ...item,
      id:
        item?.id ??
        `${event?.id ?? event?.title ?? "tour"}-work-${eventIndex}-${index}`,
      image: getEventImage(item, getEventImage(event, heroImage)),
      sourceEventTitle: event?.title ?? "관광이벤트",
    }));
  });
}

function flattenInterviews(tourEvents = []) {
  return tourEvents.flatMap((event, eventIndex) => {
    const items = normalizeArray(event?.interviews);

    return items.map((item, index) => ({
      ...item,
      id:
        item?.id ??
        `${event?.id ?? event?.title ?? "tour"}-interview-${eventIndex}-${index}`,
      sourceEventTitle: event?.title ?? "관광이벤트",
    }));
  });
}

function buildPhotoShowcaseItems(region, festivalEvents, tourEvents, heroImage) {
  const explicitRegionPhotos = normalizeArray(region?.photoItems);

  if (explicitRegionPhotos.length > 0) {
    return explicitRegionPhotos.map((item, index) => ({
      id: item?.id ?? `region-photo-${index}`,
      title: toSafeText(item?.title, `${region?.name ?? "지역"} 참여 사진`),
      summary: toSafeText(
        item?.summary ?? item?.description,
        "참여 사진 설명을 준비중입니다."
      ),
      image: getEventImage(item, heroImage),
      status: toSafeText(item?.status, "참여 사진"),
      creatorName: getDisplayAuthorName(item, "참여자"),
    }));
  }

  const featuredWorks = flattenFeaturedWorks(tourEvents, heroImage);

  if (featuredWorks.length > 0) {
    return featuredWorks.map((item, index) => ({
      id: item?.id ?? `featured-photo-${index}`,
      title: toSafeText(item?.title, `${item?.sourceEventTitle} 참여 사진`),
      summary: toSafeText(
        item?.summary ?? item?.description,
        "참여 사진 설명을 준비중입니다."
      ),
      image: getEventImage(item, heroImage),
      status: "참여 사진",
      creatorName: getDisplayAuthorName(item, "참여자"),
    }));
  }

  const baseEvents = [...tourEvents, ...festivalEvents];

  return baseEvents.slice(0, 54).map((event, index) => ({
    id: event?.id ?? `event-photo-${index}`,
    title: `${event?.title ?? "이벤트"} 현장 사진`,
    summary: toSafeText(
      event?.summary ?? event?.description,
      "현장 사진이 연결되면 이 영역에 표시됩니다."
    ),
    image: getEventImage(event, heroImage),
    status: getEventStatus(event),
    creatorName: "현장 기록",
  }));
}

function buildPostItems(region, festivalEvents, tourEvents) {
  const explicitPosts = normalizeArray(
    region?.postItems ?? region?.posts ?? region?.userPosts
  );

  if (explicitPosts.length > 0) {
    return explicitPosts.map((item, index) => ({
      id: item?.id ?? `region-post-${index}`,
      title: toSafeText(item?.title, `${region?.name ?? "지역"} 참여 후기`),
      summary: toSafeText(
        item?.summary ?? item?.description ?? item?.content,
        "참여글 내용을 준비중입니다."
      ),
      status: toSafeText(item?.status, "참여글"),
      authorName: getDisplayAuthorName(item, "참여자"),
    }));
  }

  const baseEvents = [...tourEvents, ...festivalEvents];

  return baseEvents.slice(0, 6).map((event, index) => ({
    id: event?.id ?? `event-post-${index}`,
    title: `${event?.title ?? "이벤트"} 참여 후기`,
    summary: toSafeText(
      event?.summary ?? event?.description,
      "후기 실데이터는 곧 연결될 예정입니다."
    ),
    status: getEventStatus(event),
    authorName: "참여자",
  }));
}

function SectionEmptyCard({ title, summary }) {
  return (
    <article className="region-detail-event-card">
      <div
        className="region-detail-event-image"
        style={{ backgroundImage: `url(${DEFAULT_REGION_IMAGE})` }}
        aria-hidden="true"
      />

      <div className="region-detail-event-content">
        <div className="region-detail-event-top">
          <span className="region-detail-event-badge">안내</span>
          <span className="region-detail-event-status">업데이트 예정</span>
        </div>

        <h4>{title}</h4>
        <p className="region-detail-event-summary">{summary}</p>
      </div>
    </article>
  );
}

function EventInfoCard({ event, fallbackImage, badgeLabel }) {
  const title = event?.title ?? event?.name ?? "이벤트 준비중";
  const status = getEventStatus(event);
  const period = getEventPeriod(event);
  const place = getEventPlace(event);
  const summary = getEventSummary(event);
  const image = getEventImage(event, fallbackImage);
  const hostName = getEventHostName(event);
  const contactNumber = getEventContactNumber(event);

  return (
    <article className="region-detail-event-card">
      <div
        className="region-detail-event-image"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />

      <div className="region-detail-event-content">
        <div className="region-detail-event-top">
          <span className="region-detail-event-badge">{badgeLabel}</span>
          <span className="region-detail-event-status">{status}</span>
        </div>

        <h4>{title}</h4>

        <div className="region-detail-event-info-list">
          <p className="region-detail-event-info">
            <span className="region-detail-event-info-label">기간</span>
            <span>{period}</span>
          </p>

          <p className="region-detail-event-info">
            <span className="region-detail-event-info-label">장소</span>
            <span>{place}</span>
          </p>

          {hostName ? (
            <p className="region-detail-event-info">
              <span className="region-detail-event-info-label">주관</span>
              <span>{hostName}</span>
            </p>
          ) : null}

          {contactNumber ? (
            <p className="region-detail-event-info">
              <span className="region-detail-event-info-label">문의</span>
              <span>{contactNumber}</span>
            </p>
          ) : null}
        </div>

        <p className="region-detail-event-summary">{summary}</p>
      </div>
    </article>
  );
}

function PhotoGalleryCard({ item, fallbackImage }) {
  const image = getEventImage(item, fallbackImage);
  const title = item?.title ?? "참여 사진";
  const creatorName = item?.creatorName ?? "참여자";
  const summary =
    item?.summary ?? item?.description ?? "참여 사진 설명을 준비중입니다.";

  return (
    <article className="region-detail-photo-card" title={title}>
      <div
        className="region-detail-photo-thumb"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />

      <div className="region-detail-photo-overlay">
        <span className="region-detail-photo-chip">{creatorName}</span>
        <h4>{title}</h4>
        <p>{summary}</p>
      </div>
    </article>
  );
}

function PostCard({ item, onClick }) {
  const title = item?.title ?? "참여 후기";
  const summary =
    item?.summary ??
    item?.description ??
    item?.content ??
    "참여글 내용을 준비중입니다.";
  const status = item?.status ?? "참여글";
  const authorName = item?.authorName ?? "참여자";

  return (
    <button
      type="button"
      className="region-detail-post-card-button"
      onClick={onClick}
      aria-label={`${title} 후기 / 참여글 페이지로 이동`}
    >
      <article className="region-detail-event-card region-detail-post-card">
        <div
          className="region-detail-event-image"
          style={{ backgroundImage: `url(${DEFAULT_REGION_IMAGE})` }}
          aria-hidden="true"
        />

        <div className="region-detail-event-content">
          <div className="region-detail-event-top">
            <span className="region-detail-event-badge">후기 / 참여글</span>
            <span className="region-detail-event-status">{authorName}</span>
          </div>

          <h4>{title}</h4>
          <p className="region-detail-event-summary">{summary}</p>
          <p className="region-detail-event-info">
            <span className="region-detail-event-info-label">상태</span>
            <span>{status}</span>
          </p>
        </div>
      </article>
    </button>
  );
}

function AnnouncementCard({ item, fallbackTitle }) {
  const title = item?.title ?? fallbackTitle;
  const summary =
    item?.summary ?? item?.description ?? "발표 내용을 준비중입니다.";
  const status = item?.status ?? "발표";

  return (
    <article className="region-detail-event-card">
      <div
        className="region-detail-event-image"
        style={{ backgroundImage: `url(${DEFAULT_REGION_IMAGE})` }}
        aria-hidden="true"
      />

      <div className="region-detail-event-content">
        <div className="region-detail-event-top">
          <span className="region-detail-event-badge">발표</span>
          <span className="region-detail-event-status">{status}</span>
        </div>

        <h4>{title}</h4>
        <p className="region-detail-event-summary">{summary}</p>
      </div>
    </article>
  );
}

function FeaturedWorkCard({ item, fallbackImage, fallbackTitle }) {
  const title = item?.title ?? fallbackTitle;
  const creatorName = item?.creatorName ?? item?.author ?? "참여자";
  const summary =
    item?.summary ?? item?.description ?? "당선작 소개를 준비중입니다.";
  const image =
    item?.image ?? item?.thumbnailUrl ?? item?.thumbnail ?? fallbackImage;

  return (
    <article className="region-detail-event-card">
      <div
        className="region-detail-event-image"
        style={{ backgroundImage: `url(${image || DEFAULT_REGION_IMAGE})` }}
        aria-hidden="true"
      />

      <div className="region-detail-event-content">
        <div className="region-detail-event-top">
          <span className="region-detail-event-badge">당선작</span>
          <span className="region-detail-event-status">{creatorName}</span>
        </div>

        <h4>{title}</h4>
        <p className="region-detail-event-summary">{summary}</p>
      </div>
    </article>
  );
}

function InterviewCard({ item, fallbackTitle }) {
  const title = item?.title ?? fallbackTitle;
  const name = item?.name ?? item?.participantName ?? "참여자";
  const summary =
    item?.summary ?? item?.description ?? "인터뷰 내용을 준비중입니다.";

  return (
    <article className="region-detail-event-card">
      <div
        className="region-detail-event-image"
        style={{ backgroundImage: `url(${DEFAULT_REGION_IMAGE})` }}
        aria-hidden="true"
      />

      <div className="region-detail-event-content">
        <div className="region-detail-event-top">
          <span className="region-detail-event-badge">인터뷰</span>
          <span className="region-detail-event-status">{name}</span>
        </div>

        <h4>{title}</h4>
        <p className="region-detail-event-summary">{summary}</p>
      </div>
    </article>
  );
}

export default function RegionEventHubDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [region, setRegion] = useState(null);
  const [photoPage, setPhotoPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRegion() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRegion = await getGovRegionBySlug(slug);
        if (!isMounted) return;
        setRegion(nextRegion);
      } catch (error) {
        if (!isMounted) return;
        console.error("[RegionEventHubDetailPage] failed to load region detail", error);
        setRegion(null);
        setErrorMessage(
          "지역 허브 데이터를 불러오지 못했습니다. Supabase 연결 또는 테이블 상태를 확인해주세요."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRegion();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  function handleGoEventsHub() {
    navigate("/events");
  }

  function handleGoPostsPage() {
    navigate(`/events/region/${slug}/posts`);
  }

  if (isLoading) {
    return (
      <div className="region-detail-page">
        <div className="region-detail-empty">
          <p className="region-detail-empty-badge">EVENT HUB</p>
          <h1>지역 허브를 불러오는 중입니다.</h1>
          <p>지자체에서 등록한 이벤트 데이터를 서버에서 불러오고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (!region) {
    return (
      <div className="region-detail-page">
        <div className="region-detail-empty">
          <p className="region-detail-empty-badge">EVENT HUB</p>
          <h1>지역 정보를 찾을 수 없습니다.</h1>
          <p>
            {errorMessage ||
              "선택한 지역 허브 정보가 아직 준비되지 않았거나 주소가 잘못되었습니다."}
          </p>
          <button
            type="button"
            className="region-detail-back-button"
            onClick={handleGoEventsHub}
          >
            이벤트 허브 메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const tags = normalizeArray(region?.tags);
  const festivalEvents = normalizeArray(region?.festivalEvents);
  const tourEvents = normalizeArray(region?.tourEvents);
  const courses = normalizeArray(region?.courses);

  const allVisibleEvents = [...tourEvents, ...festivalEvents].filter(
    (event) => event?.isVisible !== false
  );

  const heroBadge = region?.badge ?? "EVENT";
  const heroTitle = `${region?.name ?? "지역"} 이벤트 허브`;
  const heroDescription =
    region?.heroDescription ?? "지역 이벤트 정보를 준비중입니다.";
  const heroImage = region?.heroImage ?? region?.image ?? DEFAULT_REGION_IMAGE;

  const photoItems = buildPhotoShowcaseItems(
    region,
    festivalEvents,
    tourEvents,
    heroImage
  );
  const postItems = buildPostItems(region, festivalEvents, tourEvents);
  const previewPostItems = postItems.slice(0, POST_PREVIEW_COUNT);

  const announcementItems = flattenAnnouncementItems(tourEvents);
  const winnerItems = flattenFeaturedWorks(tourEvents, heroImage);
  const interviewItems = flattenInterviews(tourEvents);

  const hasAnnouncementSection = announcementItems.length > 0;
  const hasWinnersSection = winnerItems.length > 0;
  const hasInterviewsSection = interviewItems.length > 0;

  const photoPageCount = Math.max(
    1,
    Math.ceil(photoItems.length / PHOTO_ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setPhotoPage(1);
  }, [slug]);

  useEffect(() => {
    if (photoPage > photoPageCount) {
      setPhotoPage(photoPageCount);
    }
  }, [photoPage, photoPageCount]);

  const pagedPhotoItems = useMemo(() => {
    const startIndex = (photoPage - 1) * PHOTO_ITEMS_PER_PAGE;
    const endIndex = startIndex + PHOTO_ITEMS_PER_PAGE;
    return photoItems.slice(startIndex, endIndex);
  }, [photoItems, photoPage]);

  return (
    <>
      <PageHero
        badge={heroBadge}
        title={heroTitle}
        description={heroDescription}
        backgroundImage={heroImage}
      />

      <div className="region-detail-page">
        <section className="region-detail-intro">
          <div className="region-detail-title-row">
            <div className="region-detail-title-copy">
              <p className="region-detail-section-label">REGION OVERVIEW</p>
              <h2>{region?.name ?? "지역"} 관광이벤트 허브</h2>
            </div>

            <button
              type="button"
              className="region-detail-back-button"
              onClick={handleGoEventsHub}
            >
              전체 지역 다시 보기
            </button>
          </div>

          <p className="region-detail-description">{heroDescription}</p>

          <div className="region-detail-tags">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span key={tag} className="region-detail-tag">
                  #{tag}
                </span>
              ))
            ) : (
              <span className="region-detail-tag">#준비중</span>
            )}
          </div>
        </section>

        <section className="region-detail-events">
          <div className="region-detail-section-head">
            <p className="region-detail-section-label">TOUR EVENT OVERVIEW</p>
            <h3>{region?.tourEventSection?.title ?? "관광이벤트 소개"}</h3>
            <p className="region-detail-description">
              {region?.tourEventSection?.description ??
                region?.overview?.tourEventDescription ??
                "이 지역의 관광이벤트와 현장 흐름을 먼저 확인하고, 그 아래에서 참여 사진과 후기, 발표 이후 당선작과 인터뷰까지 이어서 볼 수 있도록 구성했습니다."}
            </p>
          </div>

          <div className="region-detail-event-grid">
            {allVisibleEvents.length > 0 ? (
              allVisibleEvents.map((event) => (
                <EventInfoCard
                  key={event?.id ?? event?.title}
                  event={event}
                  fallbackImage={heroImage}
                  badgeLabel={event?.contentTypeLabel ?? "관광이벤트"}
                />
              ))
            ) : (
              <SectionEmptyCard
                title="진행 이벤트 준비중"
                summary="이 지역의 진행 이벤트 정보가 연결되면 이 영역에 표시됩니다."
              />
            )}
          </div>
        </section>

        <section className="region-detail-events region-detail-photo-section">
          <div className="region-detail-section-head region-detail-photo-head">
            <div>
              <p className="region-detail-section-label">PARTICIPANT PHOTOS</p>
              <h3>참여 사진</h3>
              <p className="region-detail-description">
                행사에 참여한 사람들이 남긴 사진과 현장 기록을 갤러리형으로 보여주는 영역입니다.
              </p>
            </div>

            <div className="region-detail-photo-meta">
              <span className="region-detail-photo-count">
                총 {photoItems.length}장
              </span>
              <span className="region-detail-photo-count">
                {photoPage} / {photoPageCount} 페이지
              </span>
            </div>
          </div>

          {photoItems.length > 0 ? (
            <>
              <div className="region-detail-photo-grid">
                {pagedPhotoItems.map((item) => (
                  <PhotoGalleryCard
                    key={item?.id ?? item?.title}
                    item={item}
                    fallbackImage={heroImage}
                  />
                ))}
              </div>

              {photoPageCount > 1 ? (
                <div
                  className="region-detail-pagination"
                  aria-label="참여 사진 페이지네이션"
                >
                  <button
                    type="button"
                    className="region-detail-page-button"
                    onClick={() => setPhotoPage((prev) => Math.max(1, prev - 1))}
                    disabled={photoPage === 1}
                  >
                    이전
                  </button>

                  {Array.from(
                    { length: photoPageCount },
                    (_, index) => index + 1
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`region-detail-page-button${
                        pageNumber === photoPage ? " is-active" : ""
                      }`}
                      onClick={() => setPhotoPage(pageNumber)}
                      aria-current={
                        pageNumber === photoPage ? "page" : undefined
                      }
                    >
                      {pageNumber}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="region-detail-page-button"
                    onClick={() =>
                      setPhotoPage((prev) => Math.min(photoPageCount, prev + 1))
                    }
                    disabled={photoPage === photoPageCount}
                  >
                    다음
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="region-detail-photo-empty">
              <SectionEmptyCard
                title="참여 사진 준비중"
                summary="사용자 사진 데이터가 연결되면 이 영역에 표시됩니다."
              />
            </div>
          )}
        </section>

        <section className="region-detail-events region-detail-post-section">
          <div className="region-detail-section-head">
            <p className="region-detail-section-label">PARTICIPANT POSTS</p>
            <h3>후기 / 참여글</h3>
            <p className="region-detail-description">
              홈페이지 상세페이지에서는 후기와 참여글을 일부만 미리 보여주고,
              전체 목록은 전용 페이지에서 이어서 볼 수 있도록 구성합니다.
            </p>
          </div>

          <div className="region-detail-event-grid">
            {previewPostItems.length > 0 ? (
              previewPostItems.map((item) => (
                <PostCard
                  key={item?.id ?? item?.title}
                  item={item}
                  onClick={handleGoPostsPage}
                />
              ))
            ) : (
              <SectionEmptyCard
                title="후기 / 참여글 준비중"
                summary="사용자 후기와 참여글 데이터가 연결되면 이 영역에 표시됩니다."
              />
            )}
          </div>

          <div className="region-detail-post-actions">
            <button
              type="button"
              className="region-detail-more-button"
              onClick={handleGoPostsPage}
            >
              후기 더보기
            </button>
          </div>
        </section>

        {hasAnnouncementSection ? (
          <section className="region-detail-events">
            <div className="region-detail-section-head">
              <p className="region-detail-section-label">ANNOUNCEMENT</p>
              <h3>발표</h3>
              <p className="region-detail-description">
                발표 정보가 실제로 연결된 경우에만 이 영역이 노출됩니다.
              </p>
            </div>

            <div className="region-detail-event-grid">
              {announcementItems.map((item) => (
                <AnnouncementCard
                  key={item?.id ?? item?.title}
                  item={item}
                  fallbackTitle={`${item?.sourceEventTitle ?? "관광이벤트"} 발표`}
                />
              ))}
            </div>
          </section>
        ) : null}

        {hasWinnersSection ? (
          <section className="region-detail-events">
            <div className="region-detail-section-head">
              <p className="region-detail-section-label">FEATURED WORKS</p>
              <h3>당선작</h3>
              <p className="region-detail-description">
                당선작 데이터가 연결된 경우에만 이 영역이 노출됩니다.
              </p>
            </div>

            <div className="region-detail-event-grid">
              {winnerItems.map((item) => (
                <FeaturedWorkCard
                  key={item?.id ?? item?.title}
                  item={item}
                  fallbackImage={heroImage}
                  fallbackTitle={`${item?.sourceEventTitle ?? "관광이벤트"} 당선작`}
                />
              ))}
            </div>
          </section>
        ) : null}

        {hasInterviewsSection ? (
          <section className="region-detail-events">
            <div className="region-detail-section-head">
              <p className="region-detail-section-label">INTERVIEW</p>
              <h3>인터뷰</h3>
              <p className="region-detail-description">
                인터뷰 데이터가 연결된 경우에만 이 영역이 노출됩니다.
              </p>
            </div>

            <div className="region-detail-event-grid">
              {interviewItems.map((item) => (
                <InterviewCard
                  key={item?.id ?? item?.title}
                  item={item}
                  fallbackTitle={`${item?.sourceEventTitle ?? "관광이벤트"} 인터뷰`}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="region-detail-courses">
          <div className="region-detail-section-head">
            <p className="region-detail-section-label">RECOMMENDED COURSE</p>
            <h3>{region?.courseSection?.title ?? "추천 코스"}</h3>
            <p className="region-detail-description">
              {region?.courseSection?.description ??
                "이 지역을 더 편하게 둘러볼 수 있도록 추천 동선을 함께 안내합니다."}
            </p>
          </div>

          <div className="region-detail-course-list">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={course?.id ?? course?.title ?? `course-${index}`}
                  className="region-detail-course-item"
                >
                  <span className="region-detail-course-number">
                    코스 {index + 1}
                  </span>
                  <p>
                    <strong>{normalizeCourseTitle(course, index)}</strong>
                    <br />
                    {normalizeCourseSummary(course)}
                  </p>
                </div>
              ))
            ) : (
              <div className="region-detail-course-item">
                <span className="region-detail-course-number">안내</span>
                <p>추천 코스 정보가 연결되면 이 영역에 표시됩니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}