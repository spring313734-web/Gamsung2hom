// 파일 경로: src/data/regionEvents.js
// ========================================
// 📌 감성여행2 지역별 이벤트 허브 공통 데이터
// - 이벤트 허브 메인 페이지 카드 목록 데이터
// - 지역 상세 허브 페이지 표시 데이터
// - 특별시 / 광역시 / 특별자치시 / 도 그룹 구분용 regionType 포함
// - slug 기준 상세 페이지 연결
// ========================================

const regionEventData = [
  {
    slug: "seoul",
    name: "서울",
    regionType: "special_city",
    badge: "도심 축제",
    eventCount: 12,
    shortDescription: "전시, 야시장, 계절축제를 한 번에 모아보는 서울 이벤트 허브",
    heroDescription:
      "서울의 전시, 마켓, 야간 축제, 시즌 테마 이벤트를 한눈에 모아보고 감성여행2 여행 코스로 자연스럽게 연결할 수 있는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8970b1aac1?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1538485399081-7c8970b1aac1?auto=format&fit=crop&w=1400&q=80",
    tags: ["야경", "전시", "야시장", "도심산책"],
    events: [
      {
        id: "seoul-1",
        title: "한강 야시장 감성 투어",
        category: "야시장",
        status: "진행중",
        period: "2026.04.05 - 2026.05.30",
        place: "여의도 한강공원",
        summary: "푸드트럭, 플리마켓, 라이브 공연이 함께하는 대표 야간 이벤트",
      },
      {
        id: "seoul-2",
        title: "서울 봄빛 미디어아트 전시",
        category: "전시",
        status: "진행중",
        period: "2026.04.10 - 2026.06.12",
        place: "DDP 일대",
        summary: "도심 속 빛과 공간을 활용한 체험형 미디어아트 전시",
      },
      {
        id: "seoul-3",
        title: "북촌 한옥 감성 산책 주간",
        category: "체험",
        status: "예정",
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
    regionType: "metropolitan_city",
    badge: "바다 감성",
    eventCount: 9,
    shortDescription: "바다, 야경, 공연 중심으로 즐기는 부산 지역 이벤트 모음",
    heroDescription:
      "부산의 해변 축제, 감성 야경, 로컬 공연, 시즌 이벤트를 모아서 바다 테마 여행과 연계할 수 있는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1400&q=80",
    tags: ["바다", "야경", "공연", "야시장"],
    events: [
      {
        id: "busan-1",
        title: "광안리 야경 버스킹 페스티벌",
        category: "공연",
        status: "진행중",
        period: "2026.04.07 - 2026.05.19",
        place: "광안리 해변",
        summary: "야경과 라이브 공연을 동시에 즐길 수 있는 해변형 축제",
      },
      {
        id: "busan-2",
        title: "해운대 감성 푸드 나이트",
        category: "야시장",
        status: "진행중",
        period: "2026.04.14 - 2026.05.28",
        place: "해운대 이벤트광장",
        summary: "로컬 푸드와 야간 테마 조명이 어우러진 감성 야시장",
      },
      {
        id: "busan-3",
        title: "흰여울문화마을 포토위크",
        category: "포토",
        status: "예정",
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
    slug: "daegu",
    name: "대구",
    regionType: "metropolitan_city",
    badge: "도심 감성",
    eventCount: 7,
    shortDescription: "야간 산책, 도심 축제, 로컬 공연을 모은 대구 이벤트 허브",
    heroDescription:
      "대구의 도심형 축제, 야시장, 전시, 로컬 공연을 감성여행2 코스와 연결해 주는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    tags: ["도심", "야시장", "공연", "전시"],
    events: [
      {
        id: "daegu-1",
        title: "동성로 감성 스트리트 위크",
        category: "도심축제",
        status: "진행중",
        period: "2026.04.08 - 2026.05.06",
        place: "동성로 일대",
        summary: "도심 거리 공연과 로컬 마켓이 결합된 시즌 이벤트",
      },
    ],
    courses: ["동성로 → 김광석길 → 앞산 야경 코스"],
  },
  {
    slug: "incheon",
    name: "인천",
    regionType: "metropolitan_city",
    badge: "항구 여행",
    eventCount: 8,
    shortDescription: "차이나타운, 송도, 바다 야경을 함께 즐기는 인천 이벤트 허브",
    heroDescription:
      "인천의 항구 감성, 차이나타운, 송도 행사, 시즌형 해안 이벤트를 담은 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    tags: ["항구", "야경", "바다", "도심"],
    events: [
      {
        id: "incheon-1",
        title: "송도 야간 산책 페스티벌",
        category: "야경",
        status: "진행중",
        period: "2026.04.12 - 2026.05.22",
        place: "송도 센트럴파크",
        summary: "도시 야경과 호수 산책을 함께 즐기는 감성 행사",
      },
    ],
    courses: ["송도 → 월미도 → 차이나타운 코스"],
  },
  {
    slug: "gwangju",
    name: "광주",
    regionType: "metropolitan_city",
    badge: "예술 도시",
    eventCount: 6,
    shortDescription: "전시, 예술행사, 로컬 감성을 담은 광주 이벤트 허브",
    heroDescription:
      "광주의 미술, 전시, 문화 거리 행사와 지역 감성을 여행 루트로 연결하는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80",
    tags: ["예술", "전시", "문화", "도심"],
    events: [
      {
        id: "gwangju-1",
        title: "광주 예술 골목 전시 주간",
        category: "전시",
        status: "진행중",
        period: "2026.04.09 - 2026.05.01",
        place: "문화전당 일대",
        summary: "예술 전시와 지역 문화 체험을 함께 즐기는 테마 행사",
      },
    ],
    courses: ["국립아시아문화전당 → 양림동 → 야간 산책 코스"],
  },
  {
    slug: "daejeon",
    name: "대전",
    regionType: "metropolitan_city",
    badge: "과학 감성",
    eventCount: 5,
    shortDescription: "과학, 야경, 가족형 체험을 묶은 대전 이벤트 허브",
    heroDescription:
      "대전의 과학 체험, 야간 산책, 가족형 이벤트를 모아 여행 흐름으로 연결하는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    tags: ["과학", "체험", "야경", "가족"],
    events: [
      {
        id: "daejeon-1",
        title: "엑스포 야간 라이트 산책",
        category: "야경",
        status: "진행중",
        period: "2026.04.10 - 2026.05.14",
        place: "엑스포시민광장",
        summary: "빛 조형물과 산책 동선이 결합된 야간형 행사",
      },
    ],
    courses: ["엑스포 → 한밭수목원 → 성심당 코스"],
  },
  {
    slug: "ulsan",
    name: "울산",
    regionType: "metropolitan_city",
    badge: "산업과 바다",
    eventCount: 6,
    shortDescription: "태화강, 바다, 산업도시 감성을 담은 울산 이벤트 허브",
    heroDescription:
      "울산의 강변, 바다, 산업 관광형 이벤트를 감성여행2 여행 루트와 연결하는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    tags: ["강변", "바다", "산업", "야경"],
    events: [
      {
        id: "ulsan-1",
        title: "태화강 국가정원 봄빛 주간",
        category: "산책",
        status: "진행중",
        period: "2026.04.06 - 2026.05.03",
        place: "태화강 국가정원",
        summary: "강변 산책과 계절 꽃 풍경을 함께 즐기는 이벤트",
      },
    ],
    courses: ["태화강 → 대왕암공원 → 일산해수욕장 코스"],
  },
  {
    slug: "sejong",
    name: "세종",
    regionType: "special_self_governing_city",
    badge: "호수 도시",
    eventCount: 4,
    shortDescription: "호수공원과 가족형 행사를 담은 세종 이벤트 허브",
    heroDescription:
      "세종의 호수공원, 가족형 체험, 도심형 이벤트를 편하게 둘러볼 수 있는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    tags: ["호수", "가족", "산책", "도심"],
    events: [
      {
        id: "sejong-1",
        title: "세종호수공원 야간 피크닉 위크",
        category: "피크닉",
        status: "진행중",
        period: "2026.04.11 - 2026.05.09",
        place: "세종호수공원",
        summary: "야간 조명과 가족형 피크닉을 함께 즐기는 시즌 행사",
      },
    ],
    courses: ["세종호수공원 → 국립세종수목원 코스"],
  },
  {
    slug: "gyeonggi",
    name: "경기",
    regionType: "province",
    badge: "근교 여행",
    eventCount: 11,
    shortDescription: "근교 드라이브, 호수, 문화공간을 묶은 경기 이벤트 허브",
    heroDescription:
      "경기의 근교형 축제, 드라이브 코스, 자연 산책형 이벤트를 모은 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
    tags: ["근교", "드라이브", "호수", "가족"],
    events: [
      {
        id: "gyeonggi-1",
        title: "호수공원 감성 피크닉 페어",
        category: "피크닉",
        status: "진행중",
        period: "2026.04.07 - 2026.05.20",
        place: "경기 북부 일대",
        summary: "근교 나들이와 함께 가기 좋은 계절형 피크닉 이벤트",
      },
    ],
    courses: ["파주 → 일산 → 가평 드라이브 코스"],
  },
  {
    slug: "gangwon",
    name: "강원",
    regionType: "province",
    badge: "동해 여행",
    eventCount: 6,
    shortDescription: "해변, 커피거리, 계절형 이벤트를 보는 강원 이벤트 허브",
    heroDescription:
      "강원의 바다, 산, 카페거리, 로컬 이벤트를 묶어 감성 해변 여행으로 이어주는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
    tags: ["해변", "커피", "감성카페", "산책"],
    events: [
      {
        id: "gangwon-1",
        title: "동해안 감성 카페 위크",
        category: "카페",
        status: "진행중",
        period: "2026.04.06 - 2026.04.26",
        place: "강릉 · 속초 일대",
        summary: "커피와 바다 풍경을 함께 즐기는 동해안 시즌 행사",
      },
    ],
    courses: ["강릉 → 속초 → 양양 코스"],
  },
  {
    slug: "chungbuk",
    name: "충북",
    regionType: "province",
    badge: "호수와 산책",
    eventCount: 5,
    shortDescription: "호수, 산책, 로컬 감성을 담은 충북 이벤트 허브",
    heroDescription:
      "충북의 호수형 여행지와 자연 산책형 이벤트를 모아 보여주는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    tags: ["호수", "산책", "자연", "로컬"],
    events: [
      {
        id: "chungbuk-1",
        title: "충주호 봄 산책 주간",
        category: "산책",
        status: "진행중",
        period: "2026.04.08 - 2026.05.02",
        place: "충주호 일대",
        summary: "호수 풍경과 함께 걷는 힐링형 계절 이벤트",
      },
    ],
    courses: ["충주호 → 제천 → 단양 코스"],
  },
  {
    slug: "chungnam",
    name: "충남",
    regionType: "province",
    badge: "서해 감성",
    eventCount: 5,
    shortDescription: "서해 바다와 로컬 축제를 담은 충남 이벤트 허브",
    heroDescription:
      "충남의 서해안 바다, 로컬 시장, 계절 행사를 묶어 보는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    tags: ["서해", "바다", "시장", "가족"],
    events: [
      {
        id: "chungnam-1",
        title: "서해 노을 감상 페어",
        category: "야경",
        status: "진행중",
        period: "2026.04.05 - 2026.05.12",
        place: "태안 일대",
        summary: "노을과 함께 즐기는 감성 해변형 이벤트",
      },
    ],
    courses: ["태안 → 안면도 → 보령 코스"],
  },
  {
    slug: "jeonbuk",
    name: "전북",
    regionType: "province",
    badge: "한옥 감성",
    eventCount: 8,
    shortDescription: "한옥마을과 전통 먹거리, 체험형 행사 중심의 전북 이벤트 허브",
    heroDescription:
      "전북의 한옥마을, 전통 문화 체험, 먹거리 행사, 지역 축제를 연결해 전통 감성 여행으로 이어주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
    tags: ["한옥", "전통음식", "체험", "골목여행"],
    events: [
      {
        id: "jeonbuk-1",
        title: "전주 한옥마을 야행",
        category: "야행",
        status: "진행중",
        period: "2026.04.04 - 2026.05.18",
        place: "전주 한옥마을",
        summary: "전통 골목과 야간 조명이 어우러진 대표 문화행사",
      },
    ],
    courses: ["한옥마을 → 경기전 → 전동성당 코스"],
  },
  {
    slug: "jeonnam",
    name: "전남",
    regionType: "province",
    badge: "남도 감성",
    eventCount: 6,
    shortDescription: "남도 바다와 정원을 함께 즐기는 전남 이벤트 허브",
    heroDescription:
      "전남의 섬, 바다, 정원형 축제, 감성 야경 이벤트를 묶어 보여주는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
    tags: ["남도", "바다", "정원", "야경"],
    events: [
      {
        id: "jeonnam-1",
        title: "순천만 감성 정원 나이트",
        category: "정원",
        status: "진행중",
        period: "2026.04.09 - 2026.05.15",
        place: "순천만 국가정원",
        summary: "정원 산책과 야간 조명을 함께 즐기는 감성 행사",
      },
    ],
    courses: ["순천 → 여수 → 담양 코스"],
  },
  {
    slug: "gyeongbuk",
    name: "경북",
    regionType: "province",
    badge: "역사 여행",
    eventCount: 7,
    shortDescription: "전통문화와 야간 명소를 함께 즐기는 경북 이벤트 허브",
    heroDescription:
      "경북의 역사문화 행사, 야간 조명 명소, 전통 체험 이벤트를 모아서 감성여행2의 스토리형 여행 흐름으로 이어주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    tags: ["전통", "야간개장", "문화유산", "체험"],
    events: [
      {
        id: "gyeongbuk-1",
        title: "경주 역사야행 특별주간",
        category: "문화유산",
        status: "진행중",
        period: "2026.04.01 - 2026.05.15",
        place: "경주 일대",
        summary: "야간 조명과 함께 걷는 대표 역사 감성 이벤트",
      },
    ],
    courses: ["경주 → 안동 → 포항 코스"],
  },
  {
    slug: "gyeongnam",
    name: "경남",
    regionType: "province",
    badge: "바다와 도시",
    eventCount: 7,
    shortDescription: "항구 도시와 바다 감성을 함께 담은 경남 이벤트 허브",
    heroDescription:
      "경남의 바다, 항구 도시, 산책형 이벤트와 계절 축제를 연결하는 지역 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    tags: ["바다", "항구", "산책", "야경"],
    events: [
      {
        id: "gyeongnam-1",
        title: "통영 밤바다 감성 주간",
        category: "야경",
        status: "진행중",
        period: "2026.04.10 - 2026.05.18",
        place: "통영 강구안",
        summary: "밤바다와 항구 야경을 즐기는 시즌 이벤트",
      },
    ],
    courses: ["통영 → 거제 → 남해 코스"],
  },
  {
    slug: "jeju",
    name: "제주",
    regionType: "province",
    badge: "자연 힐링",
    eventCount: 10,
    shortDescription: "오름, 바다, 플리마켓, 감성축제를 담은 제주 이벤트 허브",
    heroDescription:
      "제주의 자연 감성, 로컬 마켓, 계절 축제, 바다 테마 이벤트를 묶어 힐링형 여행 루트로 연결해주는 허브입니다.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    tags: ["오름", "바다", "힐링", "플리마켓"],
    events: [
      {
        id: "jeju-1",
        title: "제주 바다빛 야간 산책",
        category: "야경",
        status: "진행중",
        period: "2026.04.08 - 2026.05.22",
        place: "함덕 해변",
        summary: "야간 조명과 바다 풍경을 함께 즐기는 감성 산책형 행사",
      },
    ],
    courses: ["함덕 → 월정리 → 세화 감성 해안 코스"],
  },
];

export function getRegionEventData() {
  return regionEventData;
}

export function getRegionBySlug(slug) {
  return regionEventData.find((region) => region.slug === slug);
}

export function getAllRegions() {
  return regionEventData;
}