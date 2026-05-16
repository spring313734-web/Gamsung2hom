// 파일 경로: src/pages/BusinessSignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 소상공인 간편 입점 페이지
// - 감성배달 앱의 "소상공인 간편 입점" 흐름을 홈페이지에 맞게 구성
// - 사업자번호를 로그인 아이디(username)로 사용
// - 필수 정보: 가게명 / 대표자명 / 사업자번호 / 휴대폰 / 비밀번호
// - 선택 정보: 주소 / 업종 / 대표 전화 / 이메일 / 한 줄 소개
// - 입점 이용권: 365일 / 100,000원 / 카드결제 또는 계좌이체 선택
// - Supabase Auth 계정 생성 후 public.profiles에 공통 회원 정보 저장
// - owner_profiles / owner_subscriptions 저장은 테이블 구조가 맞으면 함께 시도
// ========================================

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./BusinessSignupPage.css";

const SUBSCRIPTION_PRICE = 100000;
const SUBSCRIPTION_DAYS = 365;

const INITIAL_FORM = {
  storeName: "",
  ownerName: "",
  businessNumber: "",
  phone: "",
  password: "",
  passwordConfirm: "",
  address: "",
  businessType: "",
  storePhone: "",
  email: "",
  intro: "",
};

function normalizeBusinessNumber(value) {
  return value.replace(/\D/g, "").slice(0, 10);
}

function normalizePhone(value) {
  return value.trim();
}

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function formatPrice(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function getInternalBusinessEmail(businessNumber) {
  return `biz-${businessNumber}@gamsung-biz.com`;
}

function getSignupErrorMessage(error) {
  const message = error?.message || "";

  if (message.includes("already registered")) {
    return "이미 가입된 이메일입니다. 다른 이메일을 사용하거나 로그인해주세요.";
  }

  if (message.includes("duplicate key")) {
    return "이미 사용 중인 사업자번호 또는 계정 정보입니다.";
  }

  if (message.includes("Password")) {
    return "비밀번호 조건을 다시 확인해주세요.";
  }

  return message || "소상공인 입점 처리 중 문제가 발생했습니다.";
}

function getExpiresAt() {
  const date = new Date();
  date.setDate(date.getDate() + SUBSCRIPTION_DAYS);
  return date.toISOString();
}

export default function BusinessSignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const safeStoreName = form.storeName.trim();
  const safeOwnerName = form.ownerName.trim();
  const safeBusinessNumber = normalizeBusinessNumber(form.businessNumber);
  const safePhone = normalizePhone(form.phone);
  const safeAddress = form.address.trim();
  const safeBusinessType = form.businessType.trim();
  const safeStorePhone = normalizePhone(form.storePhone);
  const safeEmail = normalizeEmail(form.email);
  const safeIntro = form.intro.trim();

  const authEmail = safeEmail || getInternalBusinessEmail(safeBusinessNumber);

  const isPasswordValid = form.password.length >= 8;
  const isPasswordSame =
    form.password.length > 0 && form.password === form.passwordConfirm;

  const canSubmit = Boolean(
    safeStoreName &&
      safeOwnerName &&
      safeBusinessNumber.length === 10 &&
      safePhone &&
      isPasswordValid &&
      isPasswordSame &&
      !submitting
  );

  const submitLabel = useMemo(() => {
    if (submitting) return "입점 처리 중...";
    return paymentMethod === "card"
      ? "카드결제하고 365일 입점 시작"
      : "계좌이체로 365일 입점 신청";
  }, [submitting, paymentMethod]);

  function updateForm(key, value) {
    const nextValue =
      key === "businessNumber" ? normalizeBusinessNumber(value) : value;

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    setResultMessage("");
    setErrorMessage("");
  }

  async function checkBusinessNumberAvailable() {
    const { data, error } = await supabase.rpc(
      "is_profile_username_available",
      {
        target_username: safeBusinessNumber,
      }
    );

    if (error) {
      console.warn("[소상공인 가입] 사업자번호 중복 확인 함수 실패:", error);
      return true;
    }

    return Boolean(data);
  }

  async function saveCommonProfile(userId) {
    const payload = {
      role: "biz",
      name: safeOwnerName,
      email: authEmail,
      phone: safePhone,
      user_id: userId,
      nickname: safeStoreName,
      address: safeAddress,
      username: safeBusinessNumber,
      member_type: "business",
      public_name_type: "nickname",
      provider: "email",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("[소상공인 가입] profiles 저장 실패:", error);
      throw error;
    }
  }

  async function trySaveOwnerProfile(userId) {
    const payload = {
      user_id: userId,
      store_name: safeStoreName,
      owner_name: safeOwnerName,
      business_number: safeBusinessNumber,
      business_type: safeBusinessType,
      store_address: safeAddress,
      store_phone: safeStorePhone || safePhone,
      store_email: authEmail,
      intro: safeIntro,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("owner_profiles")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.warn("[소상공인 가입] owner_profiles 저장 확인 필요:", error);
      return false;
    }

    return true;
  }

  async function trySaveOwnerSubscription(userId) {
    const payload = {
      user_id: userId,
      price: SUBSCRIPTION_PRICE,
      payment_method: paymentMethod,
      status: "active",
      started_at: new Date().toISOString(),
      expires_at: getExpiresAt(),
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("owner_subscriptions").insert(payload);

    if (error) {
      console.warn(
        "[소상공인 가입] owner_subscriptions 저장 확인 필요:",
        error
      );
      return false;
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    setResultMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다. 환경변수를 확인해주세요.");
      return;
    }

    if (!canSubmit) {
      setErrorMessage("필수 정보를 모두 입력하고 비밀번호를 확인해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      const isAvailable = await checkBusinessNumberAvailable();

      if (!isAvailable) {
        throw new Error(
          "이미 등록된 사업자번호입니다. 로그인하거나 다른 번호를 확인해주세요."
        );
      }

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: form.password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? window.location.origin : undefined,
          data: {
            role: "biz",
            name: safeOwnerName,
            username: safeBusinessNumber,
            nickname: safeStoreName,
            phone: safePhone,
            address: safeAddress,
            business_number: safeBusinessNumber,
            business_type: safeBusinessType,
            store_phone: safeStorePhone,
            store_email: authEmail,
            intro: safeIntro,
            public_name_type: "nickname",
            provider: "email",
          },
        },
      });

      if (error) {
        throw error;
      }

      const createdUser = data?.user;

      if (!createdUser?.id) {
        throw new Error("소상공인 계정 ID를 생성하지 못했습니다.");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData?.session?.user?.id);

      if (!hasSession) {
        setResultMessage(
          "소상공인 가입 요청이 접수되었습니다. 이메일 인증이 켜져 있다면 인증 후 로그인해주세요."
        );
        return;
      }

      await saveCommonProfile(createdUser.id);

      const ownerSaved = await trySaveOwnerProfile(createdUser.id);
      const subscriptionSaved = await trySaveOwnerSubscription(createdUser.id);

      if (ownerSaved && subscriptionSaved) {
        setResultMessage(
          "소상공인 입점 가입이 완료되었습니다. 홈 화면으로 이동합니다."
        );
      } else {
        setResultMessage(
          "공통 계정은 저장되었습니다. 소상공인 전용 테이블은 구조 확인 후 추가 조정이 필요할 수 있습니다."
        );
      }

      window.setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (error) {
      const message = getSignupErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="business-signup-page">
      <section className="business-signup-wrap">
        <div className="business-signup-hero">
          <Link to="/signup" className="business-signup-back">
            ← 회원가입 유형 선택으로 돌아가기
          </Link>

          <p className="business-signup-badge">감성배달 · 감성여행2 입점</p>

          <h1>
            소상공인 1분 간편 입점
            <br />
            필수 정보만 입력하고 365일 이용을 시작하세요
          </h1>

          <p className="business-signup-desc">
            사업자번호가 로그인 아이디로 사용됩니다. 주소, 업종, 사진,
            메뉴는 가입 후 내 가게 관리에서 천천히 수정해도 됩니다.
          </p>
        </div>

        <form className="business-signup-form" onSubmit={handleSubmit}>
          <div className="business-signup-grid">
            <section className="business-card required-card">
              <div className="business-card-head">
                <div>
                  <span className="business-step">STEP 1</span>
                  <h2>필수 정보</h2>
                </div>
                <strong>필수</strong>
              </div>

              <div className="business-field-list">
                <label className="business-field">
                  <span>가게명 / 상호명</span>
                  <input
                    value={form.storeName}
                    onChange={(event) =>
                      updateForm("storeName", event.target.value)
                    }
                    placeholder="예: 감성식당"
                    disabled={submitting}
                  />
                </label>

                <label className="business-field">
                  <span>대표자명</span>
                  <input
                    value={form.ownerName}
                    onChange={(event) =>
                      updateForm("ownerName", event.target.value)
                    }
                    placeholder="대표자명을 입력해주세요"
                    disabled={submitting}
                  />
                </label>

                <label className="business-field">
                  <span>사업자번호 10자리</span>
                  <input
                    value={form.businessNumber}
                    onChange={(event) =>
                      updateForm("businessNumber", event.target.value)
                    }
                    placeholder="하이픈 없이 입력"
                    inputMode="numeric"
                    disabled={submitting}
                  />
                  <small>사업자번호가 로그인 아이디로 사용됩니다.</small>
                </label>

                <label className="business-field">
                  <span>휴대폰 번호</span>
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    placeholder="010-0000-0000"
                    disabled={submitting}
                  />
                </label>

                <div className="business-two-grid">
                  <label className="business-field">
                    <span>비밀번호</span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        updateForm("password", event.target.value)
                      }
                      placeholder="8자 이상"
                      disabled={submitting}
                    />
                  </label>

                  <label className="business-field">
                    <span>비밀번호 확인</span>
                    <input
                      type="password"
                      value={form.passwordConfirm}
                      onChange={(event) =>
                        updateForm("passwordConfirm", event.target.value)
                      }
                      placeholder="비밀번호 재입력"
                      disabled={submitting}
                    />
                  </label>
                </div>

                <p
                  className={
                    form.passwordConfirm
                      ? isPasswordSame
                        ? "business-help good"
                        : "business-help bad"
                      : "business-help"
                  }
                >
                  {form.passwordConfirm
                    ? isPasswordSame
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."
                    : "비밀번호는 8자 이상 입력해주세요."}
                </p>
              </div>
            </section>

            <aside className="business-card pass-card">
              <div className="business-card-head">
                <div>
                  <span className="business-step">STEP 2</span>
                  <h2>입점 이용권</h2>
                </div>
                <strong>365일</strong>
              </div>

              <div className="pass-price-box">
                <p>이용기간</p>
                <strong>결제 완료 후 {SUBSCRIPTION_DAYS}일</strong>
              </div>

              <div className="pass-price-box highlight">
                <p>가입비</p>
                <strong>{formatPrice(SUBSCRIPTION_PRICE)}원</strong>
              </div>

              <p className="pass-desc">
                현재 단계에서는 실제 PG 결제 대신 테스트 결제 완료로 처리합니다.
                저장되는 결제/이용권 정보는 Supabase에 기록됩니다.
              </p>

              <div className="payment-toggle">
                <button
                  type="button"
                  className={paymentMethod === "card" ? "active" : ""}
                  onClick={() => setPaymentMethod("card")}
                  disabled={submitting}
                >
                  ✓ 카드결제
                </button>

                <button
                  type="button"
                  className={paymentMethod === "bank" ? "active" : ""}
                  onClick={() => setPaymentMethod("bank")}
                  disabled={submitting}
                >
                  계좌이체
                </button>
              </div>
            </aside>
          </div>

          <section className="business-card optional-card">
            <div className="business-card-head">
              <div>
                <span className="business-step">STEP 3</span>
                <h2>선택 정보</h2>
              </div>
              <strong>선택</strong>
            </div>

            <p className="optional-desc">
              주소, 업종, 대표전화, 이메일, 한 줄 소개는 가입 후 내 가게
              관리에서 천천히 수정해도 됩니다.
            </p>

            <div className="business-field-grid">
              <label className="business-field">
                <span>주소</span>
                <input
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                  placeholder="주소를 입력해주세요"
                  disabled={submitting}
                />
              </label>

              <label className="business-field">
                <span>업종 / 품목</span>
                <input
                  value={form.businessType}
                  onChange={(event) =>
                    updateForm("businessType", event.target.value)
                  }
                  placeholder="예: 음식점, 카페, 숙박, 체험"
                  disabled={submitting}
                />
              </label>

              <label className="business-field">
                <span>대표 전화</span>
                <input
                  value={form.storePhone}
                  onChange={(event) =>
                    updateForm("storePhone", event.target.value)
                  }
                  placeholder="가게 전화번호"
                  disabled={submitting}
                />
              </label>

              <label className="business-field">
                <span>이메일</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateForm("email", event.target.value)}
                  placeholder="비우면 사업자번호 기반 내부 이메일 사용"
                  disabled={submitting}
                />
                <small>비워두면 {safeBusinessNumber || "사업자번호"} 기반 내부 이메일로 가입됩니다.</small>
              </label>
            </div>

            <label className="business-field intro-field">
              <span>한 줄 소개</span>
              <textarea
                value={form.intro}
                onChange={(event) => updateForm("intro", event.target.value)}
                placeholder="예: 함양에서 20년째 운영 중인 따뜻한 한식집입니다."
                disabled={submitting}
              />
            </label>
          </section>

          <section className="business-submit-card">
            <div>
              <h2>입점 정보 미리보기</h2>
              <dl>
                <div>
                  <dt>가게명</dt>
                  <dd>{safeStoreName || "미입력"}</dd>
                </div>

                <div>
                  <dt>대표자</dt>
                  <dd>{safeOwnerName || "미입력"}</dd>
                </div>

                <div>
                  <dt>로그인 아이디</dt>
                  <dd>{safeBusinessNumber || "사업자번호 미입력"}</dd>
                </div>

                <div>
                  <dt>결제 방식</dt>
                  <dd>{paymentMethod === "card" ? "카드결제" : "계좌이체"}</dd>
                </div>
              </dl>
            </div>

            {errorMessage ? (
              <p className="business-result error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {resultMessage ? (
              <p className="business-result success">{resultMessage}</p>
            ) : null}

            <button type="submit" className="business-submit-btn" disabled={!canSubmit}>
              {submitLabel}
            </button>

            <p className="business-submit-help">
              필수: 가게명 / 대표자명 / 사업자번호 10자리 / 휴대폰 번호 /
              비밀번호 8자 이상
            </p>
          </section>
        </form>
      </section>
    </main>
  );
}