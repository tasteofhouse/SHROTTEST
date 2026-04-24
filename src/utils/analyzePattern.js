// Analyze viewing patterns: hour-of-day, day-of-week, trends, channels, indices.

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// Last-line defense against garbage channel names that slipped past the
// parser-layer filter (`isUnavailableEntry`, `cleanChannelName`). Any of
// these should never surface in top-channel lists.
function isValidChannelName(name) {
  if (!name || typeof name !== 'string') return false;
  const t = name.trim();
  if (!t) return false;
  if (t === '알 수 없는 채널') return false;
  if (/^https?:\/\//i.test(t)) return false;
  if (/^(YouTube|YouTube Music|Google Ads?|광고|undefined|null)$/i.test(t)) return false;
  return true;
}

// Split a view list by source tag ('music' | 'shorts' | 'video').
// Returns { music, shorts, video, yt } where `yt` = shorts + video
// (YouTube side). All main analysis should run on `yt`.
export function splitBySource(views) {
  const music = [];
  const shorts = [];
  const video = [];
  for (const v of views) {
    if (v.source === 'music') music.push(v);
    else if (v.source === 'shorts') shorts.push(v);
    else video.push(v);
  }
  const yt = video.concat(shorts).sort((a, b) => b.time - a.time);
  return { music, shorts, video, yt };
}

// Music-side stats — YouTube Music listens. Doesn't try to categorize by
// genre/topic; just surfaces top artists, listen volume, peak hour.
export function analyzeMusicViews(musicViews) {
  const total = musicViews.length;
  if (total === 0) {
    return { total: 0, uniqueArtists: 0, topArtists: [], peakHour: 0, nightRatio: 0 };
  }
  const channelMap = new Map();
  const hourCount = new Array(24).fill(0);
  let nightCount = 0;
  for (const v of musicViews) {
    const h = v.time.getHours();
    hourCount[h] += 1;
    if (h >= 0 && h <= 5) nightCount += 1;
    if (!isValidChannelName(v.channel)) continue;
    channelMap.set(v.channel, (channelMap.get(v.channel) || 0) + 1);
  }
  const topArtists = Array.from(channelMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([channel, count]) => ({ channel, count }));
  let peakHour = 0;
  let peakCount = 0;
  hourCount.forEach((c, h) => {
    if (c > peakCount) { peakCount = c; peakHour = h; }
  });
  return {
    total,
    uniqueArtists: channelMap.size,
    topArtists,
    peakHour,
    nightRatio: nightCount / total,
  };
}

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
  for (const s of shorts) {
    // Final safety net against junk channel names (see `isValidChannelName`).
    if (!isValidChannelName(s.channel)) continue;
    map.set(s.channel, (map.get(s.channel) || 0) + 1);
  }
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
    if (isValidChannelName(s.channel)) channels.add(s.channel);
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

// Fun "indices" — 0–100 bars for the personality card. 10 axes total.
export function computeIndices(stats, categoryDist, topChannels, shorts = null) {
  // 1. Dopamine: heavy viewing + night = addictive
  const volume = Math.min(1, stats.avgPerDay / 100);
  const dopamine = Math.round((volume * 0.6 + stats.nightRatio * 0.4) * 100);

  // 2. Nocturnal: 0-5 AM ratio
  const nocturnal = Math.round(stats.nightRatio * 100);

  // 3. Explorer: channel diversity
  const diversityRaw = stats.total > 0 ? stats.uniqueChannels / stats.total : 0;
  const explorer = Math.round(Math.min(1, diversityRaw / 0.25) * 100);

  // 4. Picky: top category concentration (edible vs etc)
  const topCat = [...categoryDist]
    .filter((c) => c.id !== 'etc')
    .sort((a, b) => b.ratio - a.ratio)[0];
  const picky = Math.round(Math.min(1, (topCat?.ratio || 0) / 0.5) * 100);

  // Support re-computations that share data
  const totalViews = stats.total || 1;

  // 5. Loyalty 충성도 — top-3 channel share (0.5 share → 100)
  const top3Share = topChannels.slice(0, 3).reduce((s, c) => s + c.count, 0) / totalViews;
  const loyalty = Math.round(Math.min(1, top3Share / 0.4) * 100);

  // For the remaining indices we need hour/day-of-week buckets. We can derive them from
  // shorts when provided, else approximate from stats.
  let binge = 0, weekend = 0, morning = 0, shortsness = 0, steady = 0;

  if (Array.isArray(shorts) && shorts.length > 0) {
    let weekendCount = 0;
    let morningCount = 0;
    let shortsCount = 0;
    const dailyMap = new Map();
    for (const s of shorts) {
      const d = s.time.getDay();
      const h = s.time.getHours();
      if (d === 0 || d === 6) weekendCount += 1;
      if (h >= 6 && h <= 10) morningCount += 1;
      if (s.isShort) shortsCount += 1;
      const key = s.time.toISOString().slice(0, 10);
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    }
    // 6. Binge — max-day vs avg-day ratio (3x avg → 100)
    const maxDay = Math.max(0, ...dailyMap.values());
    const avgDay = stats.avgPerDay || 1;
    binge = Math.round(Math.min(1, (maxDay / avgDay - 1) / 2) * 100);
    // 7. Weekend — weekend view share (0.45+ weekend → 100)
    weekend = Math.round(Math.min(1, (weekendCount / totalViews) / 0.45) * 100);
    // 8. Morning — 6–10시 share (0.25 → 100)
    morning = Math.round(Math.min(1, (morningCount / totalViews) / 0.25) * 100);
    // 9. Shortsness — hashtag-confirmed shorts share (0.2 → 100)
    shortsness = Math.round(Math.min(1, (shortsCount / totalViews) / 0.2) * 100);
    // 10. Steady — daily consistency. coefficient of variation inverted.
    const values = Array.from(dailyMap.values());
    if (values.length > 1) {
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
      const sd = Math.sqrt(variance);
      const cv = mean > 0 ? sd / mean : 1;
      steady = Math.round(Math.max(0, Math.min(1, 1 - cv / 1.5)) * 100);
    } else {
      steady = 30;
    }
  } else {
    // Approximations when shorts not provided
    binge = Math.round(Math.min(100, (stats.maxDayCount / Math.max(1, stats.avgPerDay)) * 15));
    weekend = stats.peakDayIdx === 0 || stats.peakDayIdx === 6 ? 70 : 35;
    morning = stats.peakHour >= 6 && stats.peakHour <= 10 ? 75 : 20;
    shortsness = Math.round(Math.min(100, (stats.shortsCount / totalViews) * 500));
    steady = 50;
  }

  return {
    dopamine,
    nocturnal,
    explorer,
    picky,
    loyalty,
    binge,
    weekend,
    morning,
    shortsness,
    steady,
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
