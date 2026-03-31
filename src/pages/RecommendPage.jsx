// 파일 경로: src/pages/RecommendPage.jsx
// ========================================
// 📌 감성여행 추천 페이지
// - 공용 상단 비주얼 배너 적용
// - 여행 코스 예시 소개
// - 테마형 여행 방향 설명
// - 감성 중심 추천 구조 안내
// ========================================

import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

export default function RecommendPage() {
  return (
    <div className="page normal-page">
      <PageHero
        badge="분위기와 연결 중심의 여행 추천"
        title="감성여행 추천"
        description="좋은 여행은 목적지만이 아니라, 누구와 어떻게 연결되는가에 더 가까울 수 있습니다."
        backgroundImage="/gamsung2.png"
      />

      <section className="content-section">
        <div className="content-inner narrow">
          <p className="page-description">
            감성여행2의 추천은 단순한 인기순이 아닙니다. 혼자 떠난 여행도 결국
            사람과 지역의 이야기를 만나며 더 따뜻해질 수 있다는 믿음에서
            출발합니다. 그래서 감성여행2는 분위기, 테마, 관계, 지역의 감성을
            함께 담아 여행을 추천합니다.
          </p>

          <div className="card-grid">
            <div className="info-card">
              <h3>힐링 코스</h3>
              <p>
                자연, 산책길, 조용한 공간, 쉬어 갈 수 있는 카페와 풍경 중심으로
                마음을 편안하게 만드는 감성형 여행 코스입니다. 혼자 떠나도 마음이
                가벼워지고, 지역과 부드럽게 이어질 수 있는 흐름을 담습니다.
              </p>
            </div>

            <div className="info-card">
              <h3>가족 여행 코스</h3>
              <p>
                부모님, 아이와 함께하기 좋은 동선과 쉬운 이동, 편안한 체험 요소를
                고려한 따뜻한 가족형 여행 코스를 구성할 수 있습니다. 여행이 함께
                하는 시간이라는 의미가 가장 잘 드러나는 추천입니다.
              </p>
            </div>

            <div className="info-card">
              <h3>전설 테마 코스</h3>
              <p>
                지역 전설, 이야기, 역사적 배경을 함께 묶어 단순한 관광이 아닌
                스토리 중심의 감성형 여행 코스로 확장할 수 있습니다. 장소를 보는
                데서 그치지 않고 그 지역의 기억과 연결되는 여행을 지향합니다.
              </p>
            </div>
          </div>

          <div className="card-grid" style={{ marginTop: "22px" }}>
            <div className="info-card">
              <h3>사진 감성 코스</h3>
              <p>
                분위기 있는 풍경과 감성 사진 포인트, 시간대별 색감이 살아나는
                장소를 중심으로 한 여행 추천도 가능합니다. 장면을 기록하는 것을
                넘어, 함께 기억될 순간을 남기는 여행을 담아냅니다.
              </p>
            </div>

            <div className="info-card">
              <h3>로컬 체험 코스</h3>
              <p>
                지역 가게, 전통시장, 체험장, 특산물 판매처 등과 연결해 지역을 더
                가까이 느낄 수 있는 여행 흐름을 만들 수 있습니다. 여행자와
                지역사회가 자연스럽게 만나는 구조를 담은 추천입니다.
              </p>
            </div>

            <div className="info-card">
              <h3>계절별 추천 코스</h3>
              <p>
                봄꽃, 여름 바다, 가을 단풍, 겨울 감성거리처럼 계절 분위기에 맞춘
                추천 구조로도 확장할 수 있습니다. 계절의 감성과 지역의 분위기가
                함께 살아나는 여행을 제안합니다.
              </p>
            </div>
          </div>

          <div className="hero-actions" style={{ marginTop: "32px" }}>
            <Link to="/spots" className="primary-btn">
              지역 명소 보러가기
            </Link>
            <Link to="/contact" className="secondary-btn">
              문의 및 제휴
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}