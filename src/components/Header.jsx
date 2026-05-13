// 파일 경로: src/components/Header.jsx
// ========================================
// 📌 감성여행2 공용 상단 헤더 컴포넌트
// - 왼쪽 로고는 홈으로 이동
// - 감성여행2 소개 / 감성배달 소개 / 이벤트 / 제휴문의 메뉴 표시
// - 문의하기 메뉴는 제거하고 오른쪽 아래 감성문의 쪽지 버튼으로 대체
// - 이벤트 지역 드롭다운 유지
// - 공개 홈페이지용으로 demo_user / 현재 사용자 / 로그아웃 표시 제거
// - 모바일에서는 로고 + 메뉴 버튼만 먼저 보이고, 메뉴는 펼침 방식으로 표시
// - 모바일 메뉴 안에 PC버전 보기 / 모바일버전 보기 전환 버튼 추가
// - localStorage에 PC버전 보기 상태 저장
// - 바깥 클릭 및 ESC 입력 시 드롭다운 / 모바일 메뉴 닫힘 처리
// ========================================

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import { getAllRegions } from "../data/regionEvents";

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

export default function Header() {
  const location = useLocation();
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopView, setIsDesktopView] = useState(readDesktopViewPreference);

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
    closeAllMenus();
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
            <span className="site-logo-text">감성여행</span>
            <span className="site-logo-number">2</span>
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