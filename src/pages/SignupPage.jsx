// 파일 경로: src/pages/SignupPage.jsx
// ========================================
// 📌 감성여행2 홈페이지 회원가입 유형 선택 페이지
// - 일반 사용자 / 소상공인 / 지자체·기관 흐름을 분리
// - 일반 사용자와 소상공인은 회원가입으로 연결
// - 소상공인은 앱의 1분 입점 구조와 맞춰 간편 입점 흐름으로 안내
// - 지자체·기관은 바로 가입이 아니라 제휴문의로 연결
// - 감성여행2, 감성배달, 홈페이지 공통 아이디 체계 안내 포함
// - 화면 폭을 줄여 PC에서도 한눈에 보기 좋게 정리
// ========================================

import React from "react";
import { Link } from "react-router-dom";
import "./SignupPage.css";

const SIGNUP_TYPES = [
  {
    className: "user-card",
    icon: "🧳",
    title: "일반 사용자",
    description:
      "여행지 저장, 버킷리스트, 친구 공유, 감성앨범, 지역 이벤트 참여 기능을 이용할 수 있습니다.",
    features: [
      "나만의 버킷리스트 만들기",
      "가족·친구와 여행 기록 공유",
      "지역 축제와 관광 이벤트 확인",
    ],
    linkTo: "/signup/user",
    buttonText: "일반 사용자로 가입하기",
    buttonClassName: "signup-main-button",
  },
  {
    className: "owner-card",
    icon: "🏪",
    title: "소상공인 간편 입점",
    description:
      "사업자번호를 로그인 아이디로 사용하고, 필수 정보만 입력하면 감성배달과 감성여행2에 연결되는 입점 흐름입니다.",
    features: [
      "사업자번호 기반 간편 가입",
      "365일 입점 이용권 등록",
      "가게 미니홈피와 메뉴·상품 안내 준비",
    ],
    linkTo: "/signup/business",
    buttonText: "소상공인 1분 입점 시작하기",
    buttonClassName: "signup-main-button",
  },
  {
    className: "gov-card",
    icon: "🏛️",
    title: "지자체 / 기관",
    description:
      "지자체와 기관은 담당자 확인과 협의가 필요합니다. 제휴문의를 통해 지역 관광·축제·상권 활성화 협업을 문의해주세요.",
    features: [
      "지역 관광 활성화 제휴",
      "축제·관광 이벤트 협업",
      "소상공인 상권 데이터 연계",
    ],
    linkTo: "/partner",
    buttonText: "지자체 제휴문의하기",
    buttonClassName: "signup-outline-button",
  },
];

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
          플랫폼입니다. 가입 유형에 따라 이용 가능한 기능과 화면이 다르게
          제공됩니다.
        </p>
      </section>

      <section className="signup-type-section" aria-label="회원가입 유형 선택">
        {SIGNUP_TYPES.map((item) => (
          <article
            key={item.title}
            className={`signup-type-card ${item.className}`}
          >
            <div className="signup-icon" aria-hidden="true">
              {item.icon}
            </div>

            <h2>{item.title}</h2>
            <p>{item.description}</p>

            <ul>
              {item.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <Link to={item.linkTo} className={item.buttonClassName}>
              {item.buttonText}
            </Link>
          </article>
        ))}
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