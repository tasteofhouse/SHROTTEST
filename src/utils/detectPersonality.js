// Detect viewing personality based on category distribution + behavioral stats.

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
    description: '예능·유머 카테고리 30% 이상. 침착하지 못하고 매일 ㅋㅋㅋ 박제 중.',
    vibe: '코미디 애호가',
    gradient: 'from-yellow-400 via-orange-400 to-pink-500',
  },
  drama: {
    id: 'drama', name: '정주행 러버', emoji: '🎬',
    tagline: '"한 편만" 이 벌써 시즌 2',
    description: '영화·드라마 콘텐츠 30% 이상. 밤새 정주행하고 다음 날 눈 빨개지는 부류.',
    vibe: 'OTT 정복자',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  music: {
    id: 'music', name: '음악 감성형', emoji: '🎵',
    tagline: '15초 안에 감정이 이사 중',
    description: '음악 카테고리 30% 이상. 음악이 일상의 BGM이 된 타입.',
    vibe: '플레이리스트 큐레이터',
    gradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
  },
  sports: {
    id: 'sports', name: '스포츠 열혈형', emoji: '⚽',
    tagline: '경기는 못 봐도 하이라이트는 놓치지 않아',
    description: '스포츠 카테고리 30% 이상. 골·홈런 명장면을 놓치지 않는 찐팬.',
    vibe: '직관러의 혼',
    gradient: 'from-red-600 via-rose-500 to-pink-500',
  },
  info: {
    id: 'info', name: '정보 수집형', emoji: '🧠',
    tagline: '오늘도 쓸데없이 똑똑해지는 중',
    description: '뉴스와 교육 카테고리가 합산 30% 이상. 영상으로도 지식을 축적하는 당신.',
    vibe: '걸어다니는 위키',
    gradient: 'from-blue-600 via-cyan-500 to-sky-500',
  },
  lifestyle: {
    id: 'lifestyle', name: '라이프 큐레이터', emoji: '💄',
    tagline: '일상도 예쁘게, 뭐든 기록',
    description: '뷰티·패션·브이로그 30% 이상. 트렌드와 루틴을 섬세하게 관찰하는 타입.',
    vibe: '라이프스타일 러버',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
  },
  tech: {
    id: 'tech', name: '얼리어답터', emoji: '💻',
    tagline: '신제품 발표가 곧 국경일',
    description: 'IT·테크 30% 이상. 언박싱과 리뷰 영상으로 최신 트렌드를 추적해요.',
    vibe: '기기 변태(好)',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
  },
  night: {
    id: 'night', name: '밤의 지배자', emoji: '🌙',
    tagline: '새벽은 내 정원이다',
    description: '새벽 0~5시 시청 비율 35% 이상. 세상이 잘 때 알고리즘과 단둘이.',
    vibe: '올빼미 중의 올빼미',
    gradient: 'from-indigo-900 via-purple-700 to-blue-800',
  },
  explorer: {
    id: 'explorer', name: '채널 탐험가', emoji: '🧭',
    tagline: '한 우물 파는 건 지루해',
    description: '본 채널 수가 총 영상 수의 25%+. 새 채널을 끊임없이 발굴하는 타입.',
    vibe: '다양성 마니아',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
  },
  loyal: {
    id: 'loyal', name: '찐팬 러버', emoji: '💘',
    tagline: '한 채널만 봐도 질리지 않아',
    description: 'Top 3 채널이 전체의 40%+. 좋아하는 건 확실하게 좋아하는 타입.',
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
    vibe: 'ADHD 러닝머신',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
  },
};

export function detectPersonality(categoryDist, stats, extra = {}) {
  const byId = Object.fromEntries(categoryDist.map((c) => [c.id, c.ratio]));
  const { top3Share = 0 } = extra;

  // 1) Addict has highest priority — extreme volume + nocturnal
  if (stats.avgPerDay >= 40 && stats.nightRatio >= 0.25) {
    return PERSONALITIES.addict;
  }

  // 2) Category-based (30% threshold, picking the strongest)
  const infoRatio = (byId.news || 0) + (byId.education || 0);
  const catCandidates = [
    { p: PERSONALITIES.game,      r: byId.game || 0 },
    { p: PERSONALITIES.animal,    r: byId.animal || 0 },
    { p: PERSONALITIES.food,      r: byId.food || 0 },
    { p: PERSONALITIES.comedy,    r: byId.comedy || 0 },
    { p: PERSONALITIES.drama,     r: byId.drama || 0 },
    { p: PERSONALITIES.music,     r: byId.music || 0 },
    { p: PERSONALITIES.sports,    r: byId.sports || 0 },
    { p: PERSONALITIES.lifestyle, r: byId.lifestyle || 0 },
    { p: PERSONALITIES.tech,      r: byId.tech || 0 },
    { p: PERSONALITIES.info,      r: infoRatio },
  ];
  const topCat = [...catCandidates].sort((a, b) => b.r - a.r)[0];
  if (topCat.r >= 0.30) return topCat.p;

  // 3) Behavior-based fallbacks
  if (stats.nightRatio >= 0.35) return PERSONALITIES.night;
  if (top3Share >= 0.40) return PERSONALITIES.loyal;

  // 4) Channel diversity
  const diversity = stats.uniqueChannels / Math.max(1, stats.total);
  if (diversity >= 0.25) return PERSONALITIES.explorer;

  // 5) Pick the leading category even if below 30%, as long as it's not 'etc'
  if (topCat.r >= 0.18) return topCat.p;

  // 6) Truly diffuse → drift
  return PERSONALITIES.drift;
}
