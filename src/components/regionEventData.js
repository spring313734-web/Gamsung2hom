// 파일 경로: src/data/regionEventData.js
// ========================================
// 📌 감성여행2 지역별 이벤트 허브 공통 데이터
// - 이벤트 허브 메인 페이지 카드 목록 데이터
// - 지역 상세 허브 페이지 표시 데이터
// - 추천 이벤트 / 추천 코스 / 대표 태그 구성
// - slug 기준으로 상세 페이지 연결
// ========================================

const regionEventData = [
  {
    slug: "seoul",
    name: "서울",
    badge: "도심 축제",
    eventCount: 12,
    shortDescription: "전시, 야시장, 계절축제를 한 번에 모아보는 서울 이벤트 허브",
    heroDescription:
      "서울의 전시, 마켓, 야간 축제, 시즌 테마 이벤트를 한눈에 모아보고 감성여행2 여행 코스로 자연스럽게 연결할 수 있는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8970b1aac1?auto=format&fit=crop&w=1400&q=80",
    tags: ["야경", "전시", "야시장", "도심산책"],
    events: [
      {
        title: "한강 야시장 감성 투어",
        period: "2026.04.05 - 2026.05.30",
        place: "여의도 한강공원",
        summary: "푸드트럭, 플리마켓, 라이브 공연이 함께하는 대표 야간 이벤트",
      },
      {
        title: "서울 봄빛 미디어아트 전시",
        period: "2026.04.10 - 2026.06.12",
        place: "DDP 일대",
        summary: "도심 속 빛과 공간을 활용한 체험형 미디어아트 전시",
      },
      {
        title: "북촌 한옥 감성 산책 주간",
        period: "2026.04.01 - 2026.04.21",
        place: "북촌 한옥마을",
        summary: "전통 골목길 산책과 공방 체험을 함께 즐기는 테마형 행사",
      },
    ],
    courses: [
      "광화문 → 북촌 → 익선동 감성 코스",
      "한강공원 → 여의도 야경 → 서울숲 코스",
      "DDP → 성수 팝업 → 서울숲 산책 코스",
    ],
  },
  {
    slug: "busan",
    name: "부산",
    badge: "바다 감성",
    eventCount: 9,
    shortDescription: "바다, 야경, 공연 중심으로 즐기는 부산 지역 이벤트 모음",
    heroDescription:
      "부산의 해변 축제, 감성 야경, 로컬 공연, 시즌 이벤트를 모아서 바다 테마 여행과 연계할 수 있는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=80",
    tags: ["바다", "야경", "공연", "야시장"],
    events: [
      {
        title: "광안리 야경 버스킹 페스티벌",
        period: "2026.04.07 - 2026.05.19",
        place: "광안리 해변",
        summary: "야경과 라이브 공연을 동시에 즐길 수 있는 해변형 축제",
      },
      {
        title: "해운대 감성 푸드 나이트",
        period: "2026.04.14 - 2026.05.28",
        place: "해운대 이벤트광장",
        summary: "로컬 푸드와 야간 테마 조명이 어우러진 감성 야시장",
      },
      {
        title: "흰여울문화마을 포토위크",
        period: "2026.04.03 - 2026.04.25",
        place: "흰여울문화마을",
        summary: "사진 산책과 소규모 전시를 함께 즐기는 지역 문화 행사",
      },
    ],
    courses: [
      "해운대 → 달맞이길 → 광안리 야경 코스",
      "흰여울문화마을 → 영도 → 송도 해상케이블카 코스",
      "광안리 → 민락수변공원 → 부산항 야경 코스",
    ],
  },
  {
    slug: "gyeongju",
    name: "경주",
    badge: "역사 여행",
    eventCount: 7,
    shortDescription: "전통문화와 야간 명소를 함께 즐기는 경주 이벤트 허브",
    heroDescription:
      "경주의 역사문화 행사, 야간 조명 명소, 전통 체험 이벤트를 모아서 감성여행2의 스토리형 여행 흐름으로 이어주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    tags: ["전통", "야간개장", "문화유산", "체험"],
    events: [
      {
        title: "동궁과 월지 야간 개장 특별주간",
        period: "2026.04.01 - 2026.05.15",
        place: "동궁과 월지",
        summary: "야간 조명과 함께 걷는 대표 역사 감성 이벤트",
      },
      {
        title: "황리단길 로컬 감성 마켓",
        period: "2026.04.11 - 2026.04.27",
        place: "황리단길",
        summary: "소품, 디저트, 공방이 함께하는 지역 감성 마켓 행사",
      },
      {
        title: "신라복 체험 문화주간",
        period: "2026.04.09 - 2026.04.30",
        place: "경주 시내 일대",
        summary: "전통복 체험과 포토존, 문화 해설이 결합된 체험형 프로그램",
      },
    ],
    courses: [
      "대릉원 → 황리단길 → 동궁과 월지 야간 코스",
      "불국사 → 석굴암 → 보문단지 힐링 코스",
      "첨성대 → 교촌마을 → 월정교 야경 코스",
    ],
  },
  {
    slug: "jeju",
    name: "제주",
    badge: "자연 힐링",
    eventCount: 10,
    shortDescription: "오름, 바다, 플리마켓, 감성축제를 담은 제주 이벤트 허브",
    heroDescription:
      "제주의 자연 감성, 로컬 마켓, 계절 축제, 바다 테마 이벤트를 묶어 힐링형 여행 루트로 연결해주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    tags: ["오름", "바다", "힐링", "플리마켓"],
    events: [
      {
        title: "제주 바다빛 야간 산책",
        period: "2026.04.08 - 2026.05.22",
        place: "함덕 해변",
        summary: "야간 조명과 바다 풍경을 함께 즐기는 감성 산책형 행사",
      },
      {
        title: "제주 로컬 플리마켓 주말장",
        period: "2026.04.02 - 2026.06.01",
        place: "제주시 로컬마켓존",
        summary: "제주 소품, 간식, 수공예품을 만날 수 있는 로컬 마켓",
      },
      {
        title: "오름 힐링 트레킹 데이",
        period: "2026.04.13 - 2026.05.10",
        place: "새별오름 일대",
        summary: "자연 풍경과 걷기 여행을 연결한 체험형 프로그램",
      },
    ],
    courses: [
      "함덕 → 월정리 → 세화 감성 해안 코스",
      "새별오름 → 협재 → 금능 힐링 코스",
      "제주시 로컬마켓 → 애월 카페거리 → 노을 코스",
    ],
  },
  {
    slug: "gangneung",
    name: "강릉",
    badge: "동해 여행",
    eventCount: 6,
    shortDescription: "카페거리와 해변 중심의 계절형 이벤트를 보는 강릉 허브",
    heroDescription:
      "강릉의 바다, 카페거리, 계절 축제, 로컬 문화 이벤트를 모아 감성 해변 여행으로 이어주는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    tags: ["해변", "커피", "감성카페", "산책"],
    events: [
      {
        title: "안목 커피거리 감성 주간",
        period: "2026.04.06 - 2026.04.26",
        place: "안목해변",
        summary: "커피와 바다 풍경을 함께 즐기는 강릉 대표 감성 행사",
      },
      {
        title: "경포호 봄밤 산책 축제",
        period: "2026.04.10 - 2026.05.05",
        place: "경포호 일대",
        summary: "벚꽃과 호수 야경을 함께 볼 수 있는 야간 산책 이벤트",
      },
      {
        title: "강릉 로컬 디저트 마켓",
        period: "2026.04.12 - 2026.04.29",
        place: "강릉 중앙권역",
        summary: "지역 디저트와 수공예품이 함께하는 소규모 마켓 행사",
      },
    ],
    courses: [
      "안목해변 → 커피거리 → 경포해변 코스",
      "경포호 → 초당순두부마을 → 바다산책 코스",
      "강릉역 → 중앙시장 → 야간 해변 코스",
    ],
  },
  {
    slug: "jeonju",
    name: "전주",
    badge: "한옥 감성",
    eventCount: 8,
    shortDescription: "한옥마을과 전통 먹거리, 체험형 행사 중심의 지역 이벤트 허브",
    heroDescription:
      "전주의 한옥마을, 전통 문화 체험, 먹거리 행사, 지역 축제를 연결해 전통 감성 여행으로 이어주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
    tags: ["한옥", "전통음식", "체험", "골목여행"],
    events: [
      {
        title: "전주 한옥마을 야행",
        period: "2026.04.04 - 2026.05.18",
        place: "전주 한옥마을",
        summary: "전통 골목과 야간 조명이 어우러진 대표 문화행사",
      },
      {
        title: "전주 로컬푸드 테이스팅 페어",
        period: "2026.04.09 - 2026.04.24",
        place: "전주 시내 행사장",
        summary: "전주 대표 먹거리와 지역 상점을 함께 만나는 체험형 이벤트",
      },
      {
        title: "전통 공예 체험 주간",
        period: "2026.04.15 - 2026.05.03",
        place: "공예체험관 일대",
        summary: "전통 공예, 만들기 체험, 기념품 프로그램이 함께하는 행사",
      },
    ],
    courses: [
      "한옥마을 → 경기전 → 전동성당 코스",
      "한옥마을 → 남부시장 → 야시장 코스",
      "전통 공예관 → 객리단길 → 감성 카페 코스",
    ],
  },
];

export function getRegionEventData() {
  return regionEventData;
}

export function getRegionBySlug(slug) {
  return regionEventData.find((region) => region.slug === slug);
}