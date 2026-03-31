// 파일 경로: src/pages/ContactPage.jsx
// ========================================
// 📌 감성여행2 문의하기 페이지
// - 상단 큰 배너 없이 카드형 소개 레이아웃으로 구성
// - 일반 문의 / 제휴 안내 / 서비스 확장 방향을 카드로 정리
// - 제휴문의 페이지와 구분되도록 일반 문의 중심 문구 사용
// - ContactPage.css와 연결되는 전용 스타일 적용
// ========================================

import { Link } from "react-router-dom";
import "./ContactPage.css";

const contactTopics = [
  {
    title: "일반 문의",
    description:
      "서비스 내용, 이용 방향, 페이지 구성, 향후 기능 확장 등 감성여행2 전반에 대한 문의를 남길 수 있습니다.",
  },
  {
    title: "제휴 및 협업 문의",
    description:
      "지역 상점, 체험, 숙소, 행사, 특산물, 관광 콘텐츠 등 함께 연결할 수 있는 다양한 협업 제안을 문의할 수 있습니다.",
  },
  {
    title: "사업자 소개 및 참여",
    description:
      "사업자 소개, 미니홈피, 예약 연결, 향후 입점 구조와 관련된 방향성도 단계적으로 안내할 수 있도록 준비하고 있습니다.",
  },
  {
    title: "향후 기능 확장 안내",
    description:
      "앞으로 앱 연결, 로그인, 제휴 신청, 고객문의, 사업자 관리 기능까지 순차적으로 확장될 수 있도록 준비 중입니다.",
  },
];

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-badge">CONTACT</p>
          <h1>문의하기</h1>
          <p className="contact-hero-text">
            감성여행2는 여행자, 지역, 가게, 지역사회가 더 따뜻하게 연결될 수
            있도록 문의 또한 하나의 시작점이 되기를 바랍니다.
            <br />
            궁금한 점이나 함께하고 싶은 방향이 있다면 편하게 남겨주세요.
          </p>

          <div className="contact-hero-actions">
            <Link to="/partner" className="contact-primary-button">
              제휴문의 페이지 보기
            </Link>
            <Link to="/" className="contact-secondary-button">
              홈으로 이동
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-section-head">
          <p className="contact-section-eyebrow">CONTACT GUIDE</p>
          <h2>어떤 문의를 할 수 있나요?</h2>
          <p>
            현재 감성여행2 홈페이지는 시작 단계이지만, 앞으로 더 다양한 연결이
            가능하도록 순차적으로 확장할 수 있는 구조를 준비하고 있습니다.
          </p>
        </div>

        <div className="contact-topic-grid">
          {contactTopics.map((topic) => (
            <article key={topic.title} className="contact-topic-card">
              <div className="contact-topic-icon">✦</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-info-section">
        <div className="contact-info-grid">
          <article className="contact-info-card contact-info-card-wide">
            <p className="contact-info-label">ABOUT GAMSUNG TRAVEL 2</p>
            <h2>감성여행2는 이런 방향을 생각하고 있습니다</h2>
            <p>
              감성여행2는 여행과 지역, 사람과 상권을 감성적으로 연결하는 여행
              플랫폼을 목표로 합니다. 단순히 정보를 나열하는 것이 아니라,
              사람들의 기억에 남는 여행 경험과 지역의 따뜻한 연결을 함께
              만들어가는 방향을 지향합니다.
            </p>
          </article>

          <article className="contact-info-card">
            <p className="contact-info-label">EMAIL</p>
            <h3>문의 이메일</h3>
            <p>contact@gamsung2.com</p>
          </article>

          <article className="contact-info-card">
            <p className="contact-info-label">PARTNERSHIP</p>
            <h3>연결 가능한 분야</h3>
            <p>
              카페, 음식점, 숙소, 체험장, 특산물 판매처, 지역 행사, 관광 관련
              협업 등 지역과 여행을 함께 살릴 수 있는 다양한 제안을 열어두고
              있습니다.
            </p>
          </article>

          <article className="contact-info-card contact-info-card-wide">
            <p className="contact-info-label">TOGETHER</p>
            <h2>문의도 하나의 연결이 될 수 있습니다</h2>
            <p>
              감성여행2는 혼자 떠나는 여행도 결국 지역과 사람, 공간과 이야기의
              연결 속에서 더 깊어질 수 있다고 생각합니다. 문의와 제휴 또한 그
              연결의 시작점이 될 수 있도록, 앞으로 더 자연스럽고 편안한 흐름으로
              발전시켜 나가고자 합니다.
            </p>
          </article>
        </div>
      </section>

      <section className="contact-cta-section">
        <div className="contact-cta-card">
          <p className="contact-section-eyebrow">LET&apos;S TALK</p>
          <h2>원하는 방향이 있다면 편하게 이야기해주세요</h2>
          <p>
            일반 문의부터 협업 제안까지, 감성여행2와 함께 만들고 싶은 방향이
            있다면 남겨주세요. 앞으로 더 좋은 연결로 이어질 수 있도록 준비해
            나가겠습니다.
          </p>

          <div className="contact-hero-actions">
            <Link to="/partner" className="contact-primary-button">
              제휴문의로 이동
            </Link>
            <Link to="/about" className="contact-secondary-button">
              감성여행2 소개 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}