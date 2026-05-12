// 파일 경로: src/context/AuthContext.jsx
// ========================================
// 📌 감성여행2 공용 로그인 사용자 컨텍스트
// - 홈페이지 전체에서 같은 로그인 사용자 정보를 공유
// - 현재는 demo 사용자 기준으로 동작 확인용 구조
// - 이후 실제 로그인 / 회원가입 / 서버 연동 시 이 파일 기준으로 확장
// - 상세페이지 / 목록페이지 / 작성페이지 권한 비교용 기준값 제공
// ========================================

import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const DEFAULT_DEMO_USER = {
  id: "demo_user",
  nickname: "감성여행2사용자",
  isLoggedIn: true,
};

function normalizeUser(user) {
  if (!user || typeof user !== "object") {
    return {
      id: "",
      nickname: "",
      isLoggedIn: false,
    };
  }

  const safeId =
    typeof user.id === "string" && user.id.trim().length > 0
      ? user.id.trim()
      : "";

  const safeNickname =
    typeof user.nickname === "string" && user.nickname.trim().length > 0
      ? user.nickname.trim()
      : "";

  const isLoggedIn =
    typeof user.isLoggedIn === "boolean"
      ? user.isLoggedIn && Boolean(safeId)
      : Boolean(safeId);

  return {
    id: safeId,
    nickname: safeNickname,
    isLoggedIn,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    normalizeUser(DEFAULT_DEMO_USER)
  );

  function login(userInfo) {
    setCurrentUser(normalizeUser(userInfo));
  }

  function logout() {
    setCurrentUser({
      id: "",
      nickname: "",
      isLoggedIn: false,
    });
  }

  function updateProfile(profile) {
    setCurrentUser((prev) =>
      normalizeUser({
        ...prev,
        ...profile,
      })
    );
  }

  const value = useMemo(() => {
    return {
      currentUser,
      isLoggedIn: Boolean(currentUser?.isLoggedIn && currentUser?.id),
      login,
      logout,
      updateProfile,
    };
  }, [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }

  return context;
}