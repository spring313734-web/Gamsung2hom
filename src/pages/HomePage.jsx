// 파일 경로: src/pages/HomePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 메인 홈 화면
// - 명함 QR / 홈페이지 첫 방문자를 위한 간단 랜딩 화면
// - 큰 대표 이미지와 핵심 설명을 먼저 보여줌
// - 아래에는 짧은 안내 카드만 배치해서 너무 길지 않게 구성
// - 문의하기 이동은 제거하고 제휴문의는 /partner 안에서 처리
// - 자세한 설명은 감성여행2 소개 / 감성배달 소개 / 이벤트 / 제휴문의 페이지로 이동
// ========================================

import { Link } from "react-router-dom";
import "./HomePage.css";

const HOME_GUIDE_CARDS = [
  {
    title: "여행자",
    description:
      "내 주변 여행지, 축제, 관광이벤트를 찾고 나만의 여행과 버킷리스트로 담을 수 있습니다.",
  },
  {
    title: "감성친구",
    description:
      "가족, 친구, 연인, 회사동료와 여행 계획과 추억을 관계별로 공유하는 연결 기능입니다.",
  },
  {
    title: "소상공인",
    description:
      "지역 상권, 미니홈피, 감성배달 연결을 통해 여행자와 동네 가게를 자연스럽게 이어줍니다.",
  },
  {
    title: "지자체",
    description:
      "지역축제와 관광이벤트 반응 데이터를 바탕으로 효율적인 관광정책과 지역상생을 준비할 수 있습니다.",
  },
];

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-darken">
          <div className="hero-inner">
            <p className="hero-badge">여행 · 친구 · 지역상권을 잇는 플랫폼</p>

            <h1 className="hero-title">
              <span className="hero-title-brand">
                <span className="hero-title-text">감성여행</span>
                <span className="hero-title-number">2</span>
              </span>
              <br />
              여행을 데이터로, 지역을 기회로, 사람을 연결로
            </h1>

            <p className="hero-description">
              감성여행2는 내 주변 여행지, 지역축제, 관광이벤트, 나만의 여행코스,
              버킷리스트, 감성친구, 지역상권, 감성배달을 하나로 연결하는
              지역상생 여행 플랫폼입니다.
            </p>

            <div className="hero-actions">
              <Link to="/about" className="primary-btn">
                감성여행2 자세히 보기
              </Link>

              <Link to="/delivery-about" className="secondary-btn">
                감성배달 보기
              </Link>

              <Link to="/partner" className="secondary-btn">
                입점·제휴 문의
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-platform-section">
        <div className="home-platform-inner">
          <div className="home-platform-head">
            <p className="home-platform-label">GAMSUNG PLATFORM</p>
            <h2>감성여행2는 여행자와 지역을 짧고 쉽게 연결합니다</h2>
            <p>
              홈 화면에서는 핵심만 간단히 보여주고, 자세한 내용은 상단 메뉴와
              버튼을 통해 각 페이지에서 확인할 수 있도록 정리했습니다.
            </p>
          </div>

          <div className="home-platform-grid">
            {HOME_GUIDE_CARDS.map((item) => (
              <article key={item.title} className="home-platform-card">
                <div className="home-platform-icon">✦</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <div className="home-event-hub-actions">
            <Link to="/events" className="hub-primary-link">
              이벤트 허브 보기
            </Link>

            <Link to="/partner" className="hub-secondary-link">
              입점·제휴 문의
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}