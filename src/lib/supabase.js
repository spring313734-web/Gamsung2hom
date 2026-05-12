// 파일 경로: src/lib/supabase.js
// ========================================
// 📌 감성여행2 홈페이지용 Supabase 클라이언트
// - 홈페이지(React/Vite)에서 Supabase DB와 Storage에 접근하기 위한 공용 연결 파일
// - Vite 환경변수(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) 기준으로 클라이언트 생성
// - 이벤트 허브 메인 / 상세 / 후기 / 사진 등 홈페이지 데이터 연결의 시작점 역할
// ========================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 설정되지 않았습니다."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);