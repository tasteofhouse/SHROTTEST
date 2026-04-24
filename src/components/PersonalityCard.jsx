import {
  Sparkles, Flame, Moon, Compass, Target, Heart,
  Zap, Calendar, Sunrise, Smartphone, Repeat,
  HeartHandshake, Swords, Share2,
} from 'lucide-react';
import { PERSONALITIES } from '../utils/detectPersonality';
import { useT } from '../i18n/index.jsx';

const INDEX_META = [
  { key: 'dopamine',   label: '도파민',    icon: Flame,      bar: 'from-red-400 to-orange-300' },
  { key: 'nocturnal',  label: '야행성',    icon: Moon,       bar: 'from-indigo-300 to-purple-300' },
  { key: 'explorer',   label: '탐험력',    icon: Compass,    bar: 'from-teal-300 to-cyan-300' },
  { key: 'picky',      label: '취향집중',  icon: Target,     bar: 'from-pink-300 to-rose-300' },
  { key: 'loyalty',    label: '충성도',    icon: Heart,      bar: 'from-rose-400 to-fuchsia-300' },
  { key: 'binge',      label: '폭식형',    icon: Zap,        bar: 'from-yellow-300 to-amber-400' },
  { key: 'weekend',    label: '주말러',    icon: Calendar,   bar: 'from-sky-300 to-blue-400' },
  { key: 'morning',    label: '아침형',    icon: Sunrise,    bar: 'from-amber-200 to-yellow-300' },
  { key: 'shortsness', label: '쇼츠력',    icon: Smartphone, bar: 'from-lime-300 to-emerald-300' },
  { key: 'steady',     label: '규칙성',    icon: Repeat,     bar: 'from-violet-300 to-indigo-300' },
];

// Resolve localized name/tagline/description/vibe from i18n by personality id.
// Falls back to whatever was originally on the object (Korean source).
function localize(t, p) {
  if (!p) return p;
  const id = p.id;
  return {
    ...p,
    name: t(`personalities.${id}.name`) || p.name,
    tagline: t(`personalities.${id}.tagline`) || p.tagline,
    description: t(`personalities.${id}.description`) || p.description,
    vibe: t(`personalities.${id}.vibe`) || p.vibe,
  };
}

export default function PersonalityCard({ personality, stats, topCategories, indices }) {
  const { t } = useT();
  if (!personality) return null;
  const p = localize(t, personality);

  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl p-8 md:p-10
        bg-gradient-to-br ${p.gradient}
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
          {t('personality.yourType')}
        </div>

        <div className="text-7xl md:text-8xl leading-none drop-shadow-lg">
          {p.emoji}
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow">
          {p.name}
        </h2>

        {p.vibe && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur text-xs font-semibold text-white tracking-wide">
            #{p.vibe}
          </div>
        )}

        <p className="text-lg md:text-xl text-white/90 font-medium italic max-w-xl">
          "{p.tagline}"
        </p>

        <p className="text-sm md:text-base text-white/80 max-w-lg">
          {p.description}
        </p>

        {topCategories && topCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {topCategories.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="px-3 py-1 rounded-full bg-black/25 backdrop-blur text-xs text-white/95"
              >
                {c.emoji} {t(`categories.${c.id}`) || c.label} {Math.round(c.ratio * 100)}%
              </span>
            ))}
          </div>
        )}

        {indices && (
          <div className="mt-4 w-full max-w-md grid grid-cols-2 gap-2">
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
            <Stat value={stats.total.toLocaleString()} label={t('personality.stats.total')} />
            <Stat value={stats.avgPerDay.toFixed(1)} label={t('personality.stats.avg')} />
            <Stat value={stats.uniqueChannels.toLocaleString()} label={t('personality.stats.channels')} />
          </div>
        )}

        {stats && stats.shortsCount > 0 && (
          <div className="text-xs text-white/75 mt-1">
            {t('personality.shortsFound', { n: stats.shortsCount.toLocaleString() })}
          </div>
        )}
      </div>

      {/* Runner-ups — "나와 가까운 유형 Top 3" */}
      {p.runnerUps && p.runnerUps.length > 0 && (
        <div className="relative z-10 mt-6">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-white/85 tracking-wide">
              {t('personality.runnerUpsTitle')}
            </span>
            <span className="text-[10px] text-white/60">
              {t('personality.runnerTotal', { n: RUNNER_TOTAL })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {p.runnerUps.slice(0, 3).map((ru, i) => (
              <RunnerCard key={ru.id} rank={i + 2} type={localize(t, ru)} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Compatibility — best/worst match. Strong viral hook: "내 친구랑 궁합은?" */}
      {(p.bestMatch || p.worstMatch) && (
        <CompatibilityBlock personality={p} t={t} />
      )}
    </div>
  );
}

function CompatibilityBlock({ personality, t }) {
  const bestRaw = PERSONALITIES[personality.bestMatch];
  const worstRaw = PERSONALITIES[personality.worstMatch];
  const best = bestRaw && {
    ...bestRaw,
    name: t(`personalities.${bestRaw.id}.name`) || bestRaw.name,
    tagline: t(`personalities.${bestRaw.id}.tagline`) || bestRaw.tagline,
  };
  const worst = worstRaw && {
    ...worstRaw,
    name: t(`personalities.${worstRaw.id}.name`) || worstRaw.name,
    tagline: t(`personalities.${worstRaw.id}.tagline`) || worstRaw.tagline,
  };
  return (
    <div className="relative z-10 mt-6 rounded-2xl bg-black/35 backdrop-blur border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white/90 tracking-wide inline-flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4" />
          {t('personality.compatibility.title')}
        </span>
        <span className="text-[10px] text-white/60">{t('personality.compatibility.compareWithFriend')}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {best && (
          <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/30 p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 font-semibold mb-1.5">
              <HeartHandshake className="w-3 h-3" />
              {t('personality.compatibility.best')}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-3xl drop-shadow">{best.emoji}</div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{best.name}</div>
                <div className="text-[10px] text-white/70 line-clamp-2 leading-snug mt-0.5">
                  {best.tagline}
                </div>
              </div>
            </div>
          </div>
        )}
        {worst && (
          <div className="rounded-xl bg-red-500/15 border border-red-400/30 p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-red-200 font-semibold mb-1.5">
              <Swords className="w-3 h-3" />
              {t('personality.compatibility.worst')}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-3xl drop-shadow">{worst.emoji}</div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{worst.name}</div>
                <div className="text-[10px] text-white/70 line-clamp-2 leading-snug mt-0.5">
                  {worst.tagline}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/80 bg-white/10 rounded-xl py-2">
        <Share2 className="w-3.5 h-3.5" />
        <span>{t('personality.compatibility.sharePrompt')}</span>
      </div>
    </div>
  );
}

const RUNNER_TOTAL = 22;

function RunnerCard({ rank, type, t }) {
  return (
    <div
      className="relative rounded-2xl p-3 bg-black/30 backdrop-blur border border-white/10 hover:bg-black/40 transition overflow-hidden"
    >
      {/* Gradient tint strip on left (nods to enneagram card style) */}
      <div
        className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${type.gradient}`}
      />
      <div className="pl-2">
        <div className="flex items-start justify-between">
          <div className="text-[10px] text-white/60 font-semibold">
            {t ? t('personality.runnerRank', { n: rank }) : `${rank}`}
          </div>
          <div className="text-[10px] text-white/50 tabular-nums">
            {t ? t('personality.runnerScore', { n: type.score }) : `${type.score}pt`}
          </div>
        </div>
        <div className="text-3xl leading-none mt-1 drop-shadow">{type.emoji}</div>
        <div className="text-[11px] font-bold text-white mt-1 leading-tight">
          {type.name}
        </div>
        <div className="text-[9px] text-white/70 mt-0.5 leading-snug line-clamp-2">
          {type.tagline}
        </div>
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
