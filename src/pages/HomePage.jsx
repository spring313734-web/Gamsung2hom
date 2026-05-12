// 파일 경로: src/pages/HomePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 메인 홈 화면
// - 메인 비주얼 중심 랜딩 화면 구성
// - 감성여행2·감성배달 설명은 별도 소개 페이지로 이동
// - 주요 이동 버튼과 이벤트 허브 진입 섹션을 함께 제공
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

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-darken">
          <div className="hero-inner">
            <p className="hero-badge">여행과 지역을 잇는 서비스</p>

            <h1 className="hero-title">
              <span className="hero-title-brand">
                <span className="hero-title-text">감성여행</span>
                <span className="hero-title-number">2</span>
              </span>
              <br />
              여행의 감성과 지역의 온기를 함께 담다
            </h1>

            <p className="hero-description">
              감성여행2는 여행지를 보여주는 것에서 끝나지 않고, 여행자와 지역,
              이야기와 추억, 관광과 지역경제를 자연스럽게 연결하기 위해 시작된
              서비스입니다. 여행자는 감성여행2에서 코스와 이벤트, 관광 정보를
              만나고, 필요한 생활형 서비스와 배달은 감성배달 앱으로 이어서
              이용할 수 있습니다.
            </p>

            <div className="hero-actions">
              <Link to="/about" className="primary-btn">
                감성여행2·감성배달 보기
              </Link>
              <Link to="/events" className="secondary-btn">
                이벤트 허브 보기
              </Link>
              <Link to="/contact" className="secondary-btn">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-event-hub-section">
        <div className="home-event-hub-inner">
          <div className="home-event-hub-head">
            <p className="home-event-hub-label">EVENT HUB</p>
            <h2>홈페이지에서 바로 지역 이벤트 허브로 이어집니다</h2>
            <p>
              특별시, 광역시, 특별자치시, 도 단위로 연결된 감성여행2 이벤트
              허브를 홈에서 바로 확인하고, 원하는 지역의 상세 허브로 자연스럽게
              이어질 수 있도록 정리했습니다.
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