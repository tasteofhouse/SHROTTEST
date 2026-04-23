// Synthetic '도파민 중독자' sample result — preview data for users who want
// to see what the analysis looks like before uploading their own file.
// Shape mirrors the real result object produced by AnalysisProgress.

import { CATEGORIES } from './categorize';
import { PERSONALITIES } from './detectPersonality';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// Pick reasonable ratios that match the '도파민 중독형' personality (high
// binge + nightly + heavy volume). Tuned so the dopamine gauge goes red.
const SAMPLE_CAT_RATIOS = {
  comedy: 0.28,
  shorts: 0, // not a category — kept for reference
  game: 0.18,
  food: 0.14,
  drama: 0.11,
  music: 0.09,
  sports: 0.06,
  tech: 0.05,
  lifestyle: 0.04,
  etc: 0.05,
};

function sampleCategoryDist() {
  // Build full category list using CATEGORIES as schema, filling in ratios.
  return CATEGORIES.map((c) => {
    const ratio = SAMPLE_CAT_RATIOS[c.id] || 0;
    return { ...c, ratio, count: Math.round(ratio * 4800) };
  });
}

function sampleStats() {
  return {
    total: 4820,
    shortsCount: 3100,
    firstDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 92),
    lastDate: new Date(),
    spanDays: 92,
    avgPerDay: 52.4,
    nightRatio: 0.41,
    peakHour: 2,
    peakDay: '토',
    peakDayIdx: 6,
    uniqueChannels: 420,
    maxDayCount: 180,
    maxDayDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString().slice(0, 10),
  };
}

function sampleTopChannels() {
  return [
    { channel: '숏박스', count: 320 },
    { channel: '침착맨', count: 280 },
    { channel: '짤툰', count: 240 },
    { channel: '피식대학', count: 200 },
    { channel: 'KBS 예능', count: 150 },
    { channel: '쯔양', count: 130 },
    { channel: '우왁굳', count: 110 },
    { channel: '곽튜브', count: 95 },
    { channel: '엠마TV', count: 82 },
    { channel: '빵송국', count: 70 },
  ];
}

function sampleHeatmap() {
  const grid = Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 24 }, (_, h) => {
      // Late-night peaks on weekends.
      const isNight = h <= 3 || h >= 22;
      const isWeekend = d === 0 || d === 6;
      let base = 4;
      if (isNight) base += 15;
      if (isWeekend) base += 8;
      if (isNight && isWeekend) base += 20;
      return Math.round(base + Math.random() * 5);
    })
  );
  const rows = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      rows.push({ day: d, dayLabel: WEEKDAYS[d], hour: h, count: grid[d][h] });
    }
  }
  return { grid, rows, weekdays: WEEKDAYS };
}

function sampleTrend() {
  const out = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    // Escalating — mimic the "getting worse" storyline
    const base = 30 + (29 - i) * 1.2 + Math.random() * 25;
    out.push({ date: iso, shortDate: iso.slice(5), count: Math.round(base) });
  }
  return out;
}

function sampleIndices() {
  return {
    dopamine: 92,
    nocturnal: 82,
    explorer: 48,
    picky: 56,
    loyalty: 42,
    binge: 78,
    weekend: 68,
    morning: 14,
    shortsness: 86,
    steady: 28,
    top3Share: 0.38,
  };
}

function sampleInsights() {
  return [
    '새벽(0~5시) 시청 비율이 41% — 밤이 깊을수록 활발해지는 타입이에요 🌙',
    '하루 평균 52.4개 — 상위 1% 헤비 뷰어예요 🔥',
    '하루 최다 기록은 05-19의 180편. 그 날 무슨 일 있었나요? 🤔',
    '가장 사랑한 채널은 "숏박스" — 320편이나 봤어요 💕',
    '토요일에 가장 많이 봐요. 토요일이 특별한 이유라도? 🤭',
  ];
}

export function buildSampleResult() {
  const categoryDist = sampleCategoryDist();
  const stats = sampleStats();
  const topChannels = sampleTopChannels();
  const topCategories = [...categoryDist]
    .filter((c) => c.count > 0)
    .sort((a, b) => b.ratio - a.ratio);

  const personality = {
    ...PERSONALITIES.addict,
    score: 78,
    runnerUps: [
      { ...PERSONALITIES.shorts, score: 66 },
      { ...PERSONALITIES.night, score: 61 },
      { ...PERSONALITIES.comedy, score: 48 },
    ],
  };

  const sourceCounts = {
    total: stats.total,
    video: 1720,
    shorts: 3100,
    music: 520,
    youtubeTotal: stats.total,
  };

  const musicInsight = {
    total: 520,
    uniqueArtists: 42,
    peakHour: 23,
    nightRatio: 0.48,
    topArtists: [
      { channel: 'NewJeans', count: 68 },
      { channel: 'IVE', count: 54 },
      { channel: '아이유', count: 42 },
      { channel: 'BTS', count: 38 },
      { channel: 'LE SSERAFIM', count: 30 },
    ],
  };

  return {
    categoryDist,
    stats,
    heatmap: sampleHeatmap(),
    trend: sampleTrend(),
    topChannels,
    indices: sampleIndices(),
    personality,
    insights: sampleInsights(),
    topCategories,
    sourceCounts,
    musicInsight,
    __isSample: true,
  };
}
