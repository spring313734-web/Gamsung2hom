// 파일 경로: src/pages/HomePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 메인 홈 화면
// - 명함 QR / 첫 방문자가 감성여행2의 핵심을 바로 이해할 수 있도록 구성
// - 감성여행2 = 여행 / 감성친구 / 지역축제 / 관광이벤트 / 상권 / 감성배달 연결 플랫폼으로 설명
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
    title: "여행을 장보듯이 담는 구조",
    description:
      "관광지, 축제, 이벤트, 주변 상권을 마음에 드는 순서대로 나만의 여행과 버킷에 담아 코스를 만들 수 있습니다.",
  },
  {
    title: "감성친구와 함께하는 여행",
    description:
      "가족, 친구, 연인, 회사동료, 직접 만든 그룹과 여행·버킷·앨범·위치공유를 관계에 맞게 나눌 수 있습니다.",
  },
  {
    title: "지역축제와 관광이벤트 연결",
    description:
      "내 주변 또는 선택한 지역의 축제와 관광이벤트를 확인하고, 관심 있는 장소를 여행 계획으로 이어갈 수 있습니다.",
  },
  {
    title: "지도에서 상권까지 함께 확인",
    description:
      "지도를 열면 주변 여행지와 상권을 함께 볼 수 있고, 향후 가입 소상공인의 미니홈피와 예약 정보까지 연결됩니다.",
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
              감성여행2는 단순히 관광지를 보여주는 앱이 아닙니다. 내 주변
              여행지, 지역축제, 관광이벤트, 나만의 여행코스, 버킷리스트,
              감성친구, 지역상권, 감성배달까지 하나로 연결하는 지역상생 여행
              플랫폼입니다.
            </p>

            <div className="hero-actions">
              <Link to="/about" className="primary-btn">
                감성여행2 알아보기
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
          <div className="home-section-head">
            <p className="home-section-label">GAMSUNG TRAVEL 2</p>
            <h2>여행자, 가족과 친구, 지역상권을 한 흐름으로 연결합니다</h2>
            <p>
              사용자는 여행지를 찾고, 친구와 공유하고, 지역축제와 관광이벤트를
              확인하고, 주변 상권과 감성배달까지 이어서 이용할 수 있습니다.
              소상공인과 지자체는 사용자의 관심과 참여 데이터를 통해 지역의
              가능성을 더 선명하게 확인할 수 있습니다.
            </p>
          </div>

          <div className="home-platform-grid">
            {PLATFORM_POINTS.map((point) => (
              <article key={point.title} className="home-platform-card">
                <div className="home-platform-icon">✦</div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-flow-section">
        <div className="home-flow-inner">
          <div className="home-section-head">
            <p className="home-section-label">SERVICE FLOW</p>
            <h2>감성여행2는 이렇게 사용합니다</h2>
            <p>
              내 주변 또는 전국 지역을 선택하고, 테마를 고른 뒤, 마음에 드는
              장소를 나만의 여행이나 버킷에 담습니다. 여행 중 필요한 안전정보,
              사진, 번역, 예약현황, 감성배달 이동까지 한 흐름으로 이어집니다.
            </p>
          </div>

          <div className="home-flow-row">
            <div className="home-flow-item">내 주변 / 지역 선택</div>
            <div className="home-flow-arrow">→</div>
            <div className="home-flow-item">테마 선택</div>
            <div className="home-flow-arrow">→</div>
            <div className="home-flow-item">여행지·이벤트 담기</div>
            <div className="home-flow-arrow">→</div>
            <div className="home-flow-item">나만의 여행 / 버킷</div>
            <div className="home-flow-arrow">→</div>
            <div className="home-flow-item">지도·예약·감성배달 연결</div>
          </div>
        </div>
      </section>

      <section className="home-event-hub-section">
        <div className="home-event-hub-inner">
          <div className="home-event-hub-head">
            <p className="home-event-hub-label">EVENT HUB</p>
            <h2>내 주변 또는 원하는 지역의 이벤트를 바로 확인하세요</h2>
            <p>
              지역축제와 관광이벤트는 사용자가 직접 찾아보는 ‘내 주변 이벤트’와
              관심 지역·테마에 맞춰 알려주는 ‘알림 기능’으로 확장될 수 있습니다.
              지금은 홈페이지에서 대표 지역 이벤트 허브를 먼저 확인할 수 있습니다.
            </p>

            <div className="home-event-hub-actions">
              <Link to="/events" className="hub-primary-link">
                전체 이벤트 허브 보러가기
              </Link>
              <Link to="/partner" className="hub-secondary-link">
                지역 제휴 문의하기
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
    </div>
  );
}