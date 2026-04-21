import { useState } from 'react';
import { Trash2, TrendingUp, TrendingDown, Minus, History } from 'lucide-react';
import { loadHistory, clearHistory, deleteEntry } from '../utils/historyStorage';

function Delta({ current, prev, suffix = '', higherIsBetter = true, digits = 0 }) {
  const diff = current - prev;
  if (Math.abs(diff) < 0.01) {
    return (
      <span className="flex items-center gap-0.5 text-xs text-zinc-500">
        <Minus className="w-3 h-3" />
        변화없음
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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChangeTracker() {
  const [history, setHistory] = useState(() => loadHistory());

  const handleClear = () => {
    if (!window.confirm('모든 분석 히스토리를 삭제할까요?')) return;
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
        <p className="text-zinc-400 text-sm">아직 저장된 분석 기록이 없어요.</p>
        <p className="text-zinc-600 text-xs">
          분석을 완료하면 자동으로 여기에 저장됩니다.
        </p>
      </div>
    );
  }

  if (history.length === 1) {
    return (
      <div className="space-y-4">
        <EntryCard entry={history[0]} onDelete={() => handleDelete(history[0].id)} />
        <p className="text-center text-xs text-zinc-600">
          분석을 한 번 더 하면 변화를 비교할 수 있어요.
        </p>
      </div>
    );
  }

  // Compare latest two entries
  const [latest, previous] = history;

  return (
    <div className="space-y-5">
      {/* Comparison card */}
      <div className="rounded-2xl border border-zinc-800 bg-bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-100">최근 2회 비교</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {formatDate(previous.date)} → {formatDate(latest.date)}
          </p>
        </div>
        <div className="p-5 space-y-4">
          {/* Personality change */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">시청 유형</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">
                {previous.personality.emoji} {previous.personality.name}
              </span>
              <span className="text-zinc-700">→</span>
              <span className="text-zinc-100 font-medium">
                {latest.personality.emoji} {latest.personality.name}
              </span>
              {latest.personality.id !== previous.personality.id && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-yt-orange/20 text-yt-orange">
                  변화
                </span>
              )}
            </div>
          </div>

          {/* Stats comparison */}
          {[
            {
              label: '총 시청',
              curr: latest.stats.total,
              prev: previous.stats.total,
              suffix: '편',
              higherIsBetter: true,
            },
            {
              label: '하루 평균',
              curr: latest.stats.avgPerDay,
              prev: previous.stats.avgPerDay,
              suffix: '편',
              higherIsBetter: false,
              digits: 1,
            },
            {
              label: '본 채널 수',
              curr: latest.stats.uniqueChannels,
              prev: previous.stats.uniqueChannels,
              suffix: '개',
              higherIsBetter: true,
            },
            {
              label: '새벽 시청',
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
                />
              </div>
            </div>
          ))}

          {/* Top category change */}
          {latest.topCategories[0] && previous.topCategories[0] && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">최다 카테고리</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-zinc-500">
                  {previous.topCategories[0].emoji} {previous.topCategories[0].label}
                </span>
                <span className="text-zinc-700">→</span>
                <span className="text-zinc-100 font-medium">
                  {latest.topCategories[0].emoji} {latest.topCategories[0].label}
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
            전체 히스토리 ({history.length}회)
          </h3>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            전체 삭제
          </button>
        </div>
        {history.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={() => handleDelete(entry.id)} />
        ))}
      </div>
    </div>
  );
}

function EntryCard({ entry, onDelete }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-card border border-zinc-800">
      <span className="text-2xl">{entry.personality.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-zinc-100">{entry.personality.name}</div>
        <div className="text-xs text-zinc-500 flex gap-2 mt-0.5">
          <span>{formatDate(entry.date)}</span>
          <span>·</span>
          <span>총 {entry.stats.total.toLocaleString()}편</span>
          <span>·</span>
          <span>평균 {entry.stats.avgPerDay}편/일</span>
        </div>
        {entry.topCategories[0] && (
          <div className="text-xs text-zinc-600 mt-0.5">
            최다: {entry.topCategories[0].emoji} {entry.topCategories[0].label}{' '}
            {Math.round(entry.topCategories[0].ratio * 100)}%
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
