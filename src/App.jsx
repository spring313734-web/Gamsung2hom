// 파일 경로: src/App.jsx
// ========================================
// 📌 감성여행2 홈페이지 라우터 메인 구성
// - 공용 상단 헤더 표시
// - 홈 / 감성여행2 소개 / 감성배달 소개 / 이벤트 / 문의 라우팅 연결
// - 감성배달 소개와 제휴문의 페이지를 분리
// - 제휴문의는 PartnershipPage 전용 화면으로 연결
// - 지역별 이벤트 허브 상세 페이지 라우트 연결
// - 지역별 후기 / 참여글 전용 페이지 라우트 연결
// - 지역별 후기 상세 페이지 라우트 연결
// - 명함 QR코드 연결용 /app 앱 안내 페이지 라우트 추가
// - AuthProvider로 홈페이지 전체 공용 로그인 사용자 상태 제공
// - 실제 폴더 경로(src/context/AuthContext.jsx)에 맞춰 import 경로 정리
// ========================================

import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PartnerPage from "./pages/PartnerPage";
import PartnershipPage from "./pages/PartnershipPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import AppDownloadPage from "./pages/AppDownloadPage";
import RegionEventHubDetailPage from "./pages/RegionEventHubDetailPage";
import RegionEventPostsPage from "./pages/RegionEventPostsPage";
import RegionEventPostDetailPage from "./pages/RegionEventPostDetailPage";
import { AuthProvider } from "./contect/AuthContext";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <Header />

        <main className="page-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/delivery-about" element={<PartnerPage />} />
            <Route path="/partner" element={<PartnershipPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/events" element={<EventsPage />} />

            {/* 명함 QR코드 연결용 앱 안내 페이지 */}
            <Route path="/app" element={<AppDownloadPage />} />

            <Route
              path="/events/region/:slug"
              element={<RegionEventHubDetailPage />}
            />
            <Route
              path="/events/region/:slug/posts"
              element={<RegionEventPostsPage />}
            />
            <Route
              path="/events/region/:slug/posts/:postId"
              element={<RegionEventPostDetailPage />}
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}