// 파일 경로: src/pages/HomePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 메인 홈 화면
// - 명함 QR / 홈페이지 첫 방문자를 위한 설득형 랜딩 화면
// - 감성여행2를 단순 여행앱이 아닌 지역상생 플랫폼으로 소개
// - 감성친구 / 나만의 여행 / 지역축제 / 감성배달 연결 흐름 강조
// - 주요 이동 버튼과 이벤트 허브 진입 섹션 제공
// - 대표 지역 빠른 진입 카드로 /events 흐름을 자연스럽게 연결
// ========================================

import { Link } from "react-router-dom";
import "./HomePage.css";

const FEATURED_REGIONS = [
  {
    slug: "seoul",
    name: "서울",
    badge: "특별시",
    description: "전시, 야시장, 도심 산책 이벤트를 한 번에 이어서 보는 감성 허브",
  },
  {
    slug: "busan",
    name: "부산",
    badge: "광역시",
    description: "바다, 야경, 공연 중심의 대표 지역 이벤트를 빠르게 확인하는 허브",
  },
  {
    slug: "jeju",
    name: "제주",
    badge: "도",
    description: "바다, 힐링, 감성 산책 흐름으로 이어지는 제주 대표 이벤트 허브",
  },
  {
    slug: "sejong",
    name: "세종",
    badge: "특별자치시",
    description: "호수공원과 가족형 이벤트를 중심으로 보는 도심형 감성 허브",
  },
];

const PLATFORM_POINTS = [
  {
    title: "여행을 장보듯이 담다",
    description:
      "마음에 드는 관광지, 축제, 이벤트, 상권 정보를 나만의 여행과 버킷에 담아 코스를 만들 수 있습니다.",
  },
  {
    title: "가족과 친구가 함께하다",
    description:
      "감성친구를 통해 가족, 친구, 연인, 회사동료와 여행 계획과 추억을 관계별로 공유할 수 있습니다.",
  },
  {
    title: "지역상권과 연결되다",
    description:
      "지도를 열면 주변 상권이 함께 보이고, 향후 가입한 소상공인은 미니홈피와 예약 정보로 연결됩니다.",
  },
  {
    title: "지자체 데이터로 확장되다",
    description:
      "사용자의 버킷, 관심 여행지, 이벤트 반응은 지역 관광정책과 예산 집행에 필요한 실증 데이터가 될 수 있습니다.",
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
              감성여행2는 단순히 관광지를 보여주는 앱이 아닙니다. 내 주변 여행지,
              지역축제, 관광이벤트, 나만의 여행코스, 버킷리스트, 감성친구,
              지역상권, 감성배달까지 하나로 연결하는 지역상생 여행 플랫폼입니다.
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
            <h2>감성여행2는 여행자와 지역을 함께 키우는 플랫폼입니다</h2>
            <p>
              여행자는 더 쉽게 찾고, 담고, 공유하고, 지역은 관심과 참여 데이터를
              통해 더 효율적인 관광과 상권 활성화를 준비할 수 있습니다.
            </p>
          </div>

          <div className="home-platform-grid">
            {PLATFORM_POINTS.map((item) => (
              <article key={item.title} className="home-platform-card">
                <div className="home-platform-icon">✦</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-event-hub-section">
        <div className="home-event-hub-inner">
          <div className="home-event-hub-head">
            <p className="home-event-hub-label">EVENT HUB</p>
            <h2>내 주변과 원하는 지역의 축제·관광이벤트를 한눈에</h2>
            <p>
              감성여행2는 현재 위치를 기준으로 내 주변 이벤트를 확인할 수 있고,
              전국 지역 선택을 통해 다른 지역의 축제와 관광이벤트도 미리 둘러볼
              수 있도록 준비하고 있습니다.
            </p>

            <div className="home-event-hub-actions">
              <Link to="/events" className="hub-primary-link">
                전체 이벤트 허브 보러가기
              </Link>
              <Link to="/about" className="hub-secondary-link">
                감성여행2 사용법 보기
              </Link>
            </div>
          </div>

          <div className="home-featured-region-grid">
            {FEATURED_REGIONS.map((region) => (
              <Link
                key={region.slug}
                to={`/events/region/${region.slug}`}
                className="home-featured-region-card"
                aria-label={`${region.name} 이벤트 허브로 이동`}
              >
                <div className="home-featured-region-top">
                  <span className="home-featured-region-badge">
                    {region.badge}
                  </span>
                </div>

                <h3>{region.name}</h3>
                <p>{region.description}</p>

                <span className="home-featured-region-link">
                  지역 상세 허브 보기 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta-section">
        <div className="home-cta-card">
          <p className="home-cta-label">START TOGETHER</p>
          <h2>우리 지역에서 먼저 시작해보고 싶으신가요?</h2>
          <p>
            감성여행2는 초기 참여 소상공인과 협력 지자체를 모집하며,
            지역축제·관광이벤트·주변상권을 함께 연결하는 시범 운영을 준비하고
            있습니다.
          </p>

          <div className="home-cta-actions">
            <Link to="/partner" className="primary-btn">
              소상공인·지자체 제휴 문의
            </Link>
            <Link to="/contact" className="secondary-dark-btn">
              문의하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}