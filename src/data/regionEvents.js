// 파일 경로: src/data/regionEvents.js
// ========================================
// 📌 감성여행2 지역별 이벤트 허브 공통 데이터
// - 이벤트 허브 메인 페이지 카드 목록 데이터
// - 지역 상세 허브 페이지 표시 데이터
// - 특별시 / 광역시 / 특별자치시 / 도 그룹 구분용 regionType 포함
// - slug 기준 상세 페이지 연결
// - 홈페이지 전역에서 같은 구조로 재사용할 수 있도록 데이터 정규화 함수 추가
// - 후기/참여글 postItems 공용 구조 포함
// - nickname / userId / authorDisplayName 표시값 정규화
// - 댓글 수정 가능 구조를 위한 commentItems 정규화 추가
// - commentCount를 실제 commentItems 기준으로 자동 보정
// - 기존 웹 화면 호환용 period / place / summary / image 필드도 함께 유지
// ========================================

const rawRegionEventData = [
  {
    slug: "seoul",
    name: "서울",
    regionType: "special_city",
    badge: "도심 축제",
    eventCount: 12,
    shortDescription: "전시, 야시장, 계절 이벤트를 한 번에 이어보는 서울 대표 허브",
    heroDescription:
      "서울의 전시, 마켓, 야간 축제, 시즌 테마 이벤트를 한눈에 모아보고 감성여행2의 도심형 여행 흐름으로 자연스럽게 연결할 수 있는 지역 허브입니다.",
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
        summary: "푸드트럭과 플리마켓, 라이브 공연을 함께 즐기는 대표 야간 이벤트",
        hostName: "서울특별시 관광체육국",
        contactNumber: "02-120-0000",
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "seoul-2",
        title: "서울 봄빛 미디어아트 전시",
        category: "전시",
        status: "진행중",
        period: "2026.04.10 - 2026.06.12",
        place: "DDP 일대",
        summary: "도심 속 빛과 공간을 활용해 감각적으로 이어지는 체험형 미디어아트 전시",
        hostName: "서울디자인재단",
        contactNumber: "02-2153-0000",
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "seoul-3",
        title: "북촌 한옥 감성 산책 주간",
        category: "체험",
        status: "예정",
        period: "2026.04.01 - 2026.04.21",
        place: "북촌 한옥마을",
        summary: "전통 골목길 산책과 공방 체험을 함께 즐기는 테마형 감성 행사",
        hostName: "종로구 문화관광과",
        contactNumber: "02-2148-0000",
        image:
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "seoul-post-1",
        eventId: "seoul-1",
        type: "review",
        title: "한강 야시장에서 친구들이랑 정말 즐거운 시간 보냈어요",
        summary:
          "푸드트럭 음식 종류도 다양했고, 라이브 공연 분위기도 좋아서 밤 산책 코스로 딱 좋았어요.",
        content:
          "여의도 한강공원 쪽으로 천천히 걸으면서 야시장 구경했는데 생각보다 볼거리가 많았어요. 음식도 맛있고 조명 분위기도 예뻐서 사진 찍기 좋았습니다.",
        nickname: "감성별빛",
        userId: "rivertrip_01",
        createdAt: "2026-04-03T19:20:00+09:00",
        updatedAt: "2026-04-03T19:20:00+09:00",
        isEdited: false,
        likeCount: 18,
        image:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "seoul-post-1-comment-1",
            nickname: "도시산책러",
            userId: "urbanwalk77",
            content: "한강 쪽 야시장 분위기 진짜 좋죠. 사진도 잘 나와요.",
            createdAt: "2026-04-03T20:02:00+09:00",
            updatedAt: "2026-04-03T20:02:00+09:00",
            isEdited: false,
          },
          {
            id: "seoul-post-1-comment-2",
            nickname: "",
            userId: "hanok_day",
            content: "저도 이번 주말에 가보려고 했는데 후기 보니 더 기대돼요.",
            createdAt: "2026-04-03T20:28:00+09:00",
            updatedAt: "2026-04-03T20:28:00+09:00",
            isEdited: false,
          },
          {
            id: "seoul-post-1-comment-3",
            nickname: "서울밤공기",
            userId: "night_viewer",
            content: "푸드트럭 줄은 좀 있었나요?",
            createdAt: "2026-04-03T21:05:00+09:00",
            updatedAt: "2026-04-03T21:22:00+09:00",
            isEdited: true,
          },
          {
            id: "seoul-post-1-comment-4",
            nickname: "감성별빛",
            userId: "rivertrip_01",
            content: "조금 있었는데 생각보다 금방 빠졌어요!",
            createdAt: "2026-04-03T21:30:00+09:00",
            updatedAt: "2026-04-03T21:30:00+09:00",
            isEdited: false,
          },
        ],
      },
      {
        id: "seoul-post-2",
        eventId: "seoul-2",
        type: "participation",
        title: "서울 봄빛 미디어아트 전시 참여 인증합니다",
        summary:
          "빛 연출이 생각보다 훨씬 화려했고, 사진으로 남기기 좋은 포인트가 많았어요.",
        content:
          "DDP 일대 전시 동선이 잘 되어 있어서 부담 없이 둘러보기 좋았습니다. 저녁 시간대에 가니까 분위기가 더 살아났어요.",
        nickname: "도시산책러",
        userId: "urbanwalk77",
        createdAt: "2026-04-02T21:05:00+09:00",
        updatedAt: "2026-04-02T21:18:00+09:00",
        isEdited: true,
        likeCount: 11,
        image:
          "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "seoul-post-2-comment-1",
            nickname: "감성별빛",
            userId: "rivertrip_01",
            content: "여긴 저녁에 가야 진짜 분위기 사는 것 같아요.",
            createdAt: "2026-04-02T21:50:00+09:00",
            updatedAt: "2026-04-02T21:50:00+09:00",
            isEdited: false,
          },
          {
            id: "seoul-post-2-comment-2",
            nickname: "빛의온도",
            userId: "light_trip",
            content: "사진 포인트 많으면 친구들이랑 같이 가기 좋겠네요.",
            createdAt: "2026-04-02T22:14:00+09:00",
            updatedAt: "2026-04-02T22:14:00+09:00",
            isEdited: false,
          },
        ],
      },
      {
        id: "seoul-post-3",
        eventId: "seoul-3",
        type: "review",
        title: "북촌 한옥 감성 산책 주간 조용해서 더 좋았어요",
        summary:
          "복잡하지 않은 시간대에 가니까 골목 분위기를 천천히 느낄 수 있었어요.",
        content:
          "전통 골목과 공방 체험이 잘 어울렸고, 사진 찍기에도 좋았습니다. 부모님과 같이 가도 괜찮을 것 같아요.",
        nickname: "",
        userId: "hanok_day",
        createdAt: "2026-04-01T14:40:00+09:00",
        updatedAt: "2026-04-01T14:40:00+09:00",
        isEdited: false,
        likeCount: 7,
        image:
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "seoul-post-3-comment-1",
            nickname: "도시산책러",
            userId: "urbanwalk77",
            content: "부모님 모시고 가기 좋다는 말이 딱 와닿네요.",
            createdAt: "2026-04-01T15:12:00+09:00",
            updatedAt: "2026-04-01T15:12:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "바다, 야경, 공연 흐름으로 이어보는 부산 대표 이벤트 허브",
    heroDescription:
      "부산의 해변 축제, 감성 야경, 로컬 공연, 시즌 이벤트를 모아 바다 테마 여행과 자연스럽게 이어볼 수 있는 지역 허브입니다.",
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
        summary: "광안리 야경과 라이브 버스킹 공연을 함께 즐기는 해변형 축제",
        hostName: "부산광역시 관광진흥과",
        contactNumber: "051-888-1234",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "busan-2",
        title: "해운대 감성 푸드 나이트",
        category: "야시장",
        status: "진행중",
        period: "2026.04.14 - 2026.05.28",
        place: "해운대 이벤트광장",
        summary: "로컬 푸드와 야간 조명이 어우러져 해운대의 밤을 채우는 감성 야시장",
        hostName: "해운대구 관광문화과",
        contactNumber: "051-749-0000",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
      },
      {
        id: "busan-3",
        title: "흰여울문화마을 포토위크",
        category: "포토",
        status: "예정",
        period: "2026.04.03 - 2026.04.25",
        place: "흰여울문화마을",
        summary: "사진 산책과 소규모 전시를 함께 즐기며 골목 감성을 담아내는 지역 문화 행사",
        hostName: "영도구 문화관광과",
        contactNumber: "051-419-0000",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "busan-post-1",
        eventId: "busan-1",
        type: "review",
        title: "광안리 야경 버스킹 분위기 최고였어요",
        summary:
          "바다 보면서 공연 듣는 느낌이 정말 좋아서 다시 가고 싶은 행사였어요.",
        content:
          "광안대교 조명까지 같이 보이니까 분위기가 정말 좋았고, 공연 수준도 꽤 괜찮았습니다.",
        nickname: "바다소리",
        userId: "busanwave22",
        createdAt: "2026-04-03T20:10:00+09:00",
        updatedAt: "2026-04-03T20:10:00+09:00",
        isEdited: false,
        likeCount: 16,
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "busan-post-1-comment-1",
            nickname: "밤바다좋아",
            userId: "sea_night_11",
            content: "광안리 야경이랑 버스킹 조합은 진짜 최고죠.",
            createdAt: "2026-04-03T20:44:00+09:00",
            updatedAt: "2026-04-03T20:44:00+09:00",
            isEdited: false,
          },
          {
            id: "busan-post-1-comment-2",
            nickname: "",
            userId: "nightfood_b",
            content: "공연 시간대가 따로 정해져 있었나요?",
            createdAt: "2026-04-03T21:02:00+09:00",
            updatedAt: "2026-04-03T21:02:00+09:00",
            isEdited: false,
          },
          {
            id: "busan-post-1-comment-3",
            nickname: "바다소리",
            userId: "busanwave22",
            content: "저는 8시쯤 갔는데 공연팀이 계속 바뀌면서 이어졌어요.",
            createdAt: "2026-04-03T21:15:00+09:00",
            updatedAt: "2026-04-03T21:20:00+09:00",
            isEdited: true,
          },
        ],
      },
      {
        id: "busan-post-2",
        eventId: "busan-2",
        type: "participation",
        title: "해운대 감성 푸드 나이트 다녀왔어요",
        summary:
          "먹거리 종류가 다양했고 조명 덕분에 밤 분위기가 더 살아났어요.",
        content:
          "친구들이랑 같이 다녀왔는데 해운대 밤바다랑 같이 즐기기 좋았습니다. 사진 찍기 좋은 포인트도 많았어요.",
        nickname: "",
        userId: "nightfood_b",
        createdAt: "2026-04-02T18:55:00+09:00",
        updatedAt: "2026-04-02T19:05:00+09:00",
        isEdited: true,
        likeCount: 9,
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "busan-post-2-comment-1",
            nickname: "바다소리",
            userId: "busanwave22",
            content: "해운대 쪽 먹거리 행사는 사진 찍기에도 좋더라고요.",
            createdAt: "2026-04-02T19:40:00+09:00",
            updatedAt: "2026-04-02T19:40:00+09:00",
            isEdited: false,
          },
          {
            id: "busan-post-2-comment-2",
            nickname: "푸드트립",
            userId: "food_night_trip",
            content: "어떤 음식이 제일 괜찮았는지 궁금해요.",
            createdAt: "2026-04-02T20:03:00+09:00",
            updatedAt: "2026-04-02T20:03:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "야간 산책과 로컬 공연 흐름을 담아낸 대구 이벤트 허브",
    heroDescription:
      "대구의 도심형 축제, 야시장, 전시, 로컬 공연을 감성여행2의 도시형 코스와 자연스럽게 연결해주는 지역 허브입니다.",
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
        summary: "도심 거리 공연과 로컬 마켓이 함께 이어지는 시즌형 감성 이벤트",
        hostName: "대구광역시 관광과",
        contactNumber: "053-120-0000",
        image:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "daegu-post-1",
        eventId: "daegu-1",
        type: "review",
        title: "동성로 분위기가 살아 있어서 산책하기 좋았어요",
        summary: "공연하고 마켓이 같이 있어서 심심하지 않았어요.",
        content:
          "저녁 시간대에 가니까 조명도 괜찮고 사람들도 많아서 활기찬 느낌이었습니다.",
        nickname: "로컬한걸음",
        userId: "daegu_trip",
        createdAt: "2026-04-03T16:30:00+09:00",
        updatedAt: "2026-04-03T16:30:00+09:00",
        isEdited: false,
        likeCount: 5,
        image:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "daegu-post-1-comment-1",
            nickname: "야시장좋아",
            userId: "city_night_trip",
            content: "동성로는 밤 분위기가 확실히 좋죠.",
            createdAt: "2026-04-03T17:10:00+09:00",
            updatedAt: "2026-04-03T17:10:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "항구, 송도, 바다 야경을 감성 흐름으로 이어보는 인천 허브",
    heroDescription:
      "인천의 항구 감성, 차이나타운, 송도 행사, 시즌형 해안 이벤트를 한 번에 살펴보고 도심과 바다를 함께 잇는 지역 허브입니다.",
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
        summary: "도시 야경과 호수 산책을 함께 즐기며 여유롭게 이어지는 감성 행사",
        hostName: "인천관광공사",
        contactNumber: "032-000-0000",
        image:
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "incheon-post-1",
        eventId: "incheon-1",
        type: "participation",
        title: "송도 저녁 산책 코스로 추천해요",
        summary: "호수 쪽 분위기가 좋아서 가족이랑 걷기 좋았습니다.",
        content:
          "야경이 생각보다 예뻐서 사진도 많이 찍었고, 조용하게 걷기에도 잘 어울렸습니다.",
        nickname: "",
        userId: "songdo_night",
        createdAt: "2026-04-02T20:30:00+09:00",
        updatedAt: "2026-04-02T20:30:00+09:00",
        isEdited: false,
        likeCount: 6,
        image:
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "incheon-post-1-comment-1",
            nickname: "야경산책",
            userId: "lake_viewer",
            content: "송도는 밤에 걸으면 진짜 괜찮죠.",
            createdAt: "2026-04-02T21:02:00+09:00",
            updatedAt: "2026-04-02T21:02:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "전시와 문화 감성을 한 번에 이어보는 광주 이벤트 허브",
    heroDescription:
      "광주의 미술, 전시, 문화 거리 행사와 로컬 감성을 여행 루트와 연결해 더 깊게 즐길 수 있도록 정리한 지역 허브입니다.",
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
        summary: "예술 전시와 지역 문화 체험을 함께 즐기며 골목 감성을 살리는 테마 행사",
        hostName: "광주광역시 문화관광체육실",
        contactNumber: "062-000-0000",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "gwangju-post-1",
        eventId: "gwangju-1",
        type: "review",
        title: "예술 골목이 생각보다 훨씬 감성적이었어요",
        summary: "작은 전시들이 이어져서 천천히 보기 좋았습니다.",
        content:
          "문화전당 근처 동선이 편해서 가볍게 둘러보기 좋았고, 사진 남기기에도 괜찮았습니다.",
        nickname: "전시좋아",
        userId: "artroad_gj",
        createdAt: "2026-04-01T17:00:00+09:00",
        updatedAt: "2026-04-01T17:00:00+09:00",
        isEdited: false,
        likeCount: 4,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        commentItems: [],
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
    shortDescription: "과학 체험과 야경 흐름을 함께 담아낸 대전 이벤트 허브",
    heroDescription:
      "대전의 과학 체험, 야간 산책, 가족형 이벤트를 한 번에 모아 감성여행2의 도심형 여행 흐름으로 연결하는 지역 허브입니다.",
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
        summary: "빛 조형물과 산책 동선을 따라 편하게 이어지는 야간형 행사",
        hostName: "대전관광공사",
        contactNumber: "042-000-0000",
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "daejeon-post-1",
        eventId: "daejeon-1",
        type: "participation",
        title: "조명 산책로가 잘 되어 있어서 편하게 걸었어요",
        summary: "가족 단위로 와도 무난하게 즐길 수 있을 것 같아요.",
        content:
          "동선이 복잡하지 않아서 편했고, 밤 분위기가 차분해서 좋았습니다.",
        nickname: "",
        userId: "expo_light",
        createdAt: "2026-04-03T19:10:00+09:00",
        updatedAt: "2026-04-03T19:10:00+09:00",
        isEdited: false,
        likeCount: 3,
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "daejeon-post-1-comment-1",
            nickname: "과학산책",
            userId: "science_walk",
            content: "아이들이랑 같이 가도 괜찮을 것 같네요.",
            createdAt: "2026-04-03T19:40:00+09:00",
            updatedAt: "2026-04-03T19:40:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "강변과 바다, 도시 감성이 함께 흐르는 울산 이벤트 허브",
    heroDescription:
      "울산의 강변, 바다, 산업 관광형 이벤트를 감성여행2의 여행 루트와 연결해 보다 입체적으로 이어볼 수 있는 지역 허브입니다.",
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
        summary: "강변 산책과 계절 꽃 풍경을 함께 즐기며 여유롭게 걷는 감성 이벤트",
        hostName: "울산광역시 관광과",
        contactNumber: "052-120-1234",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "ulsan-post-1",
        eventId: "ulsan-1",
        type: "review",
        title: "꽃이랑 강변 산책이 잘 어울렸어요",
        summary: "오래 걷기 좋은 편안한 코스였습니다.",
        content:
          "사진 찍을 포인트도 많고 공원 관리가 잘 되어 있어서 만족했습니다.",
        nickname: "산책한바퀴",
        userId: "ulsan_walk",
        createdAt: "2026-04-02T15:20:00+09:00",
        updatedAt: "2026-04-02T15:20:00+09:00",
        isEdited: false,
        likeCount: 4,
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "ulsan-post-1-comment-1",
            nickname: "걷는하루",
            userId: "walk_trip_day",
            content: "태화강은 계절마다 다른 느낌이라 좋아요.",
            createdAt: "2026-04-02T16:01:00+09:00",
            updatedAt: "2026-04-02T16:01:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "호수공원과 가족형 이벤트를 담아낸 세종 대표 허브",
    heroDescription:
      "세종의 호수공원, 가족형 체험, 도심형 이벤트를 편하게 둘러보고 차분한 도시 감성으로 이어볼 수 있는 지역 허브입니다.",
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
        summary: "야간 조명과 가족형 피크닉을 함께 즐기며 편하게 머무는 시즌 행사",
        hostName: "세종시 관광문화재단",
        contactNumber: "044-000-0000",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "sejong-post-1",
        eventId: "sejong-1",
        type: "participation",
        title: "아이들과 같이 가기 좋았어요",
        summary: "호수공원 분위기가 차분해서 가족 피크닉 느낌이 잘 났어요.",
        content:
          "야간 조명도 부담스럽지 않고 걷기 좋았어요. 가족 나들이 장소로 괜찮았습니다.",
        nickname: "호수맘",
        userId: "sejong_family",
        createdAt: "2026-04-02T19:50:00+09:00",
        updatedAt: "2026-04-02T19:50:00+09:00",
        isEdited: false,
        likeCount: 5,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "sejong-post-1-comment-1",
            nickname: "가족나들이",
            userId: "family_outing",
            content: "세종호수공원은 주차도 비교적 편하더라고요.",
            createdAt: "2026-04-02T20:18:00+09:00",
            updatedAt: "2026-04-02T20:18:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "근교 드라이브와 자연 감성을 함께 잇는 경기 이벤트 허브",
    heroDescription:
      "경기의 근교형 축제, 드라이브 코스, 자연 산책형 이벤트를 모아 일상 가까이에서 감성 여행 흐름을 이어볼 수 있는 지역 허브입니다.",
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
        summary: "근교 나들이와 함께 가기 좋은 계절형 피크닉 이벤트를 여유롭게 즐기는 행사",
        hostName: "경기관광공사",
        contactNumber: "031-000-0000",
        image:
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "gyeonggi-post-1",
        eventId: "gyeonggi-1",
        type: "review",
        title: "근교 나들이로 딱 좋았어요",
        summary: "가볍게 드라이브하고 쉬기 좋은 분위기였습니다.",
        content:
          "멀지 않아서 부담 없었고, 가족이나 연인과 가기에도 무난해 보였습니다.",
        nickname: "",
        userId: "near_trip",
        createdAt: "2026-04-03T13:20:00+09:00",
        updatedAt: "2026-04-03T13:20:00+09:00",
        isEdited: false,
        likeCount: 6,
        image:
          "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "gyeonggi-post-1-comment-1",
            nickname: "주말드라이브",
            userId: "weekend_run",
            content: "가볍게 다녀오기 좋은 코스 같아요.",
            createdAt: "2026-04-03T13:54:00+09:00",
            updatedAt: "2026-04-03T13:54:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "해변과 카페거리, 계절 감성을 함께 담아낸 강원 허브",
    heroDescription:
      "강원의 바다, 산, 카페거리, 로컬 이벤트를 묶어 감성 해변 여행과 자연 산책 흐름으로 이어주는 지역 허브입니다.",
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
        summary: "커피와 바다 풍경을 함께 즐기며 동해안 감성을 천천히 이어가는 시즌 행사",
        hostName: "강원특별자치도 관광과",
        contactNumber: "033-000-0000",
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "gangwon-post-1",
        eventId: "gangwon-1",
        type: "review",
        title: "커피랑 바다 풍경 조합이 정말 좋았어요",
        summary: "천천히 둘러보기 좋은 느낌의 행사였습니다.",
        content:
          "강릉 쪽 카페 분위기가 살아 있어서 여행 기분 내기 좋았고 사진도 잘 나왔어요.",
        nickname: "바다커피",
        userId: "eastsea_trip",
        createdAt: "2026-04-02T12:10:00+09:00",
        updatedAt: "2026-04-02T12:10:00+09:00",
        isEdited: false,
        likeCount: 8,
        image:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "gangwon-post-1-comment-1",
            nickname: "커피바람",
            userId: "cafe_trip_88",
            content: "동해안 카페 코스는 진짜 실패가 적은 것 같아요.",
            createdAt: "2026-04-02T12:44:00+09:00",
            updatedAt: "2026-04-02T12:44:00+09:00",
            isEdited: false,
          },
          {
            id: "gangwon-post-1-comment-2",
            nickname: "",
            userId: "blue_sea_walk",
            content: "양양 쪽도 함께 들르면 좋더라고요.",
            createdAt: "2026-04-02T13:03:00+09:00",
            updatedAt: "2026-04-02T13:03:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "호수 풍경과 자연 산책 흐름을 담아낸 충북 이벤트 허브",
    heroDescription:
      "충북의 호수형 여행지와 자연 산책형 이벤트를 차분하게 이어볼 수 있도록 정리한 감성여행2 지역 허브입니다.",
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
        summary: "호수 풍경과 함께 걸으며 계절의 변화를 느끼는 힐링형 이벤트",
        hostName: "충청북도 관광과",
        contactNumber: "043-000-0000",
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "chungbuk-post-1",
        eventId: "chungbuk-1",
        type: "participation",
        title: "조용하게 걷기 좋은 코스였어요",
        summary: "복잡하지 않아서 힐링 느낌이 강했습니다.",
        content:
          "호수 풍경이 잘 보여서 마음이 편해졌고, 부모님과 오기에도 좋아 보였어요.",
        nickname: "",
        userId: "lake_walk_cb",
        createdAt: "2026-04-01T11:40:00+09:00",
        updatedAt: "2026-04-01T11:40:00+09:00",
        isEdited: false,
        likeCount: 3,
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [],
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
    shortDescription: "서해 바다와 노을 흐름을 함께 담은 충남 이벤트 허브",
    heroDescription:
      "충남의 서해안 바다, 로컬 시장, 계절 행사를 한 번에 살펴보고 가족형 감성 여행 흐름으로 이어볼 수 있는 지역 허브입니다.",
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
        summary: "서해 노을과 바다 풍경을 함께 즐기며 감성 여행 분위기를 더하는 해변형 행사",
        hostName: "충청남도 관광진흥과",
        contactNumber: "041-000-0000",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "chungnam-post-1",
        eventId: "chungnam-1",
        type: "review",
        title: "노을 시간 맞춰 가면 정말 예뻐요",
        summary: "서해 특유의 분위기가 잘 살아 있었습니다.",
        content:
          "노을이 질 때 사진이 잘 나왔고, 조용하게 바다 보기 좋은 행사였습니다.",
        nickname: "노을좋아",
        userId: "westsea_view",
        createdAt: "2026-04-03T18:25:00+09:00",
        updatedAt: "2026-04-03T18:25:00+09:00",
        isEdited: false,
        likeCount: 7,
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "chungnam-post-1-comment-1",
            nickname: "바다노을",
            userId: "sunset_line",
            content: "노을 시간대는 진짜 놓치면 아쉬워요.",
            createdAt: "2026-04-03T18:52:00+09:00",
            updatedAt: "2026-04-03T18:52:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "한옥마을과 전통 문화 흐름을 이어보는 전북 이벤트 허브",
    heroDescription:
      "전북의 한옥마을, 전통 문화 체험, 먹거리 행사, 지역 축제를 연결해 전통 감성 여행으로 자연스럽게 이어주는 지역 허브입니다.",
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
        summary: "전통 골목과 야간 조명이 어우러져 전주의 분위기를 깊게 느끼는 대표 문화행사",
        hostName: "전북특별자치도 관광과",
        contactNumber: "063-000-0000",
        image:
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "jeonbuk-post-1",
        eventId: "jeonbuk-1",
        type: "review",
        title: "전통 골목 분위기가 정말 좋았어요",
        summary: "밤 조명이 들어오니까 한옥 느낌이 더 살아났어요.",
        content:
          "천천히 걷기 좋았고, 전통 간식이랑 같이 즐기니까 여행 기분이 더 났습니다.",
        nickname: "한옥마실",
        userId: "jb_walk",
        createdAt: "2026-04-03T21:00:00+09:00",
        updatedAt: "2026-04-03T21:00:00+09:00",
        isEdited: false,
        likeCount: 10,
        image:
          "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "jeonbuk-post-1-comment-1",
            nickname: "전통산책",
            userId: "hanok_night_walk",
            content: "야간 조명이 한옥이랑 잘 어울리더라고요.",
            createdAt: "2026-04-03T21:25:00+09:00",
            updatedAt: "2026-04-03T21:25:00+09:00",
            isEdited: false,
          },
          {
            id: "jeonbuk-post-1-comment-2",
            nickname: "",
            userId: "snack_trip",
            content: "전통 간식 정보도 같이 있으면 좋겠어요.",
            createdAt: "2026-04-03T21:42:00+09:00",
            updatedAt: "2026-04-03T21:55:00+09:00",
            isEdited: true,
          },
        ],
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
    shortDescription: "바다와 정원, 남도 감성을 함께 잇는 전남 이벤트 허브",
    heroDescription:
      "전남의 섬, 바다, 정원형 축제, 감성 야경 이벤트를 묶어 느긋한 남도 여행 흐름으로 이어주는 지역 허브입니다.",
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
        summary: "정원 산책과 야간 조명이 어우러져 차분한 남도 감성을 더하는 행사",
        hostName: "전라남도 관광과",
        contactNumber: "061-000-0000",
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "jeonnam-post-1",
        eventId: "jeonnam-1",
        type: "participation",
        title: "정원 산책 좋아하는 분들께 추천해요",
        summary: "야간 조명 덕분에 분위기가 더 차분했습니다.",
        content:
          "사람이 너무 붐비지 않아서 여유롭게 걸을 수 있었고, 사진도 잘 나왔습니다.",
        nickname: "",
        userId: "garden_night_jn",
        createdAt: "2026-04-02T20:05:00+09:00",
        updatedAt: "2026-04-02T20:05:00+09:00",
        isEdited: false,
        likeCount: 4,
        image:
          "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [],
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
    shortDescription: "전통문화와 야간 명소 흐름을 함께 잇는 경북 이벤트 허브",
    heroDescription:
      "경북의 역사문화 행사, 야간 조명 명소, 전통 체험 이벤트를 모아 감성여행2의 스토리형 여행 흐름으로 이어주는 지역 허브입니다.",
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
        summary: "야간 조명과 함께 걸으며 역사 도시의 분위기를 깊게 느끼는 감성 이벤트",
        hostName: "경상북도 문화관광체육국",
        contactNumber: "054-000-0000",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "gyeongbuk-post-1",
        eventId: "gyeongbuk-1",
        type: "review",
        title: "경주 밤 산책이 정말 좋았습니다",
        summary: "역사 도시 느낌이 살아 있어서 기억에 남아요.",
        content:
          "야간 조명이 과하지 않고 분위기를 잘 살려줘서 천천히 걷기 좋았습니다.",
        nickname: "역사산책",
        userId: "gb_storytrip",
        createdAt: "2026-04-02T22:00:00+09:00",
        updatedAt: "2026-04-02T22:00:00+09:00",
        isEdited: false,
        likeCount: 8,
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "gyeongbuk-post-1-comment-1",
            nickname: "야행좋아",
            userId: "night_heritage",
            content: "경주는 밤에 걸어도 분위기가 살아 있죠.",
            createdAt: "2026-04-02T22:26:00+09:00",
            updatedAt: "2026-04-02T22:26:00+09:00",
            isEdited: false,
          },
        ],
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
    shortDescription: "항구 도시와 바다 감성을 함께 이어보는 경남 이벤트 허브",
    heroDescription:
      "경남의 바다, 항구 도시, 산책형 이벤트와 계절 축제를 연결해 남해안 감성 여행 흐름으로 이어주는 지역 허브입니다.",
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
        summary: "밤바다와 항구 야경을 함께 즐기며 통영의 분위기를 오래 남기는 시즌 이벤트",
        hostName: "경상남도 관광과",
        contactNumber: "055-000-0000",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "gyeongnam-post-1",
        eventId: "gyeongnam-1",
        type: "participation",
        title: "통영 밤바다 분위기 정말 좋았어요",
        summary: "항구 야경 좋아하는 분들께 잘 맞을 것 같아요.",
        content:
          "천천히 걸으면서 바다 보기 좋았고, 사진 남기기에도 괜찮았습니다.",
        nickname: "",
        userId: "tongyeong_night",
        createdAt: "2026-04-03T20:45:00+09:00",
        updatedAt: "2026-04-03T20:45:00+09:00",
        isEdited: false,
        likeCount: 6,
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [],
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
    shortDescription: "오름과 바다, 힐링 감성을 한 번에 잇는 제주 이벤트 허브",
    heroDescription:
      "제주의 자연 감성, 로컬 마켓, 계절 축제, 바다 테마 이벤트를 묶어 힐링형 여행 루트로 자연스럽게 연결해주는 지역 허브입니다.",
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
        summary: "야간 조명과 바다 풍경을 함께 즐기며 제주 밤바다 감성을 천천히 이어가는 행사",
        hostName: "제주관광공사",
        contactNumber: "064-000-0000",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
      },
    ],
    postItems: [
      {
        id: "jeju-post-1",
        eventId: "jeju-1",
        type: "review",
        title: "제주 밤바다 산책은 역시 좋네요",
        summary: "함덕 쪽 분위기가 차분해서 오래 걷기 좋았어요.",
        content:
          "야간 조명이 너무 과하지 않아서 바다 느낌이 잘 살아 있었고, 여행 마지막 코스로 좋았습니다.",
        nickname: "제주한바퀴",
        userId: "jeju_nightsea",
        createdAt: "2026-04-03T22:15:00+09:00",
        updatedAt: "2026-04-03T22:15:00+09:00",
        isEdited: false,
        likeCount: 12,
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
        commentItems: [
          {
            id: "jeju-post-1-comment-1",
            nickname: "바다숨결",
            userId: "sea_breeze_trip",
            content: "함덕 야간 산책은 진짜 제주 느낌이 살아 있어요.",
            createdAt: "2026-04-03T22:44:00+09:00",
            updatedAt: "2026-04-03T22:44:00+09:00",
            isEdited: false,
          },
          {
            id: "jeju-post-1-comment-2",
            nickname: "",
            userId: "moon_beach",
            content: "여행 마지막 코스로 좋다는 말 공감돼요.",
            createdAt: "2026-04-03T23:02:00+09:00",
            updatedAt: "2026-04-03T23:02:00+09:00",
            isEdited: false,
          },
          {
            id: "jeju-post-1-comment-3",
            nickname: "제주한바퀴",
            userId: "jeju_nightsea",
            content: "다음엔 월정리 쪽도 같이 가보려고요.",
            createdAt: "2026-04-03T23:18:00+09:00",
            updatedAt: "2026-04-03T23:25:00+09:00",
            isEdited: true,
          },
        ],
      },
    ],
    courses: ["함덕 → 월정리 → 세화 감성 해안 코스"],
  },
];

const DEFAULT_REGION_IMAGE =
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80";

const REGION_TYPE_LABELS = {
  special_city: "특별시",
  metropolitan_city: "광역시",
  special_self_governing_city: "특별자치시",
  province: "도",
};

const FESTIVAL_CATEGORY_SET = new Set([
  "전시",
  "야시장",
  "도심축제",
  "공연",
  "문화유산",
  "야행",
  "축제",
  "페스티벌",
  "정원",
  "피크닉",
  "카페",
]);

function normalizeCount(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeCourse(course) {
  if (typeof course === "string") {
    return {
      id: course,
      title: course,
      description: "",
    };
  }

  return {
    id:
      typeof course?.id === "string" && course.id.trim()
        ? course.id.trim()
        : typeof course?.title === "string" && course.title.trim()
        ? course.title.trim()
        : "",
    title:
      typeof course?.title === "string" && course.title.trim()
        ? course.title.trim()
        : typeof course?.name === "string" && course.name.trim()
        ? course.name.trim()
        : "",
    description:
      typeof course?.description === "string" ? course.description.trim() : "",
  };
}

function parsePeriodToDates(periodText = "") {
  if (typeof periodText !== "string" || !periodText.trim()) {
    return {
      startDate: "",
      endDate: "",
      periodLabel: "",
    };
  }

  const matches = periodText.match(/\d{4}\.\d{2}\.\d{2}/g) ?? [];
  const startDate = matches[0] ? matches[0].replace(/\./g, "-") : "";
  const endDate = matches[1] ? matches[1].replace(/\./g, "-") : "";

  return {
    startDate,
    endDate,
    periodLabel: periodText.trim(),
  };
}

function getEventTypeLabel(type) {
  if (type === "festival") return "지역축제";
  if (type === "tourEvent") return "관광이벤트";
  return "이벤트";
}

function inferEventType(event = {}) {
  const explicitType =
    typeof event?.type === "string" ? event.type.trim() : "";

  if (explicitType === "festival" || explicitType === "tourEvent") {
    return explicitType;
  }

  const category =
    typeof event?.category === "string" ? event.category.trim() : "";

  if (FESTIVAL_CATEGORY_SET.has(category)) {
    return "festival";
  }

  return "tourEvent";
}

function normalizeSimpleItem(item, fallbackPrefix, index) {
  if (typeof item === "string") {
    return {
      id: `${fallbackPrefix}-${index + 1}`,
      title: item,
      content: item,
    };
  }

  return {
    id:
      typeof item?.id === "string" && item.id.trim()
        ? item.id.trim()
        : `${fallbackPrefix}-${index + 1}`,
    title:
      typeof item?.title === "string" && item.title.trim()
        ? item.title.trim()
        : typeof item?.label === "string" && item.label.trim()
        ? item.label.trim()
        : "",
    content:
      typeof item?.content === "string" && item.content.trim()
        ? item.content.trim()
        : typeof item?.description === "string" && item.description.trim()
        ? item.description.trim()
        : "",
    image:
      typeof item?.image === "string" && item.image.trim()
        ? item.image.trim()
        : "",
  };
}

function normalizeEvent(event, region) {
  const inferredType = inferEventType(event);
  const { startDate, endDate, periodLabel } = parsePeriodToDates(event?.period);

  const description =
    event?.description ??
    event?.summary ??
    event?.content ??
    "이벤트 소개 내용이 준비중입니다.";

  const placeName = event?.place ?? event?.location ?? event?.venue ?? "";
  const thumbnailUrl = event?.image ?? event?.thumbnail ?? event?.coverImage ?? "";
  const hostName = event?.hostName ?? region?.name ?? "";
  const contactNumber = event?.contactNumber ?? "";

  const noticeItems = Array.isArray(event?.noticeItems)
    ? event.noticeItems.map((item, index) =>
        normalizeSimpleItem(item, `${event?.id ?? "event"}-notice`, index)
      )
    : [];

  const announcementItems = Array.isArray(event?.announcementItems)
    ? event.announcementItems.map((item, index) =>
        normalizeSimpleItem(item, `${event?.id ?? "event"}-announcement`, index)
      )
    : [];

  const featuredWorks = Array.isArray(event?.featuredWorks)
    ? event.featuredWorks.map((item, index) =>
        normalizeSimpleItem(item, `${event?.id ?? "event"}-featured`, index)
      )
    : [];

  const interviews = Array.isArray(event?.interviews)
    ? event.interviews.map((item, index) =>
        normalizeSimpleItem(item, `${event?.id ?? "event"}-interview`, index)
      )
    : [];

  return {
    id: event?.id ?? "",
    regionSlug: region?.slug ?? "",
    regionName: region?.name ?? "",
    type: inferredType,
    isFestival: inferredType === "festival",
    isTourEvent: inferredType === "tourEvent",

    title: event?.title ?? "이벤트 준비중",
    badge: event?.badge ?? "",
    category: event?.category ?? "",
    categoryLabel:
      event?.categoryLabel ?? event?.category ?? getEventTypeLabel(inferredType),

    status: event?.status ?? "준비중",
    isVisible: event?.isVisible ?? true,

    startDate,
    endDate,
    period: event?.period ?? periodLabel,
    periodLabel: event?.period ?? periodLabel,

    place: event?.place ?? placeName,
    placeName,
    location: event?.location ?? placeName,
    venue: event?.venue ?? placeName,
    address: event?.address ?? "",

    summary: event?.summary ?? description,
    description,
    intro: event?.intro ?? description,
    content: event?.content ?? description,

    image: event?.image ?? thumbnailUrl,
    thumbnailUrl,
    thumbnail: event?.thumbnail ?? thumbnailUrl,
    coverImage: event?.coverImage ?? thumbnailUrl,

    hostName,
    contactNumber,

    festivalIntro:
      inferredType === "festival" ? event?.festivalIntro ?? description : "",
    festivalNoticeTitle:
      inferredType === "festival"
        ? event?.festivalNoticeTitle ?? "축제 소식"
        : "",
    noticeItems,

    announcementTitle:
      inferredType === "tourEvent"
        ? event?.announcementTitle ?? "발표"
        : "",
    announcementItems,
    featuredWorksTitle:
      inferredType === "tourEvent"
        ? event?.featuredWorksTitle ?? "대표 참여작"
        : "",
    featuredWorks,
    interviewSectionTitle:
      inferredType === "tourEvent"
        ? event?.interviewSectionTitle ?? "참여자 인터뷰"
        : "",
    interviews,
  };
}

function normalizeCommentItem(commentItem, postItem, region, index) {
  const nickname =
    typeof commentItem?.nickname === "string" ? commentItem.nickname.trim() : "";

  const userId =
    typeof commentItem?.userId === "string" ? commentItem.userId.trim() : "";

  const authorDisplayName = nickname || userId || "참여자";
  const ownerKey = userId || nickname || "";

  const createdAt =
    typeof commentItem?.createdAt === "string" ? commentItem.createdAt : "";

  const updatedAt =
    typeof commentItem?.updatedAt === "string"
      ? commentItem.updatedAt
      : createdAt;

  return {
    id:
      typeof commentItem?.id === "string" && commentItem.id.trim()
        ? commentItem.id.trim()
        : `${postItem?.id ?? "post"}-comment-${index + 1}`,

    postId: postItem?.id ?? "",
    eventId: postItem?.eventId ?? "",
    regionSlug: region?.slug ?? "",
    regionName: region?.name ?? "",

    nickname,
    userId,
    authorDisplayName,
    ownerKey,

    content:
      typeof commentItem?.content === "string" && commentItem.content.trim()
        ? commentItem.content.trim()
        : "댓글 내용이 없습니다.",

    createdAt,
    updatedAt,
    isEdited: Boolean(commentItem?.isEdited),

    isVisible:
      typeof commentItem?.isVisible === "boolean"
        ? commentItem.isVisible
        : true,
  };
}

function normalizePostItem(postItem, region) {
  const nickname =
    typeof postItem?.nickname === "string" ? postItem.nickname.trim() : "";

  const userId =
    typeof postItem?.userId === "string" ? postItem.userId.trim() : "";

  const authorDisplayName = nickname || userId || "익명사용자";
  const ownerKey = userId || nickname || "";

  const rawCommentItems = Array.isArray(postItem?.commentItems)
    ? postItem.commentItems
    : Array.isArray(postItem?.comments)
    ? postItem.comments
    : [];

  const normalizedCommentItems = rawCommentItems
    .map((commentItem, index) =>
      normalizeCommentItem(commentItem, postItem, region, index)
    )
    .filter((commentItem) => commentItem.isVisible);

  return {
    id: postItem?.id ?? "",
    eventId: postItem?.eventId ?? "",
    regionSlug: region?.slug ?? "",
    regionName: region?.name ?? "",
    type: postItem?.type ?? "review",

    title: postItem?.title ?? "제목 없음",
    summary: postItem?.summary ?? "",
    content: postItem?.content ?? postItem?.summary ?? "",

    nickname,
    userId,
    authorDisplayName,
    ownerKey,

    createdAt: postItem?.createdAt ?? "",
    updatedAt: postItem?.updatedAt ?? postItem?.createdAt ?? "",
    isEdited: Boolean(postItem?.isEdited),

    likeCount: normalizeCount(postItem?.likeCount),

    commentCount:
      typeof postItem?.commentCount === "number"
        ? normalizeCount(postItem.commentCount)
        : normalizedCommentItems.length,

    commentItems: normalizedCommentItems,

    image:
      typeof postItem?.image === "string" && postItem.image.trim()
        ? postItem.image.trim()
        : "",

    thumbnail:
      typeof postItem?.thumbnail === "string" && postItem.thumbnail.trim()
        ? postItem.thumbnail.trim()
        : typeof postItem?.image === "string" && postItem.image.trim()
        ? postItem.image.trim()
        : "",

    isVisible:
      typeof postItem?.isVisible === "boolean" ? postItem.isVisible : true,
  };
}

function buildRegionOverview(region) {
  return {
    festivalTitle: "축제 소개",
    festivalDescription:
      region?.festivalOverview ??
      "지역축제는 축제 소개와 축제 소식을 중심으로 차분하게 확인할 수 있도록 정리합니다.",

    tourEventTitle: "관광이벤트 발표",
    tourEventDescription:
      region?.tourEventOverview ??
      "관광이벤트는 발표, 대표 참여작, 참여자 인터뷰 흐름을 중심으로 확인할 수 있도록 정리합니다.",
  };
}

function normalizeRegion(region) {
  const safeEvents = Array.isArray(region?.events) ? region.events : [];
  const safeTags = normalizeTextArray(region?.tags);
  const safeCourses = Array.isArray(region?.courses) ? region.courses : [];
  const safePostItems = Array.isArray(region?.postItems) ? region.postItems : [];

  const normalizedEvents = safeEvents.map((event) => normalizeEvent(event, region));

  const normalizedPostItems = safePostItems
    .map((postItem) => normalizePostItem(postItem, region))
    .filter((postItem) => postItem.isVisible);

  const festivalEvents = normalizedEvents.filter((event) => event.isFestival);
  const tourEvents = normalizedEvents.filter((event) => event.isTourEvent);

  const festivalNoticeCount = festivalEvents.reduce(
    (sum, event) => sum + normalizeCount(event?.noticeItems?.length),
    0
  );

  const announcementCount = tourEvents.reduce(
    (sum, event) => sum + normalizeCount(event?.announcementItems?.length),
    0
  );

  const featuredWorkCount = tourEvents.reduce(
    (sum, event) => sum + normalizeCount(event?.featuredWorks?.length),
    0
  );

  const interviewCount = tourEvents.reduce(
    (sum, event) => sum + normalizeCount(event?.interviews?.length),
    0
  );

  const normalizedRegion = {
    slug: region?.slug ?? "",
    name: region?.name ?? "지역명 준비중",
    regionType: region?.regionType ?? "region",
    badge: region?.badge ?? "EVENT",
    eventCount:
      typeof region?.eventCount === "number"
        ? normalizeCount(region.eventCount)
        : normalizedEvents.length,

    festivalCount:
      typeof region?.festivalCount === "number"
        ? normalizeCount(region.festivalCount)
        : festivalEvents.length,

    tourEventCount:
      typeof region?.tourEventCount === "number"
        ? normalizeCount(region.tourEventCount)
        : tourEvents.length,

    festivalNoticeCount:
      typeof region?.festivalNoticeCount === "number"
        ? normalizeCount(region.festivalNoticeCount)
        : festivalNoticeCount,

    announcementCount:
      typeof region?.announcementCount === "number"
        ? normalizeCount(region.announcementCount)
        : announcementCount,

    featuredWorkCount:
      typeof region?.featuredWorkCount === "number"
        ? normalizeCount(region.featuredWorkCount)
        : featuredWorkCount,

    interviewCount:
      typeof region?.interviewCount === "number"
        ? normalizeCount(region.interviewCount)
        : interviewCount,

    userPostCount:
      typeof region?.userPostCount === "number"
        ? normalizeCount(region.userPostCount)
        : normalizedPostItems.length,

    photoCount:
      typeof region?.photoCount === "number"
        ? normalizeCount(region.photoCount)
        : normalizedPostItems.filter((postItem) => Boolean(postItem.image)).length,

    latestUpdateLabel:
      typeof region?.latestUpdateLabel === "string"
        ? region.latestUpdateLabel.trim()
        : "",

    shortDescription:
      region?.shortDescription ?? "지역 이벤트 허브 정보가 준비중입니다.",

    heroDescription:
      region?.heroDescription ??
      region?.shortDescription ??
      "지역 이벤트 허브 설명이 준비중입니다.",

    description:
      region?.description ??
      region?.shortDescription ??
      "지역 이벤트 허브 정보가 준비중입니다.",

    image: region?.image ?? region?.heroImage ?? DEFAULT_REGION_IMAGE,
    heroImage: region?.heroImage ?? region?.image ?? DEFAULT_REGION_IMAGE,

    tags: safeTags,
    courses: safeCourses.map(normalizeCourse),

    overview: buildRegionOverview(region),
  };

  return {
    ...normalizedRegion,

    events: normalizedEvents.map((event) => ({
      ...event,
      regionName: normalizedRegion.name,
      regionSlug: normalizedRegion.slug,
    })),

    festivalEvents: festivalEvents.map((event) => ({
      ...event,
      regionName: normalizedRegion.name,
      regionSlug: normalizedRegion.slug,
    })),

    tourEvents: tourEvents.map((event) => ({
      ...event,
      regionName: normalizedRegion.name,
      regionSlug: normalizedRegion.slug,
    })),

    postItems: normalizedPostItems.map((postItem) => ({
      ...postItem,
      regionName: normalizedRegion.name,
      regionSlug: normalizedRegion.slug,
    })),

    festivalSection: {
      title: "축제 소개",
      description: normalizedRegion.overview.festivalDescription,
    },

    tourEventSection: {
      title: "발표 / 대표 참여작 / 참여자 인터뷰",
      description: normalizedRegion.overview.tourEventDescription,
    },
  };
}

const regionEventData = rawRegionEventData.map(normalizeRegion);

export function getRegionEventData() {
  return regionEventData;
}

export function getRegionBySlug(slug) {
  return regionEventData.find((region) => region.slug === slug);
}

export function getAllRegions() {
  return regionEventData;
}