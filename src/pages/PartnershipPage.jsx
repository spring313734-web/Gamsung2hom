// 파일 경로: src/pages/PartnershipPage.jsx
// ========================================
// 📌 감성여행2 제휴문의 전용 페이지
// - 감성배달 소개 페이지와 혼동되지 않도록 제휴 전용 구성 사용
// - 제휴 소개 / 제휴 대상 / 제휴 방식 / 문의 유도 섹션 구성
// - 감성여행2 소개 페이지 느낌의 카드형 레이아웃 적용
// - 문의하기 페이지로 자연스럽게 이동할 수 있도록 CTA 제공
// ========================================

import { Link } from "react-router-dom";
import "./PartnershipPage.css";

const partnerTargets = [
  {
    title: "지역 소상공인",
    description:
      "카페, 음식점, 숙소, 체험공방, 특산물 매장 등 지역 기반 사업자가 감성여행2 안에서 더 쉽게 소개될 수 있습니다.",
  },
  {
    title: "지자체 · 관광기관",
    description:
      "지역 관광 콘텐츠, 축제, 체험 프로그램, 로컬 브랜드를 하나의 흐름으로 연결해 방문자 경험을 높일 수 있습니다.",
  },
  {
    title: "행사 · 축제 운영사",
    description:
      "시즌 이벤트, 지역 행사, 한정 프로모션을 감성여행2 사용자에게 효과적으로 노출할 수 있습니다.",
  },
  {
    title: "콘텐츠 · 문화 파트너",
    description:
      "전설, 스토리텔링, 체험형 콘텐츠, 지역 문화 자산을 여행 동선과 연결해 더 풍부한 서비스로 확장할 수 있습니다.",
  },
];

const partnershipWays = [
  {
    title: "콘텐츠 제휴",
    description:
      "관광지, 체험, 전설, 지역 스토리 등 여행 콘텐츠를 함께 구성하여 사용자에게 더 깊은 경험을 제공합니다.",
  },
  {
    title: "홍보 · 노출 제휴",
    description:
      "서비스 내 카드, 추천 영역, 지역 페이지 등을 통해 파트너의 브랜드와 상품을 자연스럽게 소개합니다.",
  },
  {
    title: "판매 · 유입 제휴",
    description:
      "여행객 유입, 예약 연계, 오프라인 방문 유도 등 실제 연결이 일어나는 구조를 함께 설계할 수 있습니다.",
  },
  {
    title: "맞춤형 협업",
    description:
      "정해진 방식 외에도 지역 특성이나 사업 목적에 맞춰 공동 프로젝트, 캠페인, 연계 기획이 가능합니다.",
  },
];

export default function PartnershipPage() {
  return (
    <div className="partnership-page">
      <section className="partnership-hero">
        <div className="partnership-hero-inner">
          <p className="partnership-badge">Partnership</p>
          <h1>감성여행2 제휴문의</h1>
          <p className="partnership-hero-text">
            감성여행2는 지역의 매력과 사람, 공간, 이야기를 연결하는 플랫폼입니다.
            <br />
            함께할 파트너를 찾고 있으며, 서로에게 도움이 되는 방식으로 제휴를
            만들어가고자 합니다.
          </p>

          <div className="partnership-hero-actions">
            <Link to="/contact" className="partnership-primary-button">
              제휴 문의하기
            </Link>
            <Link to="/about" className="partnership-secondary-button">
              감성여행2 소개 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="partnership-section">
        <div className="partnership-section-head">
          <p className="section-eyebrow">ABOUT PARTNERSHIP</p>
          <h2>어떤 제휴를 만들고 있나요?</h2>
          <p>
            감성여행2의 제휴는 단순 광고가 아니라, 지역과 사용자 경험을 함께
            키우는 협업을 지향합니다.
          </p>
        </div>

        <div className="partnership-intro-grid">
          <article className="intro-card">
            <h3>지역 기반 연결</h3>
            <p>
              여행자에게 꼭 필요한 장소, 경험, 정보, 상품을 더 매력적인 흐름으로
              연결합니다.
            </p>
          </article>

          <article className="intro-card">
            <h3>브랜드 가치 확장</h3>
            <p>
              파트너의 강점을 감성여행2의 여행 맥락 안에 자연스럽게 녹여 브랜드
              인지와 호감도를 높입니다.
            </p>
          </article>

          <article className="intro-card">
            <h3>실제 방문과 참여 유도</h3>
            <p>
              단순 노출에서 끝나는 것이 아니라 방문, 체험, 예약, 문의로 이어질
              수 있는 구조를 함께 고민합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="partnership-section alt">
        <div className="partnership-section-head">
          <p className="section-eyebrow">PARTNER TARGET</p>
          <h2>이런 분들과 함께하고 싶어요</h2>
          <p>
            아래 대상은 예시이며, 지역과 여행에 좋은 시너지가 있다면 다양한
            방식의 협업이 가능합니다.
          </p>
        </div>

        <div className="partnership-card-grid">
          {partnerTargets.map((item) => (
            <article key={item.title} className="partnership-info-card">
              <div className="card-icon">🤝</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partnership-section">
        <div className="partnership-section-head">
          <p className="section-eyebrow">HOW WE WORK</p>
          <h2>제휴 방식은 이렇게 진행됩니다</h2>
          <p>
            파트너의 상황에 따라 가볍게 시작할 수도 있고, 장기 협업 형태로 함께
            설계할 수도 있습니다.
          </p>
        </div>

        <div className="partnership-card-grid">
          {partnershipWays.map((item) => (
            <article key={item.title} className="partnership-info-card">
              <div className="card-icon">✨</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="partnership-cta-section">
        <div className="partnership-cta-card">
          <p className="section-eyebrow">LET&apos;S CONNECT</p>
          <h2>좋은 제안이 있다면 편하게 문의해주세요</h2>
          <p>
            제휴 목적, 소개하고 싶은 서비스나 브랜드, 기대하는 협업 방향을
            남겨주시면 확인 후 연락드릴 수 있도록 준비하겠습니다.
          </p>

          <div className="partnership-cta-actions">
            <Link to="/contact" className="partnership-primary-button">
              문의하기 페이지로 이동
            </Link>
            <Link to="/" className="partnership-secondary-button">
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}