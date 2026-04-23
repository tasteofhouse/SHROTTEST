// Score-based personality detection. Every personality gets a numeric fit
// score from category ratios + behavior; the highest wins as primary, and
// the next few are returned as "가까운 유형" candidates for the UI.
//
// Motivation: the prior threshold-cascade fired "channel explorer" for
// virtually every user because Shorts feeds naturally produce high
// unique/total ratios. Scoring + tighter bounds fixes this.

// NOTE on tone — taglines/descriptions are deliberately "매운맛 (팩트폭행)": direct,
// slightly roasting, colloquial. The goal is viral shareability, not sympathy.
// Each entry also carries:
//   bestMatch / worstMatch — personality ids for the compatibility UI
//   dopamineLevel (0-100) — dopamine "addictiveness" baseline used by the gauge
export const PERSONALITIES = {
  game: {
    id: 'game', name: '게임 몰입형', emoji: '🎮',
    tagline: '"딱 한 판만"의 함정카드 지금도 발동 중',
    description: '네, 또 하이라이트 보러 들어와서 3시간 사라진 그 사람. 게임이 30%를 넘으면 이미 일상 아니라 부업입니다.',
    vibe: '플래티넘 게이머',
    gradient: 'from-purple-600 via-violet-500 to-fuchsia-500',
    bestMatch: 'comedy', worstMatch: 'steady', dopamineLevel: 82,
  },
  animal: {
    id: 'animal', name: '힐링 추구형', emoji: '🐱',
    tagline: '동물 없으면 불안장애 오는 타입',
    description: '스트레스 받으면 강아지·고양이 영상부터 켜는 리얼 상황. 털뭉치로 도파민 채우는 가성비甲 인생.',
    vibe: '집사 혹은 예비 집사',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bestMatch: 'asmr', worstMatch: 'binge', dopamineLevel: 48,
  },
  food: {
    id: 'food', name: '미식 탐험형', emoji: '🍜',
    tagline: '먹방 보면서 라면 끓이는 이중 플레이어',
    description: '새벽 2시에 족발 먹방 트는 바로 그 인간. 맛집 영상 저장해놓고 실제론 절대 안 감. 인정?',
    vibe: '식도락 러버',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    bestMatch: 'comedy', worstMatch: 'info', dopamineLevel: 68,
  },
  comedy: {
    id: 'comedy', name: '예능 중독형', emoji: '😂',
    tagline: 'ㅋㅋㅋ 박제의 장인, 폰 각도로 티남',
    description: '남들 앞에선 진지한 척, 혼자 있을 땐 30초마다 빵빵 터지고 있음. 웃음 총량 법칙이 매일 초과 달성.',
    vibe: '코미디 애호가',
    gradient: 'from-yellow-400 via-orange-400 to-pink-500',
    bestMatch: 'food', worstMatch: 'info', dopamineLevel: 79,
  },
  drama: {
    id: 'drama', name: '정주행 러버', emoji: '🎬',
    tagline: '"한 편만"으로 시즌 2까지 찍었잖아요',
    description: '내일 출근인데 새벽 3시. 눈은 빨갛고 다음 화 재생 버튼은 빠름. 또 회사 가서 "피곤하다" 타령하겠죠.',
    vibe: 'OTT 정복자',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    bestMatch: 'loyal', worstMatch: 'shorts', dopamineLevel: 74,
  },
  music: {
    id: 'music', name: '음악 감성형', emoji: '🎵',
    tagline: '15초 안에 감정이 이사하는 민감쟁이',
    description: '가사 한 줄에 전생 기억 떠오르는 타입. 이어폰 빼면 세상이 낯설어지는 진성 BGM 의존자.',
    vibe: '플레이리스트 큐레이터',
    gradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
    bestMatch: 'lifestyle', worstMatch: 'binge', dopamineLevel: 55,
  },
  sports: {
    id: 'sports', name: '스포츠 열혈형', emoji: '⚽',
    tagline: '경기는 몰라도 하이라이트 편집은 꿰뚫음',
    description: '직관은 안 가면서 찐팬 인증은 확실함. 결과 알면서 하이라이트 또 돌려보는 무한루프 장인.',
    vibe: '직관러의 혼',
    gradient: 'from-red-600 via-rose-500 to-pink-500',
    bestMatch: 'comedy', worstMatch: 'asmr', dopamineLevel: 72,
  },
  info: {
    id: 'info', name: '정보 수집형', emoji: '🧠',
    tagline: '쓸데없이 박식, 써먹을 데는 없음',
    description: '영상으로 지식 쌓고 현실에선 아무것도 안 바뀜. 유튜브가 대학원인 줄 아는 신종 학위병.',
    vibe: '걸어다니는 위키',
    gradient: 'from-blue-600 via-cyan-500 to-sky-500',
    bestMatch: 'tech', worstMatch: 'kids', dopamineLevel: 42,
  },
  lifestyle: {
    id: 'lifestyle', name: '라이프 큐레이터', emoji: '💄',
    tagline: '루틴은 저장, 실천은 미정',
    description: '아침 루틴 영상 30개 저장하고 실제론 침대에서 일어나지 못함. 트렌드는 빠삭한데 지갑은 빠삭빠삭.',
    vibe: '라이프스타일 러버',
    gradient: 'from-rose-400 via-pink-400 to-fuchsia-500',
    bestMatch: 'music', worstMatch: 'game', dopamineLevel: 62,
  },
  tech: {
    id: 'tech', name: '얼리어답터', emoji: '💻',
    tagline: '신제품 발표는 국경일, 통장은 제사일',
    description: '리뷰 다 봐서 리뷰어 다음으로 잘 앎. 안 살 거면서 언박싱 다 보고 오히려 뿌듯한 그 모순.',
    vibe: '기기 변태(好)',
    gradient: 'from-sky-500 via-blue-500 to-indigo-600',
    bestMatch: 'info', worstMatch: 'animal', dopamineLevel: 58,
  },
  kids: {
    id: 'kids', name: '키즈/애니 덕후', emoji: '🧒',
    tagline: '동심 반납 안 했는데 나이만 먹음',
    description: '주민번호는 9로 시작 안 하는데 취향은 5살. 어른인 척 하다 뽀로로 배경음 들리면 바로 멈칫.',
    vibe: '만화왕국 시민',
    gradient: 'from-sky-400 via-indigo-400 to-purple-400',
    bestMatch: 'animal', worstMatch: 'info', dopamineLevel: 66,
  },
  asmr: {
    id: 'asmr', name: '힐링 수면파', emoji: '😴',
    tagline: 'ASMR 중간에 잠들고 영상은 7시간째 재생',
    description: '자기 전 1분만 들으려다 아침에 폰 배터리 0%. 슬라임·속닥임으로 뇌를 달래지 않으면 잠을 못 자는 몸.',
    vibe: '고요의 수집가',
    gradient: 'from-violet-400 via-purple-400 to-fuchsia-400',
    bestMatch: 'animal', worstMatch: 'sports', dopamineLevel: 35,
  },
  night: {
    id: 'night', name: '밤의 지배자', emoji: '🌙',
    tagline: '"오늘은 일찍 잘 거야" 근데 새벽 4시',
    description: '세상이 잘 때 혼자 영상 트는 고독한 원주민. 내일 아침의 나를 저버린 게 하루 이틀이 아니죠?',
    vibe: '올빼미 중의 올빼미',
    gradient: 'from-indigo-900 via-purple-700 to-blue-800',
    bestMatch: 'addict', worstMatch: 'morning', dopamineLevel: 88,
  },
  morning: {
    id: 'morning', name: '모닝 러너', emoji: '🌅',
    tagline: '알람보다 알고리즘이 먼저 깨는 인간',
    description: '커피 내리기 전에 쇼츠 먼저 뜨는 찐얼리버드. 부지런한 척 하지만 결국 하루의 시작도 유튜브.',
    vibe: '얼리버드',
    gradient: 'from-amber-300 via-orange-400 to-pink-400',
    bestMatch: 'steady', worstMatch: 'night', dopamineLevel: 52,
  },
  weekend: {
    id: 'weekend', name: '주말 몰아보기', emoji: '🛋️',
    tagline: '평일은 절제, 주말엔 대폭발',
    description: '월~금 참은 거 토·일에 몰아서 한번에 소진. 주말 약속 깨고 침대에서 영상만 10시간.',
    vibe: '주말의 왕',
    gradient: 'from-orange-400 via-amber-400 to-yellow-300',
    bestMatch: 'binge', worstMatch: 'steady', dopamineLevel: 71,
  },
  binge: {
    id: 'binge', name: '폭주 정주행파', emoji: '⚡',
    tagline: '한 번 타면 브레이크 없는 폭주 기관차',
    description: '평소엔 멀쩡하다가 특정 하루에 100편씩 찍어보는 광란의 질주자. 그날만큼은 시간 개념 사라짐.',
    vibe: '원데이 몰아보기',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    bestMatch: 'weekend', worstMatch: 'steady', dopamineLevel: 85,
  },
  steady: {
    id: 'steady', name: '꾸준러', emoji: '🕰️',
    tagline: '매일 똑같이 봄, 심지어 시간대도 똑같음',
    description: '루틴에 갇힌 건지 진화한 건지 본인도 모름. 변주 없는 일정표가 매일 소름끼치도록 정확함.',
    vibe: '루틴 마스터',
    gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    bestMatch: 'morning', worstMatch: 'binge', dopamineLevel: 38,
  },
  explorer: {
    id: 'explorer', name: '채널 탐험가', emoji: '🧭',
    tagline: '본 채널 세기 포기했죠? 이미 수백 명',
    description: '한 채널에 2편 이상 머무는 일이 드문 바람둥이 시청자. 알고리즘도 당신 취향 포기함.',
    vibe: '다양성 마니아',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    bestMatch: 'tech', worstMatch: 'loyal', dopamineLevel: 64,
  },
  loyal: {
    id: 'loyal', name: '찐팬 러버', emoji: '💘',
    tagline: '같은 채널 10번째 정주행 중',
    description: 'Top 3 채널이 전체의 절반을 차지하는 진성. 다른 채널 추천받으면 "아 됐어요" 하는 그 사람.',
    vibe: '진성 구독자',
    gradient: 'from-rose-500 via-red-500 to-orange-500',
    bestMatch: 'drama', worstMatch: 'explorer', dopamineLevel: 60,
  },
  drift: {
    id: 'drift', name: '알고리즘 표류형', emoji: '🌀',
    tagline: '취향 없음, 영혼은 알고리즘에 맡김',
    description: '뭐가 떠도 일단 봄. 피드가 곧 인격인 상태. 본인 취향 물으면 "몰라…" 한숨만 쉬는 타입.',
    vibe: '피드의 난민',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    bestMatch: 'explorer', worstMatch: 'loyal', dopamineLevel: 70,
  },
  addict: {
    id: 'addict', name: '도파민 중독형', emoji: '🔥',
    tagline: '"한 번만 더"가 이미 오늘만 200번째',
    description: '새벽 3시에 새벽 3시에 새벽 3시에… 스크롤 멈출 뇌 스위치 고장남. 병원 가기 전 최후의 경고.',
    vibe: '알고리즘 러닝머신',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
    bestMatch: 'night', worstMatch: 'steady', dopamineLevel: 98,
  },
  shorts: {
    id: 'shorts', name: '쇼츠 네이티브', emoji: '📱',
    tagline: '5분 영상은 이제 "장편 영화"로 체감',
    description: '세로 스크롤로 최적화된 뇌를 가진 신인류. 집중력 평균치는 15초, 그 이상은 스트레스.',
    vibe: '쇼츠 원주민',
    gradient: 'from-lime-400 via-emerald-400 to-teal-400',
    bestMatch: 'weekend', worstMatch: 'drama', dopamineLevel: 91,
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
