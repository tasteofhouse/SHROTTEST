import { detectMbti } from '../utils/mbtiProfile';

// Renders a MBTI-style 5-axis breakdown of the user's viewing profile.
// Designed to live alongside PersonalityCard in the result tab.
export default function MbtiCard({ indices }) {
  if (!indices) return null;
  const profile = detectMbti(indices);

  return (
    <section
      className="rounded-3xl p-6 md:p-7 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(236,72,153,0.14) 55%, rgba(251,146,60,0.14) 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* Ambient orbs */}
      <div className="absolute -top-12 -right-10 w-48 h-48 rounded-full blur-3xl opacity-40"
        style={{ background: 'rgba(167,139,250,0.5)' }} />
      <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full blur-3xl opacity-30"
        style={{ background: 'rgba(251,146,60,0.45)' }} />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] tracking-widest uppercase opacity-70">MBTI-style 시청 유형</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-4xl md:text-5xl font-black tracking-tight font-mono"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
              {profile.code}
            </span>
          </div>
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
            <span>{profile.emoji}</span>
            <span>{profile.name}</span>
          </div>
          <p className="text-sm opacity-80 mt-1">“{profile.tagline}”</p>
        </div>
        <div className="text-[11px] opacity-70 text-right hidden sm:block">
          <div>5가지 축 기반</div>
          <div>총 32유형</div>
        </div>
      </div>

      {/* 5-axis breakdown */}
      <div className="relative mt-6 space-y-3">
        {profile.axes.map((axis) => {
          const strengthPct = Math.round(Math.max(5, Math.min(95, axis.strength)));
          const fromLeft = axis.pick === axis.left;
          const pickEmoji = axis.emoji[axis.pick];
          return (
            <div key={axis.key}>
              <div className="flex items-center justify-between text-[11px] mb-1 opacity-80">
                <span className="flex items-center gap-1.5">
                  <span className={fromLeft ? 'font-bold opacity-100' : 'opacity-50'}>
                    {axis.emoji[axis.left]} {axis.korean[axis.left]}
                  </span>
                </span>
                <span className="opacity-60">{axis.description}</span>
                <span className="flex items-center gap-1.5">
                  <span className={!fromLeft ? 'font-bold opacity-100' : 'opacity-50'}>
                    {axis.korean[axis.right]} {axis.emoji[axis.right]}
                  </span>
                </span>
              </div>
              <div
                className="relative h-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                {/* Center line */}
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-px h-3 opacity-30"
                  style={{ background: 'rgba(255,255,255,0.4)' }} />
                {/* Fill */}
                <div
                  className="absolute top-0 h-full rounded-full transition-all"
                  style={
                    fromLeft
                      ? {
                          right: '50%',
                          width: `${strengthPct / 2}%`,
                          background: 'linear-gradient(to left, #a78bfa, #ec4899)',
                        }
                      : {
                          left: '50%',
                          width: `${strengthPct / 2}%`,
                          background: 'linear-gradient(to right, #ec4899, #fb923c)',
                        }
                  }
                />
                {/* Indicator dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow"
                  style={{
                    left: fromLeft
                      ? `${50 - strengthPct / 2}%`
                      : `${50 + strengthPct / 2}%`,
                    transform: 'translate(-50%, -50%)',
                    background: '#fff',
                    boxShadow: '0 0 0 2px rgba(167,139,250,0.6)',
                  }}
                />
              </div>
              <div className="mt-0.5 text-[10px] opacity-60 text-right">
                {pickEmoji} {axis.korean[axis.pick]} 성향 {Math.round(axis.strength)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Descriptive sentences */}
      <ul className="relative mt-6 space-y-1.5 text-sm">
        {profile.descriptionLines.map((line, i) => (
          <li key={i} className="flex gap-2 opacity-90">
            <span className="opacity-50">•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
