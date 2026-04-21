// Analyze viewing patterns: hour-of-day, day-of-week, trends, channels, indices.

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function analyzeHourDistribution(shorts) {
  const counts = new Array(24).fill(0);
  for (const s of shorts) counts[s.time.getHours()] += 1;
  return counts.map((count, hour) => ({ hour, count }));
}

export function analyzeHourDayHeatmap(shorts) {
  const grid = Array.from({ length: 7 }, () => new Array(24).fill(0));
  for (const s of shorts) grid[s.time.getDay()][s.time.getHours()] += 1;
  const rows = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      rows.push({ day: d, dayLabel: WEEKDAYS[d], hour: h, count: grid[d][h] });
    }
  }
  return { grid, rows, weekdays: WEEKDAYS };
}

export function analyzeTopChannels(shorts, topN = 5) {
  const map = new Map();
  for (const s of shorts) map.set(s.channel, (map.get(s.channel) || 0) + 1);
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([channel, count]) => ({ channel, count }));
}

export function analyzeDailyTrend(shorts, days = 30) {
  if (shorts.length === 0) return [];
  const latest = shorts.reduce((max, s) => (s.time > max ? s.time : max), shorts[0].time);
  const endDay = new Date(latest.getFullYear(), latest.getMonth(), latest.getDate());
  const buckets = new Map();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDay);
    d.setDate(endDay.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const s of shorts) {
    const key = s.time.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({
    date,
    shortDate: date.slice(5),
    count,
  }));
}

export function summaryStats(shorts) {
  if (shorts.length === 0) {
    return { total: 0, shortsCount: 0, firstDate: null, lastDate: null, spanDays: 0,
      avgPerDay: 0, nightRatio: 0, peakHour: 0, peakDay: null, peakDayIdx: 0,
      uniqueChannels: 0, maxDayCount: 0, maxDayDate: null };
  }

  const first = shorts[shorts.length - 1].time;
  const last = shorts[0].time;
  const spanDays = Math.max(1, Math.ceil((last - first) / (1000 * 60 * 60 * 24)));
  const avgPerDay = shorts.length / spanDays;

  let nightCount = 0;
  let shortsCount = 0;
  const hourCount = new Array(24).fill(0);
  const dayCount = new Array(7).fill(0);
  const channels = new Set();
  const dailyBuckets = new Map();

  for (const s of shorts) {
    const h = s.time.getHours();
    hourCount[h] += 1;
    dayCount[s.time.getDay()] += 1;
    if (h >= 0 && h <= 5) nightCount += 1;
    if (s.isShort) shortsCount += 1;
    channels.add(s.channel);
    const key = s.time.toISOString().slice(0, 10);
    dailyBuckets.set(key, (dailyBuckets.get(key) || 0) + 1);
  }

  let peakHour = 0;
  for (let i = 1; i < 24; i++) if (hourCount[i] > hourCount[peakHour]) peakHour = i;
  let peakDayIdx = 0;
  for (let i = 1; i < 7; i++) if (dayCount[i] > dayCount[peakDayIdx]) peakDayIdx = i;

  let maxDayCount = 0;
  let maxDayDate = null;
  for (const [date, count] of dailyBuckets) {
    if (count > maxDayCount) { maxDayCount = count; maxDayDate = date; }
  }

  return {
    total: shorts.length, shortsCount,
    firstDate: first, lastDate: last, spanDays, avgPerDay,
    nightRatio: nightCount / shorts.length,
    peakHour, peakDay: WEEKDAYS[peakDayIdx], peakDayIdx,
    uniqueChannels: channels.size,
    maxDayCount, maxDayDate,
  };
}

// Fun "indices" — 0–100 bars for the personality card.
export function computeIndices(stats, categoryDist, topChannels) {
  // Dopamine: heavy viewing + night = addictive
  const volume = Math.min(1, stats.avgPerDay / 100); // 100/day → 1.0
  const dopamine = Math.round((volume * 0.6 + stats.nightRatio * 0.4) * 100);

  // Nocturnal: 0-5 AM ratio
  const nocturnal = Math.round(stats.nightRatio * 100);

  // Explorer: channel diversity. 25% unique-channel-to-view ratio → 100
  const diversityRaw = stats.total > 0 ? stats.uniqueChannels / stats.total : 0;
  const explorer = Math.round(Math.min(1, diversityRaw / 0.25) * 100);

  // Picky: top category concentration (edible vs etc)
  const topCat = [...categoryDist]
    .filter((c) => c.id !== 'etc')
    .sort((a, b) => b.ratio - a.ratio)[0];
  const picky = Math.round(Math.min(1, (topCat?.ratio || 0) / 0.5) * 100);

  // Top-3 channel share — useful signal for 'loyal' personality
  const totalViews = stats.total || 1;
  const top3Share = topChannels.slice(0, 3).reduce((s, c) => s + c.count, 0) / totalViews;

  return {
    dopamine,
    nocturnal,
    explorer,
    picky,
    top3Share,
  };
}

// Generate a rich pool of fun insights; callers pick top N.
export function buildInsights(stats, categoryDist, topChannels, indices) {
  const lines = [];
  const topCat = [...categoryDist].filter((c) => c.id !== 'etc').sort((a, b) => b.ratio - a.ratio)[0];

  if (topCat && topCat.count > 0) {
    lines.push(
      `가장 많이 본 카테고리는 ${topCat.emoji} ${topCat.label} — 전체의 ${Math.round(topCat.ratio * 100)}%를 차지해요.`
    );
  }

  // Nocturnal insight
  if (stats.nightRatio >= 0.35) {
    lines.push(
      `새벽(0~5시) 시청 비율이 ${Math.round(stats.nightRatio * 100)}% — 밤이 깊을수록 활발해지는 타입이에요 🌙`
    );
  } else if (stats.peakHour >= 22 || stats.peakHour <= 2) {
    lines.push(`${stats.peakHour}시에 시청량이 가장 많아요. 잠자기 전 한 컷 타임이네요 🌙`);
  } else if (stats.peakHour >= 11 && stats.peakHour <= 13) {
    lines.push(`점심시간(${stats.peakHour}시)에 시청량이 급증해요 🍽️`);
  } else if (stats.peakHour >= 6 && stats.peakHour <= 9) {
    lines.push(`아침(${stats.peakHour}시)부터 영상 챙겨보는 성실한 스타일이네요 ☕`);
  } else {
    lines.push(`가장 활발한 시간대는 ${stats.peakHour}시 전후예요.`);
  }

  // Volume insight
  if (stats.avgPerDay >= 50) {
    lines.push(`하루 평균 ${stats.avgPerDay.toFixed(1)}개 — 상위 1% 헤비 뷰어예요 🔥`);
  } else if (stats.avgPerDay >= 20) {
    lines.push(`하루 평균 ${stats.avgPerDay.toFixed(1)}개, 꾸준한 YouTube 애호가네요.`);
  } else if (stats.avgPerDay >= 5) {
    lines.push(`하루 평균 ${stats.avgPerDay.toFixed(1)}개로 균형 잡힌 소비자예요.`);
  } else {
    lines.push(`하루 평균 ${stats.avgPerDay.toFixed(1)}개 — 매우 선별적으로 보시는군요.`);
  }

  // Max-day insight
  if (stats.maxDayDate && stats.maxDayCount > stats.avgPerDay * 2) {
    lines.push(
      `하루 최다 기록은 ${stats.maxDayDate.slice(5)}의 ${stats.maxDayCount}편. 그 날 무슨 일 있었나요? 🤔`
    );
  }

  // Favorite-channel insight
  if (topChannels[0]) {
    lines.push(
      `가장 사랑한 채널은 "${topChannels[0].channel}" — ${topChannels[0].count}편이나 봤어요 💕`
    );
  }

  // Weekday insight
  if (stats.peakDay) {
    lines.push(`${stats.peakDay}요일에 가장 많이 봐요. ${stats.peakDay}요일이 특별한 이유라도? 🤭`);
  }

  // Diversity insight
  if (indices) {
    if (indices.explorer >= 70) {
      lines.push(`채널 ${stats.uniqueChannels.toLocaleString()}개를 섭렵 중. 알고리즘이 당신을 못 읽어요 🧭`);
    } else if (indices.picky >= 70) {
      lines.push(`한 카테고리에 몰빵 중. 취향이 확고한 스타일이에요 🎯`);
    }
  }

  return lines;
}
