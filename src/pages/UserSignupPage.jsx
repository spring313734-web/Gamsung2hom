// 파일 경로: src/pages/UserSignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 일반회원 가입 페이지
// - 감성여행2 앱의 일반회원 가입 구조와 동일한 항목 구성
// - 내국인 / 외국인 구분
// - 이름 / 아이디 / 별명 / 공개 이름 선택
// - 생년월일 / 연령 공개 여부 / 성별 공개 여부
// - 전화번호 / 이메일 / 주소 / 비밀번호 입력
// - 카카오 / 구글 / 네이버 소셜 가입 버튼 자리 포함
// - 현재 단계는 화면 구성과 기본 입력 검증까지 처리
// - Supabase Auth 저장 연결은 다음 단계에서 AuthContext / Supabase 파일 확인 후 연결
// ========================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./UserSignupPage.css";

const currentYear = new Date().getFullYear();

const initialForm = {
  nationality: "local",
  name: "",
  loginId: "",
  nickname: "",
  publicNameType: "loginId",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  showAge: true,
  ageGroup: "",
  showGender: false,
  gender: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  passwordConfirm: "",
};

function getAgeGroup(year) {
  if (!year) return "";

  const age = currentYear - Number(year) + 1;

  if (age < 10) return "10세 미만";
  if (age < 20) return "10대";
  if (age < 30) return "20대";
  if (age < 40) return "30대";
  if (age < 50) return "40대";
  if (age < 60) return "50대";
  if (age < 70) return "60대";
  return "70대 이상";
}

function isValidLoginId(value) {
  return /^[a-zA-Z0-9_.-]{4,20}$/.test(value);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^[0-9]{9,12}$/.test(value.replaceAll("-", ""));
}

export default function UserSignupPage() {
  const [form, setForm] = useState(initialForm);
  const [loginIdChecked, setLoginIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [message, setMessage] = useState("");

  const years = useMemo(() => {
    return Array.from({ length: 100 }, (_, index) => String(currentYear - index));
  }, []);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, "0"));
  }, []);

  const days = useMemo(() => {
    const year = Number(form.birthYear || currentYear);
    const month = Number(form.birthMonth || 1);
    const lastDay = new Date(year, month, 0).getDate();

    return Array.from({ length: lastDay }, (_, index) =>
      String(index + 1).padStart(2, "0")
    );
  }, [form.birthYear, form.birthMonth]);

  const publicNamePreview =
    form.publicNameType === "nickname"
      ? form.nickname || "별명 미입력"
      : form.loginId || "아이디 미입력";

  const agePreview = form.showAge
    ? form.ageGroup || getAgeGroup(form.birthYear) || "연령대 미선택"
    : "비공개";

  const genderPreview = form.showGender
    ? form.gender || "성별 미선택"
    : "비공개";

  const canSubmit =
    form.name.trim() &&
    form.loginId.trim() &&
    loginIdChecked &&
    form.nickname.trim() &&
    nicknameChecked &&
    form.birthYear &&
    form.birthMonth &&
    form.birthDay &&
    form.ageGroup &&
    form.gender &&
    form.phone.trim() &&
    form.email.trim() &&
    form.password.length >= 8 &&
    form.passwordConfirm.length >= 8 &&
    form.password === form.passwordConfirm &&
    isValidEmail(form.email) &&
    isValidPhone(form.phone);

  function updateField(name, value) {
    setMessage("");

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "birthYear") {
        next.ageGroup = getAgeGroup(value);
      }

      return next;
    });

    if (name === "loginId") {
      setLoginIdChecked(false);
    }

    if (name === "nickname") {
      setNicknameChecked(false);
    }
  }

  function handleCheckLoginId() {
    if (!form.loginId.trim()) {
      setMessage("아이디를 입력해주세요.");
      return;
    }

    if (!isValidLoginId(form.loginId)) {
      setMessage("아이디는 영문, 숫자, 점, 밑줄, 하이픈 조합으로 4~20자까지 가능합니다.");
      return;
    }

    setLoginIdChecked(true);
    setMessage("사용 가능한 아이디 형식입니다. 실제 중복 확인은 Supabase 연결 단계에서 처리합니다.");
  }

  function handleCheckNickname() {
    if (!form.nickname.trim()) {
      setMessage("별명 또는 예명을 입력해주세요.");
      return;
    }

    if (form.nickname.trim().length < 2) {
      setMessage("별명은 2자 이상 입력해주세요.");
      return;
    }

    setNicknameChecked(true);
    setMessage("사용 가능한 별명 형식입니다. 실제 중복 확인은 Supabase 연결 단계에서 처리합니다.");
  }

  function handleSocialSignup(provider) {
    setMessage(
      `${provider} 가입은 다음 단계에서 Supabase 소셜 로그인 설정과 연결합니다. 가입 후에는 이 화면의 추가 정보를 같은 구조로 저장하게 됩니다.`
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      setMessage("필수 항목을 모두 입력하고 아이디 / 별명 중복 확인을 완료해주세요.");
      return;
    }

    const signupPayload = {
      role: "user",
      provider: "email",
      nationality: form.nationality,
      name: form.name.trim(),
      login_id: form.loginId.trim(),
      nickname: form.nickname.trim(),
      public_name_type: form.publicNameType,
      public_name_preview: publicNamePreview,
      birth_date: `${form.birthYear}-${form.birthMonth}-${form.birthDay}`,
      show_age: form.showAge,
      age_group: form.ageGroup,
      show_gender: form.showGender,
      gender: form.gender,
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    };

    console.log("감성여행2 일반회원 가입 입력값:", signupPayload);

    setMessage(
      "일반회원 가입 입력이 완료되었습니다. 다음 단계에서 이 값을 Supabase Auth와 공통 프로필 테이블에 저장하도록 연결하면 됩니다."
    );
  }

  return (
    <main className="user-signup-page">
      <section className="user-signup-head">
        <Link to="/signup" className="user-signup-back">
          ← 회원가입 유형 선택으로 돌아가기
        </Link>

        <p className="user-signup-eyebrow">감성여행2 일반회원 가입</p>

        <h1>감성여행2와 감성배달을 함께 이용할 일반회원 정보를 입력해주세요</h1>

        <p>
          홈페이지에서 가입해도 감성여행2 앱과 같은 회원 구조로 저장되는 방향입니다.
          카카오, 구글, 네이버 가입도 최종 회원 정보 구성은 동일하게 맞춥니다.
        </p>
      </section>

      <form className="user-signup-form" onSubmit={handleSubmit}>
        <section className="signup-card">
          <div className="signup-card-title-row">
            <div>
              <p className="signup-step-label">STEP 1</p>
              <h2>가입 방식</h2>
            </div>
          </div>

          <div className="social-signup-grid">
            <button
              type="button"
              className="social-button kakao"
              onClick={() => handleSocialSignup("카카오")}
            >
              카카오로 가입
            </button>

            <button
              type="button"
              className="social-button google"
              onClick={() => handleSocialSignup("구글")}
            >
              구글로 가입
            </button>

            <button
              type="button"
              className="social-button naver"
              onClick={() => handleSocialSignup("네이버")}
            >
              네이버로 가입
            </button>
          </div>

          <div className="signup-divider">
            <span>또는 이메일로 가입</span>
          </div>

          <div className="signup-choice-row">
            <button
              type="button"
              className={form.nationality === "local" ? "choice active" : "choice"}
              onClick={() => updateField("nationality", "local")}
            >
              내국인
            </button>

            <button
              type="button"
              className={form.nationality === "foreign" ? "choice active" : "choice"}
              onClick={() => updateField("nationality", "foreign")}
            >
              외국인
            </button>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-card-title-row">
            <div>
              <p className="signup-step-label">STEP 2</p>
              <h2>기본 정보</h2>
            </div>
          </div>

          <div className="form-grid">
            <label className="form-field full">
              <span>이름 <b>필수</b></span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="이름을 입력해주세요"
              />
            </label>

            <label className="form-field with-button">
              <span>아이디 <b>필수</b></span>
              <div className="input-button-row">
                <input
                  value={form.loginId}
                  onChange={(event) => updateField("loginId", event.target.value)}
                  placeholder="영문, 숫자, 점, 밑줄, 하이픈 4~20자"
                />
                <button type="button" onClick={handleCheckLoginId}>
                  중복 확인
                </button>
              </div>
              {loginIdChecked ? <small className="ok-text">아이디 확인 완료</small> : null}
            </label>

            <label className="form-field with-button">
              <span>별명 / 예명 <b>필수</b></span>
              <div className="input-button-row">
                <input
                  value={form.nickname}
                  onChange={(event) => updateField("nickname", event.target.value)}
                  placeholder="공개 프로필에 사용할 별명"
                />
                <button type="button" onClick={handleCheckNickname}>
                  중복 확인
                </button>
              </div>
              {nicknameChecked ? <small className="ok-text">별명 확인 완료</small> : null}
            </label>
          </div>

          <div className="public-name-box">
            <p className="mini-title">공개 이름 선택</p>
            <p className="mini-desc">공개 프로필에 보일 이름을 선택해주세요.</p>

            <div className="signup-choice-row">
              <button
                type="button"
                className={form.publicNameType === "loginId" ? "choice active" : "choice"}
                onClick={() => updateField("publicNameType", "loginId")}
              >
                아이디
              </button>

              <button
                type="button"
                className={form.publicNameType === "nickname" ? "choice active" : "choice"}
                onClick={() => updateField("publicNameType", "nickname")}
              >
                별명
              </button>
            </div>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-card-title-row">
            <div>
              <p className="signup-step-label">STEP 3</p>
              <h2>생년월일 / 공개 설정</h2>
            </div>
          </div>

          <p className="helper-text">
            생년월일은 공개하지 않고, 선택에 따라 연령대만 공개할 수 있습니다.
          </p>

          <div className="birth-grid">
            <label className="form-field">
              <span>년도 <b>필수</b></span>
              <select
                value={form.birthYear}
                onChange={(event) => updateField("birthYear", event.target.value)}
              >
                <option value="">년도 선택</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>월 <b>필수</b></span>
              <select
                value={form.birthMonth}
                onChange={(event) => updateField("birthMonth", event.target.value)}
              >
                <option value="">월 선택</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              <span>일 <b>필수</b></span>
              <select
                value={form.birthDay}
                onChange={(event) => updateField("birthDay", event.target.value)}
              >
                <option value="">일 선택</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="privacy-grid">
            <div className="privacy-box">
              <div>
                <p className="mini-title">연령</p>
                <p className="mini-desc">{form.showAge ? "표시" : "비공개"}</p>
              </div>

              <button
                type="button"
                className={form.showAge ? "toggle active" : "toggle"}
                onClick={() => updateField("showAge", !form.showAge)}
                aria-label="연령 공개 여부 변경"
              >
                <span />
              </button>
            </div>

            <div className="privacy-box">
              <div>
                <p className="mini-title">성별</p>
                <p className="mini-desc">{form.showGender ? "표시" : "비공개"}</p>
              </div>

              <button
                type="button"
                className={form.showGender ? "toggle active" : "toggle"}
                onClick={() => updateField("showGender", !form.showGender)}
                aria-label="성별 공개 여부 변경"
              >
                <span />
              </button>
            </div>
          </div>

          <div className="form-grid two">
            <label className="form-field">
              <span>연령대 <b>필수</b></span>
              <select
                value={form.ageGroup}
                onChange={(event) => updateField("ageGroup", event.target.value)}
              >
                <option value="">연령 선택</option>
                <option value="10세 미만">10세 미만</option>
                <option value="10대">10대</option>
                <option value="20대">20대</option>
                <option value="30대">30대</option>
                <option value="40대">40대</option>
                <option value="50대">50대</option>
                <option value="60대">60대</option>
                <option value="70대 이상">70대 이상</option>
              </select>
            </label>

            <label className="form-field">
              <span>성별 <b>필수</b></span>
              <select
                value={form.gender}
                onChange={(event) => updateField("gender", event.target.value)}
              >
                <option value="">성별 선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="none">선택 안 함</option>
              </select>
            </label>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-card-title-row">
            <div>
              <p className="signup-step-label">STEP 4</p>
              <h2>연락 정보</h2>
            </div>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>전화번호 <b>필수</b></span>
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="01012345678"
              />
            </label>

            <label className="form-field">
              <span>이메일 <b>필수</b></span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="example@email.com"
              />
            </label>

            <label className="form-field full">
              <span>주소 <em>선택</em></span>
              <input
                value={form.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="주소를 입력해주세요"
              />
            </label>
          </div>
        </section>

        <section className="signup-card">
          <div className="signup-card-title-row">
            <div>
              <p className="signup-step-label">STEP 5</p>
              <h2>비밀번호</h2>
            </div>
          </div>

          <div className="form-grid two">
            <label className="form-field">
              <span>비밀번호 <b>필수</b></span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="8자 이상"
              />
            </label>

            <label className="form-field">
              <span>비밀번호 확인 <b>필수</b></span>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={(event) =>
                  updateField("passwordConfirm", event.target.value)
                }
                placeholder="비밀번호를 다시 입력해주세요"
              />
            </label>
          </div>

          {form.passwordConfirm && form.password !== form.passwordConfirm ? (
            <p className="error-text">비밀번호가 서로 다릅니다.</p>
          ) : null}
        </section>

        <section className="signup-preview-card">
          <h2>공개 프로필 미리보기</h2>

          <div className="preview-grid">
            <div>
              <span>공개 이름</span>
              <strong>{publicNamePreview}</strong>
            </div>

            <div>
              <span>연령</span>
              <strong>{agePreview}</strong>
            </div>

            <div>
              <span>성별</span>
              <strong>{genderPreview}</strong>
            </div>

            <div>
              <span>회원 구분</span>
              <strong>{form.nationality === "local" ? "내국인" : "외국인"}</strong>
            </div>
          </div>
        </section>

        {message ? <p className="signup-message">{message}</p> : null}

        <button
          type="submit"
          className="signup-submit-button"
          disabled={!canSubmit}
        >
          일반회원 가입하기
        </button>

        <p className="signup-bottom-guide">
          필수: 이름 / 아이디 중복확인 / 별명 중복확인 / 생년월일 / 연령 /
          성별 / 전화번호 / 이메일 / 비밀번호 8자 이상
          <br />
          선택: 주소
        </p>
      </form>
    </main>
  );
}