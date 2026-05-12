// 파일 경로: src/pages/AppDownloadPage.jsx
// ========================================
// 📌 감성여행2 앱 안내 페이지
// - 명함 QR코드가 연결될 /app 페이지
// - 앱 출시 전에는 서비스 안내 / 문의 버튼 제공
// - 앱 출시 후에는 Google Play / App Store 버튼으로 교체 가능
// ========================================

import "./AppDownloadPage.css";

export default function AppDownloadPage() {
  return (
    <section className="app-download-page">
      <div className="app-download-card">
        <div className="app-download-badge">GAMSUNG TRAVEL 2</div>

        <h1>감성여행2 앱 준비중입니다</h1>

        <p className="app-download-desc">
          감성여행2는 지역여행, 버킷리스트, 감성친구, 감성배달을 연결하는
          지역상생 플랫폼입니다.
        </p>

        <p className="app-download-subdesc">
          현재 앱 출시를 준비하고 있습니다. 앱 출시 전까지 서비스 소개와
          입점/제휴 문의를 확인하실 수 있습니다.
        </p>

        <div className="app-download-actions">
          <a href="/" className="app-download-button primary">
            서비스 소개 보기
          </a>

          <a href="/partner" className="app-download-button">
            소상공인 입점 문의
          </a>

          <a href="/delivery-about" className="app-download-button">
            지자체 제휴 문의
          </a>

          <a href="/contact" className="app-download-button">
            문의하기
          </a>
        </div>

        <div className="app-download-notice">
          앱 출시 후 이 페이지에서 Google Play / App Store 다운로드 버튼을
          제공할 예정입니다.
        </div>
      </div>
    </section>
  );
}