import { useMemo, useState } from 'react';
import {
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  Target,
  CheckCircle2,
  XCircle,
  CircleDashed,
} from 'lucide-react';
import { loadHistory, clearHistory, deleteEntry } from '../utils/historyStorage';
import { loadAlgorithmTarget, describeCategory } from './AlgorithmGuide';
import { useT } from '../i18n/index.jsx';

function Delta({ current, prev, suffix = '', higherIsBetter = true, digits = 0, t }) {
  const diff = current - prev;
  if (Math.abs(diff) < 0.01) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-zinc-500">
        <Minus className="w-3 h-3" />
        {t ? t('changeTracker.noChange') : '변화없음'}
      </span>
    );
  }
  const positive = diff > 0;
  const good = higherIsBetter ? positive : !positive;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${good ? 'text-emerald-400' : 'text-red-400'}`}
    >
      {positive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {positive ? '+' : ''}
      {digits > 0 ? diff.toFixed(digits) : Math.round(diff)}
      {suffix}
    </span>
  );
}

// Locale tag map for date formatting (Intl-friendly).
const DATE_LOCALES = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };

function formatDate(iso, lang = 'ko') {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[lang] || 'ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChangeTracker() {
  const { t, lang } = useT();
  const [history, setHistory] = useState(() => loadHistory());

  const handleClear = () => {
    if (!window.confirm(t('changeTracker.confirmClearAll'))) return;
    clearHistory();
    setHistory([]);
  };

  const handleDelete = (id) => {
    deleteEntry(id);
    setHistory(loadHistory());
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <History className="w-10 h-10 text-zinc-700" />
        <p className="text-zinc-400 text-sm">{t('changeTracker.empty.title')}</p>
        <p className="text-zinc-600 text-xs">
          {t('changeTracker.empty.body')}
        </p>
      </div>
    );
  }

  if (history.length === 1) {
    return (
      <div className="space-y-4">
        <EntryCard entry={history[0]} onDelete={() => handleDelete(history[0].id)} t={t} lang={lang} />
        <p className="text-center text-xs text-zinc-600">
          {t('changeTracker.singleEntry')}
        </p>
      </div>
    );
  }

  // Compare latest two entries
  const [latest, previous] = history;
  const videoSfx = t('changeTracker.suffix.videos');
  const channelSfx = t('changeTracker.suffix.channels');

  return (
    <div className="space-y-5">
      {/* Algorithm Diet Report — pinned at top when user has set targets */}
      <DietReport previous={previous} latest={latest} t={t} />

      {/* Comparison card */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">{t('changeTracker.compareTitle')}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {formatDate(previous.date, lang)} → {formatDate(latest.date, lang)}
          </p>
        </div>
        <div className="p-5 space-y-4">
          {/* Personality change */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">{t('changeTracker.personality')}</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">
                {previous.personality.emoji} {t(`personalities.${previous.personality.id}.name`) || previous.personality.name}
              </span>
              <span className="text-zinc-700">→</span>
              <span className="text-zinc-100 font-medium">
                {latest.personality.emoji} {t(`personalities.${latest.personality.id}.name`) || latest.personality.name}
              </span>
              {latest.personality.id !== previous.personality.id && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-yt-orange/20 text-yt-orange">
                  {t('changeTracker.changed')}
                </span>
              )}
            </div>
          </div>

          {/* Stats comparison */}
          {[
            {
              label: t('changeTracker.labels.total'),
              curr: latest.stats.total,
              prev: previous.stats.total,
              suffix: videoSfx,
              higherIsBetter: true,
            },
            {
              label: t('changeTracker.labels.avg'),
              curr: latest.stats.avgPerDay,
              prev: previous.stats.avgPerDay,
              suffix: videoSfx,
              higherIsBetter: false,
              digits: 1,
            },
            {
              label: t('changeTracker.labels.channels'),
              curr: latest.stats.uniqueChannels,
              prev: previous.stats.uniqueChannels,
              suffix: channelSfx,
              higherIsBetter: true,
            },
            {
              label: t('changeTracker.labels.night'),
              curr: Math.round(latest.stats.nightRatio * 100),
              prev: Math.round(previous.stats.nightRatio * 100),
              suffix: '%',
              higherIsBetter: false,
            },
          ].map(({ label, curr, prev: p, suffix, higherIsBetter, digits }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400">{digits ? p.toFixed(digits) : p}{suffix}</span>
                <span className="text-zinc-700">→</span>
                <span className="text-sm font-medium text-zinc-100">
                  {digits ? curr.toFixed(digits) : curr}{suffix}
                </span>
                <Delta
                  current={curr}
                  prev={p}
                  suffix={suffix}
                  higherIsBetter={higherIsBetter}
                  digits={digits || 0}
                  t={t}
                />
              </div>
            </div>
          ))}

          {/* Top category change */}
          {latest.topCategories[0] && previous.topCategories[0] && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{t('changeTracker.labels.topCategory')}</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500">
                  {previous.topCategories[0].emoji} {t(`categories.${previous.topCategories[0].id}`) || previous.topCategories[0].label}
                </span>
                <span className="text-zinc-700">→</span>
                <span className="text-zinc-100 font-medium">
                  {latest.topCategories[0].emoji} {t(`categories.${latest.topCategories[0].id}`) || latest.topCategories[0].label}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full history list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-300">
            {t('changeTracker.historyHeading', { n: history.length })}
          </h3>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {t('changeTracker.deleteAll')}
          </button>
        </div>
        {history.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} t={t} lang={lang} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Algorithm Diet Report — compares saved target categories (user-picked in
// AlgorithmGuide) between previous and latest analysis.
// ---------------------------------------------------------------------------
function ratioFor(entry, catId) {
  if (!entry || !catId) return 0;
  const cats = entry.topCategories || entry.categoryDist || [];
  const hit = cats.find((c) => c.id === catId);
  return hit ? hit.ratio : 0;
}

function DietLine({ mode, catId, prev, curr, t }) {
  const meta = describeCategory(catId);
  if (!meta) return null;
  const pct = (n) => Math.round(n * 1000) / 10; // 1 decimal
  const diffP = pct(curr) - pct(prev);
  const absP = Math.abs(diffP);

  // For "want" mode: higher ratio = success. For "avoid": lower = success.
  const success = mode === 'want' ? diffP > 0.5 : diffP < -0.5;
  const flat = Math.abs(diffP) < 0.5;

  const targetLabel = mode === 'want'
    ? t('changeTracker.diet.labels.want')
    : t('changeTracker.diet.labels.avoid');
  // Localized category label (fallback to source meta).
  const catLabel = t(`categories.${catId}`) || meta.label;

  const tone = flat
    ? {
        bg: 'bg-zinc-800/40',
        border: 'border-zinc-700',
        icon: <CircleDashed className="w-5 h-5 text-zinc-400" />,
        title: t('changeTracker.diet.verdict.flat'),
        titleClass: 'text-zinc-300',
        msg:
          mode === 'want'
            ? t('changeTracker.diet.messages.wantFlat')
            : t('changeTracker.diet.messages.avoidFlat'),
      }
    : success
      ? {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: t('changeTracker.diet.verdict.success'),
          titleClass: 'text-emerald-300',
          msg:
            mode === 'want'
              ? t('changeTracker.diet.messages.wantWin', { n: diffP.toFixed(1) })
              : t('changeTracker.diet.messages.avoidWin', { n: Math.abs(diffP).toFixed(1) }),
        }
      : {
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          title: t('changeTracker.diet.verdict.fail'),
          titleClass: 'text-red-300',
          msg:
            mode === 'want'
              ? t('changeTracker.diet.messages.wantLose', { n: absP.toFixed(1) })
              : t('changeTracker.diet.messages.avoidLose', { n: absP.toFixed(1) }),
        };

  return (
    <div className={`rounded-xl border ${tone.border} ${tone.bg} p-4 space-y-2`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {tone.icon}
          <div className="min-w-0">
            <div className="text-xs text-zinc-500">
              {targetLabel} · <span className="text-zinc-400">{meta.emoji} {catLabel}</span>
            </div>
            <div className={`text-sm font-bold ${tone.titleClass}`}>{tone.title}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span className="text-zinc-500 tabular-nums">{pct(prev).toFixed(1)}%</span>
          <span className="text-zinc-700">→</span>
          <span className="text-zinc-100 font-semibold tabular-nums">{pct(curr).toFixed(1)}%</span>
          <span
            className={`tabular-nums font-semibold ${
              flat
                ? 'text-zinc-500'
                : success
                  ? 'text-emerald-400'
                  : 'text-red-400'
            }`}
          >
            ({diffP > 0 ? '+' : ''}
            {diffP.toFixed(1)}%p)
          </span>
        </div>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{tone.msg}</p>
    </div>
  );
}

function DietReport({ previous, latest, t }) {
  const target = useMemo(() => loadAlgorithmTarget(), []);
  if (!target || (!target.want && !target.avoid)) return null;

  const wantPrev = ratioFor(previous, target.want);
  const wantCurr = ratioFor(latest, target.want);
  const avoidPrev = ratioFor(previous, target.avoid);
  const avoidCurr = ratioFor(latest, target.avoid);

  return (
    <div className="rounded-2xl border border-yt-orange/30 bg-gradient-to-br from-yt-red/10 via-yt-orange/5 to-transparent overflow-hidden">
      <div className="px-5 py-4 border-b border-yt-orange/20 flex items-center gap-2">
        <Target className="w-4 h-4 text-yt-orange" />
        <h3 className="text-sm font-bold text-zinc-100">{t('changeTracker.diet.title')}</h3>
      </div>
      <div className="p-4 space-y-3">
        {target.want && (
          <DietLine mode="want" catId={target.want} prev={wantPrev} curr={wantCurr} t={t} />
        )}
        {target.avoid && (
          <DietLine mode="avoid" catId={target.avoid} prev={avoidPrev} curr={avoidCurr} t={t} />
        )}
        <p className="text-[11px] text-zinc-500">
          {t('changeTracker.diet.footer')}
        </p>
      </div>
    </div>
  );
}

function EntryCard({ entry, onDelete, t, lang }) {
  const persName = t ? (t(`personalities.${entry.personality.id}.name`) || entry.personality.name) : entry.personality.name;
  const topCat = entry.topCategories[0];
  const catLabel = topCat && t ? (t(`categories.${topCat.id}`) || topCat.label) : topCat?.label;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card border border-zinc-800">
      <span className="text-2xl">{entry.personality.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-100">{persName}</div>
        <div className="text-xs text-zinc-500 flex gap-2 mt-0.5">
          <span>{formatDate(entry.date, lang)}</span>
          <span>·</span>
          <span>{t ? t('changeTracker.entry.totalLine', { n: entry.stats.total.toLocaleString() }) : `총 ${entry.stats.total.toLocaleString()}편`}</span>
          <span>·</span>
          <span>{t ? t('changeTracker.entry.avgLine', { n: entry.stats.avgPerDay }) : `평균 ${entry.stats.avgPerDay}편/일`}</span>
        </div>
        {topCat && (
          <div className="text-xs text-zinc-600 mt-0.5">
            {t
              ? t('changeTracker.entry.topLine', {
                  label: `${topCat.emoji} ${catLabel}`,
                  n: Math.round(topCat.ratio * 100),
                })
              : `최다: ${topCat.emoji} ${catLabel} ${Math.round(topCat.ratio * 100)}%`}
          </div>
        )}
      </div>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
