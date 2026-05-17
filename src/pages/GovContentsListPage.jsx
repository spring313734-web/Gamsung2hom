// 파일 경로: src/pages/GovContentsListPage.jsx
// ========================================
// 📌 감성여행2 지자체 등록 콘텐츠 관리 페이지
// - 로그인한 지자체가 등록한 지역 축제 / 관광이벤트 목록 확인
// - gov_contents(지자체 콘텐츠 정보)에서 현재 사용자 user_id 기준으로 조회
// - 축제 / 관광이벤트 필터 제공
// - 다음 단계에서 수정 / 숨김 / 종료 처리 기능 확장 예정
// ========================================

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const FILTERS = [
  { key: "all", label: "전체" },
  { key: "festival", label: "지역 축제" },
  { key: "tour_event", label: "관광이벤트" },
];

function getTypeLabel(type) {
  if (type === "tour_event") return "관광이벤트";
  if (type === "festival") return "지역 축제";
  return "기타";
}

function getStatusLabel(status) {
  if (status === "active") return "노출중";
  if (status === "hidden") return "숨김";
  if (status === "ended") return "종료";
  if (status === "draft") return "임시저장";
  return status || "상태없음";
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

export default function GovContentsListPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.content_type === filter);
  }, [filter, items]);

  useEffect(() => {
    let alive = true;

    async function loadContents() {
      if (!isSupabaseConfigured) {
        if (alive) {
          setErrorMessage("Supabase 연결 정보가 없습니다.");
          setLoading(false);
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
            setLoading(false);
          }
          return;
        }

        const { data, error } = await supabase
          .from("gov_contents")
          .select("*")
          .eq("user_id", userId);

        if (error) {
          throw error;
        }

        if (alive) {
          const rows = Array.isArray(data) ? [...data].reverse() : [];
          setItems(rows);
          setLoading(false);
        }
      } catch (error) {
        if (alive) {
          setErrorMessage(
            error?.message || "등록 콘텐츠 목록을 불러오지 못했습니다."
          );
          setLoading(false);
        }
      }
    }

    loadContents();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.topActions}>
          <Link to="/gov/dashboard" style={styles.backLink}>
            ← 지자체 관리자 홈
          </Link>

          <div style={styles.quickActions}>
            <Link
              to="/gov/contents/new?type=festival"
              style={styles.smallButton}
            >
              축제 등록
            </Link>
            <Link
              to="/gov/contents/new?type=tour_event"
              style={styles.smallButtonPrimary}
            >
              관광이벤트 등록
            </Link>
          </div>
        </div>

        <div style={styles.hero}>
          <p style={styles.badge}>등록 콘텐츠 관리</p>
          <h1 style={styles.title}>내가 등록한 콘텐츠</h1>
          <p style={styles.desc}>
            지자체 계정으로 등록한 지역 축제와 관광이벤트를 확인합니다. 다음
            단계에서 수정, 숨김, 종료 처리 기능을 연결하면 됩니다.
          </p>
        </div>

        <div style={styles.filterRow}>
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                style={active ? styles.filterButtonActive : styles.filterButton}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={styles.stateBox}>등록 콘텐츠를 불러오는 중입니다...</div>
        ) : null}

        {!loading && errorMessage ? (
          <div style={{ ...styles.stateBox, ...styles.errorBox }}>
            {errorMessage}
          </div>
        ) : null}

        {!loading && !errorMessage && filteredItems.length === 0 ? (
          <div style={styles.emptyBox}>
            <h2 style={styles.emptyTitle}>아직 등록한 콘텐츠가 없습니다</h2>
            <p style={styles.emptyText}>
              지역 축제 또는 관광이벤트를 먼저 등록하면 이곳에서 목록을 확인할
              수 있습니다.
            </p>
            <div style={styles.emptyActions}>
              <Link
                to="/gov/contents/new?type=festival"
                style={styles.linkButton}
              >
                축제 등록하기
              </Link>
              <Link
                to="/gov/contents/new?type=tour_event"
                style={styles.linkButtonAlt}
              >
                관광이벤트 등록하기
              </Link>
            </div>
          </div>
        ) : null}

        {!loading && !errorMessage && filteredItems.length > 0 ? (
          <div style={styles.list}>
            {filteredItems.map((item) => (
              <article key={item.id || item.title} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.typeBadge}>
                    {getTypeLabel(item.content_type)}
                  </span>
                  <span style={styles.statusBadge}>
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                <h2 style={styles.cardTitle}>{item.title || "제목 없음"}</h2>

                <div style={styles.metaGrid}>
                  <p>
                    <strong>지역</strong>
                    <span>{item.region || "-"}</span>
                  </p>
                  <p>
                    <strong>기간</strong>
                    <span>
                      {formatDate(item.start_date)} ~ {formatDate(item.end_date)}
                    </span>
                  </p>
                  <p style={styles.fullMeta}>
                    <strong>주소</strong>
                    <span>{item.address || "-"}</span>
                  </p>
                </div>

                <p style={styles.description}>
                  {item.description || "소개글이 없습니다."}
                </p>

                <div style={styles.cardActions}>
                  <button type="button" style={styles.disabledButton}>
                    수정 기능 준비중
                  </button>
                  <button type="button" style={styles.disabledButton}>
                    숨김 / 종료 준비중
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
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
    width: "min(1080px, 100%)",
    margin: "0 auto",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
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
  quickActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  smallButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
    padding: "0 16px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#3456bd",
    border: "1px solid #dbe3f4",
    fontSize: "13px",
    fontWeight: 900,
    textDecoration: "none",
  },
  smallButtonPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
    padding: "0 16px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #6a5bd6, #ff8b4a)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 900,
    textDecoration: "none",
  },
  hero: {
    textAlign: "center",
    marginBottom: "26px",
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
    width: "min(760px, 100%)",
    margin: "16px auto 0",
    color: "#526276",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.7,
  },
  filterRow: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },
  filterButton: {
    minHeight: "42px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid #dbe3f4",
    background: "#fff",
    color: "#475569",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  filterButtonActive: {
    minHeight: "42px",
    padding: "0 18px",
    borderRadius: "999px",
    border: "1px solid #6d5dfc",
    background: "#eef2ff",
    color: "#3b2fc9",
    fontSize: "14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  stateBox: {
    padding: "22px",
    borderRadius: "24px",
    background: "#ffffff",
    color: "#475569",
    border: "1px solid rgba(106, 88, 68, 0.12)",
    fontSize: "15px",
    fontWeight: 800,
    textAlign: "center",
  },
  errorBox: {
    background: "#fff1f1",
    color: "#b42318",
  },
  emptyBox: {
    padding: "42px 24px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.94)",
    border: "1px solid rgba(106, 88, 68, 0.12)",
    textAlign: "center",
    boxShadow: "0 20px 54px rgba(31, 41, 55, 0.08)",
  },
  emptyTitle: {
    margin: "0 0 10px",
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: 900,
  },
  emptyText: {
    margin: "0 auto 22px",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.7,
  },
  emptyActions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  list: {
    display: "grid",
    gap: "16px",
  },
  card: {
    padding: "24px",
    borderRadius: "28px",
    background: "rgba(255, 255, 255, 0.94)",
    border: "1px solid rgba(106, 88, 68, 0.12)",
    boxShadow: "0 20px 54px rgba(31, 41, 55, 0.08)",
  },
  cardTop: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  typeBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#eef3ff",
    color: "#3456bd",
    fontSize: "12px",
    fontWeight: 900,
  },
  statusBadge: {
    padding: "7px 12px",
    borderRadius: "999px",
    background: "#ecfdf5",
    color: "#047857",
    fontSize: "12px",
    fontWeight: 900,
  },
  cardTitle: {
    margin: "0 0 16px",
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  fullMeta: {
    gridColumn: "1 / -1",
  },
  description: {
    margin: "0 0 18px",
    color: "#475569",
    fontSize: "15px",
    fontWeight: 700,
    lineHeight: 1.7,
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  disabledButton: {
    minHeight: "42px",
    padding: "0 16px",
    border: 0,
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "not-allowed",
  },
  linkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "0 22px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #6a5bd6, #ff8b4a)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 900,
    textDecoration: "none",
  },
  linkButtonAlt: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "48px",
    padding: "0 22px",
    borderRadius: "999px",
    background: "#ffffff",
    color: "#3456bd",
    border: "1px solid #dbe3f4",
    fontSize: "15px",
    fontWeight: 900,
    textDecoration: "none",
  },
};