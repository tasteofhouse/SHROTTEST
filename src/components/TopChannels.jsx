import { classifyLocally, CATEGORY_BY_ID } from '../utils/categorize';

// 20 distinct colors so every rank in a top-20 list gets its own hue.
const RANK_COLORS = [
  '#FF0000', '#FF4B6E', '#FF8A3D', '#FFB347', '#FFD166',
  '#c084fc', '#34d399', '#60a5fa', '#f472b6', '#a3e635',
  '#fb7185', '#38bdf8', '#fbbf24', '#a78bfa', '#22d3ee',
  '#4ade80', '#f97316', '#e879f9', '#facc15', '#818cf8',
];

export default function TopChannels({ topChannels }) {
  if (!topChannels || topChannels.length === 0) {
    return <div className="text-zinc-500 text-sm">데이터가 없어요.</div>;
  }

  const maxCount = topChannels[0]?.count || 1;
  const showScroll = topChannels.length > 10;

  return (
    <div
      className={`space-y-2.5 ${showScroll ? 'max-h-[480px] overflow-y-auto pr-1 -mr-1' : ''}`}
      style={showScroll ? { scrollbarWidth: 'thin' } : undefined}
    >
      {showScroll && (
        <p className="text-[10px] opacity-60 sticky top-0 py-1">
          Top {topChannels.length}개 · 스크롤해서 더 보기
        </p>
      )}
      {topChannels.map((ch, i) => {
        const catId = classifyLocally(ch.channel);
        const cat = CATEGORY_BY_ID[catId];
        const pct = Math.round((ch.count / maxCount) * 100);
        const color = RANK_COLORS[i] || '#9ca3af';

        return (
          <div key={i} className="group">
            {/* Header row */}
            <div className="flex items-center gap-2 mb-1">
              {/* Rank badge */}
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: color }}
              >
                {i + 1}
              </span>

              {/* Channel name */}
              <span className="flex-1 text-sm truncate font-medium">
                {ch.channel}
              </span>

              {/* Category badge */}
              {cat && catId !== 'etc' && (
                <span className="flex-shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] opacity-80"
                  style={{ background: 'rgba(0,0,0,0.25)' }}>
                  {cat.emoji} {cat.label}
                </span>
              )}

              {/* View count */}
              <span className="flex-shrink-0 text-xs font-semibold tabular-nums opacity-90">
                {ch.count.toLocaleString()}편
              </span>
            </div>

            {/* Bar */}
            <div className="ml-7 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
