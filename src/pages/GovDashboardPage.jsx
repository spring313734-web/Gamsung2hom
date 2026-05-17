// 파일 경로: src/pages/GovDashboardPage.jsx
// ========================================
// 📌 감성여행2 지자체 관리자 대시보드
// - 지자체 / 기관 로그인 후 이동하는 첫 화면
// - 지역 축제 등록 / 관광이벤트 등록 / 등록 콘텐츠 관리로 이동
// - 지자체 담당자가 무엇을 해야 하는지 사용 순서 안내
// - gov_contents(지자체 콘텐츠 정보) 등록 화면과 목록 화면으로 연결
// ========================================

import { Link } from "react-router-dom";

export default function GovDashboardPage() {
  return (
    <section style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.hero}>
          <p style={styles.badge}>지자체 / 기관 관리자</p>

          <h1 style={styles.title}>
            지자체 관리자 화면에
            <br />
            정상 접속되었습니다
          </h1>

          <p style={styles.desc}>
            이곳에서 지역 축제와 관광이벤트를 등록하고, 등록한 콘텐츠를 관리할
            수 있습니다. 아래 버튼을 눌러 바로 등록을 시작하세요.
          </p>
        </div>

        <div style={styles.grid}>
          <article style={styles.card}>
            <p style={styles.cardIcon}>🎉</p>
            <h2 style={styles.cardTitle}>지역 축제 등록</h2>
            <p style={styles.cardText}>
              축제명, 기간, 장소, 주소, 소개글을 입력해서 지역 축제 정보를
              등록합니다.
            </p>
            <Link
              to="/gov/contents/new?type=festival"
              style={styles.primaryButton}
            >
              축제 등록하기
            </Link>
          </article>

          <article style={styles.card}>
            <p style={styles.cardIcon}>📍</p>
            <h2 style={styles.cardTitle}>관광이벤트 등록</h2>
            <p style={styles.cardText}>
              관광지 방문 이벤트, 인증 미션, 참여 혜택 같은 지자체 관광
              이벤트를 등록합니다.
            </p>
            <Link
              to="/gov/contents/new?type=tour_event"
              style={styles.primaryButton}
            >
              관광이벤트 등록하기
            </Link>
          </article>

          <article style={styles.card}>
            <p style={styles.cardIcon}>📋</p>
            <h2 style={styles.cardTitle}>등록 콘텐츠 관리</h2>
            <p style={styles.cardText}>
              이미 등록한 축제와 관광이벤트를 확인하고, 이후 수정·숨김·종료
              처리를 할 수 있습니다.
            </p>
            <Link to="/gov/contents" style={styles.primaryButton}>
              등록 콘텐츠 보기
            </Link>
          </article>
        </div>

        <div style={styles.notice}>
          <strong>사용 순서</strong>
          <ol style={styles.noticeList}>
            <li>지역 축제 또는 관광이벤트 등록 버튼을 누릅니다.</li>
            <li>제목, 지역, 주소, 기간, 소개글을 입력합니다.</li>
            <li>등록한 내용은 등록 콘텐츠 관리에서 다시 확인합니다.</li>
            <li>
              다음 단계에서 대표 이미지, 상세 이미지, 노출 여부, 수정 기능을
              연결하면 됩니다.
            </li>
          </ol>
        </div>

        <div style={styles.actions}>
          <Link to="/gov/contents" style={styles.linkButton}>
            내가 등록한 콘텐츠 보기
          </Link>
          <Link to="/events" style={styles.linkButtonAlt}>
            홈페이지 이벤트 화면 보기
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
    minHeight: "270px",
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
    minHeight: "74px",
    margin: "0 0 22px",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.65,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: "48px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #6a5bd6, #ff8b4a)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 900,
    textDecoration: "none",
    boxShadow: "0 14px 28px rgba(105, 91, 214, 0.2)",
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
  noticeList: {
    margin: "10px 0 0",
    paddingLeft: "22px",
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
    background: "#1f2937",
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