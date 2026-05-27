// 파일 경로: src/pages/GovSignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 지자체 / 기관 회원가입 신청 페이지
// - 지자체, 관광과, 문화관광재단, 공공기관 담당자 가입 흐름 구성
// - 제휴문의가 아니라 지자체 / 기관 계정 생성용 회원가입 화면
// - Supabase Auth 계정 생성 후 public.profiles 공통 회원방 저장
// - public.gov_profiles 지자체 전용방 저장
// - 가입 직후 approval_status는 pending 상태로 시작
// - 이용료는 홈페이지 즉시 결제가 아니라 직접 결제 / 계좌이체 / 협약 확인 후 관리자 승인 구조
// - 지역 이벤트 / 관광 이벤트 / 후기 관리 / 통계 기능은 승인 및 이용료 확인 후 연결 예정
// - 기관 식별번호와 부서 대표전화도 gov_profiles 기존 컬럼과 새 컬럼에 함께 저장
// - 앱에서 성공한 Supabase 공용 구조와 동일하게 profiles.gov_profile_id를 연결
// - Auth 트리거가 실행될 때도 예전 컬럼(org_name/email/manager 등)이 채워지도록 metadata 보강
// - 이미 계정이 있는 담당자는 로그인 / 아이디 찾기 / 비밀번호 찾기로 이동
// - gov_profiles 저장 후 한 번 더 update하여 새 컬럼과 예전 컬럼 누락을 방지
// ========================================

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import "./GovSignupPage.css";

const GOV_PAYMENT_METHOD_LABEL = "직접 결제 / 계좌이체 / 협약 후 정산";
const GOV_PAYMENT_STATUS = "직접 결제 안내 대기";
const GOV_APPROVAL_STATUS = "pending";

const INITIAL_FORM = {
  organizationName: "",
  departmentName: "",
  organizationNumber: "",
  departmentPhone: "",
  managerName: "",
  managerPhone: "",
  managerEmail: "",
  regionName: "",
  regionCode: "",
  password: "",
  passwordConfirm: "",
  memo: "",
};

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

function normalizePhoneInput(value) {
  return value.replace(/[^\d+\-\s()]/g, "").slice(0, 20);
}

function getPhoneDigits(value) {
  return value.replace(/\D/g, "");
}

function normalizePhone(value) {
  return value.trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


function getSignupErrorMessage(error) {
  const message = error?.message || "";

  if (message.includes("already registered")) {
    return "이미 가입된 이메일입니다. 다른 이메일을 사용하거나 로그인해주세요.";
  }

  if (message.includes("duplicate key")) {
    return "이미 사용 중인 계정 정보입니다. 입력값을 다시 확인해주세요.";
  }

  if (message.includes("Password")) {
    return "비밀번호 조건을 다시 확인해주세요.";
  }

  return message || "지자체 / 기관 회원가입 신청 처리 중 문제가 발생했습니다.";
}

export default function GovSignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const safeOrganizationName = form.organizationName.trim();
  const safeDepartmentName = form.departmentName.trim();
  const safeOrganizationNumber = form.organizationNumber.trim();
  const safeDepartmentPhone = normalizePhone(form.departmentPhone);
  const safeManagerName = form.managerName.trim();
  const safeManagerPhone = normalizePhone(form.managerPhone);
  const safeManagerPhoneDigits = getPhoneDigits(form.managerPhone);
  const safeManagerEmail = normalizeEmail(form.managerEmail);
  const safeRegionName = form.regionName.trim();
  const safeRegionCode = form.regionCode.trim();
  const safeMemo = form.memo.trim();

  const isPhoneValid =
    safeManagerPhoneDigits.length >= 10 &&
    safeManagerPhoneDigits.length <= 11;

  const isPasswordValid = form.password.length >= 8;
  const isPasswordSame =
    form.password.length > 0 && form.password === form.passwordConfirm;

  const canSubmit = Boolean(
    safeOrganizationName &&
      safeDepartmentName &&
      safeManagerName &&
      safeManagerPhone &&
      isPhoneValid &&
      safeManagerEmail &&
      isValidEmail(safeManagerEmail) &&
      safeRegionName &&
      isPasswordValid &&
      isPasswordSame &&
      !submitting
  );

  const submitLabel = useMemo(() => {
    if (submitting) return "지자체 / 기관 회원가입 신청 중...";
    return "지자체 / 기관 회원가입 신청하기";
  }, [submitting]);

  function updateForm(key, value) {
    const nextValue =
      key === "managerPhone" || key === "departmentPhone"
        ? normalizePhoneInput(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [key]: nextValue,
    }));

    setResultMessage("");
    setErrorMessage("");
  }

  function buildStoredMemo() {
    const memoLines = [
      safeMemo,
      safeOrganizationNumber
        ? `기관 식별번호 / 고유번호 / 사업자번호: ${safeOrganizationNumber}`
        : "",
      safeDepartmentPhone ? `부서 대표전화: ${safeDepartmentPhone}` : "",
      `이용료 처리 방식: ${GOV_PAYMENT_METHOD_LABEL}`,
      `결제 상태: ${GOV_PAYMENT_STATUS}`,
      "승인 조건: 담당자 확인 + 이용료 처리 확인 후 관리자 승인",
    ].filter(Boolean);

    return memoLines.join("\n");
  }

  async function saveGovProfile(userId) {
    const payload = {
      user_id: userId,

      // 앱과 홈페이지가 함께 쓰는 새 지자체 컬럼
      organization_name: safeOrganizationName,
      department_name: safeDepartmentName,
      manager_name: safeManagerName,
      manager_phone: safeManagerPhone,
      manager_email: safeManagerEmail,
      region_name: safeRegionName,
      region_code: safeRegionCode,
      approval_status: GOV_APPROVAL_STATUS,
      memo: buildStoredMemo(),
      updated_at: new Date().toISOString(),

      // 예전 서버 컬럼 호환용
      org_name: safeOrganizationName,
      biz_no: safeOrganizationNumber,
      rep_phone: safeDepartmentPhone || null,
      address: safeRegionName,
      email: safeManagerEmail,
      manager: safeManagerName,
    };

    // 1차 저장: 없으면 insert, 있으면 user_id 기준 갱신
    const { data: upsertData, error: upsertError } = await supabase
      .from("gov_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select("id")
      .single();

    if (upsertError) {
      console.error("[지자체 회원가입] gov_profiles upsert 실패:", upsertError);
      throw upsertError;
    }

    // 2차 보강: Auth 트리거나 예전 코드가 먼저 만든 행의 빈 컬럼까지 확실히 채움
    const { data: updateData, error: updateError } = await supabase
      .from("gov_profiles")
      .update(payload)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (updateError) {
      console.error("[지자체 회원가입] gov_profiles 보강 update 실패:", updateError);
      throw updateError;
    }

    const govProfileId = updateData?.id || upsertData?.id;

    if (!govProfileId) {
      throw new Error("지자체 / 기관 프로필 ID를 생성하지 못했습니다.");
    }

    return govProfileId;
  }

  async function saveCommonProfile(userId, govProfileId) {
    const payload = {
      role: "gov",
      member_type: "government",
      name: safeManagerName,
      email: safeManagerEmail,
      phone: safeManagerPhone,
      user_id: userId,
      nickname: safeOrganizationName,
      address: safeRegionName,
      birth_date: "",
      age_group: "",
      gender: "",
      use_nickname_as_public: true,
      show_gender_public: false,
      show_age_range_public: false,
      show_age_group_public: false,
      public_name_mode: "nickname",
      owner_profile_id: null,
      gov_profile_id: govProfileId,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select("id")
      .single();

    if (error) {
      console.error("[지자체 회원가입] profiles 저장 실패:", error);
      throw error;
    }

    return data?.id || null;
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
      setErrorMessage(
        "필수 정보를 모두 입력하고 전화번호, 이메일, 비밀번호를 확인해주세요."
      );
      return;
    }

    setSubmitting(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/signup/gov`
        : undefined;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: safeManagerEmail,
        password: form.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            role: "gov",
            member_type: "government",
            name: safeManagerName,
            nickname: safeOrganizationName,
            phone: safeManagerPhone,
            address: safeRegionName,
            organization_name: safeOrganizationName,
            department_name: safeDepartmentName,
            organization_number: safeOrganizationNumber,
            department_phone: safeDepartmentPhone,
            manager_name: safeManagerName,
            manager_phone: safeManagerPhone,
            manager_email: safeManagerEmail,
            region_name: safeRegionName,
            region_code: safeRegionCode,

            // Supabase Auth 트리거가 metadata로 gov_profiles를 만들 때도
            // 기존 서버 컬럼이 비지 않도록 예전 컬럼명도 함께 전달
            org_name: safeOrganizationName,
            biz_no: safeOrganizationNumber,
            rep_phone: safeDepartmentPhone,
            address: safeRegionName,
            email: safeManagerEmail,
            manager: safeManagerName,

            approval_status: GOV_APPROVAL_STATUS,
            payment_method: GOV_PAYMENT_METHOD_LABEL,
            payment_status: GOV_PAYMENT_STATUS,
            memo: buildStoredMemo(),
            public_name_type: "organization",
            provider: "email",
          },
        },
      });

      if (error) {
        throw error;
      }

      const createdUser = data?.user;

      if (!createdUser?.id) {
        throw new Error("지자체 / 기관 계정 ID를 생성하지 못했습니다.");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = Boolean(sessionData?.session?.user?.id);

      if (hasSession) {
        const govProfileId = await saveGovProfile(createdUser.id);
        await saveCommonProfile(createdUser.id, govProfileId);

        setResultMessage(
          "지자체 / 기관 회원가입 신청이 완료되었습니다. 담당자 확인 후 직접 결제, 계좌이체 또는 협약 방식으로 이용료를 안내드리고, 관리자 승인 후 지역축제·관광이벤트 관리 기능을 사용할 수 있습니다."
        );

        window.setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setResultMessage(
          "지자체 / 기관 회원가입 요청이 접수되었습니다. 이메일 인증이 켜져 있다면 인증 후 로그인해주세요. 이후 관리자 확인 및 직접 결제 / 계좌이체 안내가 진행됩니다."
        );
      }
    } catch (error) {
      const message = getSignupErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="gov-signup-page">
      <section className="gov-signup-wrap">
        <div className="gov-signup-hero">
          <Link to="/signup" className="gov-signup-back">
            ← 회원가입 유형 선택으로 돌아가기
          </Link>

          <Link to="/login" className="gov-signup-back">
            ← 이미 기관 계정이 있다면 로그인하기
          </Link>

          <p className="gov-signup-badge">감성여행2 지자체 / 기관 회원가입</p>

          <h1>
            지역 축제와 관광 이벤트를 운영할
            <br />
            지자체 / 기관 계정을 신청해주세요
          </h1>

          <p className="gov-signup-desc">
            지자체 계정은 제휴문의가 아니라 담당자 계정을 만드는 회원가입
            신청입니다. 신청 후 담당자 확인, 직접 결제 / 계좌이체 / 협약
            절차, 관리자 승인을 거쳐 지역축제·관광이벤트 운영 기능을 사용할
            수 있습니다.
          </p>
        </div>

        <form
          className="gov-signup-form"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <section className="gov-card">
            <div className="gov-card-head">
              <div>
                <span className="gov-step">STEP 1</span>
                <h2>기관 정보</h2>
              </div>
              <strong>필수</strong>
            </div>

            <div className="gov-field-grid">
              <label className="gov-field">
                <span>기관명 / 지자체명</span>
                <input
                  type="text"
                  name="organizationName"
                  autoComplete="organization"
                  value={form.organizationName}
                  onChange={(event) =>
                    updateForm("organizationName", event.target.value)
                  }
                  placeholder="예: 함양군청, 문화관광재단"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>부서명</span>
                <input
                  type="text"
                  name="departmentName"
                  autoComplete="organization-title"
                  value={form.departmentName}
                  onChange={(event) =>
                    updateForm("departmentName", event.target.value)
                  }
                  placeholder="예: 문화관광과, 관광진흥팀"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>담당 지역</span>
                <input
                  type="text"
                  name="regionName"
                  autoComplete="address-level2"
                  value={form.regionName}
                  onChange={(event) =>
                    updateForm("regionName", event.target.value)
                  }
                  placeholder="예: 경남 함양군"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>지역 코드 / 내부 코드</span>
                <input
                  type="text"
                  name="regionCode"
                  autoComplete="off"
                  value={form.regionCode}
                  onChange={(event) =>
                    updateForm("regionCode", event.target.value)
                  }
                  placeholder="선택 입력"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>기관 식별번호 / 고유번호 / 사업자번호</span>
                <input
                  type="text"
                  name="organizationNumber"
                  autoComplete="off"
                  value={form.organizationNumber}
                  onChange={(event) =>
                    updateForm("organizationNumber", event.target.value)
                  }
                  placeholder="선택 입력 · 모르면 비워두세요"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>부서 대표전화</span>
                <input
                  type="tel"
                  name="departmentPhone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.departmentPhone}
                  onChange={(event) =>
                    updateForm("departmentPhone", event.target.value)
                  }
                  placeholder="선택 입력"
                  disabled={submitting}
                />
              </label>
            </div>
          </section>

          <section className="gov-card">
            <div className="gov-card-head">
              <div>
                <span className="gov-step">STEP 2</span>
                <h2>담당자 계정 정보</h2>
              </div>
              <strong>필수</strong>
            </div>

            <div className="gov-field-grid">
              <label className="gov-field">
                <span>담당자명</span>
                <input
                  type="text"
                  name="managerName"
                  autoComplete="name"
                  value={form.managerName}
                  onChange={(event) =>
                    updateForm("managerName", event.target.value)
                  }
                  placeholder="담당자명을 입력해주세요"
                  disabled={submitting}
                />
              </label>

              <label className="gov-field">
                <span>담당자 연락처</span>
                <input
                  type="tel"
                  name="managerPhone"
                  autoComplete="tel-national"
                  inputMode="tel"
                  value={form.managerPhone}
                  onChange={(event) =>
                    updateForm("managerPhone", event.target.value)
                  }
                  placeholder="010-0000-0000"
                  disabled={submitting}
                />
                <small>숫자 기준 10~11자리로 입력해주세요.</small>
              </label>

              <label className="gov-field">
                <span>담당자 이메일</span>
                <input
                  type="email"
                  name="managerEmail"
                  autoComplete="email"
                  inputMode="email"
                  value={form.managerEmail}
                  onChange={(event) =>
                    updateForm("managerEmail", event.target.value)
                  }
                  placeholder="example@city.go.kr"
                  disabled={submitting}
                />
              </label>

              <div className="gov-password-grid">
                <label className="gov-field">
                  <span>비밀번호</span>
                  <input
                    type="password"
                    name="newPassword"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      updateForm("password", event.target.value)
                    }
                    placeholder="8자 이상"
                    disabled={submitting}
                  />
                </label>

                <label className="gov-field">
                  <span>비밀번호 확인</span>
                  <input
                    type="password"
                    name="newPasswordConfirm"
                    autoComplete="new-password"
                    value={form.passwordConfirm}
                    onChange={(event) =>
                      updateForm("passwordConfirm", event.target.value)
                    }
                    placeholder="비밀번호 재입력"
                    disabled={submitting}
                  />
                </label>
              </div>
            </div>

            <p
              className={
                form.passwordConfirm
                  ? isPasswordSame
                    ? "gov-help good"
                    : "gov-help bad"
                  : "gov-help"
              }
            >
              {form.passwordConfirm
                ? isPasswordSame
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."
                : "비밀번호는 8자 이상 입력해주세요."}
            </p>
          </section>

          <section className="gov-card">
            <div className="gov-card-head">
              <div>
                <span className="gov-step">STEP 3</span>
                <h2>이용료 / 승인 안내</h2>
              </div>
              <strong>확인</strong>
            </div>

            <p className="gov-submit-help">
              지자체 / 기관 회원가입 신청 자체는 먼저 접수할 수 있습니다. 실제
              지역축제·관광이벤트 운영 권한은 담당자 확인, 이용료 처리, 관리자
              승인 후 열립니다.
            </p>

            <div className="gov-field-grid">
              <div className="gov-field">
                <span>이용료 처리 방식</span>
                <input type="text" value={GOV_PAYMENT_METHOD_LABEL} readOnly />
                <small>
                  홈페이지에서 바로 카드결제를 받지 않고, 직접 결제 / 계좌이체 /
                  협약 방식으로 별도 안내합니다.
                </small>
              </div>

              <div className="gov-field">
                <span>초기 상태</span>
                <input type="text" value="관리자 승인 대기" readOnly />
                <small>
                  승인 전에는 지자체 축제 및 관광이벤트 운영 기능을 제한합니다.
                </small>
              </div>
            </div>
          </section>

          <section className="gov-card">
            <div className="gov-card-head">
              <div>
                <span className="gov-step">STEP 4</span>
                <h2>신청 목적</h2>
              </div>
              <strong>선택</strong>
            </div>

            <label className="gov-field">
              <span>신청 메모</span>
              <textarea
                name="govMemo"
                autoComplete="off"
                value={form.memo}
                onChange={(event) => updateForm("memo", event.target.value)}
                placeholder="예: 지역 축제 홍보와 소상공인 연계 이벤트 운영을 검토하고 있습니다."
                disabled={submitting}
              />
            </label>
          </section>

          <section className="gov-submit-card">
            <div>
              <h2>회원가입 신청 미리보기</h2>

              <dl>
                <div>
                  <dt>기관명</dt>
                  <dd>{safeOrganizationName || "미입력"}</dd>
                </div>

                <div>
                  <dt>부서명</dt>
                  <dd>{safeDepartmentName || "미입력"}</dd>
                </div>

                <div>
                  <dt>담당자</dt>
                  <dd>{safeManagerName || "미입력"}</dd>
                </div>

                <div>
                  <dt>담당 지역</dt>
                  <dd>{safeRegionName || "미입력"}</dd>
                </div>

                <div>
                  <dt>이용료 처리</dt>
                  <dd>{GOV_PAYMENT_METHOD_LABEL}</dd>
                </div>

                <div>
                  <dt>승인 상태</dt>
                  <dd>승인 대기</dd>
                </div>
              </dl>
            </div>

            {errorMessage ? (
              <p className="gov-result error" role="alert">
                {errorMessage}
              </p>
            ) : null}

            {resultMessage ? (
              <p className="gov-result success">{resultMessage}</p>
            ) : null}

            <button type="submit" className="gov-submit-btn" disabled={!canSubmit}>
              {submitLabel}
            </button>

            <p className="gov-submit-help">
              필수: 기관명 / 부서명 / 담당자명 / 연락처 10~11자리 / 이메일 /
              담당 지역 / 비밀번호 8자 이상
              <br />
              선택: 기관 식별번호 / 지역 코드 / 부서 대표전화 / 신청 메모
              <br />
              가입 후 직접 결제, 계좌이체 또는 협약 확인을 거쳐 관리자 승인
              상태로 전환됩니다.
            </p>
          </section>
        </form>
      </section>
    </main>
  );
}
