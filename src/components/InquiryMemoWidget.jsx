// 파일 경로: src/components/InquiryMemoWidget.jsx
// ========================================
// 📌 감성문의 쪽지 위젯
// - 홈페이지 오른쪽 아래 고정 문의 버튼
// - 방문자가 문의 유형 / 성함 / 연락처 / 이메일 / 내용을 남길 수 있는 간단 쪽지창
// - Supabase inquiries 테이블에 문의 내용을 실제 저장
// - 저장 성공 시 접수 완료 UI 표시
// ========================================

import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./InquiryMemoWidget.css";

const inquiryTypes = [
  "소비자 문의",
  "소상공인 입점 문의",
  "지자체 제휴 문의",
  "서비스 이용 문의",
  "기타 문의",
];

const initialForm = {
  type: inquiryTypes[0],
  name: "",
  phone: "",
  email: "",
  message: "",
};

function getCurrentPageInfo() {
  if (typeof window === "undefined") {
    return {
      source_path: "/",
      source_url: "",
    };
  }

  return {
    source_path: window.location.pathname || "/",
    source_url: window.location.href || "",
  };
}

export default function InquiryMemoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setErrorMessage("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSaving) return;

    const trimmedForm = {
      type: form.type.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    const hasName = trimmedForm.name.length > 0;
    const hasContact =
      trimmedForm.phone.length > 0 || trimmedForm.email.length > 0;
    const hasMessage = trimmedForm.message.length > 0;

    if (!hasName || !hasContact || !hasMessage) {
      alert("성함/상호명, 연락처 또는 이메일, 문의 내용을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const pageInfo = getCurrentPageInfo();

    const payload = {
      inquiry_type: trimmedForm.type,
      name: trimmedForm.name,
      phone: trimmedForm.phone || null,
      email: trimmedForm.email || null,
      message: trimmedForm.message,
      status: "접수",
      source_path: pageInfo.source_path,
      source_url: pageInfo.source_url,
    };

    try {
      const { error } = await supabase.from("inquiries").insert(payload);

      if (error) {
        console.error("[감성문의] Supabase 저장 실패:", error);
        setErrorMessage(
          "문의 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("[감성문의] 예외 발생:", error);
      setErrorMessage(
        "문의 저장 중 문제가 발생했습니다. 인터넷 연결을 확인한 뒤 다시 시도해주세요."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setIsSubmitted(false);
    setErrorMessage("");
  }

  function handleClose() {
    setIsOpen(false);
    setErrorMessage("");
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
              onClick={handleClose}
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
                  autoComplete="name"
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
                  autoComplete="tel"
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
                  autoComplete="email"
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

              {errorMessage ? (
                <p className="inquiry-help-text">{errorMessage}</p>
              ) : (
                <p className="inquiry-help-text">
                  남겨주신 문의는 감성여행2 관리자 확인용 문의함에 저장됩니다.
                  연락처 또는 이메일 중 하나는 꼭 입력해주세요.
                </p>
              )}

              <button
                type="submit"
                className="inquiry-primary-button"
                disabled={isSaving}
              >
                {isSaving ? "저장 중..." : "쪽지 보내기"}
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