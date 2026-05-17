// 파일 경로: src/pages/GovDashboardPage.jsx
// ========================================
// 📌 감성여행2 지자체 관리자 대시보드
// - 지자체 / 기관 로그인 후 이동하는 첫 화면
// - 축제 등록 / 관광이벤트 등록 / 등록 콘텐츠 관리 진입 자리 제공
// - 다음 단계에서 gov_contents(지자체 콘텐츠 정보)와 연결 예정
// ========================================

import { Link } from "react-router-dom";

export default function GovDashboardPage() {
  return (
    <section style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.hero}>
          <p style={styles.badge}>지자체 / 기관 관리자</p>

          <h1 style={styles.title}>
            함양군청 관리자 화면에
            <br />
            정상 접속되었습니다
          </h1>

          <p style={styles.desc}>
            이 화면은 지자체가 지역 축제, 관광이벤트, 참여 콘텐츠를 등록하고
            관리하는 공간입니다. 다음 단계에서 실제 등록 폼과 목록을 연결하면
            됩니다.
          </p>
        </div>

        <div style={styles.grid}>
          <article style={styles.card}>
            <p style={styles.cardIcon}>🎉</p>
            <h2 style={styles.cardTitle}>지역 축제 등록</h2>
            <p style={styles.cardText}>
              축제명, 기간, 장소, 소개글, 대표 이미지를 등록하는 화면으로
              연결할 예정입니다.
            </p>
            <button type="button" style={styles.disabledButton}>
              준비중
            </button>
          </article>

          <article style={styles.card}>
            <p style={styles.cardIcon}>📍</p>
            <h2 style={styles.cardTitle}>관광이벤트 등록</h2>
            <p style={styles.cardText}>
              지자체가 만든 관광 이벤트, 인증 미션, 방문 혜택 정보를 등록하는
              화면으로 연결할 예정입니다.
            </p>
            <button type="button" style={styles.disabledButton}>
              준비중
            </button>
          </article>

          <article style={styles.card}>
            <p style={styles.cardIcon}>📋</p>
            <h2 style={styles.cardTitle}>등록 콘텐츠 관리</h2>
            <p style={styles.cardText}>
              이미 등록한 축제와 관광이벤트를 수정, 숨김, 종료 처리하는 관리
              화면입니다.
            </p>
            <button type="button" style={styles.disabledButton}>
              준비중
            </button>
          </article>
        </div>

        <div style={styles.notice}>
          <strong>다음 작업 안내</strong>
          <p>
            이제 로그인 연결은 성공했으니, 다음에는
            <b> 지자체 축제 / 관광이벤트 등록 화면</b>을 만들고
            <b> gov_contents(지자체 콘텐츠 정보)</b> 테이블에 저장되도록
            연결하면 됩니다.
          </p>
        </div>

        <div style={styles.actions}>
          <Link to="/" style={styles.linkButton}>
            홈으로 이동
          </Link>
          <Link to="/events" style={styles.linkButtonAlt}>
            이벤트 화면 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 88px)",
    padding: "72px 20px 96px",
    background:
      "radial-gradient(circle at top left, rgba(255, 197, 86, 0.18), transparent 34%), radial-gradient(circle at top right, rgba(112, 101, 240, 0.16), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #fffaf3 100%)",
  },
  wrap: {
    width: "min(1100px, 100%)",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    marginBottom: "34px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 0 16px",
    padding: "9px 18px",
    borderRadius: "999px",
    background: "#eef3ff",
    color: "#3456bd",
    fontSize: "13px",
    fontWeight: 900,
  },
  title: {
    margin: 0,
    color: "#192434",
    fontSize: "clamp(34px, 5vw, 54px)",
    lineHeight: 1.15,
    letterSpacing: "-0.06em",
  },
  desc: {
    width: "min(760px, 100%)",
    margin: "18px auto 0",
    color: "#526276",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.75,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },
  card: {
    minHeight: "260px",
    padding: "26px",
    border: "1px solid rgba(106, 88, 68, 0.12)",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.94)",
    boxShadow: "0 20px 54px rgba(31, 41, 55, 0.08)",
  },
  cardIcon: {
    margin: "0 0 14px",
    fontSize: "38px",
  },
  cardTitle: {
    margin: "0 0 12px",
    color: "#1f2937",
    fontSize: "22px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  cardText: {
    margin: "0 0 22px",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.65,
  },
  disabledButton: {
    width: "100%",
    minHeight: "46px",
    border: 0,
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "not-allowed",
  },
  notice: {
    marginTop: "22px",
    padding: "22px 24px",
    borderRadius: "24px",
    background: "#fff7ed",
    color: "#7c2d12",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "28px",
    flexWrap: "wrap",
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "0 22px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #6a5bd6, #ff8b4a)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 900,
    textDecoration: "none",
  },
  linkButtonAlt: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "0 22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#3456bd",
    border: "1px solid #dbe3f4",
    fontSize: "15px",
    fontWeight: 900,
    textDecoration: "none",
  },
};