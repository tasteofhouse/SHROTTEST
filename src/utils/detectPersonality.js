// Score-based personality detection. Every personality gets a numeric fit
// score from category ratios + behavior; the highest wins as primary, and
// the next few are returned as "가까운 유형" candidates for the UI.
//
// Motivation: the prior threshold-cascade fired "channel explorer" for
// virtually every user because Shorts feeds naturally produce high
// unique/total ratios. Scoring + tighter bounds fixes this.

export const PERSONALITIES = {
  game: {
    id: 'game', name: '게임 몰입형', emoji: '🎮',
    tagline: '한 판만 하려 했는데 쇼츠까지 정복',
    description: '게임 카테고리가 전체의 30% 이상. 게임 하이라이트와 플레이 영상이 당신의 주식이에요.',
    vibe: '플래티넘 게이머',
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-500',
  },
  animal: {
    id: 'animal', name: '힐링 추구형', emoji: '🐱',
    tagline: '오늘도 동물에게서 평화를 얻었다',
    description: '귀여운 동물 영상으로 하루를 마무리하는 타입. 스트레스 해소를 위해 영상을 켜시네요.',
    vibe: '집사 혹은 예비 집사',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
  },
  food: {
    id: 'food', name: '미식 탐험형', emoji: '🍜',
    tagline: '보면서 먹고, 먹으면서 본다',
    description: '먹방과 맛집 영상에 진심인 타입. 새로운 맛집과 레시피를 찾는 탐험가예요.',
    vibe: '식도락 러버',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
  },
  comedy: {
    id: 'comedy', name: '예능 중독형', emoji: '😂',
    tagline: '웃기면 다 용서된다',
    description: '예능·유머 카테고리 비중이 커요. 침착하지 못하고 매일 ㅋㅋㅋ 박제 중.',
    vibe: '코미디 애호가',
    gradient: 'from-yellow-400 via-orange-400 to-pink-500',
  },
  drama: {
    id: 'drama', name: '정주행 러버', emoji: '🎬',
    tagline: '"한 편만" 이 벌써 시즌 2',
    description: '영화·드라마 클립에 꽂혀 밤새 정주행하고 다음 날 눈 빨개지는 부류.',
    vibe: 'OTT 정복자',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  music: {
    id: 'music', name: '음악 감성형', emoji: '🎵',
    tagline: '15초 안에 감정이 이사 중',
    description: '음악 카테고리 비중이 높아요. 음악이 일상의 BGM이 된 타입.',
    vibe: '플레이리스트 큐레이터',
    gradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
  },
  sports: {
    id: 'sports', name: '스포츠 열혈형', emoji: '⚽',
    tagline: '경기는 못 봐도 하이라이트는 놓치지 않아',
    description: '스포츠 클립 비중이 높아요. 골·홈런 명장면을 놓치지 않는 찐팬.',
    vibe: '직관러의 혼',
    gradient: 'from-red-600 via-rose-500 to-pink-500',
  },
  info: {
    id: 'info', name: '정보 수집형', emoji: '🧠',
    tagline: '오늘도 쓸데없이 똑똑해지는 중',
    description: '뉴스와 교육 카테고리 합산 비중이 커요. 영상으로도 지식을 축적하는 당신.',
    vibe: '걸어다니는 위키',
    gradient: 'from-blue-600 via-cyan-500 to-sky-500',
  },
  lifestyle: {
    id: 'lifestyle', name: '라이프 큐레이터', emoji: '💄',
    tagline: '일상도 예쁘게, 뭐든 기록',
    description: '뷰티·패션·브이로그 비중이 커요. 트렌드와 루틴을 섬세하게 관찰하는 타입.',
    vibe: '라이프스타일 러버',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
  },
  tech: {
    id: 'tech', name: '얼리어답터', emoji: '💻',
    tagline: '신제품 발표가 곧 국경일',
    description: 'IT·테크 콘텐츠 비중이 커요. 언박싱과 리뷰 영상으로 최신 트렌드를 추적해요.',
    vibe: '기기 변태(好)',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
  },
  kids: {
    id: 'kids', name: '키즈/애니 덕후', emoji: '🧒',
    tagline: '동심은 돌려줘도 유튜브엔 안 돌려줌',
    description: '애니메이션·키즈 콘텐츠 비중이 커요. 나이는 숫자일 뿐, 취향은 어린이.',
    vibe: '만화왕국 시민',
    gradient: 'from-sky-400 via-indigo-400 to-purple-400',
  },
  asmr: {
    id: 'asmr', name: '힐링 수면파', emoji: '😴',
    tagline: '내 귀는 오늘도 마사지 중',
    description: 'ASMR·수면·힐링 사운드 비중이 커요. 영상을 배경음처럼 활용하는 타입.',
    vibe: '고요의 수집가',
    gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
  },
  night: {
    id: 'night', name: '밤의 지배자', emoji: '🌙',
    tagline: '새벽은 내 정원이다',
    description: '새벽 0~5시 시청 비율이 매우 높아요. 세상이 잘 때 알고리즘과 단둘이.',
    vibe: '올빼미 중의 올빼미',
    gradient: 'from-indigo-900 via-purple-700 to-blue-800',
  },
  morning: {
    id: 'morning', name: '모닝 러너', emoji: '🌅',
    tagline: '커피보다 유튜브가 먼저 깨요',
    description: '오전 6~10시 시청 비중이 큰 타입. 하루 시작을 쇼츠로 여는 부지런파.',
    vibe: '얼리버드',
    gradient: 'from-amber-300 via-orange-400 to-pink-400',
  },
  weekend: {
    id: 'weekend', name: '주말 몰아보기', emoji: '🛋️',
    tagline: '평일은 참았어, 주말엔 터진다',
    description: '토·일 시청량이 다른 요일을 압도. 일주일의 보상을 주말에 한 번에 받는 타입.',
    vibe: '주말의 왕',
    gradient: 'from-orange-400 via-amber-400 to-yellow-300',
  },
  binge: {
    id: 'binge', name: '폭주 정주행파', emoji: '⚡',
    tagline: '한 번 타면 못 내려요',
    description: '평소엔 잔잔하다가 특정 하루에 몰아보기가 폭발하는 타입. 몰입형 소비자.',
    vibe: '주말 몰아보기',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
  },
  steady: {
    id: 'steady', name: '꾸준러', emoji: '🕰️',
    tagline: '매일 비슷하게, 오래 간다',
    description: '매일 비슷한 양으로 꾸준히 시청. 루틴이 몸에 밴 규칙성 만렙.',
    vibe: '루틴 마스터',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
  },
  explorer: {
    id: 'explorer', name: '채널 탐험가', emoji: '🧭',
    tagline: '한 우물 파는 건 지루해',
    description: '본 채널 수가 극단적으로 많아요. 새 채널을 끊임없이 발굴하는 타입.',
    vibe: '다양성 마니아',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
  },
  loyal: {
    id: 'loyal', name: '찐팬 러버', emoji: '💘',
    tagline: '한 채널만 봐도 질리지 않아',
    description: 'Top 3 채널이 전체의 절반 가까이 차지. 좋아하는 건 확실하게 좋아하는 타입.',
    vibe: '진성 구독자',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
  },
  drift: {
    id: 'drift', name: '알고리즘 표류형', emoji: '🌀',
    tagline: '알고리즘에 영혼을 맡긴 자',
    description: '특정 카테고리에 치우치지 않는 잡식성. 피드가 이끄는 대로 흐르는 타입.',
    vibe: '피드의 난민',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
  },
  addict: {
    id: 'addict', name: '도파민 중독형', emoji: '🔥',
    tagline: '한 번만 더… 가 10분 뒤',
    description: '하루 평균이 비정상적으로 높고 새벽 시청이 잦음. 도파민 러너의 정석.',
    vibe: '알고리즘 러닝머신',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
  },
  shorts: {
    id: 'shorts', name: '쇼츠 네이티브', emoji: '📱',
    tagline: '긴 영상은 너무 길어',
    description: '짧은 영상 비중이 절대적으로 큼. 수직 피드에 최적화된 뇌.',
    vibe: '쇼츠 원주민',
    gradient: 'from-lime-400 via-emerald-400 to-teal-400',
  },
};

// Score a single personality candidate (0 - 100+). Higher = better fit.
function scoreAll(categoryDist, stats, extra = {}) {
  const byId = Object.fromEntries(categoryDist.map((c) => [c.id, c.ratio]));
  const { top3Share = 0, indices = {} } = extra;

  const infoRatio = (byId.news || 0) + (byId.education || 0);
  const diversity = stats.total > 0 ? stats.uniqueChannels / stats.total : 0;
  const total = stats.total || 0;

  // Indices are already 0..100, bring to 0..1 where useful.
  const binge = (indices.binge ?? 0) / 100;
  const steady = (indices.steady ?? 0) / 100;
  const morning = (indices.morning ?? 0) / 100;
  const weekend = (indices.weekend ?? 0) / 100;
  const shortsness = (indices.shortsness ?? 0) / 100;

  // Category scores — ratio * scalar. Anything over ~20% should be competitive.
  const scores = {
    game:      (byId.game || 0) * 110,
    animal:    (byId.animal || 0) * 110,
    food:      (byId.food || 0) * 110,
    comedy:    (byId.comedy || 0) * 110,
    drama:     (byId.drama || 0) * 110,
    music:     (byId.music || 0) * 110,
    sports:    (byId.sports || 0) * 110,
    info:      infoRatio * 110,
    lifestyle: (byId.lifestyle || 0) * 110,
    tech:      (byId.tech || 0) * 110,
    kids:      (byId.kids || 0) * 120, // slight boost — kids is niche but distinctive
    asmr:      (byId.asmr || 0) * 120,

    // Behavioral scores — deliberately bounded so they rarely dominate
    // unless the signal is very strong.
    night:   stats.nightRatio >= 0.30 ? (stats.nightRatio - 0.30) * 200 + 20 : 0,
    morning: morning >= 0.5 ? (morning - 0.5) * 100 + 15 : 0,
    weekend: weekend >= 0.5 ? (weekend - 0.5) * 100 + 15 : 0,
    binge:   binge >= 0.6 ? (binge - 0.6) * 120 + 15 : 0,
    steady:  steady >= 0.6 ? (steady - 0.6) * 120 + 12 : 0,
    // Explorer ONLY fires for truly extreme diversity — prior bug was 0.25
    // catching almost everyone. Bumped to ≥ 0.65 with graded score.
    explorer: diversity >= 0.65 ? (diversity - 0.65) * 180 + 14 : 0,
    loyal:   top3Share >= 0.45 ? (top3Share - 0.45) * 180 + 18 : 0,
    shorts:  shortsness >= 0.6 ? (shortsness - 0.6) * 120 + 10 : 0,
    // Addict: extreme combo of volume + night
    addict: stats.avgPerDay >= 40 && stats.nightRatio >= 0.25
      ? Math.min(50, (stats.avgPerDay / 40 - 1) * 30) + stats.nightRatio * 30
      : 0,
    // Drift: low concentration, low behavioral signal — a fallback that
    // only scores meaningfully when NOTHING else does.
    drift: 0, // computed below
  };

  // Drift score — inversely related to the max category ratio. When the user
  // has no dominant category AND no extreme behavior, drift wins.
  const maxCat = Math.max(
    byId.game || 0, byId.animal || 0, byId.food || 0, byId.comedy || 0,
    byId.drama || 0, byId.music || 0, byId.sports || 0, infoRatio,
    byId.lifestyle || 0, byId.tech || 0, byId.kids || 0, byId.asmr || 0,
  );
  // scales up as the top category shrinks: 0.10 top → 13, 0.05 top → 17
  scores.drift = maxCat < 0.22 ? (0.22 - maxCat) * 70 + 5 : 0;

  // Tiny floor for every personality so they show up as runner-up candidates
  // when the user is close.
  for (const key of Object.keys(PERSONALITIES)) {
    if (!(key in scores)) scores[key] = 0;
    if (total < 30) scores[key] = Math.min(scores[key], 15); // low-data guard
  }

  return scores;
}

export function detectPersonality(categoryDist, stats, extra = {}) {
  const scores = scoreAll(categoryDist, stats, extra);
  const ranked = Object.entries(scores)
    .filter(([id]) => id in PERSONALITIES)
    .sort((a, b) => b[1] - a[1]);

  const [winnerId, winnerScore] = ranked[0] || ['drift', 0];
  const primary = PERSONALITIES[winnerId] || PERSONALITIES.drift;
  // Runner-ups: the next 3 distinct types with non-trivial scores.
  const runnerUps = ranked
    .slice(1)
    .filter(([, s]) => s > 3)
    .slice(0, 3)
    .map(([id, s]) => ({ ...PERSONALITIES[id], score: Math.round(s) }));

  // Expose winner metadata for the card.
  return {
    ...primary,
    score: Math.round(winnerScore),
    runnerUps,
  };
}

// Useful for debugging / future analytics.
export function debugPersonalityScores(categoryDist, stats, extra = {}) {
  return scoreAll(categoryDist, stats, extra);
}
