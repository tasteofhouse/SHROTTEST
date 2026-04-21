const KEY = 'shorts-insight-history';
const MAX = 12;

export function saveAnalysis({ personality, stats, topCategories }) {
  try {
    const history = loadHistory();
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      personality: {
        id: personality.id,
        name: personality.name,
        emoji: personality.emoji,
        gradient: personality.gradient,
      },
      stats: {
        total: stats.total,
        avgPerDay: +stats.avgPerDay.toFixed(1),
        uniqueChannels: stats.uniqueChannels,
        spanDays: stats.spanDays,
        nightRatio: +stats.nightRatio.toFixed(3),
        peakHour: stats.peakHour,
        peakDay: stats.peakDay,
      },
      topCategories: (topCategories || []).slice(0, 5).map((c) => ({
        id: c.id,
        label: c.label,
        emoji: c.emoji,
        ratio: +c.ratio.toFixed(3),
        color: c.color,
      })),
    };
    const updated = [entry, ...history].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return entry;
  } catch {
    return null;
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function deleteEntry(id) {
  try {
    const history = loadHistory();
    localStorage.setItem(KEY, JSON.stringify(history.filter((e) => e.id !== id)));
  } catch {}
}
