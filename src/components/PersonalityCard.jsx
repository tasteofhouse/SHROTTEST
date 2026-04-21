import { Sparkles, Flame, Moon, Compass, Target } from 'lucide-react';

const INDEX_META = [
  { key: 'dopamine',  label: '도파민',   icon: Flame,   bar: 'from-red-400 to-orange-300' },
  { key: 'nocturnal', label: '야행성',   icon: Moon,    bar: 'from-indigo-300 to-purple-300' },
  { key: 'explorer',  label: '탐험력',   icon: Compass, bar: 'from-teal-300 to-cyan-300' },
  { key: 'picky',     label: '취향 집중', icon: Target,  bar: 'from-pink-300 to-rose-300' },
];

export default function PersonalityCard({ personality, stats, topCategories, indices }) {
  if (!personality) return null;

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-8 md:p-10
        bg-gradient-to-br ${personality.gradient}
        animate-pulse-glow animate-fade-up
      `}
    >
      {/* subtle texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 40%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-medium text-white/90">
          <Sparkles className="w-3.5 h-3.5" />
          당신의 YouTube 취향 유형
        </div>

        <div className="text-7xl md:text-8xl leading-none drop-shadow-lg">
          {personality.emoji}
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow">
          {personality.name}
        </h2>

        {personality.vibe && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur text-xs font-semibold text-white tracking-wide">
            #{personality.vibe}
          </div>
        )}

        <p className="text-lg md:text-xl text-white/90 font-medium italic max-w-xl">
          "{personality.tagline}"
        </p>

        <p className="text-sm md:text-base text-white/80 max-w-lg">
          {personality.description}
        </p>

        {topCategories && topCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {topCategories.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="px-3 py-1 rounded-full bg-black/25 backdrop-blur text-xs text-white/95"
              >
                {c.emoji} {c.label} {Math.round(c.ratio * 100)}%
              </span>
            ))}
          </div>
        )}

        {indices && (
          <div className="mt-4 w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INDEX_META.map(({ key, label, icon: Icon, bar }) => (
              <IndexBar
                key={key}
                icon={Icon}
                label={label}
                value={indices[key] || 0}
                bar={bar}
              />
            ))}
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-3 gap-6 mt-4 w-full max-w-md">
            <Stat value={stats.total.toLocaleString()} label="총 시청" />
            <Stat value={stats.avgPerDay.toFixed(1)} label="하루 평균" />
            <Stat value={stats.uniqueChannels.toLocaleString()} label="본 채널" />
          </div>
        )}

        {stats && stats.shortsCount > 0 && (
          <div className="text-xs text-white/75 mt-1">
            이 중 #shorts 태그 확인된 쇼츠: {stats.shortsCount.toLocaleString()}편
          </div>
        )}
      </div>
    </div>
  );
}

function IndexBar({ icon: Icon, label, value, bar }) {
  return (
    <div className="flex flex-col gap-1 bg-black/25 backdrop-blur rounded-xl px-3 py-2 text-left">
      <div className="flex items-center justify-between text-white/95">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl md:text-3xl font-bold text-white drop-shadow">{value}</div>
      <div className="text-xs text-white/75 mt-0.5">{label}</div>
    </div>
  );
}
