// 파일 경로: src/components/RegionCardGrid.jsx
// ========================================
// 📌 감성여행2 지역 카드 그리드 컴포넌트
// - 지역별 이벤트 허브 진입용 카드 목록 출력
// - 카드 전체 클릭 시 지역 상세 허브 페이지로 이동
// - hover / focus / 접근성 구조 포함
// - regions 데이터가 비정상이어도 화면이 깨지지 않도록 방어 처리
// ========================================

import { Link } from "react-router-dom";
import "./RegionCardGrid.css";

export default function RegionCardGrid({
  title,
  description,
  regions = [],
}) {
  const safeRegions = Array.isArray(regions) ? regions : [];

  return (
    <section className="region-card-section">
      <div className="region-card-section-head">
        {title ? <h2>{title}</h2> : null}
        {description ? <p>{description}</p> : null}
      </div>

      <div className="region-card-grid">
        {safeRegions.length > 0 ? (
          safeRegions.map((region, index) => {
            const slug = region?.slug ?? `region-${index}`;
            const name = region?.name ?? "지역 준비중";
            const badge = region?.badge ?? "EVENT";
            const eventCount = region?.eventCount ?? 0;
            const cardDescription =
              region?.description ?? "이벤트 정보 준비중입니다.";
            const image =
              region?.image ??
              "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

            return (
              <Link
                key={slug}
                to={`/events/region/${slug}`}
                className="region-card"
                aria-label={`${name} 이벤트 허브로 이동`}
              >
                <div
                  className="region-card-image"
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                />
                <div className="region-card-body">
                  <div className="region-card-top">
                    <span className="region-card-badge">{badge}</span>
                    <span className="region-card-count">
                      이벤트 {eventCount}개
                    </span>
                  </div>

                  <h3>{name}</h3>
                  <p>{cardDescription}</p>

                  <span className="region-card-link">
                    지역 허브 보러가기 →
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <article className="region-card">
            <div
              className="region-card-image"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80)",
              }}
            />
            <div className="region-card-body">
              <div className="region-card-top">
                <span className="region-card-badge">EVENT</span>
                <span className="region-card-count">준비중</span>
              </div>

              <h3>지역 이벤트 허브 준비중</h3>
              <p>지역별 이벤트 허브 데이터가 아직 연결되지 않았습니다.</p>

              <span className="region-card-link">곧 업데이트됩니다</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}