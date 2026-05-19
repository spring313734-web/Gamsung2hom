// 파일 경로: src/App.jsx
// ========================================
// 📌 감성여행2 홈페이지 라우터 메인 구성
// - 공용 상단 헤더 표시
// - 홈 / 감성여행2 소개 / 감성배달 소개 / 이벤트 / 문의 라우팅 연결
// - 로그인 / 회원가입 / 권한별 관리 화면 라우팅 연결
// - 소상공인 내 가게 관리 /business/dashboard 연결
// - 지자체 관리자 대시보드 /gov/dashboard 연결
// - 지자체 축제·관광이벤트 등록 /gov/contents/new 연결
// - 지자체 등록 콘텐츠 관리 /gov/contents 연결
// - 관리자 문의함 /admin/inquiries 연결
// - 관리자 / 소상공인 / 지자체 관리 화면에서는 오른쪽 아래 감성문의 버튼 숨김
// - AuthProvider로 홈페이지 전체 공용 로그인 상태 제공
// - ProtectedRoute로 직접 URL 접근 시 로그인 / 권한 분기 보호
// ========================================

import { Navigate, Routes, Route, useLocation } from "react-router-dom";
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
import GovDashboardPage from "./pages/GovDashboardPage";
import GovContentFormPage from "./pages/GovContentFormPage";
import GovContentsListPage from "./pages/GovContentsListPage";
import RegionEventHubDetailPage from "./pages/RegionEventHubDetailPage";
import RegionEventPostsPage from "./pages/RegionEventPostsPage";
import RegionEventPostDetailPage from "./pages/RegionEventPostDetailPage";
import { AuthProvider, useAuth } from "./contect/AuthContext";
import "./App.css";

function normalizeAccountType(value) {
  return String(value || "").trim().toLowerCase();
}

function ProtectedRoute({ allowedAccountTypes = [], children }) {
  const location = useLocation();
  const { loading, isLoggedIn, currentUser } = useAuth();

  const accountType = normalizeAccountType(currentUser?.accountType);
  const allowedTypes = allowedAccountTypes.map(normalizeAccountType);
  const isAdmin = accountType === "admin";

  if (loading) {
    return (
      <section className="protected-route-state">
        <p>로그인 상태를 확인하는 중입니다...</p>
      </section>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin && !allowedTypes.includes(accountType)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();

  const isManagePage =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/business") ||
    location.pathname.startsWith("/gov");

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
              element={
                <ProtectedRoute allowedAccountTypes={["business", "biz", "owner"]}>
                  <BusinessDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gov/dashboard"
              element={
                <ProtectedRoute
                  allowedAccountTypes={[
                    "gov",
                    "government",
                    "local_government",
                    "agency",
                    "institution",
                  ]}
                >
                  <GovDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gov/contents/new"
              element={
                <ProtectedRoute
                  allowedAccountTypes={[
                    "gov",
                    "government",
                    "local_government",
                    "agency",
                    "institution",
                  ]}
                >
                  <GovContentFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/gov/contents"
              element={
                <ProtectedRoute
                  allowedAccountTypes={[
                    "gov",
                    "government",
                    "local_government",
                    "agency",
                    "institution",
                  ]}
                >
                  <GovContentsListPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/inquiries"
              element={
                <ProtectedRoute allowedAccountTypes={["admin"]}>
                  <AdminInquiriesPage />
                </ProtectedRoute>
              }
            />

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

        {!isManagePage ? <InquiryMemoWidget /> : null}
      </div>
    </AuthProvider>
  );
}