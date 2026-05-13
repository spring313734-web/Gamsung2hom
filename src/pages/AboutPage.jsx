// 파일 경로: src/pages/AboutPage.jsx
// ========================================
// 📌 감성여행2 소개 페이지
// - 감성여행2 핵심 가치와 메뉴별 기능을 설명
// - 감성친구 / 그룹 기능 / SOS / 교통 / 테마 / 나만의 여행 / 버킷 / 지도 상권 연결 보강
// - 감성배달과 역할을 구분하여 안내
// - 소상공인과 지자체가 이해할 수 있는 지역상생 가치 포함
// ========================================

import "./AboutPage.css";

const features = [
  {
    title: "내 주변 / 지역 선택",
    description:
      "기본은 내 주변입니다. 현재 위치를 기준으로 여행지, 축제, 관광이벤트, 주변 상권을 확인하고, 전국 또는 지역 선택을 눌러 원하는 지역의 여행 흐름도 미리 둘러볼 수 있습니다.",
  },
  {
    title: "테마 선택",
    description:
      "내 주변, 가족여행, 친구여행, 연인여행, 역사탐방, 자연여행, 지역축제, 관광이벤트 등 원하는 테마를 선택해 목적에 맞는 장소와 콘텐츠를 찾을 수 있습니다.",
  },
  {
    title: "교통 선택",
    description:
      "도보, 자가용, 대중교통 등 주 교통수단을 기준으로 여행 코스를 더 편하게 구성할 수 있도록 준비하고 있습니다. 교통수단을 선택하지 않았다면 코스 구성 전에 선택을 유도합니다.",
  },
  {
    title: "감성친구",
    description:
      "가족, 친구, 연인, 회사동료와 여행, 버킷, 앨범, 위치 공유를 관계에 맞게 나눌 수 있습니다. 감성친구는 단순 채팅이 아니라 여행과 추억, 안전 확인을 연결하는 핵심 기능입니다.",
  },
  {
    title: "그룹 기능",
    description:
      "가족, 친구, 연인, 회사동료 같은 기본 그룹은 물론 동창모임, 사진동호회, 회사 워크숍처럼 사용자가 직접 그룹을 만들어 여행과 기록을 공유할 수 있습니다.",
  },
  {
    title: "SOS 통합검색",
    description:
      "경찰서, 소방서, 병원, 약국, 화장실, 쇼핑몰 등 여행 중 급하게 필요한 생활 정보를 한 번에 검색할 수 있도록 준비하고 있습니다.",
  },
  {
    title: "나만의 여행",
    description:
      "마음에 드는 관광지, 축제, 이벤트, 상권 정보를 장보듯이 담아 나만의 일정처럼 정리할 수 있습니다. 여행지를 하나씩 담아 나만의 코스를 만드는 공간입니다.",
  },
  {
    title: "나만의 버킷",
    description:
      "언젠가 가보고 싶은 장소와 해보고 싶은 경험을 저장하는 공간입니다. 사용자의 버킷 데이터는 지역이 어떤 관광지와 이벤트에 관심이 모이는지 확인하는 중요한 신호가 됩니다.",
  },
  {
    title: "코스짜기",
    description:
      "담아둔 장소들을 여행 순서에 맞게 정리하고, 관광지, 축제, 식당, 카페, 숙소, 생활서비스를 하루 코스나 가족 코스처럼 구성할 수 있습니다.",
  },
  {
    title: "지역축제 / 관광이벤트",
    description:
      "지역축제는 실제 지역 행사 정보를, 관광이벤트는 지자체나 지역이 관광 활성화를 위해 운영하는 특별 이벤트를 안내합니다. 관심 있는 이벤트는 여행이나 버킷으로 이어질 수 있습니다.",
  },
  {
    title: "지도 기반 상권 연결",
    description:
      "지도를 열면 내 주변 여행지와 지역 상권을 함께 확인할 수 있습니다. 향후 가입한 소상공인은 미니홈피, 이벤트, 메뉴, 위치, 연락처, 예약 가능 여부까지 보여줄 수 있습니다.",
  },
  {
    title: "예약 / 카메라 / 사진 / 번역",
    description:
      "내 예약현황, 카메라와 사진 기록, 외국인 방문객을 위한 번역 기능까지 여행 중 필요한 기능을 하나의 흐름으로 연결합니다.",
  },
];

const values = [
  {
    title: "여행자에게",
    description:
      "여행지를 찾고, 친구와 공유하고, 지역축제와 이벤트를 담아 나만의 여행으로 만들 수 있습니다.",
  },
  {
    title: "소상공인에게",
    description:
      "지도와 미니홈피를 통해 여행자에게 자연스럽게 노출되고, 예약과 감성배달로 이어질 수 있습니다.",
  },
  {
    title: "지자체에게",
    description:
      "버킷, 관심 장소, 이벤트 반응 데이터를 통해 관광정책과 예산 집행의 방향을 더 선명하게 확인할 수 있습니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-badge">GAMSUNG TRAVEL 2</div>
        <h1 className="about-hero-title">감성여행2 소개</h1>
        <p className="about-hero-description">
          감성여행2는 단순 여행앱이 아닙니다. 여행자, 가족과 친구, 지역축제,
          관광이벤트, 소상공인, 감성배달을 하나로 연결하는 지역상생 여행
          플랫폼입니다.
        </p>
      </section>

      <section className="about-overview-grid">
        <article className="about-overview-card">
          <p className="about-overview-label">WHY GAMSUNG TRAVEL 2</p>
          <h2>여행의 감성, 지역의 온기, 사람의 연결</h2>
          <p>
            여행은 단순히 장소를 소비하는 것이 아니라 사람과 지역, 계절과
            분위기, 이야기와 추억이 함께 쌓이는 과정입니다. 감성여행2는 이런
            여행의 본질을 담아, 여행자가 더 따뜻하고 깊이 있는 경험을 할 수
            있도록 돕습니다.
          </p>
        </article>

        <article className="about-overview-card">
          <p className="about-overview-label">HOW TO USE</p>
          <h2>장보듯이 담아 만드는 나만의 여행</h2>
          <p>
            테마를 선택하고 마음에 드는 장소를 나만의 여행이나 버킷에 담으면,
            여행지가 하나씩 모여 나만의 코스가 됩니다. 내 주변을 기준으로
            시작하고, 원하면 전국 지역을 선택해 다른 지역도 미리 둘러볼 수
            있습니다.
          </p>
        </article>

        <article className="about-overview-card about-overview-card-wide">
          <p className="about-overview-label">SERVICE FLOW</p>
          <h2>감성여행2와 감성배달은 이렇게 이어집니다</h2>
          <p>
            감성여행2는 여행, 코스, 버킷, 감성친구, 예약현황을 중심으로
            움직입니다. 배달 주문과 생활서비스 이용은 감성배달에서 진행하며,
            두 서비스는 필요한 순간 자연스럽게 이어지도록 설계됩니다.
          </p>

          <div className="about-flow-row">
            <div className="about-flow-item">지역 / 테마 선택</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">여행지 담기</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">나만의 여행 / 버킷</div>
            <div className="about-flow-arrow">→</div>
            <div className="about-flow-item">지도 / 예약 / 감성배달</div>
          </div>
        </article>
      </section>

      <section className="about-section">
        <div className="about-section-header">
          <p className="about-section-eyebrow">CORE FEATURES</p>
          <h2>감성여행2 핵심 기능</h2>
          <p>
            여행 준비부터 친구 공유, 안전 확인, 지역축제와 관광이벤트, 상권
            연결까지 이어지는 핵심 기능을 정리했습니다.
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

      <section className="about-section">
        <div className="about-section-header">
          <p className="about-section-eyebrow">LOCAL VALUE</p>
          <h2>감성여행2가 만드는 지역상생 가치</h2>
          <p>
            감성여행2는 여행자의 편의뿐 아니라 소상공인과 지자체가 함께 활용할
            수 있는 지역상생 데이터 플랫폼을 목표로 합니다.
          </p>
        </div>

        <div className="about-feature-grid">
          {values.map((value) => (
            <article key={value.title} className="about-feature-card">
              <div className="about-feature-icon">◆</div>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-highlight-box">
        <p className="about-highlight-label">출시 준비중 안내</p>
        <h2>감성여행2와 감성배달은 순차적으로 공개될 예정입니다</h2>
        <p>
          현재 감성여행2와 감성배달은 정식 출시를 준비하고 있습니다. 일부
          기능은 순차적으로 공개될 예정이며, 초기 참여 소상공인과 협력 지자체를
          모집하고 있습니다. 우리 지역에서 먼저 시작해보고 싶다면 제휴문의 또는
          문의하기를 통해 연락해 주세요.
        </p>
      </section>
    </div>
  );
}