// 파일 경로: src/pages/RegionEventHubDetailPage.jsx
// ========================================
// 📌 감성여행2 지역별 이벤트 허브 상세 페이지
// - URL slug 기준 지역 데이터 조회
// - 지역 소개 / 대표 태그 / 추천 이벤트 / 추천 코스 출력
// - 존재하지 않는 지역은 안내 메시지 출력
// - 배열 데이터가 비어 있어도 화면이 깨지지 않도록 방어 처리
// - 전체 지역 다시 보기 버튼은 navigate 방식으로 안정화
// ========================================

import { Link, useNavigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero";
import { getRegionBySlug } from "../data/regionEvents";
import "./RegionEventHubDetailPage.css";

export default function RegionEventHubDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const region = getRegionBySlug(slug);

  function handleGoEventsHub() {
    navigate("/events");
  }

  if (!region) {
    return (
      <div className="region-detail-page">
        <div className="region-detail-empty">
          <p className="region-detail-empty-badge">EVENT HUB</p>
          <h1>지역 정보를 찾을 수 없습니다.</h1>
          <p>선택한 지역 허브 정보가 아직 준비되지 않았거나 주소가 잘못되었습니다.</p>
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

  const tags = Array.isArray(region.tags) ? region.tags : [];
  const events = Array.isArray(region.events) ? region.events : [];
  const courses = Array.isArray(region.courses) ? region.courses : [];

  return (
    <>
      <PageHero
        badge={region.badge ?? "EVENT"}
        title={`${region.name ?? "지역"} 이벤트 허브`}
        description={region.heroDescription ?? "지역 이벤트 정보를 준비중입니다."}
        backgroundImage={
          region.image ??
          "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80"
        }
      />

      <div className="region-detail-page">
        <section className="region-detail-intro">
          <div className="region-detail-title-row">
            <div className="region-detail-title-copy">
              <p className="region-detail-section-label">REGION OVERVIEW</p>
              <h2>{region.name ?? "지역"}에서 지금 즐기기 좋은 이벤트</h2>
            </div>

            <button
              type="button"
              className="region-detail-back-button"
              onClick={handleGoEventsHub}
            >
              전체 지역 다시 보기
            </button>
          </div>

          <p className="region-detail-description">
            {region.heroDescription ?? "지역 이벤트 정보를 준비중입니다."}
          </p>

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
            <p className="region-detail-section-label">RECOMMENDED EVENTS</p>
            <h3>추천 이벤트</h3>
          </div>

          <div className="region-detail-event-grid">
            {events.length > 0 ? (
              events.map((event) => (
                <article
                  key={`${event.title}-${event.period}`}
                  className="region-detail-event-card"
                >
                  <p className="region-detail-event-period">
                    {event.period ?? "일정 준비중"}
                  </p>
                  <h4>{event.title ?? "이벤트 준비중"}</h4>
                  <p className="region-detail-event-place">
                    {event.place ?? "장소 준비중"}
                  </p>
                  <p className="region-detail-event-summary">
                    {event.summary ?? "상세 설명 준비중입니다."}
                  </p>
                </article>
              ))
            ) : (
              <article className="region-detail-event-card">
                <p className="region-detail-event-period">안내</p>
                <h4>추천 이벤트 준비중</h4>
                <p className="region-detail-event-place">업데이트 예정</p>
                <p className="region-detail-event-summary">
                  해당 지역의 상세 이벤트 정보는 곧 추가될 예정입니다.
                </p>
              </article>
            )}
          </div>
        </section>

        <section className="region-detail-courses">
          <div className="region-detail-section-head">
            <p className="region-detail-section-label">TRAVEL COURSE</p>
            <h3>함께 가기 좋은 추천 코스</h3>
          </div>

          <div className="region-detail-course-list">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div
                  key={`${course}-${index}`}
                  className="region-detail-course-item"
                >
                  <span className="region-detail-course-number">추천</span>
                  <p>{course}</p>
                </div>
              ))
            ) : (
              <div className="region-detail-course-item">
                <span className="region-detail-course-number">안내</span>
                <p>추천 코스 정보를 준비중입니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}