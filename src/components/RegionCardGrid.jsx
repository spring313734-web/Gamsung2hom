// 파일 경로: src/components/RegionCardGrid.jsx
// ========================================
// 📌 감성여행2 지역 카드 그리드 컴포넌트
// - 지역별 이벤트 허브 진입용 카드 목록 출력
// - 카드 전체 클릭 시 지역 상세 허브 페이지로 이동
// - hover / focus / 접근성 구조 포함
// - regions 데이터가 비정상이어도 화면이 깨지지 않도록 방어 처리
// - 제목 / 설명이 없으면 헤더 영역은 렌더링하지 않음
// - 공지 / 후기 / 사진 / 최근 업데이트 요약을 선택적으로 표시
// - 단일 카드 그룹 전용 gridClassName을 다시 지원하도록 복구
// ========================================

import { Link } from "react-router-dom";
import "./RegionCardGrid.css";

function toSafeCount(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function getEventCount(region) {
  return toSafeCount(region?.eventCount ?? region?.totalEventCount);
}

function buildMetaItems(region) {
  const noticeCount = toSafeCount(region?.noticeCount);
  const userPostCount = toSafeCount(region?.userPostCount);
  const photoCount = toSafeCount(region?.photoCount);
  const latestUpdateLabel = toSafeText(region?.latestUpdateLabel);

  const items = [];

  if (noticeCount > 0) {
    items.push({
      key: "notice",
      label: `공지 ${noticeCount}개`,
      tone: "primary",
    });
  }

  if (userPostCount > 0) {
    items.push({
      key: "post",
      label: `후기 ${userPostCount}개`,
      tone: "neutral",
    });
  }

  if (photoCount > 0) {
    items.push({
      key: "photo",
      label: `사진 ${photoCount}장`,
      tone: "neutral",
    });
  }

  if (latestUpdateLabel) {
    items.push({
      key: "latest",
      label: latestUpdateLabel,
      tone: "accent",
    });
  }

  return items;
}

export default function RegionCardGrid({
  title,
  description,
  regions = [],
  gridClassName = "",
}) {
  const safeRegions = Array.isArray(regions) ? regions : [];
  const hasSectionHead = Boolean(title || description);
  const gridClassNames = ["region-card-grid", gridClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="region-card-section">
      {hasSectionHead ? (
        <div className="region-card-section-head">
          {title ? <h2>{title}</h2> : null}
          {description ? <p>{description}</p> : null}
        </div>
      ) : null}

      <div className={gridClassNames}>
        {safeRegions.length > 0 ? (
          safeRegions.map((region, index) => {
            const slug = toSafeText(region?.slug, `region-${index}`);
            const name = toSafeText(region?.name, "지역 준비중");
            const badge = toSafeText(region?.badge, "EVENT HUB");
            const eventCount = getEventCount(region);
            const countText = toSafeText(
              region?.countText,
              `이벤트 ${eventCount}개`
            );
            const cardDescription = toSafeText(
              region?.shortDescription,
              toSafeText(
                region?.description,
                "지역별 대표 축제와 관광이벤트 정보를 준비중입니다."
              )
            );
            const image = toSafeText(
              region?.image,
              "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80"
            );

            const metaItems = buildMetaItems(region);

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
                    <span className="region-card-count">{countText}</span>
                  </div>

                  <h3>{name}</h3>
                  <p>{cardDescription}</p>

                  {metaItems.length > 0 ? (
                    <div style={styles.metaWrap}>
                      {metaItems.map((item) => (
                        <span
                          key={`${slug}-${item.key}`}
                          style={{
                            ...styles.metaChip,
                            ...(item.tone === "primary"
                              ? styles.metaChipPrimary
                              : item.tone === "accent"
                              ? styles.metaChipAccent
                              : styles.metaChipNeutral),
                          }}
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="region-card-link">
                    지역 상세 허브 보기 →
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
                <span className="region-card-badge">EVENT HUB</span>
                <span className="region-card-count">준비중</span>
              </div>

              <h3>지역 이벤트 허브 준비중</h3>
              <p>
                지역별 대표 축제와 관광이벤트 데이터가 아직 연결되지
                않았습니다.
              </p>

              <span className="region-card-link">곧 업데이트됩니다</span>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

const styles = {
  metaWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
    marginBottom: "8px",
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "28px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.82rem",
    fontWeight: 800,
  },
  metaChipPrimary: {
    background: "rgba(37, 99, 235, 0.08)",
    color: "#2563eb",
  },
  metaChipNeutral: {
    background: "rgba(15, 23, 42, 0.06)",
    color: "#334155",
  },
  metaChipAccent: {
    background: "rgba(234, 179, 8, 0.12)",
    color: "#a16207",
  },
};