// 파일 경로: src/components/Header.jsx
// ========================================
// 📌 감성여행2 공용 상단 헤더 컴포넌트
// - 왼쪽 로고는 홈으로 이동
// - 감성여행2 소개 / 감성배달 소개 / 제휴문의 메뉴를 각각 분리
// - 이벤트 지역 드롭다운 유지
// - AuthContext 기반 로그인 사용자 상태 표시
// - demo 로그인 / 로그아웃 전환 버튼 포함
// - 바깥 클릭 및 ESC 입력 시 드롭다운 닫힘 처리
// ========================================

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { getAllRegions } from "../data/regionEvents";
import { useAuth } from "../contect/AuthContext";

const REGION_GROUP_LABELS = {
  special_city: "특별시",
  metropolitan_city: "광역시",
  special_self_governing_city: "특별자치시",
  province: "도",
};

const REGION_GROUP_ORDER = [
  "special_city",
  "metropolitan_city",
  "special_self_governing_city",
  "province",
];

const DEMO_LOGIN_USER = {
  id: "demo_user",
  nickname: "감성여행2사용자",
  isLoggedIn: true,
};

function toSafeText(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

function getUserDisplayName(user) {
  const nickname = toSafeText(user?.nickname, "");
  const userId = toSafeText(user?.id, "");

  if (nickname && userId && nickname !== userId) {
    return `${nickname} (${userId})`;
  }

  return nickname || userId || "비로그인";
}

export default function Header() {
  const location = useLocation();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isLoggedIn, login, logout } = useAuth();

  const regions = useMemo(() => {
    try {
      return getAllRegions();
    } catch (error) {
      console.error("지역 데이터 로딩 실패:", error);
      return [];
    }
  }, []);

  const groupedRegions = useMemo(() => {
    const groups = REGION_GROUP_ORDER.map((type) => ({
      type,
      label: REGION_GROUP_LABELS[type],
      items: regions.filter((region) => region.regionType === type),
    }));

    return groups.filter((group) => group.items.length > 0);
  }, [regions]);

  const isEventsActive =
    location.pathname === "/events" ||
    location.pathname.startsWith("/events/") ||
    location.pathname.startsWith("/event-hub");

  const currentUserLabel = getUserDisplayName(currentUser);

  function handleToggleDemoLogin() {
    if (isLoggedIn) {
      logout();
      return;
    }

    login(DEMO_LOGIN_USER);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo" aria-label="감성여행2 홈으로 이동">
          <span className="site-logo-text">감성여행</span>
          <span className="site-logo-number">2</span>
        </Link>

        <nav className="site-nav" aria-label="주요 메뉴">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            감성여행2 소개
          </NavLink>

          <NavLink
            to="/delivery-about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            감성배달 소개
          </NavLink>

          <div
            ref={dropdownRef}
            className={`dropdown ${isOpen ? "open" : ""}`}
          >
            <div className="dropdown-trigger-group">
              <NavLink
                to="/events"
                className={
                  isEventsActive
                    ? "nav-link active dropdown-main-link"
                    : "nav-link dropdown-main-link"
                }
              >
                이벤트
              </NavLink>

              <button
                type="button"
                className={`dropdown-toggle ${isOpen ? "active" : ""}`}
                aria-label="지역 이벤트 메뉴 열기"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <span className="dropdown-arrow">▼</span>
              </button>
            </div>

            {isOpen ? (
              <div className="dropdown-menu">
                {groupedRegions.map((group) => (
                  <div key={group.type} className="dropdown-group">
                    <div className="dropdown-group-head">
                      <p className="dropdown-group-title">{group.label}</p>
                    </div>

                    <div className="dropdown-group-items">
                      {group.items.map((region) => (
                        <Link
                          key={region.slug}
                          to={`/events/region/${region.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          {region.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <NavLink
            to="/partner"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            제휴문의
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            문의하기
          </NavLink>
        </nav>

        <div className="site-auth-panel">
          <div className="site-auth-user-box">
            <span className="site-auth-user-label">
              {isLoggedIn ? "현재 사용자" : "로그인 상태"}
            </span>
            <strong className="site-auth-user-name">{currentUserLabel}</strong>
          </div>

          <button
            type="button"
            className={`site-auth-button ${isLoggedIn ? "is-logout" : "is-login"}`}
            onClick={handleToggleDemoLogin}
          >
            {isLoggedIn ? "로그아웃" : "demo 로그인"}
          </button>
        </div>
      </div>
    </header>
  );
}