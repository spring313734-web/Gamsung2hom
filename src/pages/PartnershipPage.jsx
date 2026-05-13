// 파일 경로: src/pages/PartnershipPage.jsx
// ========================================
// 📌 감성여행2 제휴문의 전용 페이지
// - 소비자 / 소상공인 / 지자체 문의를 한 페이지 안에서 선택
// - 제휴문의에서 문의하기 페이지로 이동하지 않도록 /contact 연결 제거
// - 선택한 문의 유형에 맞는 입력 섹션을 바로 표시
// - 현재 단계에서는 서버 저장 없이 접수 완료 안내만 표시
// - 다음 단계에서 Supabase inquiries 테이블 저장 기능 연결 예정
// ========================================

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./PartnershipPage.css";

const inquiryOptions = [
  {
    key: "customer",
    icon: "🙋",
    title: "소비자 문의",
    badge: "여행자 / 일반 사용자",
    description:
      "감성여행2 이용, 앱 설치, 여행지·이벤트 확인, 서비스 이용 관련 문의를 남길 수 있습니다.",
  },
  {
    key: "store",
    icon: "🏪",
    title: "소상공인 입점 문의",
    badge: "가게 / 숙소 / 체험 / 생활서비스",
    description:
      "가게 미니홈피, 감성배달, 지역상권 노출, 이벤트 참여 등 입점 상담을 남길 수 있습니다.",
  },
  {
    key: "local",
    icon: "🏛️",
    title: "지자체 제휴 문의",
    badge: "지자체 / 관광기관 / 행사 담당자",
    description:
      "지역축제, 관광이벤트, 시범운영, 지역상권 활성화 협업 문의를 남길 수 있습니다.",
  },
];

const initialForm = {
  name: "",
  organization: "",
  region: "",
  phone: "",
  email: "",
  message: "",
};

function getSelectedTitle(selectedType) {
  return inquiryOptions.find((item) => item.key === selectedType)?.title ?? "";
}

function getFormGuide(selectedType) {
  if (selectedType === "customer") {
    return {
      organizationLabel: "관련 내용",
      organizationPlaceholder: "예: 앱 이용 문의 / 이벤트 확인 / 여행지 문의",
      regionLabel: "관심 지역",
      regionPlaceholder: "예: 함양 / 부산 / 제주 / 전국",
      messagePlaceholder:
        "궁금한 내용이나 불편했던 점, 확인하고 싶은 내용을 남겨주세요.",
    };
  }

  if (selectedType === "store") {
    return {
      organizationLabel: "상호명 / 업종",
      organizationPlaceholder: "예: 감성식당 / 한식 / 카페 / 숙소",
      regionLabel: "가게 지역",
      regionPlaceholder: "예: 경남 함양군 / 부산 해운대구",
      messagePlaceholder:
        "입점 희망 내용, 가게 소개, 감성배달 또는 미니홈피 연결 희망 여부를 남겨주세요.",
    };
  }

  return {
    organizationLabel: "기관명 / 담당부서",
    organizationPlaceholder: "예: 함양군청 관광과 / 지역축제 담당",
    regionLabel: "담당 지역",
    regionPlaceholder: "예: 경남 함양군 / 전북 남원시",
    messagePlaceholder:
      "시범운영, 지역축제, 관광이벤트, 소상공인 연계 등 협업하고 싶은 내용을 남겨주세요.",
  };
}

export default function PartnershipPage() {
  const formRef = useRef(null);
  const [selectedType, setSelectedType] = useState("store");
  const [form, setForm] = useState(initialForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedTitle = getSelectedTitle(selectedType);
  const formGuide = getFormGuide(selectedType);

  function handleSelect(type) {
    setSelectedType(type);
    setIsSubmitted(false);

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const hasName = form.name.trim().length > 0;
    const hasContact =
      form.phone.trim().length > 0 || form.email.trim().length > 0;
    const hasMessage = form.message.trim().length > 0;

    if (!hasName || !hasContact || !hasMessage) {
      alert("성함, 연락처 또는 이메일, 문의 내용을 입력해주세요.");
      return;
    }

    setIsSubmitted(true);
  }

  function handleReset() {
    setForm(initialForm);
    setIsSubmitted(false);
  }

  return (
    <div className="partnership-page">
      <section className="partnership-hero">
        <div className="partnership-hero-inner">
          <p className="partnership-badge">Partnership</p>
          <h1>감성여행2 제휴문의</h1>
          <p className="partnership-hero-text">
            소비자, 소상공인, 지자체 문의를 한 페이지에서 선택하고 바로 남길 수
            있도록 정리했습니다.
            <br />
            감성여행2는 여행자와 지역상권, 지자체를 함께 연결하는 지역상생
            플랫폼을 준비하고 있습니다.
          </p>

          <div className="partnership-hero-actions">
            <button
              type="button"
              className="partnership-primary-button"
              onClick={() => handleSelect("store")}
            >
              소상공인 입점 문의
            </button>

            <button
              type="button"
              className="partnership-secondary-button"
              onClick={() => handleSelect("local")}
            >
              지자체 제휴 문의
            </button>
          </div>
        </div>
      </section>

      <section className="partnership-section">
        <div className="partnership-section-head">
          <p className="section-eyebrow">SELECT INQUIRY TYPE</p>
          <h2>어떤 문의를 남기시겠어요?</h2>
          <p>
            아래에서 해당되는 유형을 선택하면 같은 페이지 안에서 바로 문의 입력
            영역이 열립니다.
          </p>
        </div>

        <div className="partnership-card-grid">
          {inquiryOptions.map((item) => (
            <article
              key={item.key}
              className={`partnership-info-card ${
                selectedType === item.key ? "active" : ""
              }`}
            >
              <div className="card-icon">{item.icon}</div>
              <p className="section-eyebrow">{item.badge}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <button
                type="button"
                className={
                  selectedType === item.key
                    ? "partnership-primary-button"
                    : "partnership-secondary-button"
                }
                onClick={() => handleSelect(item.key)}
              >
                {item.title} 선택
              </button>
            </article>
          ))}
        </div>
      </section>

      <section ref={formRef} className="partnership-section alt">
        <div className="partnership-section-head">
          <p className="section-eyebrow">INQUIRY FORM</p>
          <h2>{selectedTitle}</h2>
          <p>
            필요한 내용을 남겨주시면 확인 후 연락드릴 수 있도록 준비하겠습니다.
            현재는 화면 접수 단계이며, 다음 작업에서 Supabase 저장 기능을
            연결합니다.
          </p>
        </div>

        <div className="partnership-cta-card">
          {isSubmitted ? (
            <div className="partnership-section-head">
              <p className="section-eyebrow">RECEIVED</p>
              <h2>문의가 접수되었습니다</h2>
              <p>
                남겨주신 내용을 확인 후 연락드릴 수 있도록 준비하겠습니다.
                빠른 확인이 필요한 경우 연락처나 이메일을 정확히 남겨주세요.
              </p>

              <div className="partnership-cta-actions">
                <button
                  type="button"
                  className="partnership-primary-button"
                  onClick={handleReset}
                >
                  새 문의 남기기
                </button>

                <Link to="/" className="partnership-secondary-button">
                  홈으로 돌아가기
                </Link>
              </div>
            </div>
          ) : (
            <form className="partnership-form" onSubmit={handleSubmit}>
              <label>
                <span>문의 유형</span>
                <select
                  name="selectedType"
                  value={selectedType}
                  onChange={(event) => handleSelect(event.target.value)}
                >
                  {inquiryOptions.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>성함 / 담당자명</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="예: 홍길동"
                />
              </label>

              <label>
                <span>{formGuide.organizationLabel}</span>
                <input
                  name="organization"
                  type="text"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder={formGuide.organizationPlaceholder}
                />
              </label>

              <label>
                <span>{formGuide.regionLabel}</span>
                <input
                  name="region"
                  type="text"
                  value={form.region}
                  onChange={handleChange}
                  placeholder={formGuide.regionPlaceholder}
                />
              </label>

              <label>
                <span>연락처</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="예: 010-0000-0000"
                />
              </label>

              <label>
                <span>이메일</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="예: info@example.com"
                />
              </label>

              <label>
                <span>문의 내용</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={formGuide.messagePlaceholder}
                  rows={6}
                />
              </label>

              <div className="partnership-cta-actions">
                <button type="submit" className="partnership-primary-button">
                  문의 접수하기
                </button>

                <Link to="/" className="partnership-secondary-button">
                  홈으로 돌아가기
                </Link>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}