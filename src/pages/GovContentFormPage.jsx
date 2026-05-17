// 파일 경로: src/pages/GovContentFormPage.jsx
// ========================================
// 📌 감성여행2 지자체 콘텐츠 등록 페이지
// - 지자체가 지역 축제 / 관광이벤트를 등록하는 화면
// - URL 쿼리 type=festival 또는 type=tour_event 기준으로 등록 유형 결정
// - Supabase gov_contents(지자체 콘텐츠 정보)에 저장
// - 다음 단계에서 대표 이미지 / 상세 이미지 / 수정 기능을 확장 예정
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const CONTENT_TYPES = {
  festival: {
    label: "지역 축제",
    title: "지역 축제 등록",
    badge: "지역 축제",
    helper:
      "지역에서 열리는 축제명, 기간, 장소, 주소, 소개글을 등록합니다.",
  },
  tour_event: {
    label: "관광이벤트",
    title: "관광이벤트 등록",
    badge: "관광이벤트",
    helper:
      "방문 인증, 관광 미션, 혜택 제공 같은 지자체 관광이벤트를 등록합니다.",
  },
};

const INITIAL_FORM = {
  title: "",
  region: "",
  address: "",
  startDate: "",
  endDate: "",
  description: "",
};

function normalizeContentType(value) {
  if (value === "tour_event") return "tour_event";
  return "festival";
}

function getContentTypeInfo(type) {
  return CONTENT_TYPES[type] || CONTENT_TYPES.festival;
}

function trimForm(form) {
  return {
    title: form.title.trim(),
    region: form.region.trim(),
    address: form.address.trim(),
    startDate: form.startDate,
    endDate: form.endDate,
    description: form.description.trim(),
  };
}

function getSaveErrorMessage(error) {
  const message = error?.message || "";

  if (message.includes("row-level security")) {
    return "저장 권한이 없습니다. Supabase RLS 정책을 확인해주세요.";
  }

  if (message.includes("Could not find")) {
    return `테이블 컬럼이 맞지 않습니다. Supabase gov_contents 컬럼을 확인해주세요. (${message})`;
  }

  return message || "등록 중 문제가 발생했습니다.";
}

export default function GovContentFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const contentType = normalizeContentType(searchParams.get("type"));
  const contentInfo = useMemo(
    () => getContentTypeInfo(contentType),
    [contentType]
  );

  const [form, setForm] = useState(INITIAL_FORM);
  const [govProfile, setGovProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadGovProfile() {
      if (!isSupabaseConfigured) {
        if (alive) {
          setErrorMessage("Supabase 연결 정보가 없습니다.");
          setLoadingProfile(false);
        }
        return;
      }

      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        const userId = userData?.user?.id || "";

        if (!userId) {
          if (alive) {
            setErrorMessage("로그인 정보가 없습니다. 다시 로그인해주세요.");
            setLoadingProfile(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("gov_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) {
          console.warn("[GovContentFormPage] gov_profiles 조회 실패:", error);
        }

        if (alive) {
          setGovProfile(data || null);
          setLoadingProfile(false);
        }
      } catch (error) {
        if (alive) {
          setErrorMessage(error?.message || "지자체 정보를 불러오지 못했습니다.");
          setLoadingProfile(false);
        }
      }
    }

    loadGovProfile();

    return () => {
      alive = false;
    };
  }, []);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setResultMessage("");
    setErrorMessage("");
  }

  async function insertGovContent(payload) {
    const { error } = await supabase.from("gov_contents").insert(payload);

    if (error) {
      throw error;
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setResultMessage("");
    setErrorMessage("");

    if (!isSupabaseConfigured) {
      setErrorMessage("Supabase 연결 정보가 없습니다.");
      return;
    }

    const safeForm = trimForm(form);

    if (!safeForm.title || !safeForm.region || !safeForm.address) {
      setErrorMessage("제목, 지역, 주소는 꼭 입력해주세요.");
      return;
    }

    if (!safeForm.startDate || !safeForm.endDate) {
      setErrorMessage("시작일과 종료일을 입력해주세요.");
      return;
    }

    if (safeForm.startDate > safeForm.endDate) {
      setErrorMessage("종료일은 시작일보다 빠를 수 없습니다.");
      return;
    }

    if (!safeForm.description) {
      setErrorMessage("소개글을 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      const userId = userData?.user?.id || "";

      if (!userId) {
        throw new Error("로그인 정보가 없습니다. 다시 로그인해주세요.");
      }

      const basePayload = {
        user_id: userId,
        content_type: contentType,
        title: safeForm.title,
        region: safeForm.region,
        address: safeForm.address,
        start_date: safeForm.startDate,
        end_date: safeForm.endDate,
        description: safeForm.description,
        status: "active",
      };

      const payload = govProfile?.id
        ? {
            ...basePayload,
            gov_profile_id: govProfile.id,
          }
        : basePayload;

      try {
        await insertGovContent(payload);
      } catch (error) {
        if (payload.gov_profile_id && error?.message?.includes("gov_profile_id")) {
          await insertGovContent(basePayload);
        } else {
          throw error;
        }
      }

      setResultMessage(`${contentInfo.label}이 등록되었습니다.`);

      window.setTimeout(() => {
        navigate("/gov/contents");
      }, 700);
    } catch (error) {
      const message = getSaveErrorMessage(error);
      setErrorMessage(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.topActions}>
          <Link to="/gov/dashboard" style={styles.backLink}>
            ← 지자체 관리자 홈
          </Link>
          <Link to="/gov/contents" style={styles.backLink}>
            등록 콘텐츠 보기
          </Link>
        </div>

        <div style={styles.hero}>
          <p style={styles.badge}>{contentInfo.badge}</p>
          <h1 style={styles.title}>{contentInfo.title}</h1>
          <p style={styles.desc}>{contentInfo.helper}</p>
        </div>

        <form style={styles.card} onSubmit={handleSubmit}>
          {loadingProfile ? (
            <p style={styles.loading}>지자체 정보를 확인하는 중입니다...</p>
          ) : null}

          {govProfile ? (
            <div style={styles.profileBox}>
              <strong>로그인 기관</strong>
              <span>
                {govProfile.gov_name ||
                  govProfile.organization_name ||
                  govProfile.region_name ||
                  "지자체 / 기관"}
              </span>
            </div>
          ) : null}

          <div style={styles.gridTwo}>
            <label style={styles.field}>
              <span>등록 유형</span>
              <input value={contentInfo.label} disabled style={styles.input} />
            </label>

            <label style={styles.field}>
              <span>지역명</span>
              <input
                value={form.region}
                onChange={(event) => updateForm("region", event.target.value)}
                placeholder="예: 경남 함양군"
                disabled={saving}
                style={styles.input}
              />
            </label>
          </div>

          <label style={styles.field}>
            <span>제목</span>
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder={
                contentType === "festival"
                  ? "예: 함양 산삼 축제"
                  : "예: 상림공원 방문 인증 이벤트"
              }
              disabled={saving}
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span>주소 / 장소</span>
            <input
              value={form.address}
              onChange={(event) => updateForm("address", event.target.value)}
              placeholder="예: 경남 함양군 함양읍 상림공원 일대"
              disabled={saving}
              style={styles.input}
            />
          </label>

          <div style={styles.gridTwo}>
            <label style={styles.field}>
              <span>시작일</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  updateForm("startDate", event.target.value)
                }
                disabled={saving}
                style={styles.input}
              />
            </label>

            <label style={styles.field}>
              <span>종료일</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(event) => updateForm("endDate", event.target.value)}
                disabled={saving}
                style={styles.input}
              />
            </label>
          </div>

          <label style={styles.field}>
            <span>소개글</span>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              placeholder="행사 내용, 참여 방법, 볼거리, 혜택 등을 적어주세요."
              disabled={saving}
              style={styles.textarea}
            />
          </label>

          {errorMessage ? (
            <p style={{ ...styles.result, ...styles.error }}>{errorMessage}</p>
          ) : null}

          {resultMessage ? (
            <p style={{ ...styles.result, ...styles.success }}>
              {resultMessage}
            </p>
          ) : null}

          <button type="submit" disabled={saving} style={styles.submitButton}>
            {saving ? "등록 중..." : `${contentInfo.label} 등록하기`}
          </button>
        </form>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 88px)",
    padding: "56px 20px 96px",
    background:
      "radial-gradient(circle at top left, rgba(255, 197, 86, 0.18), transparent 34%), radial-gradient(circle at top right, rgba(112, 101, 240, 0.16), transparent 32%), linear-gradient(180deg, #f7fbff 0%, #fffaf3 100%)",
  },
  wrap: {
    width: "min(860px, 100%)",
    margin: "0 auto",
  },
  topActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  backLink: {
    color: "#3456bd",
    fontSize: "14px",
    fontWeight: 900,
    textDecoration: "none",
  },
  hero: {
    textAlign: "center",
    marginBottom: "28px",
  },
  badge: {
    display: "inline-flex",
    justifyContent: "center",
    margin: "0 0 14px",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "#eef3ff",
    color: "#3456bd",
    fontSize: "13px",
    fontWeight: 900,
  },
  title: {
    margin: 0,
    color: "#192434",
    fontSize: "clamp(32px, 5vw, 50px)",
    lineHeight: 1.15,
    letterSpacing: "-0.06em",
  },
  desc: {
    margin: "16px auto 0",
    color: "#526276",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.7,
  },
  card: {
    padding: "30px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.94)",
    border: "1px solid rgba(106, 88, 68, 0.12)",
    boxShadow: "0 24px 70px rgba(31, 41, 55, 0.1)",
  },
  loading: {
    margin: "0 0 16px",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: 800,
  },
  profileBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 16px",
    marginBottom: "18px",
    borderRadius: "16px",
    background: "#f8fafc",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 800,
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },
  field: {
    display: "grid",
    gap: "8px",
    marginBottom: "16px",
    color: "#1f2937",
    fontSize: "15px",
    fontWeight: 900,
  },
  input: {
    width: "100%",
    minHeight: "54px",
    padding: "0 16px",
    border: "1px solid #d8dee9",
    borderRadius: "16px",
    background: "#fff",
    color: "#172033",
    fontSize: "15px",
    fontWeight: 700,
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "16px",
    border: "1px solid #d8dee9",
    borderRadius: "16px",
    background: "#fff",
    color: "#172033",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.7,
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  result: {
    margin: "0 0 16px",
    padding: "13px 15px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: 800,
    lineHeight: 1.5,
  },
  error: {
    background: "#fff1f1",
    color: "#b42318",
  },
  success: {
    background: "#effaf3",
    color: "#14783f",
  },
  submitButton: {
    width: "100%",
    minHeight: "58px",
    border: 0,
    borderRadius: "999px",
    background: "linear-gradient(135deg, #6a5bd6, #ff8b4a)",
    color: "#fff",
    fontSize: "17px",
    fontWeight: 900,
    cursor: "pointer",
    boxShadow: "0 18px 36px rgba(105, 91, 214, 0.22)",
  },
};