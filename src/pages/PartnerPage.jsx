// 파일 경로: src/pages/PartnerPage.jsx
// ========================================
// 📌 감성배달 소개 페이지
// - 감성배달 서비스 방향과 핵심 기능을 카드형으로 정리
// - 감성여행2와의 연결 구조를 보기 쉽게 설명
// - 사업자 / 사용자 관점의 기능 흐름을 함께 안내
// - PartnerPage.css와 연결되는 전용 레이아웃 적용
// ========================================

import "./PartnerPage.css";

const features = [
  {
    title: "빠른 생활형 이벤트",
    description:
      "오늘만, 지금만, 신규 오픈, 긴급 할인처럼 즉시 반응이 필요한 이벤트를 첫 화면에서 빠르게 확인할 수 있도록 구성됩니다.",
  },
  {
    title: "근처 업체 찾기",
    description:
      "현재 위치를 기준으로 근처 가게, 생활서비스, 지역 업체를 찾고 필요한 곳을 빠르게 연결할 수 있습니다.",
  },
  {
    title: "업체 직접 등록 이벤트",
    description:
      "감성배달의 이벤트는 업체가 직접 등록하는 생활형 이벤트 구조입니다. 오늘의 이벤트, 이주의 이벤트, 할인, 체험, 상담 같은 흐름으로 확장할 수 있습니다.",
  },
  {
    title: "사업자 대시보드",
    description:
      "사업자는 관리자 화면에서 매출, 주문수, 판매수량, 인기 메뉴 같은 운영 정보를 한눈에 확인할 수 있습니다.",
  },
  {
    title: "가게 프로필 관리",
    description:
      "상호명, 대표자, 사업자 정보, 업종 카테고리, 연락처, 소개 문구 등 기본 정보를 직접 관리할 수 있습니다.",
  },
  {
    title: "상품 / 메뉴 / 사진 관리",
    description:
      "상품 추가, 수정, 삭제, 사진 등록, 갤러리 관리, 메뉴 노출 여부 설정 등 실제 운영에 필요한 기능을 담을 수 있습니다.",
  },
  {
    title: "예약 · 할인 · 휴무 설정",
    description:
      "예약 관리, 할인 이벤트, 리뷰 이벤트, 휴무 설정까지 사업자가 직접 운영할 수 있는 구조로 확장할 수 있습니다.",
  },
  {
    title: "AI 촬영 · 편집 스튜디오",
    description:
      "가게 홍보 사진을 더 보기 좋게 정리하고 메뉴나 매장 이미지를 더 깔끔하게 보여줄 수 있는 보정형 도구로 활용할 수 있습니다.",
  },
];

export default function PartnerPage() {
  return (
    <div className="partner-page">
      <section className="partner-hero">
        <div className="partner-hero-badge">GAMSUNG DELIVERY</div>
        <h1 className="partner-hero-title">감성배달 소개</h1>
        <p className="partner-hero-description">
          감성배달은 음식 배달만을 위한 앱이 아니라, 생활형 서비스와 지역 상점,
          빠른 연결 이벤트, 사업자 운영 기능까지 담는 지역 밀착형 서비스입니다.
          감성여행2가 여행자의 흐름을 담당한다면, 감성배달은 지역 생활과 빠른
          연결을 맡는 구조로 함께 움직입니다.
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
          <h2>사업자는 무엇을 할 수 있나요?</h2>
          <p>
            사업자는 매장 소개, 메뉴 등록, 이벤트 등록, 사진 관리, 예약 설정,
            운영 정보 확인까지 직접 관리할 수 있습니다. 단순 입점이 아니라
            스스로 운영 흐름을 조절할 수 있는 구조로 확장할 수 있습니다.
          </p>
        </article>

        <article className="partner-overview-card partner-overview-card-wide">
          <p className="partner-overview-label">HOW IT CONNECTS</p>
          <h2>감성여행2와는 이렇게 연결됩니다</h2>
          <p>
            감성여행2 지도에서는 미니홈피가 노출될 수 있지만, 그 공간은 예약
            중심입니다. 배달 주문, 생활서비스 이용, 빠른 이벤트 확인, 사업자
            운영 기능은 감성배달 앱에서 별도로 사용하는 구조로 분리됩니다.
          </p>

          <div className="partner-flow-row">
            <div className="partner-flow-item">감성여행2 탐색</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">미니홈피 확인</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">예약 중심 연결</div>
            <div className="partner-flow-arrow">→</div>
            <div className="partner-flow-item">감성배달 이용</div>
          </div>
        </article>
      </section>

      <section className="partner-section">
        <div className="partner-section-header">
          <p className="partner-section-eyebrow">CORE FEATURES</p>
          <h2>감성배달 핵심 기능</h2>
          <p>
            사용자에게는 빠른 연결을, 사업자에게는 직접 운영 흐름을 제공하는
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

      <section className="partner-highlight-box">
        <p className="partner-highlight-label">서비스 연결 안내</p>
        <h2>감성여행2와 감성배달은 역할이 다릅니다</h2>
        <p>
          감성여행2는 여행자 중심으로 코스, 이벤트, 관광 정보, 예약 흐름을
          담고, 감성배달은 음식, 생활서비스, 지역 업체 운영, 빠른 이벤트 기능을
          담당합니다. 두 서비스는 분리되어 있지만 필요한 순간 자연스럽게
          이어지도록 설계됩니다.
        </p>
      </section>
    </div>
  );
}