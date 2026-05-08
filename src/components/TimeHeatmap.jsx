// Custom 7x24 heatmap using plain divs (more compact than recharts for this).
import { useT } from '../i18n/index.jsx';

export default function TimeHeatmap({ heatmap }) {
  const { t } = useT();
  if (!heatmap || !heatmap.grid) return null;
  const { grid } = heatmap;
  // Locale-aware short weekday labels (fall back to whatever the analyzer
  // shipped). The analyzer produces these in Korean, so the tooltip too uses
  // a locale-aware template.
  const weekdayList = t('heatmap.weekdays');
  const weekdays = Array.isArray(weekdayList) && weekdayList.length === 7
    ? weekdayList
    : heatmap.weekdays;

  const max = Math.max(1, ...grid.flat());

  const cellColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.04)';
    const intensity = Math.min(1, 0.15 + (count / max) * 0.85);
    // YouTube red with variable alpha
    return `rgba(255, 0, 0, ${intensity})`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[560px]">
        {/* Header: hours */}
        <div className="flex items-center pl-8 gap-[2px]">
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="flex-1 text-[10px] text-zinc-500 text-center"
            >
              {h % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>

        {/* Rows: day x hour */}
        <div className="mt-1 flex flex-col gap-[2px]">
          {grid.map((row, d) => (
            <div key={d} className="flex items-center gap-[2px]">
              <div className="w-7 text-[11px] text-zinc-400 text-right pr-1">
                {weekdays[d]}
              </div>
              {row.map((count, h) => (
                <div
                  key={h}
                  className="flex-1 aspect-square rounded-[3px] transition-transform hover:scale-110"
                  style={{ background: cellColor(count) }}
                  title={t('heatmap.cellTooltip', { day: weekdays[d], h, n: count })}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-zinc-500">
          <span>{t('heatmap.legendLow')}</span>
          {[0.1, 0.3, 0.5, 0.7, 1.0].map((a) => (
            <div
              key={a}
              className="w-3 h-3 rounded-[3px]"
              style={{ background: `rgba(255, 0, 0, ${a})` }}
            />
          ))}
          <span>{t('heatmap.legendHigh')}</span>
        </div>
      </div>
    </div>
  );
}
