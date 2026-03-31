// 파일 경로: src/pages/HomePage.jsx
// ========================================
// 📌 감성여행2 홈페이지 메인 홈 화면
// - 메인 비주얼 중심 랜딩 화면 구성
// - 홈 하단 설명 블록 제거
// - 감성여행2·감성배달 설명은 별도 소개 페이지로 이동
// - 주요 이동 버튼만 간결하게 유지
// ========================================

import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-darken">
          <div className="hero-inner">
            <p className="hero-badge">여행과 지역을 잇는 서비스</p>

            <h1 className="hero-title">
              <span className="hero-title-brand">
                <span className="hero-title-text">감성여행</span>
                <span className="hero-title-number">2</span>
              </span>
              <br />
              여행의 감성과 지역의 온기를 함께 담다
            </h1>

            <p className="hero-description">
              감성여행2는 여행지를 보여주는 것에서 끝나지 않고, 여행자와 지역,
              이야기와 추억, 관광과 지역경제를 자연스럽게 연결하기 위해 시작된
              서비스입니다. 여행자는 감성여행2에서 코스와 이벤트, 관광 정보를
              만나고, 필요한 생활형 서비스와 배달은 감성배달 앱으로 이어서
              이용할 수 있습니다.
            </p>

            <div className="hero-actions">
              <Link to="/about" className="primary-btn">
                감성여행2·감성배달 보기
              </Link>
              <Link to="/events" className="secondary-btn">
                이벤트 허브 보기
              </Link>
              <Link to="/contact" className="secondary-btn">
                문의하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}