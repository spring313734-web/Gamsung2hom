// 파일 경로: src/components/PageHero.jsx
// ========================================
// 📌 감성여행2 공용 페이지 상단 비주얼 배너
// - 각 페이지의 대표 이미지 배경 표시
// - 페이지 제목 / 설명 / 작은 배지 출력
// - 클릭 간섭 방지를 위해 배너는 표시 전용 레이어로만 사용
// ========================================

import "./PageHero.css";

export default function PageHero({
  badge,
  title,
  description,
  backgroundImage,
}) {
  return (
    <section
      className="page-hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-hidden="true"
    >
      <div className="page-hero-overlay">
        <div className="page-hero-inner">
          {badge ? <p className="page-hero-badge">{badge}</p> : null}
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
      </div>
    </section>
  );
}