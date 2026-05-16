// 파일 경로: src/App.jsx
// ========================================
// 📌 감성여행2 홈페이지 라우터 메인 구성
// - 공용 상단 헤더 표시
// - 홈 / 감성여행2 소개 / 감성배달 소개 / 이벤트 / 문의 라우팅 연결
// - 감성배달 소개와 제휴문의 페이지를 분리
// - 제휴문의는 PartnershipPage 전용 화면으로 연결
// - 로그인 페이지 /login 라우트 추가
// - 회원가입 유형 선택 페이지 /signup 라우트 추가
// - 일반회원 가입 페이지 /signup/user 라우트 추가
// - 소상공인 간편 입점 페이지 /signup/business 라우트 추가
// - 지자체 / 기관 가입 페이지 /signup/gov 라우트 추가
// - 소상공인 내 가게 관리 준비 화면 /business/dashboard 라우트 추가
// - 지역별 이벤트 허브 상세 페이지 라우트 연결
// - 지역별 후기 / 참여글 전용 페이지 라우트 연결
// - 지역별 후기 상세 페이지 라우트 연결
// - 명함 QR코드 연결용 /app 앱 안내 페이지 라우트 연결
// - 홈페이지 전체에서 감성문의 쪽지 위젯 표시
// - 관리자 문의함 /admin/inquiries 라우트 추가
// - 관리자 페이지에서는 오른쪽 아래 감성문의 버튼을 숨김
// - AuthProvider로 홈페이지 전체 공용 상태 제공
// ========================================

import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import InquiryMemoWidget from "./components/InquiryMemoWidget";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PartnerPage from "./pages/PartnerPage";
import PartnershipPage from "./pages/PartnershipPage";
import ContactPage from "./pages/ContactPage";
import EventsPage from "./pages/EventsPage";
import AppDownloadPage from "./pages/AppDownloadPage";
import AdminInquiriesPage from "./pages/AdminInquiriesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserSignupPage from "./pages/UserSignupPage";
import BusinessSignupPage from "./pages/BusinessSignupPage";
import BusinessDashboardPage from "./pages/BusinessDashboardPage";
import GovSignupPage from "./pages/GovSignupPage";
import RegionEventHubDetailPage from "./pages/RegionEventHubDetailPage";
import RegionEventPostsPage from "./pages/RegionEventPostsPage";
import RegionEventPostDetailPage from "./pages/RegionEventPostDetailPage";
import { AuthProvider } from "./contect/AuthContext";
import "./App.css";

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

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
            <Route path="/app" element={<AppDownloadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/user" element={<UserSignupPage />} />
            <Route path="/signup/business" element={<BusinessSignupPage />} />
            <Route path="/signup/gov" element={<GovSignupPage />} />
            <Route
              path="/business/dashboard"
              element={<BusinessDashboardPage />}
            />
            <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />

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

        {!isAdminPage ? <InquiryMemoWidget /> : null}
      </div>
    </AuthProvider>
  );
}
