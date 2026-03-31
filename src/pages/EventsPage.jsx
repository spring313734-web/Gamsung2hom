// 파일 경로: src/pages/EventsPage.jsx
// ========================================
// 📌 감성여행2 이벤트 페이지
// - 기존 EventsPage를 이벤트 허브 메인 페이지로 통일
// - /events 경로에서 항상 EventHubPage 출력
// - 헤더 메뉴의 이벤트 메인 진입점 역할 유지
// ========================================

import EventHubPage from "./EventHubPage";

export default function EventsPage() {
  return <EventHubPage />;
}