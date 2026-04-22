// MBTI-style 5-axis viewing profile. Each axis is a binary split derived
// from the 10 behavioral indices. 2^5 = 32 combinations — enough variety to
// feel personal, while still interpretable.
//
// Axes:
//   D / C — Dopamine 중독 vs Calm 절제    (index.dopamine vs 50)
//   N / M — Night 야행성 vs Morning 아침형 (morning vs nocturnal)
//   E / L — Explorer 탐험가 vs Loyal 고정팬 (explorer vs loyalty)
//   B / S — Binge 폭주형 vs Steady 꾸준형   (binge vs steady)
//   F / V — Focused 취향집중 vs Varied 잡식  (picky vs 50)

export const MBTI_AXES = [
  {
    key: 'DC',
    labels: { D: 'Dopamine', C: 'Calm' },
    korean: { D: '도파민 추종', C: '절제형' },
    description: '시청 강도 · 빈도',
    emoji: { D: '🔥', C: '🕊️' },
  },
  {
    key: 'NM',
    labels: { N: 'Night', M: 'Morning' },
    korean: { N: '야행성', M: '아침형' },
    description: '활동 시간대',
    emoji: { N: '🌙', M: '🌅' },
  },
  {
    key: 'EL',
    labels: { E: 'Explorer', L: 'Loyal' },
    korean: { E: '탐험가', L: '찐팬' },
    description: '채널 충성도',
    emoji: { E: '🧭', L: '💘' },
  },
  {
    key: 'BS',
    labels: { B: 'Binge', S: 'Steady' },
    korean: { B: '폭주형', S: '꾸준형' },
    description: '시청 리듬',
    emoji: { B: '⚡', S: '🔁' },
  },
  {
    key: 'FV',
    labels: { F: 'Focused', V: 'Varied' },
    korean: { F: '취향집중', V: '잡식' },
    description: '장르 편식도',
    emoji: { F: '🎯', V: '🎨' },
  },
];

// Short names for each of the 32 codes. Keep them tight — they're titles.
// Written in Korean with a playful tone.
const CODE_NAMES = {
  // D**** — dopamine dominant
  DNEBF: { name: '심야 사냥꾼',       tagline: '새벽마다 새로운 굴을 판다',       emoji: '🦊' },
  DNEBV: { name: '밤의 서핑러',       tagline: '모든 피드 위를 미끄러지는 야밤족', emoji: '🌊' },
  DNESF: { name: '밤샘 장인',         tagline: '좋아하는 카테고리로 뜬눈을 샌다',  emoji: '🌒' },
  DNESV: { name: '새벽 무한루프',     tagline: '뭘 보든 멈추지 않는 타입',       emoji: '🔁' },
  DNLBF: { name: '심야 덕후',         tagline: '내 최애 채널은 잠들지 않는다',    emoji: '💜' },
  DNLBV: { name: '밤의 도파민 스트리머', tagline: '스트리머를 타고 떠돈다',         emoji: '📡' },
  DNLSF: { name: '올빼미 고정팬',     tagline: '매일 밤 같은 사람을 본다',       emoji: '🦉' },
  DNLSV: { name: '심야 잡식 구독자',  tagline: '밤의 채널 백과사전',             emoji: '🌌' },
  DMEBF: { name: '모닝 도파민러',     tagline: '출근 전 15편 자동 소비',          emoji: '☕' },
  DMEBV: { name: '아침 벼락 소비자',  tagline: '커피보다 먼저 쇼츠를 들이킨다',   emoji: '⚡' },
  DMESF: { name: '새벽 기상 폭주러',  tagline: '아침부터 덕질 엔진 가동',         emoji: '🌅' },
  DMESV: { name: '아침 탐방가',       tagline: '해뜨기 전부터 스크롤 여행',       emoji: '🧭' },
  DMLBF: { name: '모닝 찐팬',         tagline: '아침 루틴은 최애의 신작',         emoji: '💘' },
  DMLBV: { name: '출근길 서퍼',       tagline: '지하철에서 끝내는 30편',          emoji: '🚇' },
  DMLSF: { name: '아침형 덕후',       tagline: '한 채널만 꾸준히 틀어놓는 타입',  emoji: '🌞' },
  DMLSV: { name: '아침 섭취가',       tagline: '매일 같은 시간, 다른 피드',       emoji: '🍊' },
  // C**** — calm / moderate
  CNEBF: { name: '밤의 큐레이터',     tagline: '밤은 짧게, 고르는 안목은 길게',  emoji: '🌙' },
  CNEBV: { name: '밤 산책자',         tagline: '자기 전 몇 편만 거니는 타입',    emoji: '🌠' },
  CNESF: { name: '야밤 독서가',       tagline: '조용히 파고드는 새벽 공부',      emoji: '📘' },
  CNESV: { name: '늦은 밤 수집가',    tagline: '밤에만 새로운 채널을 모은다',    emoji: '🗂️' },
  CNLBF: { name: '밤의 오타쿠',       tagline: '최애 영상만 몰아본다',           emoji: '🕯️' },
  CNLBV: { name: '한밤의 몰아보기',   tagline: '주말 밤은 정주행의 시간',        emoji: '🎞️' },
  CNLSF: { name: '조용한 고정팬',     tagline: '한 채널, 한 주제에 충실',        emoji: '🌾' },
  CNLSV: { name: '잔잔 밤 러버',      tagline: '느린 템포로 밤을 소비',          emoji: '🍵' },
  CMEBF: { name: '아침 큐레이터',     tagline: '오늘 뭐 볼지 미리 골라둔다',     emoji: '☀️' },
  CMEBV: { name: '아침 가벼운 산책',  tagline: '출근길 10분, 딱 그만큼',         emoji: '🌼' },
  CMESF: { name: '아침 탐험가',       tagline: '하루를 새 채널로 시작',          emoji: '🗺️' },
  CMESV: { name: '주말 아침 감상가',  tagline: '여유롭게 아침을 감상한다',       emoji: '🥐' },
  CMLBF: { name: '고요한 찐팬',       tagline: '조용히 최애만 들여다보는 타입',  emoji: '🌸' },
  CMLBV: { name: '아침 몰입파',       tagline: '커피 한 잔과 정주행 한 회',      emoji: '☕' },
  CMLSF: { name: '하루 한 채널',      tagline: '단골만 챙기는 슴슴한 루틴',      emoji: '🕯️' },
  CMLSV: { name: '느긋한 구독자',     tagline: '잡식이지만 과하진 않다',         emoji: '🌿' },
};

// Long descriptions generated from axis compositions — attached dynamically.
function axisSentences(codes) {
  const [dc, nm, el, bs, fv] = codes;
  const lines = [];
  lines.push(
    dc === 'D'
      ? '시청량이 높고 도파민 민감도가 강한 편이에요.'
      : '꾸준히, 그러나 과열되지 않게 영상을 즐기는 편이에요.'
  );
  lines.push(
    nm === 'N'
      ? '주로 밤~새벽에 시청 집중도가 치솟아요.'
      : '하루의 앞쪽, 아침·오전 시간대에 영상 소비가 집중돼요.'
  );
  lines.push(
    el === 'E'
      ? '새로운 채널을 끊임없이 발굴하는 탐험형이에요.'
      : '좋아하는 Top 채널 몇 개에 시청이 쏠리는 고정팬 스타일.'
  );
  lines.push(
    bs === 'B'
      ? '한 번 꽂히면 몰아보기로 폭주하는 리듬을 가졌어요.'
      : '매일 비슷한 양으로 꾸준히 이어가는 스테디 타입.'
  );
  lines.push(
    fv === 'F'
      ? '특정 카테고리에 시청이 집중되는 취향 확실한 타입.'
      : '여러 장르를 자유롭게 오가는 잡식 시청자예요.'
  );
  return lines;
}

// Return the 2-letter axis picks for a given indices object.
function pickAxes(indices) {
  const { dopamine = 0, nocturnal = 0, morning = 0, explorer = 0, loyalty = 0, binge = 0, steady = 0, picky = 0 } = indices || {};
  const dc = dopamine >= 50 ? 'D' : 'C';
  // Night wins if nocturnal >= 25 OR nocturnal strictly beats morning, else morning.
  const nm = nocturnal >= 25 || nocturnal > morning ? 'N' : 'M';
  const el = explorer >= loyalty ? 'E' : 'L';
  const bs = binge > steady ? 'B' : 'S';
  const fv = picky >= 50 ? 'F' : 'V';
  return { dc, nm, el, bs, fv };
}

// Compute strength for each axis (0-100), used for bar rendering.
function axisStrengths(indices, picks) {
  const { dopamine = 0, nocturnal = 0, morning = 0, explorer = 0, loyalty = 0, binge = 0, steady = 0, picky = 0 } = indices || {};
  return {
    DC: picks.dc === 'D' ? dopamine : 100 - dopamine,
    NM: picks.nm === 'N' ? Math.max(nocturnal, 100 - morning) : Math.max(morning, 100 - nocturnal),
    EL: picks.el === 'E'
      ? (explorer + (100 - loyalty)) / 2
      : (loyalty + (100 - explorer)) / 2,
    BS: picks.bs === 'B'
      ? (binge + (100 - steady)) / 2
      : (steady + (100 - binge)) / 2,
    FV: picks.fv === 'F' ? picky : 100 - picky,
  };
}

export function detectMbti(indices) {
  const picks = pickAxes(indices);
  const code = `${picks.dc}${picks.nm}${picks.el}${picks.bs}${picks.fv}`;
  const meta = CODE_NAMES[code] || {
    name: '알 수 없는 유형',
    tagline: '데이터가 조금 더 필요해요',
    emoji: '🧩',
  };
  const strengths = axisStrengths(indices, picks);
  return {
    code,
    picks,
    name: meta.name,
    tagline: meta.tagline,
    emoji: meta.emoji,
    descriptionLines: axisSentences(code),
    strengths,
    axes: MBTI_AXES.map((axis) => {
      const [left, right] = axis.key.split('');
      const pick = picks[axis.key === 'DC' ? 'dc' : axis.key === 'NM' ? 'nm' : axis.key === 'EL' ? 'el' : axis.key === 'BS' ? 'bs' : 'fv'];
      return {
        ...axis,
        left,
        right,
        pick,
        strength: strengths[axis.key],
      };
    }),
  };
}
