// 파일 경로: src/pages/EventHubPage.jsx
// ========================================
// 📌 감성여행2 이벤트 허브 메인 페이지
// - /events 메인에서 지역별 이벤트 허브 목록 출력
// - 홈페이지 로컬 regionEvents 대신 Supabase 기반 지자체 콘텐츠 데이터를 읽음
// - 지역축제와 관광이벤트를 함께 보는 공용 허브 소개 구조 유지
// - 특별시 / 광역시 / 특별자치시 / 도 / 기타 지역 순서로 정리
// - 서버 데이터가 일부 비정상이어도 화면이 깨지지 않도록 방어 처리
// ========================================

import { useEffect, useMemo, useState } from "react";
import PageHero from "../components/PageHero";
import RegionCardGrid from "../components/RegionCardGrid";
import { getGovEventHubRegions } from "../lib/govEventApi";
import "./EventHubPage.css";

const REGION_GROUPS = [
  { key: "special_city", label: "특별시" },
  { key: "metropolitan_city", label: "광역시" },
  { key: "special_self_governing_city", label: "특별자치시" },
  { key: "province", label: "도" },
];

const UNKNOWN_GROUP = {
  key: "other",
  label: "기타 지역",
};

function toSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toSafeCount(value) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function getRegionTotalEventCount(region) {
  return toSafeCount(region?.eventCount ?? region?.totalEventCount);
}

function buildGroupMeta(items = []) {
  return items.reduce(
    (acc, item) => {
      acc.totalRegions += 1;
      acc.totalEvents += getRegionTotalEventCount(item);
      acc.totalNotices += toSafeCount(item?.noticeCount);
      acc.totalUserPosts += toSafeCount(item?.userPostCount);
      acc.totalPhotos += toSafeCount(item?.photoCount);
      return acc;
    },
    {
      totalRegions: 0,
      totalEvents: 0,
      totalNotices: 0,
      totalUserPosts: 0,
      totalPhotos: 0,
    }
  );
}

function buildSummaryParts(meta) {
  const parts = [
    `${meta.totalRegions}개 지역 허브`,
    `대표 이벤트 ${meta.totalEvents}개`,
  ];

  if (meta.totalNotices > 0) {
    parts.push(`공지 ${meta.totalNotices}개`);
  }

  if (meta.totalUserPosts > 0) {
    parts.push(`후기 ${meta.totalUserPosts}개`);
  }

  if (meta.totalPhotos > 0) {
    parts.push(`사진 ${meta.totalPhotos}장`);
  }

  return parts;
}

function buildGroupDescription(groupLabel, items = []) {
  const meta = buildGroupMeta(items);
  const summaryParts = buildSummaryParts(meta);

  return `${groupLabel} 단위로 연결된 지역축제와 관광이벤트 허브를 한눈에 확인하고, 원하는 지역의 상세 페이지로 이어질 수 있도록 정리했습니다. ${summaryParts.join(" · ")}`;
}

function groupRegions(regions = []) {
  const knownGroupMap = new Map(
    REGION_GROUPS.map((group) => [group.key, { ...group, items: [] }])
  );

  const unknownItems = [];

  regions.forEach((region) => {
    const regionType = region?.regionType;

    if (knownGroupMap.has(regionType)) {
      knownGroupMap.get(regionType).items.push(region);
      return;
    }

    unknownItems.push(region);
  });

  const orderedGroups = REGION_GROUPS.map((group) => knownGroupMap.get(group.key))
    .filter((group) => group.items.length > 0);

  if (unknownItems.length > 0) {
    orderedGroups.push({
      ...UNKNOWN_GROUP,
      items: unknownItems,
    });
  }

  return orderedGroups;
}

export default function EventHubPage() {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRegions() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const nextRegions = await getGovEventHubRegions();
        if (!isMounted) return;
        setRegions(toSafeArray(nextRegions));
      } catch (error) {
        if (!isMounted) return;
        console.error("[EventHubPage] failed to load gov event hub regions", error);
        setRegions([]);
        setErrorMessage(
          "지역 허브 데이터를 불러오지 못했습니다. Supabase 연결 또는 테이블 상태를 확인해주세요."
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRegions();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedRegions = useMemo(() => groupRegions(regions), [regions]);
  const hasGroupedRegions = groupedRegions.length > 0;

  const totalMeta = useMemo(() => buildGroupMeta(regions), [regions]);
  const introMetaParts = useMemo(() => buildSummaryParts(totalMeta), [totalMeta]);

  return (
    <>
      <PageHero
        badge="EVENT HUB"
        title="지역별 이벤트 허브"
        description="지자체에서 등록한 지역축제와 관광이벤트를 행정구역 단위로 모아 보고, 원하는 지역의 상세 허브로 바로 이어질 수 있도록 정리한 감성여행2 공용 이벤트 화면입니다."
        backgroundImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80"
      />

      <div className="event-hub-page">
        <section className="event-hub-intro-section">
          <p className="event-hub-section-label">EVENT HUB MAIN</p>
          <h2 className="event-hub-title">행정구역별 이벤트 허브</h2>
          <p className="event-hub-description">
            특별시, 광역시, 특별자치시, 도 기준으로 지역 허브를 정리했습니다.
            각 지역 카드에서 대표 이벤트 흐름을 먼저 보고, 상세 허브 페이지에서
            유형, 상태, 기간, 장소, 주관, 문의 정보를 이어서 확인할 수 있습니다.
          </p>

          {introMetaParts.length > 0 ? (
            <div className="event-hub-meta-wrap">
              {introMetaParts.map((text) => (
                <span key={text} className="event-hub-meta-chip">
                  {text}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        {isLoading ? (
          <section className="event-hub-empty-section">
            <p className="event-hub-empty-label">EVENT HUB LOADING</p>
            <h3 className="event-hub-empty-title">지역 이벤트 허브를 불러오는 중입니다</h3>
            <p className="event-hub-empty-description">
              지자체에서 등록한 지역축제와 관광이벤트 데이터를 서버에서 불러오고 있습니다.
            </p>
          </section>
        ) : errorMessage ? (
          <section className="event-hub-empty-section">
            <p className="event-hub-empty-label">EVENT HUB ERROR</p>
            <h3 className="event-hub-empty-title">지역 이벤트 허브를 불러오지 못했습니다</h3>
            <p className="event-hub-empty-description">{errorMessage}</p>
          </section>
        ) : hasGroupedRegions ? (
          groupedRegions.map((group) => {
            const isSingleCardGroup = group.items.length === 1;

            return (
              <section key={group.key} className="event-hub-group-section">
                <div className="event-hub-group-header">
                  <p className="event-hub-group-label">{group.label}</p>
                  <h3 className="event-hub-group-title">
                    {group.label} 이벤트 허브
                  </h3>
                  <p className="event-hub-group-description">
                    {buildGroupDescription(group.label, group.items)}
                  </p>
                </div>

                <div
                  className={
                    isSingleCardGroup
                      ? "event-hub-single-card-wrap"
                      : "event-hub-group-grid-wrap"
                  }
                >
                  <RegionCardGrid
                    regions={group.items}
                    gridClassName={
                      isSingleCardGroup ? "region-card-grid-single" : ""
                    }
                  />
                </div>
              </section>
            );
          })
        ) : (
          <section className="event-hub-empty-section">
            <p className="event-hub-empty-label">EVENT HUB READY</p>
            <h3 className="event-hub-empty-title">
              지역 이벤트 허브를 준비중입니다
            </h3>
            <p className="event-hub-empty-description">
              현재 연결된 지역 데이터가 없어 메인 허브 목록을 불러오지 못했습니다.
              지자체 콘텐츠 데이터가 연결되면 이 화면에서 지역별 허브를 바로
              확인할 수 있습니다.
            </p>
          </section>
        )}
      </div>
    </>
  );
}