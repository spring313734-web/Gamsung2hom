// 파일 경로: src/pages/SpotsPage.jsx
// ========================================
// 📌 지역 명소 탐방 페이지
// - 공용 상단 비주얼 배너 적용
// - 지역 명소 소개
// - 숨은 장소와 스토리형 명소 안내
// - 감성 사진 포인트 및 테마 탐방 방향 제시
// ========================================

import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

export default function SpotsPage() {
  return (
    <div className="page normal-page">
      <PageHero
        badge="숨은 명소와 함께 기억되는 장소"
        title="지역 명소 탐방"
        description="명소는 단지 보는 곳이 아니라, 사람과 지역의 이야기가 함께 기억되는 곳입니다."
        backgroundImage="/gamsung2.png"
      />

      <section className="content-section">
        <div className="content-inner narrow">
          <p className="page-description">
            감성여행2는 유명 관광지뿐 아니라, 지역 주민들이 아끼는 숨은 장소와
            이야기가 있는 공간까지 함께 담아내고자 합니다. 눈에 보이는 장소만이
            아니라 그 장소가 가진 느낌과 사연까지 여행의 일부로 소개하는
            페이지입니다.
          </p>

          <div className="card-grid">
            <div className="info-card">
              <h3>숨은 명소 소개</h3>
              <p>
                지역 주민들이 아끼는 조용한 산책길, 작은 골목, 감성 카페 거리,
                전망 좋은 포인트 등 잘 알려지지 않았지만 매력적인 장소를 담을 수
                있습니다. 감성여행2는 이런 공간 속에 살아 있는 지역의 분위기를
                함께 보여 주고자 합니다.
              </p>
            </div>

            <div className="info-card">
              <h3>전설과 역사 연결</h3>
              <p>
                지역의 전설, 옛이야기, 역사적 배경을 함께 소개해 한 장소를 더
                깊게 느낄 수 있는 스토리형 명소 탐방 구조로 확장할 수 있습니다.
                장소를 보는 것을 넘어, 그 지역의 시간과 기억을 만나는 여행을
                지향합니다.
              </p>
            </div>

            <div className="info-card">
              <h3>감성 사진 포인트</h3>
              <p>
                아침, 노을, 야경처럼 시간대에 따라 분위기가 달라지는 장소와
                사진으로 남기기 좋은 포인트를 함께 안내할 수 있습니다. 장면을
                기록하는 것과 동시에 마음에 남는 추억을 함께 남기는 공간입니다.
              </p>
            </div>
          </div>

          <div className="card-grid" style={{ marginTop: "22px" }}>
            <div className="info-card">
              <h3>지역 이야기 담기</h3>
              <p>
                장소 소개에 그치지 않고 그 지역 사람들의 생활과 분위기, 기억을
                함께 담아 여행자가 더 따뜻하게 지역을 느낄 수 있도록 구성합니다.
                감성여행2는 명소를 지역사회와 연결된 이야기 속에서 바라봅니다.
              </p>
            </div>

            <div className="info-card">
              <h3>추천 동선 확장</h3>
              <p>
                명소 하나만 보여주는 것이 아니라, 근처 가게와 먹거리, 쉬어 갈 곳,
                다음 이동 장소까지 연결하는 흐름으로 발전시킬 수 있습니다.
                여행자가 지역과 더 자연스럽게 이어지는 길을 만드는 것이
                중요합니다.
              </p>
            </div>

            <div className="info-card">
              <h3>앱 지도 연결 가능</h3>
              <p>
                앞으로 앱이나 지도 기능과 연결하면 명소 탐방 페이지를 실제 이동
                동선과 연계된 구조로 확장할 수 있습니다. 더 많은 사람과 지역이
                연결되는 여행 구조로 발전시킬 수 있습니다.
              </p>
            </div>
          </div>

          <div className="hero-actions" style={{ marginTop: "32px" }}>
            <Link to="/recommend" className="primary-btn">
              추천 코스 보기
            </Link>
            <Link to="/partner" className="secondary-btn">
              소상공인 연결
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}