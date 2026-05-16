// 파일 경로: src/contect/AuthContext.jsx
// ========================================
// 📌 감성여행2 공용 로그인 사용자 컨텍스트
// - 홈페이지 전체에서 Supabase 로그인 세션을 공유
// - auth.users.id를 감성여행2 / 감성배달 / 홈페이지 공통 user_id 기준으로 사용
// - public.profiles에서 내 회원 정보를 불러와 별명 / 아이디 / 공개 이름 설정 반영
// - Header에서 회원가입 버튼 대신 로그인 사용자 이름을 표시할 수 있도록 제공
// - 기존 demo_user 구조 제거
// - 현재 프로젝트 폴더명이 contect 이므로 이 경로를 기준으로 사용
// ========================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

const EMPTY_USER = {
  id: "",
  userId: "",
  email: "",
  name: "",
  username: "",
  nickname: "",
  role: "",
  publicNameType: "userId",
  displayName: "",
  isLoggedIn: false,
  profile: null,
};

function getMetadataValue(user, key) {
  const metadata = user?.user_metadata || {};
  return typeof metadata[key] === "string" ? metadata[key].trim() : "";
}

function pickDisplayName({ publicNameType, username, nickname, name, email }) {
  if (publicNameType === "nickname") {
    return nickname || username || name || email || "회원";
  }

  return username || nickname || name || email || "회원";
}

function normalizeUserFromSession(session, profile) {
  const authUser = session?.user;

  if (!authUser?.id) {
    return EMPTY_USER;
  }

  const email = authUser.email || profile?.email || "";

  const username =
    typeof profile?.username === "string" && profile.username.trim()
      ? profile.username.trim()
      : getMetadataValue(authUser, "username");

  const nickname =
    typeof profile?.nickname === "string" && profile.nickname.trim()
      ? profile.nickname.trim()
      : getMetadataValue(authUser, "nickname");

  const name =
    typeof profile?.name === "string" && profile.name.trim()
      ? profile.name.trim()
      : getMetadataValue(authUser, "name");

  const role =
    typeof profile?.role === "string" && profile.role.trim()
      ? profile.role.trim()
      : getMetadataValue(authUser, "role") || "USER";

  const publicNameType =
    typeof profile?.public_name_type === "string" &&
    profile.public_name_type.trim()
      ? profile.public_name_type.trim()
      : getMetadataValue(authUser, "public_name_type") || "userId";

  const displayName = pickDisplayName({
    publicNameType,
    username,
    nickname,
    name,
    email,
  });

  return {
    id: authUser.id,
    userId: authUser.id,
    email,
    name,
    username,
    nickname,
    role,
    publicNameType,
    displayName,
    isLoggedIn: true,
    profile: profile || null,
  };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(EMPTY_USER);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfileForSession = useCallback(async (nextSession) => {
    const authUser = nextSession?.user;

    if (!authUser?.id) {
      setSession(null);
      setCurrentUser(EMPTY_USER);
      setLoading(false);
      return;
    }

    setSession(nextSession);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (error) {
      console.error("[AuthContext] profiles 조회 실패:", error);
      setCurrentUser(normalizeUserFromSession(nextSession, null));
      setLoading(false);
      return;
    }

    setCurrentUser(normalizeUserFromSession(nextSession, profile));
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("[AuthContext] 세션 확인 실패:", error);
        setSession(null);
        setCurrentUser(EMPTY_USER);
        setLoading(false);
        return;
      }

      await loadProfileForSession(data?.session || null);
    }

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        if (!mounted) return;
        setLoading(true);
        await loadProfileForSession(nextSession);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [loadProfileForSession]);

  async function refreshUserProfile() {
    setLoading(true);
    await loadProfileForSession(session);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setCurrentUser(EMPTY_USER);
    setLoading(false);
  }

  function login(userInfo) {
    const fallbackUser = {
      ...EMPTY_USER,
      ...userInfo,
      id: userInfo?.id || userInfo?.userId || "",
      userId: userInfo?.userId || userInfo?.id || "",
      isLoggedIn: Boolean(userInfo?.id || userInfo?.userId),
    };

    fallbackUser.displayName =
      userInfo?.displayName ||
      pickDisplayName({
        publicNameType: userInfo?.publicNameType || "userId",
        username: userInfo?.username || "",
        nickname: userInfo?.nickname || "",
        name: userInfo?.name || "",
        email: userInfo?.email || "",
      });

    setCurrentUser(fallbackUser);
  }

  function updateProfile(profile) {
    setCurrentUser((prev) => {
      const nextUser = {
        ...prev,
        ...profile,
        profile: {
          ...(prev.profile || {}),
          ...(profile || {}),
        },
      };

      return {
        ...nextUser,
        displayName: pickDisplayName({
          publicNameType: nextUser.publicNameType || "userId",
          username: nextUser.username || "",
          nickname: nextUser.nickname || "",
          name: nextUser.name || "",
          email: nextUser.email || "",
        }),
      };
    });
  }

  const value = useMemo(() => {
    return {
      currentUser,
      session,
      loading,
      isLoggedIn: Boolean(currentUser?.isLoggedIn && currentUser?.id),
      login,
      logout,
      updateProfile,
      refreshUserProfile,
    };
  }, [currentUser, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }

  return context;
}