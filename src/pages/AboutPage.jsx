// 파일 경로: src/pages/AboutPage.jsx
// ========================================
// 📌 감성여행2·감성배달 소개 페이지
// - 두 서비스의 방향과 차이를 한눈에 정리
// - 감성여행2 핵심 기능을 카드형으로 안내
// - 그룹 위치공유, 화장실, AI 추천, 지도 이벤트 필터 문구 반영
// - 마지막 안내 박스로 예약 중심 구조 설명
// ========================================

import "./AboutPage.css";

const features = [
  {
    title: "그룹 여행 관리",
    description:
      "그룹을 설정해 여행을 떠나면 최대 5일 동안 서로의 위치를 확인할 수 있습니다. 함께 여행하는 사람들끼리 이동 흐름을 맞출 수 있고, 집에 남아 있는 가족도 안심할 수 있도록 돕는 기능입니다.",
  },
  {
    title: "SOS 빠른 연결",
    description:
      "경찰, 소방, 약국, 편의점·마트, 화장실 같은 긴급하거나 꼭 필요한 생활 정보를 빠르게 확인할 수 있도록 구성됩니다. 특히 낯선 지역이나 외국인 여행자에게도 매우 중요한 기능입니다.",
  },
  {
    title: "나만의 여행 / 나만의 버킷",
    description:
      "여행지, 관광지, 숙소, 식당을 장보듯이 편하게 담아둘 수 있고, 담아 놓은 여행 코스를 바탕으로 AI가 1~3개의 추천 코스를 제안해 주는 구조로 확장됩니다.",
  },
  {
    title: "코스짜기",
    description:
      "출발지, 동행, 예산, 지역, 테마를 기준으로 여행 코스를 구성할 수 있고, 저장한 관심 장소와 이동 흐름을 바탕으로 더 자연스럽게 일정을 연결할 수 있습니다.",
  },
  {
    title: "테마 여행",
    description:
      "역사여행, 힐링여행, 사진여행, 드라이브 여행처럼 원하는 분위기와 목적에 맞는 테마를 고르고 일정과 계절 흐름에 맞춰 선택할 수 있습니다.",
  },
  {
    title: "관광지 상세 탐색",
    description:
      "관광지 상세 정보, 평점, 위치, 주변 숙소·식당 연결, 외부 지도 열기 등 여행 중 필요한 상세 흐름을 한곳에서 확인할 수 있습니다.",
  },
  {
    title: "지도 기반 탐색",
    description:
      "지도에서도 이벤트가 바로 표시되며, 이벤트 기준으로 따로 확인할 수 있습니다. 또한 다양한 필터를 통해 내가 보고 싶은 정보만 골라서 볼 수 있도록 구성됩니다.",
  },
  {
    title: "예약 관리",
    description:
      "여행 관련 예약 흐름을 확인할 수 있고, 내 예약과 취소 내역도 따로 관리할 수 있도록 설계되어 있습니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-badge">GAMSUNG TRAVEL 2 · DELIVERY</div>
        <h1 className="about-hero-title">감성여행2·감성배달</h1>
        <p className="about-hero-description">
          감성여행2는 여행자 중심으로 여행의 감성, 지역 정보, 코스, 이벤트,
          예약 흐름을 담는 앱입니다. 감성배달은 생활형 서비스와 배달, 지역
          상점과 빠른 연결을 맡는 구조입니다. 두 서비스는 따로 움직이지만,
          여행자가 필요한 순간 자연스럽게 이어지도록 설계되어 있습니다.
        </p>
      </section>

      <section className="about-overview-grid">
        <article className="about-overview-card">
          <p className="about-overview-label">WHY GAMSUNG TRAVEL 2</p>
          <h2>감성여행2는 왜 만들어졌나요?</h2>
          <p>
            여행은 단순히 장소를 소비하는 것이 아니라 사람과 지역, 계절과
            분위기, 이야기와 추억이 함께 쌓이는 과정입니다. 감성여행2는 이런
            여행의 본질을 담아, 여행자가 더 따뜻하고 깊이 있는 경험을 할 수
            있도록 돕기 위해 시작되었습니다.
          </p>
        </article>

        <article className="about-overview-card">
          <p className="about-overview-label">HOW TWO APPS CONNECT</p>
          <h2>감성여행2와 감성배달은 어떻게 다르나요?</h2>
          <p>
            감성여행2는 여행자 중심 앱입니다. 여행 코스, 관광지, 그룹 여행,
            이벤트, SOS, 예약 기능을 중심으로 구성됩니다. 반면 감성배달은 음식,
            생활서비스, 지역 상점, 빠른 연결 기능을 담은 별도 앱입니다.
          </p>
        </article>

        <article className="about-overview-card about-overview-card-wide">
          <p className="about-overview-label">SERVICE FLOW</p>
          <h2>두 서비스는 이렇게 이어집니다</h2>
          <p>
            여행자는 감성여행2에서 지역 정보와 코스를 탐색하고, 지도에서
            미니홈피를 확인하며 예약할 수 있습니다. 다만 미니홈피에서는 예약
            중심 기능을 제공하고, 배달이나 생활형 서비스 이용은 감성배달 앱으로
            이어지는 구조입니다.
          </p>

          <div className="about-flow-row">
            <div className="about-flow-item">지역 탐색</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">이벤트 / 여행 코스</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">미니홈피 예약</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">감성배달 연동</div>
          </div>
        </article>
      </section>

      <section className="about-section">
        <div className="about-section-header">
          <p className="about-section-eyebrow">CORE FEATURES</p>
          <h2>감성여행2 핵심 기능</h2>
          <p>
            여행 준비부터 이동, 탐색, 이벤트 확인, 예약까지 이어지는 핵심 흐름을
            보기 쉽게 정리했습니다.
          </p>
        </div>

        <div className="about-feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="about-feature-card">
              <div className="about-feature-icon">✦</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-highlight-box">
        <p className="about-highlight-label">예약 중심 안내</p>
        <h2>지도 속 미니홈피는 예약 중심으로 연결됩니다</h2>
        <p>
          감성여행2 지도에서는 지역 가게나 업체의 미니홈피를 확인할 수
          있습니다. 다만 이 공간은 예약 중심 기능으로 운영되며, 배달 주문이나
          생활형 서비스 이용은 감성배달 앱으로 이동해서 별도로 사용하는 구조를
          기준으로 설계되어 있습니다.
        </p>
      </section>
    </div>
  );
}