// 파일 경로: src/pages/UserSignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 일반회원 가입 페이지
// - 감성여행2 앱 일반회원 가입 구조와 동일한 기본 항목 구성
// - 내국인 / 외국인, 이름, 아이디, 별명, 공개 이름 선택
// - 생년월일, 연령대 공개 여부, 성별 공개 여부 구성
// - 전화번호, 이메일, 주소, 비밀번호 입력 구성
// - 카카오 / 구글 / 네이버 가입 버튼 자리 포함
// - 현재 단계는 화면 구조와 필수값 검증만 처리
// - Supabase 실제 회원가입 저장은 다음 단계에서 연결
// ========================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./UserSignupPage.css";

const CURRENT_YEAR = new Date().getFullYear();

const YEARS = Array.from({ length: 90 }, (_, index) =>
  String(CURRENT_YEAR - index)
);

const MONTHS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);

const DAYS = Array.from({ length: 31 }, (_, index) =>
  String(index + 1).padStart(2, "0")
);

const AGE_GROUPS = [
  "10대",
  "20대",
  "30대",
  "40대",
  "50대",
  "60대",
  "70대 이상",
];

const GENDERS = ["남성", "여성", "선택 안 함"];

const INITIAL_FORM = {
  name: "",
  userId: "",
  nickname: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  ageGroup: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  password: "",
  passwordConfirm: "",
};

export default function UserSignupPage() {
  const [memberType, setMemberType] = useState("local");
  const [publicNameType, setPublicNameType] = useState("userId");
  const [showAge, setShowAge] = useState(true);
  const [showGender, setShowGender] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [idChecked, setIdChecked] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const isPasswordValid = form.password.length >= 8;
  const isPasswordSame =
    form.password.length > 0 && form.password === form.passwordConfirm;

  const publicPreview = useMemo(() => {
    if (publicNameType === "nickname") {
      return form.nickname.trim() || "별명 미입력";
    }

    return form.userId.trim() || "아이디 미입력";
  }, [form.nickname, form.userId, publicNameType]);

  const canSubmit =
    form.name.trim() &&
    form.userId.trim() &&
    form.nickname.trim() &&
    form.birthYear &&
    form.birthMonth &&
    form.birthDay &&
    form.ageGroup &&
    form.gender &&
    form.phone.trim() &&
    form.email.trim() &&
    isPasswordValid &&
    isPasswordSame &&
    idChecked &&
    nicknameChecked;

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "userId") {
      setIdChecked(false);
    }

    if (key === "nickname") {
      setNicknameChecked(false);
    }
  }

  function handleCheckUserId() {
    const safeUserId = form.userId.trim();
    const isValidUserId = /^[a-zA-Z0-9._]{4,20}$/.test(safeUserId);

    if (!safeUserId) {
      alert("아이디를 먼저 입력해주세요.");
      return;
    }

    if (!isValidUserId) {
      alert("아이디는 영문, 숫자, 점, 밑줄만 사용해서 4~20자로 입력해주세요.");
      return;
    }

    setIdChecked(true);
    alert("임시 중복 확인 완료입니다. 다음 단계에서 Supabase 실제 중복 확인으로 연결합니다.");
  }

  function handleCheckNickname() {
    const safeNickname = form.nickname.trim();

    if (!safeNickname) {
      alert("별명 / 예명을 먼저 입력해주세요.");
      return;
    }

    if (safeNickname.length < 2 || safeNickname.length > 20) {
      alert("별명 / 예명은 2~20자로 입력해주세요.");
      return;
    }

    setNicknameChecked(true);
    alert("임시 중복 확인 완료입니다. 다음 단계에서 Supabase 실제 중복 확인으로 연결합니다.");
  }

  function handleSocialSignup(provider) {
    alert(
      `${provider} 가입은 버튼 자리만 먼저 만들었습니다. 다음 단계에서 Supabase 소셜 로그인으로 연결합니다.`
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      alert("필수 항목 입력과 중복 확인을 모두 완료해주세요.");
      return;
    }

    alert("일반회원 가입 화면 검증 완료입니다. 다음 단계에서 Supabase 저장을 연결하면 됩니다.");
  }

  return (
    <main className="user-signup-page">
      <section className="user-signup-wrap">
        <div className="user-signup-hero">
          <Link to="/signup" className="user-signup-back">
            ← 회원가입 유형 선택으로 돌아가기
          </Link>

          <p className="user-signup-badge">감성여행2 일반회원 가입</p>

          <h1>
            감성여행2와 감성배달을 함께 이용할
            <br />
            일반회원 정보를 입력해주세요
          </h1>

          <p className="user-signup-desc">
            홈페이지에서 가입해도 감성여행2 앱과 같은 회원 구조로 저장되는
            방향입니다. 카카오, 구글, 네이버 가입도 최종 회원 정보 구성은
            동일하게 맞춥니다.
          </p>
        </div>

        <form className="user-signup-form" onSubmit={handleSubmit}>
          <section className="signup-card">
            <div className="signup-card-head">
              <div>
                <span className="step-label">STEP 1</span>
                <h2>가입 방식</h2>
              </div>
              <strong>선택</strong>
            </div>

            <div className="social-grid">
              <button
                type="button"
                className="social-btn kakao"
                onClick={() => handleSocialSignup("카카오")}
              >
                카카오로 가입
              </button>

              <button
                type="button"
                className="social-btn google"
                onClick={() => handleSocialSignup("구글")}
              >
                구글로 가입
              </button>

              <button
                type="button"
                className="social-btn naver"
                onClick={() => handleSocialSignup("네이버")}
              >
                네이버로 가입
              </button>
            </div>

            <div className="divider">
              <span>또는 이메일로 가입</span>
            </div>

            <div className="choice-row">
              <button
                type="button"
                className={memberType === "local" ? "choice-btn active" : "choice-btn"}
                onClick={() => setMemberType("local")}
              >
                내국인
              </button>

              <button
                type="button"
                className={
                  memberType === "foreigner" ? "choice-btn active" : "choice-btn"
                }
                onClick={() => setMemberType("foreigner")}
              >
                외국인
              </button>
            </div>
          </section>

          <section className="signup-card">
            <div className="signup-card-head">
              <div>
                <span className="step-label">STEP 2</span>
                <h2>기본 정보</h2>
              </div>
              <strong>필수</strong>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>이름</span>
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="이름을 입력해주세요"
                />
              </label>

              <div className="form-field button-field">
                <label>
                  <span>아이디</span>
                  <input
                    value={form.userId}
                    onChange={(event) => updateForm("userId", event.target.value)}
                    placeholder="영문, 숫자, 점, 밑줄 4~20자"
                  />
                </label>

                <button type="button" onClick={handleCheckUserId}>
                  중복 확인
                </button>
              </div>

              <div className="form-field button-field">
                <label>
                  <span>별명 / 예명</span>
                  <input
                    value={form.nickname}
                    onChange={(event) =>
                      updateForm("nickname", event.target.value)
                    }
                    placeholder="공개 프로필에 사용할 별명"
                  />
                </label>

                <button type="button" onClick={handleCheckNickname}>
                  중복 확인
                </button>
              </div>
            </div>

            <div className="public-name-card">
              <h3>공개 이름 선택</h3>
              <p>공개 프로필에 보일 이름을 선택해주세요.</p>

              <div className="choice-row two">
                <button
                  type="button"
                  className={
                    publicNameType === "userId" ? "choice-btn active" : "choice-btn"
                  }
                  onClick={() => setPublicNameType("userId")}
                >
                  아이디
                </button>

                <button
                  type="button"
                  className={
                    publicNameType === "nickname"
                      ? "choice-btn active"
                      : "choice-btn"
                  }
                  onClick={() => setPublicNameType("nickname")}
                >
                  별명
                </button>
              </div>

              <div className="preview-line">
                공개 미리보기: <strong>{publicPreview}</strong>
              </div>
            </div>
          </section>

          <section className="signup-card">
            <div className="signup-card-head">
              <div>
                <span className="step-label">STEP 3</span>
                <h2>생년월일 / 공개 설정</h2>
              </div>
              <strong>필수</strong>
            </div>

            <p className="section-help">
              생년월일은 공개하지 않고, 선택에 따라 연령대만 공개할 수 있습니다.
            </p>

            <div className="birth-grid">
              <label className="form-field">
                <span>년도</span>
                <select
                  value={form.birthYear}
                  onChange={(event) => updateForm("birthYear", event.target.value)}
                >
                  <option value="">년도 선택</option>
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>월</span>
                <select
                  value={form.birthMonth}
                  onChange={(event) =>
                    updateForm("birthMonth", event.target.value)
                  }
                >
                  <option value="">월 선택</option>
                  {MONTHS.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>일</span>
                <select
                  value={form.birthDay}
                  onChange={(event) => updateForm("birthDay", event.target.value)}
                >
                  <option value="">일 선택</option>
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="setting-grid">
              <div className="setting-box">
                <div className="setting-top">
                  <div>
                    <h3>연령대</h3>
                    <p>{showAge ? "공개" : "비공개"}</p>
                  </div>

                  <button
                    type="button"
                    className={showAge ? "switch active" : "switch"}
                    onClick={() => setShowAge((prev) => !prev)}
                    aria-label="연령대 공개 여부"
                  >
                    <span />
                  </button>
                </div>

                <label className="form-field">
                  <span>연령대</span>
                  <select
                    value={form.ageGroup}
                    onChange={(event) =>
                      updateForm("ageGroup", event.target.value)
                    }
                  >
                    <option value="">연령 선택</option>
                    {AGE_GROUPS.map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="setting-box">
                <div className="setting-top">
                  <div>
                    <h3>성별</h3>
                    <p>{showGender ? "공개" : "비공개"}</p>
                  </div>

                  <button
                    type="button"
                    className={showGender ? "switch active" : "switch"}
                    onClick={() => setShowGender((prev) => !prev)}
                    aria-label="성별 공개 여부"
                  >
                    <span />
                  </button>
                </div>

                <label className="form-field">
                  <span>성별</span>
                  <select
                    value={form.gender}
                    onChange={(event) => updateForm("gender", event.target.value)}
                  >
                    <option value="">성별 선택</option>
                    {GENDERS.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </section>

          <section className="signup-card">
            <div className="signup-card-head">
              <div>
                <span className="step-label">STEP 4</span>
                <h2>연락 정보</h2>
              </div>
              <strong>필수</strong>
            </div>

            <div className="form-grid three">
              <label className="form-field">
                <span>전화번호</span>
                <input
                  value={form.phone}
                  onChange={(event) => updateForm("phone", event.target.value)}
                  placeholder="010-0000-0000"
                />
              </label>

              <label className="form-field">
                <span>이메일</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="example@email.com"
                />
              </label>

              <label className="form-field">
                <span>주소</span>
                <input
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                  placeholder="주소를 입력해주세요"
                />
              </label>
            </div>
          </section>

          <section className="signup-card">
            <div className="signup-card-head">
              <div>
                <span className="step-label">STEP 5</span>
                <h2>비밀번호</h2>
              </div>
              <strong>필수</strong>
            </div>

            <div className="form-grid two">
              <label className="form-field">
                <span>비밀번호</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => updateForm("password", event.target.value)}
                  placeholder="8자 이상"
                />
              </label>

              <label className="form-field">
                <span>비밀번호 확인</span>
                <input
                  type="password"
                  value={form.passwordConfirm}
                  onChange={(event) =>
                    updateForm("passwordConfirm", event.target.value)
                  }
                  placeholder="비밀번호를 다시 입력해주세요"
                />
              </label>
            </div>

            {form.passwordConfirm ? (
              <p className={isPasswordSame ? "password-help good" : "password-help bad"}>
                {isPasswordSame
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
            ) : (
              <p className="password-help">비밀번호는 8자 이상 입력해주세요.</p>
            )}
          </section>

          <section className="submit-card">
            <div className="profile-preview">
              <h2>공개 프로필 미리보기</h2>

              <dl>
                <div>
                  <dt>공개 이름</dt>
                  <dd>{publicPreview}</dd>
                </div>

                <div>
                  <dt>연령 정보</dt>
                  <dd>{showAge ? form.ageGroup || "연령대 미선택" : "비공개"}</dd>
                </div>

                <div>
                  <dt>성별 정보</dt>
                  <dd>{showGender ? form.gender || "성별 미선택" : "비공개"}</dd>
                </div>

                <div>
                  <dt>회원 구분</dt>
                  <dd>{memberType === "local" ? "내국인" : "외국인"}</dd>
                </div>
              </dl>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!canSubmit}
            >
              일반회원 가입하기
            </button>

            <p className="submit-help">
              필수: 이름 / 아이디 중복 확인 / 별명 중복 확인 / 생년월일 /
              연령대 / 성별 / 전화번호 / 이메일 / 비밀번호 8자 이상
              <br />
              선택: 주소
            </p>
          </section>
        </form>
      </section>
    </main>
  );
}