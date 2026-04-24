// "현타 환산기" — converts estimated watch time into relatable alternatives.
// Assumptions: regular video = 5 min per view, shorts = 30 sec per view.
// Music is tracked separately (listening while doing other things) so we don't
// count it toward "wasted time" — that would be unfair.

import { translate } from '../i18n/index.jsx';

const VIDEO_SECONDS = 300;   // 5 min
const SHORTS_SECONDS = 30;   // 30 sec

// Each alternative stores per-unit time in minutes + label template. `unit`
// is what we show next to the number ("번", "권", "회"). `verb` keeps the
// sentence grammatical in Korean.
const ALTERNATIVES = [
  {
    id: 'hallasan',
    emoji: '⛰️',
    label: '한라산 등반',
    unit: '번',
    minutes: 8 * 60, // ~8 hours round trip for an average hiker
    verb: '할 수 있었어요',
  },
  {
    id: 'novel',
    emoji: '📚',
    label: '장편소설 완독',
    unit: '권',
    minutes: 7 * 60, // avg 500p novel
    verb: '읽을 수 있었어요',
  },
  {
    id: 'movie',
    emoji: '🎥',
    label: '영화관 관람',
    unit: '편',
    minutes: 130,
    verb: '볼 수 있었어요',
  },
  {
    id: 'marathon',
    emoji: '🏃',
    label: '풀코스 마라톤',
    unit: '회',
    minutes: 5 * 60,
    verb: '완주할 수 있었어요',
  },
  {
    id: 'language',
    emoji: '🗣️',
    label: '외국어 기초 과정',
    unit: '개',
    minutes: 40 * 60, // ~40h to reach basic A1
    verb: '마스터할 수 있었어요',
  },
  {
    id: 'sleep',
    emoji: '😴',
    label: '꿀잠 8시간',
    unit: '일치',
    minutes: 8 * 60,
    verb: '더 잘 수 있었어요',
  },
  {
    id: 'coffee',
    emoji: '☕',
    label: '카페에서 여유',
    unit: '번',
    minutes: 90,
    verb: '즐길 수 있었어요',
  },
  {
    id: 'gym',
    emoji: '💪',
    label: '헬스장 운동',
    unit: '회',
    minutes: 60,
    verb: '다녀올 수 있었어요',
  },
];

// Compute total watched seconds from sourceCounts or a views array.
// sourceCounts schema (new): { video, shorts, music, ... }
// Fallback: sum using legacy shortsCount split.
export function estimateWatchSeconds({ sourceCounts, stats }) {
  if (sourceCounts && typeof sourceCounts.video === 'number') {
    return sourceCounts.video * VIDEO_SECONDS + sourceCounts.shorts * SHORTS_SECONDS;
  }
  if (stats) {
    const shortsCount = stats.shortsCount || 0;
    const videoCount = Math.max(0, (stats.total || 0) - shortsCount);
    return videoCount * VIDEO_SECONDS + shortsCount * SHORTS_SECONDS;
  }
  return 0;
}

// Pick top-N alternatives that are "interesting" — prefer ones where the
// result is ≥ 1 (otherwise it reads awkwardly) and showcase variety.
export function computeAlternatives(totalSeconds, limit = 4, lang) {
  const totalMinutes = totalSeconds / 60;
  return ALTERNATIVES
    .map((alt) => {
      const raw = totalMinutes / alt.minutes;
      const base = { ...alt };
      if (lang) {
        base.label = translate(lang, `realityCheck.alternatives.${alt.id}.label`) || alt.label;
        base.unit = translate(lang, `realityCheck.alternatives.${alt.id}.unit`) || alt.unit;
        base.verb = translate(lang, `realityCheck.alternatives.${alt.id}.verb`) || alt.verb;
      }
      return {
        ...base,
        count: raw,
        display: raw >= 10 ? Math.round(raw) : raw >= 1 ? raw.toFixed(1) : raw.toFixed(2),
        qualifies: raw >= 0.5,
      };
    })
    .filter((a) => a.qualifies)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Human-readable "3일 7시간 12분" / "3d 7h 12m" style string.
export function formatDuration(totalSeconds, lang) {
  const d = lang ? translate(lang, 'realityCheck.units.days')    : '일';
  const h = lang ? translate(lang, 'realityCheck.units.hours')   : '시간';
  const m = lang ? translate(lang, 'realityCheck.units.minutes') : '분';
  const s = lang ? translate(lang, 'realityCheck.units.seconds') : '초';
  if (!totalSeconds || totalSeconds < 60) {
    return `${Math.round(totalSeconds || 0)}${s}`;
  }
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}${d}`);
  if (hours) parts.push(`${hours}${h}`);
  if (minutes && days === 0) parts.push(`${minutes}${m}`);
  return parts.join(' ') || `${Math.round(totalSeconds / 60)}${m}`;
}

// Combined summary payload for the UI.
export function buildRealityCheck({ sourceCounts, stats, lang }) {
  const seconds = estimateWatchSeconds({ sourceCounts, stats });
  return {
    seconds,
    durationText: formatDuration(seconds, lang),
    alternatives: computeAlternatives(seconds, 4, lang),
    perDayMinutes: stats?.spanDays ? seconds / 60 / stats.spanDays : 0,
  };
}
