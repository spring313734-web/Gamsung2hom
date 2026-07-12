// 파일 경로: src/components/Header.jsx
// ========================================
// 📌 감성여행2 공용 상단 헤더 컴포넌트
// - 왼쪽 로고는 PNG 이미지 파일로 표시하고 홈으로 이동
// - 로고 파일 위치: public/logo-gamsung2-header.png
// - 감성여행2 소개 / 감성배달 소개 / 이벤트 / 제휴문의 메뉴 표시
// - 로그인 전에는 로그인 버튼만 표시하고 회원가입은 로그인 화면 안에서 연결
// - 로그인 후에는 공개 이름 기준 별명/아이디 표시
// - 로그인 후 마이페이지 버튼 표시
// - 공개 이름 선택이 별명이면 별명 우선, 아니면 아이디 우선 표시
// - 로그아웃 버튼으로 Supabase 세션 종료
// - 이벤트 지역 드롭다운 유지
// - 모바일에서는 로고 + 메뉴 버튼만 먼저 보이고, 메뉴는 펼침 방식으로 표시
// - 모바일 메뉴 안에 PC버전 보기 / 모바일버전 보기 전환 버튼 추가
// - localStorage에 PC버전 보기 상태 저장
// - 바깥 클릭 및 ESC 입력 시 드롭다운 / 모바일 메뉴 닫힘 처리
// - 현재 프로젝트 폴더명이 contect 이므로 ../contect/AuthContext 사용
// ========================================

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contect/AuthContext";
import { getAllRegions } from "../data/regionEvents";
import "./Header.css";

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

const DESKTOP_VIEW_STORAGE_KEY = "gamsung2_force_desktop_view";

function readDesktopViewPreference() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem(DESKTOP_VIEW_STORAGE_KEY) === "true";
}

function getUserLabel(currentUser) {
  if (!currentUser?.isLoggedIn) return "";

  return (
    currentUser.displayName ||
    currentUser.nickname ||
    currentUser.username ||
    currentUser.name ||
    currentUser.email ||
    "회원"
  );
}

export default function Header() {
  const location = useLocation();
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(readDesktopViewPreference);

  const { currentUser, isLoggedIn, loading, logout } = useAuth();

  const userLabel = useMemo(() => getUserLabel(currentUser), [currentUser]);

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

  function closeAllMenus() {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
  }

  function handleMobileMenuToggle() {
    setIsMobileMenuOpen((prev) => !prev);
    setIsOpen(false);
  }

  function handleToggleDesktopView() {
    setIsDesktopView((prev) => !prev);
    setIsOpen(false);
  }

  async function handleLogout() {
    await logout();
    closeAllMenus();
  }

  useEffect(() => {
    const root = document.documentElement;

    if (isDesktopView) {
      root.classList.add("gamsung-force-desktop");
      window.localStorage.setItem(DESKTOP_VIEW_STORAGE_KEY, "true");
    } else {
      root.classList.remove("gamsung-force-desktop");
      window.localStorage.setItem(DESKTOP_VIEW_STORAGE_KEY, "false");
    }

    return () => {
      root.classList.remove("gamsung-force-desktop");
    };
  }, [isDesktopView]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!headerRef.current) return;

      if (!headerRef.current.contains(event.target)) {
        closeAllMenus();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        closeAllMenus();
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
    const timeoutId = window.setTimeout(() => {
      setIsOpen(false);
      setIsMobileMenuOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return (
    <header
      ref={headerRef}
      className={`site-header ${isMobileMenuOpen ? "mobile-menu-open" : ""} ${
        isDesktopView ? "desktop-view-enabled" : ""
      }`}
    >
      <div className="site-header-inner">
        <div className="site-header-top">
          <Link
            to="/"
            className="site-logo"
            aria-label="감성여행2 홈으로 이동"
            onClick={closeAllMenus}
          >
            <img
              src="/logo-gamsung2-header.png"
              alt="감성여행2"
              className="site-logo-image"
            />
          </Link>

          <button
            type="button"
            className={`mobile-menu-button ${
              isMobileMenuOpen ? "active" : ""
            }`}
            aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMobileMenuOpen}
            onClick={handleMobileMenuToggle}
          >
            <span className="mobile-menu-line" />
            <span className="mobile-menu-line" />
            <span className="mobile-menu-line" />
          </button>
        </div>

        <div className="site-header-menu">
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
                            onClick={closeAllMenus}
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

            {loading ? (
              <div className="site-auth-panel">
                <div className="site-auth-user-box is-loading">
                  <span className="site-auth-user-label">로그인 확인 중</span>
                  <span className="site-auth-user-name">잠시만요</span>
                </div>
              </div>
            ) : isLoggedIn ? (
              <div className="site-auth-panel">
                <Link
                  to="/my"
                  className="site-auth-user-box"
                  onClick={closeAllMenus}
                  aria-label="마이페이지로 이동"
                >
                  <span className="site-auth-user-label">감성회원</span>
                  <span className="site-auth-user-name">{userLabel}님</span>
                </Link>

                <NavLink
                  to="/my"
                  className={({ isActive }) =>
                    isActive
                      ? "site-auth-button is-mypage active"
                      : "site-auth-button is-mypage"
                  }
                  onClick={closeAllMenus}
                >
                  마이페이지
                </NavLink>

                <button
                  type="button"
                  className="site-auth-button is-logout"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active login-nav-link"
                    : "nav-link login-nav-link"
                }
                onClick={closeAllMenus}
              >
                로그인
              </NavLink>
            )}

            <button
              type="button"
              className={`desktop-view-toggle ${
                isDesktopView ? "active" : ""
              }`}
              onClick={handleToggleDesktopView}
            >
              {isDesktopView ? "모바일버전으로 보기" : "PC버전으로 보기"}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}