// 파일 경로: src/pages/SignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 회원가입 유형 선택 페이지
// - 일반 사용자 / 소상공인 / 지자체·기관 흐름을 분리
// - 일반 사용자와 소상공인은 회원가입으로 연결
// - 지자체·기관은 바로 가입이 아니라 제휴문의로 연결
// - 감성여행2, 감성배달, 홈페이지 공통 아이디 체계 안내 포함
// ========================================

import React from "react";
import { Link } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
  return (
    <main className="signup-page">
      <section className="signup-hero">
        <p className="signup-eyebrow">감성여행2 통합 회원가입</p>

        <h1>
          하나의 아이디로
          <br />
          감성여행2와 감성배달을 함께 이용하세요
        </h1>

        <p className="signup-hero-desc">
          감성여행2는 여행자, 소상공인, 지자체를 연결하는 지역 활성화
          플랫폼입니다. 가입 유형에 따라 이용 가능한 기능이 달라집니다.
        </p>
      </section>

      <section className="signup-type-section">
        <div className="signup-type-card user-card">
          <div className="signup-icon">🧳</div>
          <h2>일반 사용자</h2>
          <p>
            여행지 저장, 버킷리스트, 친구 공유, 감성앨범, 지역 이벤트
            참여 기능을 이용할 수 있습니다.
          </p>

          <ul>
            <li>나만의 버킷리스트 만들기</li>
            <li>가족·친구와 여행 기록 공유</li>
            <li>지역 축제와 관광 이벤트 확인</li>
          </ul>

          <Link to="/signup/user" className="signup-main-button">
            일반 사용자로 가입하기
          </Link>
        </div>

        <div className="signup-type-card owner-card">
          <div className="signup-icon">🏪</div>
          <h2>소상공인</h2>
          <p>
            가게 미니홈피, 메뉴·상품 안내, 위치·연락처 안내, 지역 이벤트
            참여 기능을 이용할 수 있습니다.
          </p>

          <ul>
            <li>가게 미니홈피 운영</li>
            <li>메뉴·상품·서비스 안내</li>
            <li>지역 관광객 대상 홍보</li>
          </ul>

          <Link to="/signup/business" className="signup-main-button">
            소상공인으로 가입하기
          </Link>
        </div>

        <div className="signup-type-card gov-card">
          <div className="signup-icon">🏛️</div>
          <h2>지자체 / 기관</h2>
          <p>
            지자체와 기관은 바로 가입보다 담당자 확인과 협의가 필요합니다.
            제휴문의를 통해 지역 관광·축제·상권 활성화 협업을 문의해주세요.
          </p>

          <ul>
            <li>지역 관광 활성화 제휴</li>
            <li>축제·관광 이벤트 협업</li>
            <li>소상공인 상권 데이터 연계</li>
          </ul>

          <Link to="/partnership" className="signup-outline-button">
            지자체 제휴문의하기
          </Link>
        </div>
      </section>

      <section className="signup-info-box">
        <h2>공통 아이디 체계 안내</h2>
        <p>
          앞으로 감성여행2 앱, 감성배달 앱, 홈페이지는 하나의 아이디로
          연결되는 구조를 목표로 합니다. 단, 일반 사용자, 소상공인, 지자체,
          관리자는 권한과 이용 화면이 다르게 운영됩니다.
        </p>
      </section>
    </main>
  );
}