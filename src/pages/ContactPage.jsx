// 파일 경로: src/pages/ContactPage.jsx
// ========================================
// 📌 감성여행2 문의하기 페이지
// - 홈페이지 오른쪽 아래 감성문의 쪽지 사용 안내
// - 소상공인 입점 / 지자체 제휴 / 일반 문의 / 서비스 이용 문의를 구분
// - 이메일 문의와 감성문의 쪽지 흐름을 함께 안내
// - 제휴문의 페이지와 구분되도록 일반 문의 중심 문구 사용
// ========================================

import { Link } from "react-router-dom";
import "./ContactPage.css";

const contactTopics = [
  {
    title: "소상공인 입점 문의",
    description:
      "가게 소개, 메뉴, 이벤트, 미니홈피, 지역상권 노출, 감성배달 연결에 관심 있는 소상공인 문의를 받습니다.",
  },
  {
    title: "지자체 제휴 문의",
    description:
      "지역축제, 관광이벤트, 지역상권 활성화, 시범 운영, 데이터 기반 관광정책 협력 문의를 남길 수 있습니다.",
  },
  {
    title: "일반 문의",
    description:
      "감성여행2 서비스 방향, 앱 출시 준비, 홈페이지 내용, 이용 방법 등에 대한 문의를 남길 수 있습니다.",
  },
  {
    title: "서비스 이용 문의",
    description:
      "나만의 여행, 버킷, 감성친구, 이벤트 허브, 감성배달 연결 등 기능 이용과 관련된 문의를 남길 수 있습니다.",
  },
];

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <p className="contact-badge">CONTACT</p>
          <h1>감성문의</h1>
          <p className="contact-hero-text">
            감성여행2에 관심을 가져주셔서 감사합니다.
            <br />
            소상공인 입점, 지자체 제휴, 서비스 이용 문의는 홈페이지 오른쪽 아래
            <strong> 감성문의 쪽지</strong>를 통해 편하게 남겨주세요.
          </p>

          <div className="contact-hero-actions">
            <a href="mailto:info@gamsung2.com" className="contact-primary-button">
              이메일 문의하기
            </a>
            <Link to="/partner" className="contact-secondary-button">
              제휴문의 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-section-head">
          <p className="contact-section-eyebrow">CONTACT GUIDE</p>
          <h2>어떤 문의를 남길 수 있나요?</h2>
          <p>
            현재 감성여행2와 감성배달은 정식 출시를 준비 중이며, 초기 참여
            소상공인과 협력 지자체를 우선 모집하고 있습니다.
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
            <p className="contact-info-label">MESSAGE</p>
            <h2>오른쪽 아래 감성문의 버튼을 눌러주세요</h2>
            <p>
              홈페이지 어디서든 오른쪽 아래의 감성문의 버튼을 누르면 간단한
              쪽지창이 열립니다. 문의 유형, 성함 또는 상호명, 연락처, 이메일,
              문의 내용을 남기면 확인 후 연락드릴 수 있도록 준비하겠습니다.
            </p>
          </article>

          <article className="contact-info-card">
            <p className="contact-info-label">EMAIL</p>
            <h3>이메일 문의</h3>
            <p>
              info@gamsung2.com
              <br />
              공식 제안서, 지자체 제휴, 문서 전달이 필요한 경우 이메일을
              이용해주세요.
            </p>
          </article>

          <article className="contact-info-card">
            <p className="contact-info-label">NOTICE</p>
            <h3>현재 준비 단계입니다</h3>
            <p>
              감성문의 쪽지는 먼저 홈페이지 문의 접수용으로 제공됩니다. 이후
              Supabase 저장, 관리자 확인, 답변 상태 관리 기능으로 확장할
              예정입니다.
            </p>
          </article>

          <article className="contact-info-card contact-info-card-wide">
            <p className="contact-info-label">TOGETHER</p>
            <h2>문의도 하나의 연결이 될 수 있습니다</h2>
            <p>
              감성여행2는 여행과 지역, 사람과 상권을 연결하는 플랫폼을 목표로
              합니다. 작은 문의 하나가 지역 소상공인, 지자체, 여행자 모두에게
              도움이 되는 시작점이 될 수 있습니다.
            </p>
          </article>
        </div>
      </section>

      <section className="contact-cta-section">
        <div className="contact-cta-card">
          <p className="contact-section-eyebrow">LET&apos;S CONNECT</p>
          <h2>우리 지역에서 먼저 시작해보고 싶으신가요?</h2>
          <p>
            소상공인 입점, 지자체 시범 운영, 지역축제와 관광이벤트 연결,
            감성배달 상권 연계에 관심이 있다면 감성문의 쪽지 또는 이메일로
            남겨주세요.
          </p>

          <div className="contact-hero-actions">
            <Link to="/partner" className="contact-primary-button">
              제휴문의 페이지로 이동
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