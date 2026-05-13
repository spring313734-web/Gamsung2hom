// 파일 경로: src/components/InquiryMemoWidget.jsx
// ========================================
// 📌 감성문의 쪽지 위젯
// - 홈페이지 오른쪽 아래 고정 문의 버튼
// - 방문자가 문의 유형 / 성함 / 연락처 / 이메일 / 내용을 남길 수 있는 간단 쪽지창
// - 현재 단계에서는 서버 저장 없이 접수 완료 UI만 제공
// - 다음 단계에서 Supabase inquiries 테이블 저장 기능 연결 예정
// ========================================

import { useState } from "react";
import "./InquiryMemoWidget.css";

const inquiryTypes = [
  "소상공인 입점 문의",
  "지자체 제휴 문의",
  "일반 문의",
  "서비스 이용 문의",
];

const initialForm = {
  type: inquiryTypes[0],
  name: "",
  phone: "",
  email: "",
  message: "",
};

export default function InquiryMemoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);

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
    const hasContact = form.phone.trim().length > 0 || form.email.trim().length > 0;
    const hasMessage = form.message.trim().length > 0;

    if (!hasName || !hasContact || !hasMessage) {
      alert("성함/상호명, 연락처 또는 이메일, 문의 내용을 입력해주세요.");
      return;
    }

    setIsSubmitted(true);
  }

  function handleReset() {
    setForm(initialForm);
    setIsSubmitted(false);
  }

  return (
    <div className={`inquiry-widget ${isOpen ? "open" : ""}`}>
      {isOpen ? (
        <section className="inquiry-panel" aria-label="감성문의 쪽지창">
          <div className="inquiry-panel-head">
            <div>
              <p className="inquiry-kicker">GAMSUNG MESSAGE</p>
              <h2>감성문의</h2>
            </div>

            <button
              type="button"
              className="inquiry-close-button"
              aria-label="감성문의 닫기"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          {isSubmitted ? (
            <div className="inquiry-success">
              <div className="inquiry-success-icon">✓</div>
              <h3>문의가 접수되었습니다</h3>
              <p>
                남겨주신 내용을 확인 후 연락드릴 수 있도록 준비하겠습니다.
                빠른 응답이 필요한 경우 전화번호나 이메일을 정확히 남겨주세요.
              </p>

              <button
                type="button"
                className="inquiry-primary-button"
                onClick={handleReset}
              >
                새 문의 남기기
              </button>
            </div>
          ) : (
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <label>
                <span>문의 유형</span>
                <select name="type" value={form.type} onChange={handleChange}>
                  {inquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>성함 / 상호명</span>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="예: 홍길동 / 감성식당"
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
                  placeholder="문의 내용을 남겨주세요."
                  rows={5}
                />
              </label>

              <p className="inquiry-help-text">
                현재는 간단 문의 접수 화면입니다. 다음 단계에서 문의 내용 저장과
                관리자 확인 기능을 연결할 예정입니다.
              </p>

              <button type="submit" className="inquiry-primary-button">
                쪽지 보내기
              </button>
            </form>
          )}
        </section>
      ) : null}

      <button
        type="button"
        className="inquiry-floating-button"
        aria-label="감성문의 열기"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="inquiry-floating-icon">💬</span>
        <span className="inquiry-floating-text">감성문의</span>
      </button>
    </div>
  );
}