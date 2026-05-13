// 파일 경로: src/pages/PartnerPage.jsx
// ========================================
// 📌 감성배달 소개 페이지
// - 감성배달을 음식 배달만이 아닌 지역상권 / 생활서비스 플랫폼으로 설명
// - 이벤트, 주문, 생활서비스, 미니홈피, 소상공인 운영 흐름 정리
// - 감성여행2와 역할 구분 안내
// - 예약은 감성여행2 중심, 배달과 주문은 감성배달 중심이라는 문구 반영
// ========================================

import "./PartnerPage.css";

const features = [
  {
    title: "지역 상권 중심 배달",
    description:
      "감성배달은 단순 음식 배달을 넘어 지역 소상공인의 먹거리, 생활서비스, 이벤트, 할인 정보를 함께 연결하는 지역상권 플랫폼입니다.",
  },
  {
    title: "이벤트별 빠른 노출",
    description:
      "오늘만, 지금만, 신규 오픈, 할인, 체험, 리뷰 이벤트처럼 소상공인이 직접 등록한 생활형 이벤트를 사용자에게 빠르게 보여줄 수 있습니다.",
  },
  {
    title: "근처 가게 / 생활서비스 찾기",
    description:
      "사용자는 현재 위치를 기준으로 주변 가게, 생활서비스, 지역 업체를 확인하고 필요한 서비스를 바로 찾을 수 있습니다.",
  },
  {
    title: "메뉴 / 상품 선택과 주문",
    description:
      "사용자는 가게 상세 화면에서 메뉴와 상품을 확인하고 장바구니에 담아 주문할 수 있습니다. 누구나 익숙한 선택 후 주문 흐름을 기준으로 구성됩니다.",
  },
  {
    title: "소상공인 미니홈피",
    description:
      "향후 가입한 소상공인은 가게 소개, 메뉴, 사진, 이벤트, 위치, 연락처를 보여주는 미니홈피를 가질 수 있습니다.",
  },
  {
    title: "사업자 운영 관리",
    description:
      "사업자는 가게 정보, 메뉴, 상품 사진, 이벤트, 휴무, 할인, 주문 흐름을 직접 관리할 수 있는 구조로 확장됩니다.",
  },
  {
    title: "감성여행2와 연결",
    description:
      "감성여행2 지도에서는 주변 상권과 미니홈피를 확인하고, 배달 주문과 생활서비스 이용은 감성배달에서 진행하는 구조로 연결됩니다.",
  },
  {
    title: "지역 단골 고객 만들기",
    description:
      "가게는 이벤트와 미니홈피를 통해 단순 주문 고객을 넘어 지역 단골 고객과 여행자를 함께 만날 수 있습니다.",
  },
];

const eventTypes = [
  {
    title: "오늘의 이벤트",
    description:
      "오늘 방문하거나 주문하면 받을 수 있는 할인, 서비스, 한정 메뉴를 빠르게 보여줍니다.",
  },
  {
    title: "신규 오픈 이벤트",
    description:
      "새롭게 문을 연 가게를 지역 주민과 여행자에게 알리는 홍보 공간으로 활용할 수 있습니다.",
  },
  {
    title: "리뷰 / 단골 이벤트",
    description:
      "리뷰 작성, 재방문, 단골 등록 등 고객과 지속적으로 이어지는 이벤트로 확장할 수 있습니다.",
  },
  {
    title: "지역 연계 이벤트",
    description:
      "지역축제나 관광이벤트와 함께 주변 가게 할인, 체험, 쿠폰을 연결할 수 있습니다.",
  },
];

export default function PartnerPage() {
  return (
    <div className="partner-page">
      <section className="partner-hero">
        <div className="partner-hero-badge">GAMSUNG DELIVERY</div>
        <h1 className="partner-hero-title">감성배달 소개</h1>
        <p className="partner-hero-description">
          감성배달은 음식 배달만을 위한 앱이 아닙니다. 지역 소상공인의 먹거리,
          생활서비스, 이벤트, 할인, 미니홈피를 연결하는 지역상권 플랫폼입니다.
          감성여행2가 여행자와 지역을 연결한다면, 감성배달은 지역 상권과
          고객을 연결합니다.
        </p>
      </section>

      <section className="partner-overview-grid">
        <article className="partner-overview-card">
          <p className="partner-overview-label">WHAT IS GAMSUNG DELIVERY</p>
          <h2>감성배달은 어떤 서비스인가요?</h2>
          <p>
            감성배달은 음식, 생활서비스, 지역 업체, 빠른 이벤트를 한곳에 모아
            사용자가 필요한 것을 더 빠르게 찾고 연결받을 수 있도록 설계된
            서비스입니다. 단순 주문 앱을 넘어서 지역 상점과 사용자를 자연스럽게
            이어주는 구조를 목표로 합니다.
          </p>
        </article>

        <article className="partner-overview-card">
          <p className="partner-overview-label">FOR STORE OWNERS</p>
          <h2>소상공인은 무엇을 할 수 있나요?</h2>
          <p>
            소상공인은 가게 정보, 메뉴, 상품 사진, 이벤트, 할인, 휴무, 연락처,
            위치 정보를 직접 관리할 수 있습니다. 향후 미니홈피를 통해 가게만의
            매력과 소식을 더 자세히 보여줄 수 있습니다.
          </p>
        </article>

        <article className="partner-overview-card partner-overview-card-wide">
          <p className="partner-overview-label">HOW IT CONNECTS</p>
          <h2>감성여행2와 감성배달은 역할이 다릅니다</h2>
          <p>
            감성여행2에서는 여행, 관광, 버킷리스트, 코스짜기, 예약현황을 확인할
            수 있습니다. 배달 주문과 생활서비스 이용은 감성배달에서 진행합니다.
            예약 기능은 감성여행2를 중심으로 연결하고, 배달과 주문은 감성배달을
            이용하는 구조입니다.
          </p>

          <div className="partner-flow-row">
            <div className="partner-flow-item">감성여행2 탐색</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">지도 / 미니홈피 확인</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">예약은 감성여행2</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">주문은 감성배달</div>
          </div>
        </article>
      </section>

      <section className="partner-section">
        <div className="partner-section-header">
          <p className="partner-section-eyebrow">CORE FEATURES</p>
          <h2>감성배달 핵심 기능</h2>
          <p>
            사용자에게는 빠른 연결을, 소상공인에게는 직접 운영 흐름을 제공하는
            핵심 기능을 보기 쉽게 정리했습니다.
          </p>
        </div>

        <div className="partner-feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="partner-feature-card">
              <div className="partner-feature-icon">✦</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partner-section">
        <div className="partner-section-header">
          <p className="partner-section-eyebrow">EVENT TYPES</p>
          <h2>감성배달 이벤트 예시</h2>
          <p>
            감성배달의 이벤트는 소상공인이 직접 고객에게 알리고 싶은 소식과
            혜택을 빠르게 보여주는 생활형 이벤트 구조입니다.
          </p>
        </div>

        <div className="partner-feature-grid">
          {eventTypes.map((event) => (
            <article key={event.title} className="partner-feature-card">
              <div className="partner-feature-icon">◆</div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partner-highlight-box">
        <p className="partner-highlight-label">서비스 연결 안내</p>
        <h2>예약은 감성여행2, 주문은 감성배달</h2>
        <p>
          감성여행2는 여행자 중심으로 코스, 이벤트, 관광 정보, 예약 흐름을
          담고, 감성배달은 음식, 생활서비스, 지역 업체 운영, 빠른 이벤트 기능을
          담당합니다. 감성여행2에서 배달이 필요할 때는 감성배달을 이용해 주세요.
        </p>
      </section>
    </div>
  );
}