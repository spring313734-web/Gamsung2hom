// 파일 경로: src/pages/EventHubPage.jsx
// ========================================
// 📌 감성여행2 이벤트 허브 메인 페이지
// - 지역별 이벤트 허브 메인 목록 출력
// - 특별시 / 광역시 / 특별자치시 / 도 단위로 그룹화
// - 각 지역 카드는 상세 이벤트 허브 페이지로 이동
// - regionEvents 공통 데이터의 regionType 기준으로 화면 구성
// ========================================

import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { getRegionEventData } from "../data/regionEvents";

const REGION_GROUPS = [
  { key: "special_city", label: "특별시" },
  { key: "metropolitan_city", label: "광역시" },
  { key: "special_self_governing_city", label: "특별자치시" },
  { key: "province", label: "도" },
];

export default function EventHubPage() {
  const regions = getRegionEventData();

  const groupedRegions = REGION_GROUPS.map((group) => ({
    ...group,
    items: regions.filter((region) => region.regionType === group.key),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        badge="EVENT HUB"
        title="지역별 이벤트 허브"
        description="특별시, 광역시, 특별자치시, 도 단위로 지역별 대표 이벤트와 추천 코스를 한눈에 보고 감성여행2 여행 흐름으로 자연스럽게 이어보세요."
        backgroundImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
      />

      <div style={styles.page}>
        <section style={styles.introSection}>
          <p style={styles.sectionLabel}>EVENT HUB MAIN</p>
          <h2 style={styles.title}>행정구역별 이벤트 허브</h2>
          <p style={styles.description}>
            이벤트 허브를 특별시, 광역시, 특별자치시, 도 기준으로 나누어
            보기 쉽게 정리했습니다. 원하는 지역을 선택하면 상세 허브로
            이동합니다.
          </p>
        </section>

        {groupedRegions.map((group) => (
          <section key={group.key} style={styles.groupSection}>
            <div style={styles.groupHeader}>
              <p style={styles.groupLabel}>{group.label}</p>
              <h3 style={styles.groupTitle}>{group.label} 이벤트 허브</h3>
            </div>

            <div style={styles.grid}>
              {group.items.map((region) => (
                <article key={region.slug} style={styles.card}>
                  <div
                    style={{
                      ...styles.cardImage,
                      backgroundImage: `url(${region.heroImage || region.image})`,
                    }}
                  />
                  <div style={styles.cardBody}>
                    <p style={styles.badge}>{region.badge}</p>
                    <h4 style={styles.cardTitle}>{region.name} 이벤트 허브</h4>
                    <p style={styles.cardDescription}>
                      {region.shortDescription}
                    </p>

                    <div style={styles.metaRow}>
                      <span style={styles.metaChip}>
                        이벤트 {region.eventCount}개
                      </span>
                      {Array.isArray(region.tags) && region.tags.length > 0 ? (
                        <span style={styles.metaChip}>#{region.tags[0]}</span>
                      ) : null}
                    </div>

                    <Link
                      to={`/events/region/${region.slug}`}
                      style={styles.linkButton}
                    >
                      전체 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "56px 24px 80px",
  },
  introSection: {
    marginBottom: "40px",
  },
  sectionLabel: {
    margin: "0 0 10px",
    color: "#2563eb",
    fontSize: "0.84rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
  },
  title: {
    margin: "0 0 14px",
    color: "#0f172a",
    fontSize: "2rem",
    lineHeight: 1.3,
  },
  description: {
    margin: 0,
    color: "#475569",
    fontSize: "1rem",
    lineHeight: 1.8,
  },
  groupSection: {
    marginBottom: "42px",
  },
  groupHeader: {
    marginBottom: "18px",
  },
  groupLabel: {
    margin: "0 0 8px",
    color: "#2563eb",
    fontSize: "0.82rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
  },
  groupTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "1.55rem",
    lineHeight: 1.3,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },
  card: {
    overflow: "hidden",
    borderRadius: "24px",
    background: "#ffffff",
    border: "1px solid rgba(15, 23, 42, 0.07)",
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  },
  cardImage: {
    width: "100%",
    height: "220px",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  cardBody: {
    padding: "22px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "34px",
    margin: "0 0 14px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(37, 99, 235, 0.1)",
    color: "#2563eb",
    fontSize: "0.84rem",
    fontWeight: 800,
  },
  cardTitle: {
    margin: "0 0 10px",
    color: "#0f172a",
    fontSize: "1.3rem",
    lineHeight: 1.4,
  },
  cardDescription: {
    margin: "0 0 16px",
    color: "#64748b",
    fontSize: "0.97rem",
    lineHeight: 1.7,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "18px",
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: "32px",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "#f8fafc",
    color: "#334155",
    fontSize: "0.84rem",
    fontWeight: 700,
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "44px",
    padding: "10px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "0.95rem",
    fontWeight: 800,
  },
};