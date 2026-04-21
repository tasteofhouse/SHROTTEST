import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Copy, Check, Link, Sparkles, Receipt, Trophy, IdCard } from 'lucide-react';

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const VARIANTS = [
  { id: 'classic', label: '클래식', icon: Sparkles },
  { id: 'receipt', label: '영수증', icon: Receipt },
  { id: 'tier',    label: '티어표', icon: Trophy },
  { id: 'idcard',  label: '신분증', icon: IdCard },
];

export default function ShareCard({ personality, topCategories, stats, indices }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [variant, setVariant] = useState('classic');

  const top3 = (topCategories || []).filter((c) => c.id !== 'etc').slice(0, 3);

  const shareText =
    `내 YouTube 취향은 ${personality.emoji} ${personality.name}!\n` +
    `"${personality.tagline}"\n\n` +
    (top3.length
      ? `Top 3: ${top3.map((c) => `${c.emoji} ${c.label}(${Math.round(c.ratio * 100)}%)`).join(' · ')}\n`
      : '') +
    `총 ${stats?.total?.toLocaleString() || 0}편을 봤어요 📱\n` +
    `#ShortsInsight #YouTube취향카드`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `shorts-insight-${personality.id}-${variant}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      alert('카드 생성에 실패했어요: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('클립보드 복사에 실패했어요.');
    }
  };

  const handleCopyLink = async () => {
    try {
      const payload = {
        p: personality.id,
        n: personality.name,
        e: personality.emoji,
        t: stats?.total || 0,
        top: top3.map((c) => ({ id: c.id, e: c.emoji, l: c.label, r: Math.round(c.ratio * 100) })),
      };
      const hash = btoa(encodeURIComponent(JSON.stringify(payload)));
      const url = `${window.location.origin}${window.location.pathname}#share=${hash}`;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      alert('링크 복사에 실패했어요.');
    }
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
  };

  return (
    <div className="space-y-5">
      {/* Variant picker */}
      <div className="flex flex-wrap gap-2 justify-center">
        {VARIANTS.map(({ id, label, icon: Icon }) => {
          const active = variant === id;
          return (
            <button
              key={id}
              onClick={() => setVariant(id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                active
                  ? 'bg-grad-yt text-white border-transparent shadow-glow'
                  : 'bg-bg-elevated text-zinc-300 border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Shareable card */}
      <div className="flex justify-center">
        <div ref={cardRef}>
          {variant === 'classic' && (
            <ClassicCard personality={personality} top3={top3} stats={stats} />
          )}
          {variant === 'receipt' && (
            <ReceiptCard personality={personality} top3={top3} stats={stats} indices={indices} />
          )}
          {variant === 'tier' && (
            <TierCard personality={personality} categories={topCategories} stats={stats} />
          )}
          {variant === 'idcard' && (
            <IdCardVariant personality={personality} top3={top3} stats={stats} indices={indices} />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-grad-yt text-white font-semibold shadow-glow hover:opacity-90 transition disabled:opacity-60 col-span-2"
        >
          <Download className="w-4 h-4" />
          {downloading ? '이미지 만드는 중...' : 'PNG로 저장'}
        </button>

        <button
          onClick={handleTwitter}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1DA1F2]/20 border border-[#1DA1F2]/40 text-[#1DA1F2] font-semibold hover:bg-[#1DA1F2]/30 transition"
        >
          <XIcon className="w-4 h-4" />
          트위터 공유
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-100 font-semibold hover:bg-zinc-800 transition"
        >
          {linkCopied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Link className="w-4 h-4" />
          )}
          {linkCopied ? '복사됨!' : '링크 복사'}
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-100 font-semibold hover:bg-zinc-800 transition col-span-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? '복사됨!' : '공유 문구 복사'}
        </button>
      </div>
    </div>
  );
}

/* ===================== VARIANT 1 — CLASSIC ===================== */
function ClassicCard({ personality, top3, stats }) {
  return (
    <div
      className={`w-[320px] aspect-[9/16] rounded-3xl p-6 relative overflow-hidden bg-gradient-to-br ${personality.gradient} shadow-glow-lg`}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, white 0, transparent 45%), radial-gradient(circle at 70% 90%, white 0, transparent 45%)',
        }}
      />
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest text-white/80 font-semibold">SHORTS INSIGHT</span>
          <span className="text-[10px] text-white/70">{new Date().toLocaleDateString('ko-KR')}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 -mt-2">
          <div className="text-7xl drop-shadow-lg">{personality.emoji}</div>
          <div className="text-white/80 text-xs font-medium tracking-wider">YOUR TYPE</div>
          <h3 className="text-3xl font-bold text-white drop-shadow leading-tight">{personality.name}</h3>
          {personality.vibe && (
            <div className="px-3 py-1 rounded-full bg-black/30 text-[11px] font-semibold text-white tracking-wide">
              #{personality.vibe}
            </div>
          )}
          <p className="text-white/90 text-sm italic px-4">"{personality.tagline}"</p>

          {top3.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2 w-full px-4">
              {top3.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/25 backdrop-blur"
                >
                  <span className="text-white text-xs font-medium">
                    {c.emoji} {c.label}
                  </span>
                  <span className="text-white/90 text-xs font-semibold">{Math.round(c.ratio * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-white/70 text-[10px]">TOTAL WATCHED</div>
            <div className="text-white text-xl font-bold">{stats?.total?.toLocaleString() || 0}</div>
          </div>
          <div className="text-right">
            <div className="text-white/70 text-[10px]">AVG / DAY</div>
            <div className="text-white text-xl font-bold">{stats?.avgPerDay?.toFixed(1) || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 2 — RECEIPT ===================== */
function ReceiptCard({ personality, top3, stats, indices }) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const orderNo = String(1000 + ((stats?.total || 0) % 9000)).padStart(4, '0');

  const bar = (v) => {
    const filled = Math.round((v || 0) / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled);
  };

  return (
    <div
      className="w-[320px] rounded-lg p-6 font-mono text-[12px] text-zinc-900 shadow-glow-lg"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, #fdfcf6 0px, #fdfcf6 24px, #f4f0e4 24px, #f4f0e4 25px)',
      }}
    >
      <div className="text-center mb-2">
        <div className="text-[10px] tracking-[0.35em]">YOUTUBE INSIGHT</div>
        <div className="text-[24px] font-black mt-0.5">RECEIPT</div>
        <div className="text-[10px] text-zinc-600 mt-1">
          {dateStr} · No.{orderNo}
        </div>
      </div>

      <div className="border-t border-b border-dashed border-zinc-500 py-2 my-3 text-center">
        <div className="text-xl leading-tight">
          {personality.emoji} {personality.name}
        </div>
        {personality.vibe && <div className="text-[10px] mt-1">#{personality.vibe}</div>}
        <div className="text-[10px] italic mt-1">"{personality.tagline}"</div>
      </div>

      <div className="space-y-1">
        {top3.map((c) => (
          <div key={c.id} className="flex justify-between">
            <span className="truncate pr-2">
              {c.emoji} {c.label} ×{c.count.toLocaleString()}
            </span>
            <span className="tabular-nums">{Math.round(c.ratio * 100)}%</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-zinc-500 my-3" />

      <div className="space-y-1 tabular-nums">
        <div className="flex justify-between">
          <span>총 시청</span>
          <span>{stats?.total?.toLocaleString() || 0} 편</span>
        </div>
        <div className="flex justify-between">
          <span>하루 평균</span>
          <span>{stats?.avgPerDay?.toFixed(1) || 0} 편</span>
        </div>
        <div className="flex justify-between">
          <span>본 채널</span>
          <span>{stats?.uniqueChannels?.toLocaleString() || 0} 개</span>
        </div>
        {stats?.shortsCount > 0 && (
          <div className="flex justify-between">
            <span>#shorts</span>
            <span>{stats.shortsCount.toLocaleString()} 편</span>
          </div>
        )}
      </div>

      {indices && (
        <>
          <div className="border-t border-dashed border-zinc-500 my-3" />
          <div className="space-y-0.5 text-[10px] leading-tight">
            <div>도파민   {bar(indices.dopamine)} {String(indices.dopamine).padStart(3)}</div>
            <div>야행성   {bar(indices.nocturnal)} {String(indices.nocturnal).padStart(3)}</div>
            <div>탐험력   {bar(indices.explorer)} {String(indices.explorer).padStart(3)}</div>
            <div>취향집중 {bar(indices.picky)} {String(indices.picky).padStart(3)}</div>
          </div>
        </>
      )}

      <div className="border-t border-dashed border-zinc-500 my-3" />
      <div className="text-center text-[10px]">
        <div>THANK YOU, SEE YOU AGAIN</div>
        <div className="mt-1">#YouTube취향영수증</div>
      </div>

      <div
        className="mt-3 h-7"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #111 0 2px, transparent 2px 4px, #111 4px 5px, transparent 5px 9px, #111 9px 11px, transparent 11px 14px)',
        }}
      />
    </div>
  );
}

/* ===================== VARIANT 3 — TIER LIST ===================== */
function TierCard({ personality, categories, stats }) {
  const rows = (categories || []).filter((c) => c.id !== 'etc' && c.count > 0);
  const tiers = [
    { label: 'S', min: 0.15, color: 'from-rose-500 to-red-500', items: [] },
    { label: 'A', min: 0.08, color: 'from-orange-400 to-amber-400', items: [] },
    { label: 'B', min: 0.03, color: 'from-emerald-500 to-teal-500', items: [] },
    { label: 'C', min: 0,    color: 'from-sky-500 to-indigo-500', items: [] },
  ];
  for (const c of rows) {
    for (const t of tiers) {
      if (c.ratio >= t.min) { t.items.push(c); break; }
    }
  }

  return (
    <div className="w-[320px] rounded-3xl p-6 bg-zinc-950 shadow-glow-lg border border-zinc-800 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-yt-red/30 to-transparent blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[10px] tracking-widest text-zinc-400 font-semibold">MY YOUTUBE</div>
          <div className="text-[10px] text-zinc-500">{new Date().toLocaleDateString('ko-KR')}</div>
        </div>
        <h3 className="text-2xl font-black text-white mb-4">TIER LIST 🏆</h3>

        <div className="space-y-2">
          {tiers.map((t) => (
            <div key={t.label} className="flex items-stretch gap-2 min-h-[44px]">
              <div
                className={`w-10 shrink-0 rounded-lg flex items-center justify-center font-black text-lg text-white bg-gradient-to-br ${t.color}`}
              >
                {t.label}
              </div>
              <div className="flex-1 rounded-lg bg-zinc-900 border border-zinc-800 p-2 flex flex-wrap gap-1.5 items-center">
                {t.items.length === 0 ? (
                  <span className="text-zinc-600 text-[10px] italic">— 없음 —</span>
                ) : (
                  t.items.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 text-[11px] text-white"
                    >
                      <span className="text-sm leading-none">{c.emoji}</span>
                      <span className="font-medium">{c.label}</span>
                      <span className="text-zinc-400 tabular-nums text-[10px]">
                        {Math.round(c.ratio * 100)}%
                      </span>
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-4 rounded-xl p-3 bg-gradient-to-br ${personality.gradient} flex items-center gap-3`}
        >
          <div className="text-4xl">{personality.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-bold leading-tight truncate">{personality.name}</div>
            <div className="text-white/85 text-[10px]">
              {stats?.total?.toLocaleString() || 0}편 · {stats?.uniqueChannels?.toLocaleString() || 0}채널
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-zinc-500 mt-3">#내YT티어표</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 4 — ID CARD ===================== */
function IdCardVariant({ personality, top3, stats, indices }) {
  const issued = new Date();
  const expires = new Date(issued.getFullYear() + 1, issued.getMonth(), issued.getDate());
  const fmt = (d) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  const memberNo = `YT-${String(stats?.total || 0).padStart(6, '0').slice(-6)}`;

  return (
    <div
      className="w-[320px] rounded-2xl p-0.5 shadow-glow-lg"
      style={{ background: 'linear-gradient(135deg, #FF0000 0%, #FF4B6E 50%, #FF8A3D 100%)' }}
    >
      <div className="rounded-[14px] bg-zinc-950 p-5 text-white">
        {/* Header band */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-yt-red font-bold">YOUTUBE ID</div>
            <div className="text-[9px] text-zinc-500">MEMBERSHIP CARD</div>
          </div>
          <div className="w-10 h-7 rounded-sm bg-gradient-to-br from-amber-300 to-yellow-600 shadow-inner" />
        </div>

        {/* Photo + info */}
        <div className="flex gap-4 items-center">
          <div
            className={`w-24 h-28 rounded-lg bg-gradient-to-br ${personality.gradient} flex items-center justify-center shrink-0 relative overflow-hidden`}
          >
            <div className="text-6xl drop-shadow-lg">{personality.emoji}</div>
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 20%, white 0, transparent 50%), radial-gradient(circle at 80% 80%, white 0, transparent 50%)',
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-zinc-500">TYPE</div>
            <div className="text-lg font-bold leading-tight truncate">{personality.name}</div>
            {personality.vibe && (
              <div className="text-[10px] text-yt-pink font-semibold mt-0.5">#{personality.vibe}</div>
            )}
            <div className="text-[10px] text-zinc-500 mt-2">MEMBER NO.</div>
            <div className="text-xs font-mono tracking-wider">{memberNo}</div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <Chip label="TOTAL" value={stats?.total?.toLocaleString() || 0} />
          <Chip label="CHANNELS" value={stats?.uniqueChannels?.toLocaleString() || 0} />
          <Chip label="AVG/DAY" value={stats?.avgPerDay?.toFixed(1) || 0} />
        </div>

        {/* Categories */}
        {top3.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {top3.map((c) => (
              <span key={c.id} className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px]">
                {c.emoji} {c.label} {Math.round(c.ratio * 100)}%
              </span>
            ))}
          </div>
        )}

        {/* Indices mini */}
        {indices && (
          <div className="grid grid-cols-4 gap-1.5 mt-3">
            {[
              { k: 'dopamine',  l: '도파민' },
              { k: 'nocturnal', l: '야행성' },
              { k: 'explorer',  l: '탐험력' },
              { k: 'picky',     l: '집중도' },
            ].map(({ k, l }) => (
              <div key={k} className="rounded-md bg-zinc-900 border border-zinc-800 px-1 py-1 text-center">
                <div className="text-[9px] text-zinc-500">{l}</div>
                <div className="text-xs font-bold text-white tabular-nums">{indices[k]}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer: dates + barcode */}
        <div className="flex items-end justify-between mt-4">
          <div className="text-[9px] text-zinc-500 leading-tight">
            <div>ISSUED {fmt(issued)}</div>
            <div>EXPIRES {fmt(expires)}</div>
          </div>
          <div
            className="h-7 w-28"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #e5e7eb 0 2px, transparent 2px 4px, #e5e7eb 4px 5px, transparent 5px 9px, #e5e7eb 9px 11px, transparent 11px 14px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div className="rounded-lg bg-zinc-900 border border-zinc-800 px-2 py-1.5">
      <div className="text-[9px] text-zinc-500">{label}</div>
      <div className="text-sm font-bold text-white tabular-nums">{value}</div>
    </div>
  );
}
