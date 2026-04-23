import { Flame, Clock, Sparkles } from 'lucide-react';
import { buildRealityCheck } from '../utils/realityCheck';

// Color bands for the dopamine gauge — stays aligned with detectPersonality
// dopamineLevel baseline thresholds.
function gaugeToneFor(value) {
  if (value >= 85) return {
    from: 'from-red-500', to: 'to-orange-400', text: 'text-red-300',
    badge: 'bg-red-500/20 border-red-500/40 text-red-200',
    verdict: '🚨 빨간불 — 지금 당장 스크롤 내려놓기',
  };
  if (value >= 70) return {
    from: 'from-orange-500', to: 'to-amber-400', text: 'text-orange-300',
    badge: 'bg-orange-500/20 border-orange-500/40 text-orange-200',
    verdict: '⚠️ 주의 — 한 번만 더가 10분 뒤',
  };
  if (value >= 50) return {
    from: 'from-yellow-400', to: 'to-lime-400', text: 'text-yellow-300',
    badge: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-100',
    verdict: '🟡 보통 — 적당히 즐기는 중',
  };
  if (value >= 30) return {
    from: 'from-emerald-500', to: 'to-cyan-400', text: 'text-emerald-300',
    badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200',
    verdict: '🟢 안전 — 건강한 시청 습관',
  };
  return {
    from: 'from-sky-500', to: 'to-indigo-400', text: 'text-sky-300',
    badge: 'bg-sky-500/15 border-sky-500/30 text-sky-200',
    verdict: '💎 절제러 — 유튜브보다 할 일 많은 분',
  };
}

// Combines personality.dopamineLevel (baseline) with indices.dopamine (live
// measurement from viewing stats) — weighted 40/60 toward the live reading.
function finalDopamineScore(personality, indices) {
  const baseline = personality?.dopamineLevel ?? 50;
  const live = indices?.dopamine ?? baseline;
  return Math.round(baseline * 0.4 + live * 0.6);
}

export default function DopamineBlock({ personality, indices, stats, sourceCounts }) {
  const value = finalDopamineScore(personality, indices);
  const tone = gaugeToneFor(value);
  const reality = buildRealityCheck({ sourceCounts, stats });

  return (
    <section className="rounded-3xl border border-zinc-800 bg-bg-card overflow-hidden">
      {/* Dopamine gauge */}
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Dopamine Index
            </div>
            <h3 className="text-lg md:text-xl font-bold text-zinc-100 mt-0.5">
              도파민 중독 지수
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              시청 패턴 + 유형 기반으로 계산한 의존도
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`text-4xl md:text-5xl font-black tabular-nums ${tone.text}`}>
              {value}
            </div>
            <div className="text-[10px] text-zinc-500 tracking-wider">/ 100</div>
          </div>
        </div>

        <div className="relative h-4 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${tone.from} ${tone.to} shadow-glow transition-all duration-700`}
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
          {/* Risk zone markers */}
          {[30, 50, 70, 85].map((mark) => (
            <div
              key={mark}
              className="absolute top-0 bottom-0 w-px bg-black/30"
              style={{ left: `${mark}%` }}
            />
          ))}
        </div>

        <div className={`mt-3 text-sm font-semibold px-3 py-2 rounded-xl border ${tone.badge} inline-flex items-center gap-2`}>
          {tone.verdict}
        </div>
      </div>

      {/* Reality check */}
      {reality.seconds > 0 && (
        <div className="border-t border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900/20 p-5 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold tracking-wide uppercase">
                <Clock className="w-3.5 h-3.5 text-yt-orange" />
                Reality Check
              </div>
              <h3 className="text-lg md:text-xl font-bold text-zinc-100 mt-0.5">
                현타 타임 — 이 시간이면…
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                일반 영상 5분 · 쇼츠 30초 기준 추정치
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xl md:text-2xl font-extrabold text-yt-orange tabular-nums">
                {reality.durationText}
              </div>
              {reality.perDayMinutes > 0 && (
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  하루 평균 {Math.round(reality.perDayMinutes)}분
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {reality.alternatives.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl bg-bg-elevated border border-zinc-800 px-3 py-3 flex flex-col items-start gap-1 hover:border-yt-orange/50 transition"
              >
                <div className="text-2xl">{a.emoji}</div>
                <div className="text-lg font-bold text-zinc-100 tabular-nums leading-none">
                  {a.display}
                  <span className="text-xs font-medium text-zinc-400 ml-0.5">{a.unit}</span>
                </div>
                <div className="text-[11px] text-zinc-500 leading-tight">{a.label}</div>
                <div className="text-[10px] text-zinc-600 leading-tight mt-0.5">
                  {a.verb}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
            <Sparkles className="w-3.5 h-3.5 text-yt-pink" />
            <span>
              지금 이 순간도 누군가는 한라산에 오르고 있어요. 결정은 당신의 몫.
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
