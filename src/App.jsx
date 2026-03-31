// 파일 경로: src/App.jsx
// ========================================
// 📌 감성여행2 홈페이지 라우터 메인 구성
// - 공용 상단 헤더 표시
// - 홈 / 감성여행2 소개 / 감성배달 소개 / 이벤트 / 문의 라우팅 연결
// - 감성배달 소개와 제휴문의 페이지를 분리
// - 제휴문의는 PartnershipPage 전용 화면으로 연결
// - 지역별 이벤트 허브 상세 페이지 라우트 연결
// ========================================

import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PartnerPage from "./pages/PartnerPage";
import PartnershipPage from "./pages/PartnershipPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import RegionEventHubDetailPage from "./pages/RegionEventHubDetailPage";
import "./App.css";

export default function App() {
  return (
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
          <Route
            path="/events/region/:slug"
            element={<RegionEventHubDetailPage />}
          />
        </Routes>
      </main>
    </div>
  );
}