// 30 dashboard display themes. Each theme applies a subtle skin to the
// dashboard view — background gradient, card tint, accent. Picked via a
// cycler at the top of the dashboard.

export const DASHBOARD_THEMES = [
  { id: 'midnight',    label: '자정',      emoji: '🌙', bg: 'radial-gradient(1200px 600px at 20% 10%, #1f0b2e 0%, transparent 60%), #0a0a0f', card: '#14131c', accent: '#a78bfa', text: '#e5e7eb' },
  { id: 'sunset',      label: '선셋',      emoji: '🌇', bg: 'linear-gradient(180deg, #1a0a14 0%, #2c0f1a 100%)', card: '#1f0e18', accent: '#f97316', text: '#ffe4d6' },
  { id: 'forest',      label: '숲',        emoji: '🌲', bg: 'linear-gradient(180deg, #0a1810 0%, #0d1f17 100%)', card: '#122a1e', accent: '#34d399', text: '#d1fae5' },
  { id: 'ocean',       label: '오션',      emoji: '🌊', bg: 'linear-gradient(180deg, #051d2d 0%, #082a3e 100%)', card: '#0c2d40', accent: '#38bdf8', text: '#e0f2fe' },
  { id: 'rose',        label: '로즈',      emoji: '🌹', bg: 'linear-gradient(180deg, #1c0812 0%, #2a0f1b 100%)', card: '#22101a', accent: '#fb7185', text: '#ffe4ec' },
  { id: 'mint',        label: '민트',      emoji: '🌿', bg: 'linear-gradient(180deg, #091f1c 0%, #0a2925 100%)', card: '#0f2e29', accent: '#5eead4', text: '#ccfbf1' },
  { id: 'peach',       label: '피치',      emoji: '🍑', bg: 'linear-gradient(180deg, #281810 0%, #2e1c14 100%)', card: '#2f1f18', accent: '#fdba74', text: '#ffedd5' },
  { id: 'lavender',    label: '라벤더',    emoji: '💜', bg: 'linear-gradient(180deg, #18112a 0%, #211636 100%)', card: '#1d1732', accent: '#c4b5fd', text: '#ede9fe' },
  { id: 'gold',        label: '골드',      emoji: '✨', bg: 'linear-gradient(180deg, #1a1408 0%, #221810 100%)', card: '#201810', accent: '#fbbf24', text: '#fef3c7' },
  { id: 'mono',        label: '모노',      emoji: '⚫', bg: '#0a0a0a', card: '#151515', accent: '#e5e5e5', text: '#f5f5f5' },
  { id: 'cotton',      label: '코튼',      emoji: '🧸', bg: '#fef9f2', card: '#ffffff', accent: '#f472b6', text: '#3f3f46', dark: false },
  { id: 'paper',       label: '종이',      emoji: '📄', bg: '#faf6ee', card: '#ffffff', accent: '#78716c', text: '#27272a', dark: false },
  { id: 'sky',         label: '하늘',      emoji: '🌤️', bg: '#ecfeff', card: '#ffffff', accent: '#0891b2', text: '#164e63', dark: false },
  { id: 'matcha',      label: '말차',      emoji: '🍵', bg: '#f0fdf4', card: '#ffffff', accent: '#16a34a', text: '#052e16', dark: false },
  { id: 'sand',        label: '샌드',      emoji: '🏖️', bg: '#fefce8', card: '#fffcea', accent: '#ca8a04', text: '#422006', dark: false },
  { id: 'cyber',       label: '사이버',    emoji: '🌐', bg: 'radial-gradient(800px 400px at 50% 0%, #1e0a3c 0%, transparent 60%), #05011a', card: '#0e0825', accent: '#22d3ee', text: '#e0e7ff' },
  { id: 'vaporwave',   label: '베이퍼',    emoji: '📼', bg: 'linear-gradient(180deg, #2a0853 0%, #5b0f4c 100%)', card: '#2d0c4a', accent: '#f0abfc', text: '#fae8ff' },
  { id: 'retrowave',   label: '레트로',    emoji: '🕹️', bg: 'linear-gradient(180deg, #0a0425 0%, #170936 100%)', card: '#1a0d3f', accent: '#ff4dc3', text: '#e0e7ff' },
  { id: 'noir',        label: '누아르',    emoji: '🎞️', bg: '#0a0a0a', card: '#1b1b1b', accent: '#ef4444', text: '#fafafa' },
  { id: 'sakura',      label: '벚꽃',      emoji: '🌸', bg: 'linear-gradient(180deg, #28101a 0%, #3a1522 100%)', card: '#2a1320', accent: '#f9a8d4', text: '#fce7f3' },
  { id: 'aurora',      label: '오로라',    emoji: '🌌', bg: 'linear-gradient(160deg, #071122 0%, #0a1f3a 40%, #0f3a2b 100%)', card: '#0c1f32', accent: '#7dd3fc', text: '#e0f2fe' },
  { id: 'candy',       label: '캔디',      emoji: '🍭', bg: 'linear-gradient(180deg, #1a0b22 0%, #2a0f33 100%)', card: '#20112a', accent: '#f0abfc', text: '#fdf4ff' },
  { id: 'jade',        label: '옥빛',      emoji: '💎', bg: 'linear-gradient(180deg, #041814 0%, #082621 100%)', card: '#0b2820', accent: '#10b981', text: '#ecfdf5' },
  { id: 'sunrise',     label: '선라이즈',  emoji: '🌅', bg: 'linear-gradient(180deg, #1a0a0a 0%, #2a1208 100%)', card: '#231408', accent: '#fcd34d', text: '#fef3c7' },
  { id: 'iceberg',     label: '빙하',      emoji: '🧊', bg: 'linear-gradient(180deg, #051d28 0%, #072a36 100%)', card: '#0a2a35', accent: '#67e8f9', text: '#cffafe' },
  { id: 'cacao',       label: '카카오',    emoji: '🍫', bg: 'linear-gradient(180deg, #1a0e08 0%, #251408 100%)', card: '#20110a', accent: '#d97706', text: '#fef3c7' },
  { id: 'mocha',       label: '모카',      emoji: '☕', bg: '#f5eede', card: '#fff8e7', accent: '#92400e', text: '#3f2f0a', dark: false },
  { id: 'blueprint',   label: '블루프린트', emoji: '📐', bg: 'linear-gradient(180deg, #042a52 0%, #063169 100%)', card: '#0a3770', accent: '#93c5fd', text: '#e0f2fe' },
  { id: 'pastel',      label: '파스텔',    emoji: '🎨', bg: 'linear-gradient(135deg, #ffe4e6 0%, #e0f2fe 50%, #fef9c3 100%)', card: '#ffffffcc', accent: '#f472b6', text: '#1f2937', dark: false },
  { id: 'emerald',     label: '에메랄드',  emoji: '💚', bg: 'linear-gradient(180deg, #041f15 0%, #07291d 100%)', card: '#0c2e23', accent: '#10b981', text: '#d1fae5' },
];

export function getThemeById(id) {
  return DASHBOARD_THEMES.find((t) => t.id === id) || DASHBOARD_THEMES[0];
}

// Render a style object from a theme — use as inline style on the root dashboard div.
export function themeStyle(theme) {
  if (!theme) return {};
  return {
    background: theme.bg,
    color: theme.text,
  };
}
