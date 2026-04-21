import { classifyLocally, CATEGORY_BY_ID } from '../utils/categorize';

const RANK_COLORS = ['#FF0000', '#FF4B6E', '#FF8A3D', '#FFB347', '#FFD166',
                     '#c084fc', '#34d399', '#60a5fa', '#f472b6', '#a3e635'];

export default function TopChannels({ topChannels }) {
  if (!topChannels || topChannels.length === 0) {
    return <div className="text-zinc-500 text-sm">데이터가 없어요.</div>;
  }

  const maxCount = topChannels[0]?.count || 1;

  return (
    <div className="space-y-2.5">
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
              <span className="flex-1 text-sm text-zinc-100 truncate font-medium">
                {ch.channel}
              </span>

              {/* Category badge */}
              {cat && catId !== 'etc' && (
                <span className="flex-shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-zinc-800 text-[11px] text-zinc-400">
                  {cat.emoji} {cat.label}
                </span>
              )}

              {/* View count */}
              <span className="flex-shrink-0 text-xs font-semibold tabular-nums text-zinc-300">
                {ch.count.toLocaleString()}편
              </span>
            </div>

            {/* Bar */}
            <div className="ml-7 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
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
