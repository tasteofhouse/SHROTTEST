import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Download, Copy, Check, Link, Shuffle,
  Sparkles, Receipt, Trophy, IdCard,
  MessageCircle, Stethoscope, NotebookPen, Newspaper,
  Stamp, Camera, Ticket, Megaphone, MailOpen, Film,
  UtensilsCrossed, Award, Plane, Disc3, Zap,
  Tv, Circle, Star, Mail, Crown, Gift,
  Dice5, Gamepad2, StickyNote, BarChart3, Moon as MoonIcon,
} from 'lucide-react';

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const VARIANTS = [
  { id: 'classic',     label: '클래식',    icon: Sparkles },
  { id: 'profile',     label: '프로필',    icon: MessageCircle },
  { id: 'diagnosis',   label: '진단서',    icon: Stethoscope },
  { id: 'diary',       label: '다이어리',  icon: NotebookPen },
  { id: 'magazine',    label: '매거진',    icon: Newspaper },
  { id: 'receipt',     label: '영수증',    icon: Receipt },
  { id: 'tier',        label: '티어표',    icon: Trophy },
  { id: 'idcard',      label: '신분증',    icon: IdCard },
  { id: 'stamp',       label: '스탬프',    icon: Stamp },
  { id: 'polaroid',    label: '폴라로이드', icon: Camera },
  { id: 'ticket',      label: '티켓',      icon: Ticket },
  { id: 'notice',      label: '공고문',    icon: Megaphone },
  { id: 'postcard',    label: '엽서',      icon: MailOpen },
  { id: 'manga',       label: '만화',      icon: Film },
  { id: 'menu',        label: '메뉴판',    icon: UtensilsCrossed },
  { id: 'badge',       label: '뱃지',      icon: Award },
  { id: 'passport',    label: '여권',      icon: Plane },
  { id: 'vinyl',       label: '레코드',    icon: Disc3 },
  { id: 'neon',        label: '네온',      icon: Zap },
  { id: 'retro',       label: '레트로',    icon: Tv },
  { id: 'minimal',     label: '미니멀',    icon: Circle },
  { id: 'glitter',     label: '글리터',    icon: Star },
  { id: 'envelope',    label: '편지',      icon: Mail },
  { id: 'wanted',      label: '현상수배',  icon: Crown },
  { id: 'certificate', label: '상장',      icon: Gift },
  { id: 'boardgame',   label: '보드게임',  icon: Dice5 },
  { id: 'arcade',      label: '아케이드',  icon: Gamepad2 },
  { id: 'stickernote', label: '스티커',    icon: StickyNote },
  { id: 'chart',       label: '차트',      icon: BarChart3 },
  { id: 'horoscope',   label: '별자리',    icon: MoonIcon },
];

export default function ShareCard({ personality, topCategories, stats, indices }) {
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [variant, setVariant] = useState('classic');

  const top3 = (topCategories || []).filter((c) => c.id !== 'etc').slice(0, 3);

  const pickRandomVariant = () => {
    const others = VARIANTS.filter((v) => v.id !== variant);
    const next = others[Math.floor(Math.random() * others.length)];
    setVariant(next.id);
  };

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
        g: personality.gradient,
        v: personality.vibe,
        tg: personality.tagline,
        t: stats?.total || 0,
        a: Math.round((stats?.avgPerDay || 0) * 10) / 10,
        u: stats?.uniqueChannels || 0,
        h: stats?.peakHour || 0,
        d: stats?.peakDay || '',
        sd: stats?.spanDays || 0,
        sc: stats?.shortsCount || 0,
        top: top3.map((c) => ({ id: c.id, e: c.emoji, l: c.label, r: Math.round(c.ratio * 100), c: c.count })),
        i: indices ? {
          dopamine: indices.dopamine ?? 0,
          nocturnal: indices.nocturnal ?? 0,
          explorer: indices.explorer ?? 0,
          picky: indices.picky ?? 0,
          loyalty: indices.loyalty ?? 0,
          binge: indices.binge ?? 0,
          weekend: indices.weekend ?? 0,
          morning: indices.morning ?? 0,
          shortsness: indices.shortsness ?? 0,
          steady: indices.steady ?? 0,
        } : null,
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

      {/* Random picker */}
      <div className="flex justify-center">
        <button
          onClick={pickRandomVariant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-elevated border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-800 transition"
        >
          <Shuffle className="w-3.5 h-3.5" />
          랜덤 (총 {VARIANTS.length}종)
        </button>
      </div>

      {/* Shareable card */}
      <div className="flex justify-center">
        <div ref={cardRef}>
          <VariantSwitch
            variant={variant}
            personality={personality}
            top3={top3}
            stats={stats}
            indices={indices}
            topCategories={topCategories}
          />
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

/* Helpers shared across psych-test style variants */
function traitsFor(personality, stats, indices, top3) {
  const i = indices || {};
  const traits = [];
  if (i.dopamine >= 70) traits.push('도파민에 영혼을 맡김');
  else if (i.dopamine >= 40) traits.push('적당한 자극 러버');
  else traits.push('차분한 시청 스타일');

  if (i.nocturnal >= 35) traits.push('새벽형 올빼미 체질');
  else if (stats?.peakHour >= 22 || stats?.peakHour <= 2) traits.push('자기 전 한 컷이 국룰');
  else traits.push(`${stats?.peakHour || 0}시쯤 가장 활발`);

  if (i.explorer >= 70) traits.push('알고리즘이 날 못 읽음');
  else if (i.picky >= 70) traits.push('취향 한 우물 파는 중');
  else traits.push('적당히 다양하게 탐색');

  if (top3?.[0]) traits.push(`${top3[0].label} 편애 중`);
  return traits;
}

function prosConsFor(personality, stats, indices) {
  const pros = [];
  const cons = [];
  const i = indices || {};
  if (i.explorer >= 60) pros.push('호기심 왕성');
  if (i.picky >= 60) pros.push('취향이 확고함');
  if (stats?.avgPerDay >= 20) pros.push('콘텐츠 리터러시');
  if (i.dopamine < 50) pros.push('자제력 탑재');
  if (pros.length < 3) pros.push('관찰력 좋음', '트렌드 감지', '선별 능력');

  if (i.dopamine >= 60) cons.push('한 번 켜면 못 끔');
  if (i.nocturnal >= 35) cons.push('수면 부채 증가');
  if (stats?.avgPerDay >= 50) cons.push('생산성 vs 콘텐츠 줄다리기');
  if (i.picky >= 70) cons.push('시야가 좁아질 수 있음');
  if (cons.length < 2) cons.push('가끔 알고리즘에 휘둘림');

  return { pros: pros.slice(0, 3), cons: cons.slice(0, 2) };
}

/* ===================== VARIANT 5 — PROFILE (동물티콘 스타일) ===================== */
function ProfileCard({ personality, top3, stats, indices }) {
  const traits = traitsFor(personality, stats, indices, top3);
  const { pros, cons } = prosConsFor(personality, stats, indices);

  return (
    <div
      className="w-[320px] rounded-3xl p-5 shadow-glow-lg relative overflow-hidden"
      style={{
        backgroundColor: '#ffe9f1',
        backgroundImage:
          'linear-gradient(#ffffff80 1px, transparent 1px), linear-gradient(90deg, #ffffff80 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {/* decorative sparkles */}
      <div className="absolute top-3 right-4 text-xl">✨</div>
      <div className="absolute bottom-20 left-3 text-sm">⭐</div>
      <div className="absolute top-28 right-5 text-xs">♡</div>

      {/* Title */}
      <div className="text-center mb-3">
        <div className="text-[10px] text-pink-500 tracking-[0.3em] font-bold">YOUTUBE TYPE TEST</div>
        <h3 className="text-2xl font-black text-zinc-900 mt-0.5">내 취향 프로필</h3>
      </div>

      {/* Character bubble */}
      <div className="flex items-start gap-2 mb-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white border-4 border-pink-300 flex items-center justify-center text-5xl shrink-0 shadow">
            {personality.emoji}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-pink-400 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
            NEW
          </div>
        </div>
        <div className="flex-1 relative bg-white rounded-2xl rounded-tl-none px-3 py-2 border-2 border-pink-200 shadow-sm">
          <div className="text-[10px] text-pink-400 font-bold">{personality.vibe || 'MY TYPE'}</div>
          <div className="text-base font-black text-zinc-900 leading-tight">{personality.name}</div>
          <div className="text-[10px] text-zinc-600 italic mt-0.5">"{personality.tagline}"</div>
        </div>
      </div>

      {/* 특징 section */}
      <div className="bg-white rounded-2xl p-3 border-2 border-pink-200 mb-2">
        <div className="text-[11px] font-black text-pink-500 mb-1.5">📌 특징</div>
        <ul className="space-y-1">
          {traits.map((t, i) => (
            <li key={i} className="text-[11px] text-zinc-800 flex items-start gap-1.5">
              <span className="text-pink-400 mt-0.5">✔</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pros & cons */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-2.5 border-2 border-pink-200">
          <div className="text-[10px] font-black text-pink-500 mb-1">💗 장점</div>
          <ul className="space-y-0.5">
            {pros.map((p, i) => (
              <li key={i} className="text-[10px] text-zinc-800">• {p}</li>
            ))}
          </ul>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-2.5 border-2 border-violet-200">
          <div className="text-[10px] font-black text-violet-500 mb-1">💭 단점</div>
          <ul className="space-y-0.5">
            {cons.map((c, i) => (
              <li key={i} className="text-[10px] text-zinc-800">• {c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <div className="inline-block bg-white rounded-full px-3 py-1 border-2 border-pink-200 text-[10px] text-zinc-700">
          총 <b>{stats?.total?.toLocaleString() || 0}</b>편 · 채널 <b>{stats?.uniqueChannels?.toLocaleString() || 0}</b>개
        </div>
        <div className="text-[9px] text-pink-400 mt-1.5">#내유튜브프로필</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 6 — DIAGNOSIS (주의보 스타일) ===================== */
function DiagnosisCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const severity = Math.round(((i.dopamine || 0) + (i.nocturnal || 0) * 0.7 + Math.min(100, (stats?.avgPerDay || 0))) / 2.7);
  const sevLabel = severity >= 75 ? '심각' : severity >= 50 ? '주의' : severity >= 25 ? '관찰' : '안전';
  const sevColor = severity >= 75 ? 'bg-red-500' : severity >= 50 ? 'bg-orange-500' : severity >= 25 ? 'bg-amber-400' : 'bg-emerald-500';

  const symptoms = [];
  if (stats?.avgPerDay >= 20) symptoms.push(`하루 ${stats.avgPerDay.toFixed(1)}편 시청 기록`);
  if (i.nocturnal >= 25) symptoms.push(`새벽 시청 비율 ${i.nocturnal}%`);
  if (i.dopamine >= 50) symptoms.push(`도파민 지수 ${i.dopamine} 측정`);
  if (stats?.uniqueChannels >= 1000) symptoms.push(`채널 ${stats.uniqueChannels.toLocaleString()}개 무분별 구독`);
  if (top3?.[0]) symptoms.push(`${top3[0].label} 카테고리 편식 소견`);
  if (symptoms.length < 3) symptoms.push('YouTube 알고리즘 의존 징후');

  const prescriptions = [
    i.nocturnal >= 35 ? '12시 이후 YouTube 앱 잠금' : '저녁 시간대 시청 루틴 유지',
    i.dopamine >= 70 ? '하루 1회 "쇼츠 금식" 권장' : '적정량 유지 중',
    i.explorer >= 70 ? '가끔은 한 채널 정주행도 ❤️' : '새 채널 탐험 추천',
  ];

  return (
    <div className="w-[320px] rounded-3xl p-5 shadow-glow-lg bg-gradient-to-br from-rose-50 to-pink-100 border-4 border-rose-300 relative overflow-hidden">
      <div className="absolute top-2 right-3 text-3xl opacity-30">⚠️</div>

      {/* Header */}
      <div className="text-center mb-3">
        <div className="inline-flex items-center gap-1 text-rose-600 text-[10px] font-black tracking-[0.3em]">
          <span>⚠</span>
          <span>YOUTUBE 증후군 진단서</span>
          <span>⚠</span>
        </div>
        <h3 className="text-xl font-black text-zinc-900 mt-1">두근두근 시청 주의보</h3>
        <div className="text-[9px] text-zinc-500 mt-1">발행일 {new Date().toLocaleDateString('ko-KR')}</div>
      </div>

      {/* Patient card */}
      <div className="bg-white rounded-2xl p-3 mb-3 border-2 border-rose-200">
        <div className="flex items-center gap-3">
          <div className="text-5xl">{personality.emoji}</div>
          <div className="flex-1">
            <div className="text-[10px] text-rose-500 font-bold">진단명</div>
            <div className="text-base font-black text-zinc-900 leading-tight">{personality.name}</div>
            {personality.vibe && (
              <div className="text-[10px] text-zinc-500">유형: #{personality.vibe}</div>
            )}
          </div>
        </div>
      </div>

      {/* Severity meter */}
      <div className="bg-white rounded-2xl p-3 mb-3 border-2 border-rose-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black text-zinc-700">위험도</span>
          <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-full ${sevColor}`}>
            {sevLabel} · {severity}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
          <div className={`h-full ${sevColor}`} style={{ width: `${severity}%` }} />
        </div>
      </div>

      {/* Symptoms */}
      <div className="bg-white rounded-2xl p-3 mb-3 border-2 border-rose-200">
        <div className="text-[11px] font-black text-rose-500 mb-1.5">📋 관찰된 증상</div>
        <ul className="space-y-1">
          {symptoms.slice(0, 4).map((s, idx) => (
            <li key={idx} className="text-[11px] text-zinc-800 flex items-start gap-1.5">
              <span className="inline-block w-3 h-3 rounded border-2 border-rose-400 bg-rose-100 text-[9px] leading-[8px] text-rose-500 text-center font-black shrink-0 mt-0.5">
                ✓
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Prescription */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-3 border-2 border-emerald-200">
        <div className="text-[11px] font-black text-emerald-600 mb-1.5">💊 처방</div>
        <ul className="space-y-0.5">
          {prescriptions.map((p, idx) => (
            <li key={idx} className="text-[10px] text-zinc-800">· {p}</li>
          ))}
        </ul>
      </div>

      <div className="text-center text-[10px] text-rose-400 mt-3 font-bold">#YouTube진단서</div>
    </div>
  );
}

/* ===================== VARIANT 7 — DIARY (노트 스타일) ===================== */
function DiaryCard({ personality, top3, stats, indices }) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];

  return (
    <div className="w-[320px] relative">
      {/* washi tape top */}
      <div
        className="absolute -top-2 left-8 w-20 h-6 rotate-[-6deg] z-10 opacity-90"
        style={{ backgroundColor: '#ffd6e0', backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, #ffffff50 6px 9px)' }}
      />
      <div
        className="absolute -top-2 right-6 w-16 h-5 rotate-[8deg] z-10 opacity-90"
        style={{ backgroundColor: '#c9e5ff', backgroundImage: 'repeating-linear-gradient(-45deg, transparent 0 6px, #ffffff50 6px 9px)' }}
      />

      <div
        className="rounded-2xl p-6 shadow-glow-lg"
        style={{
          backgroundColor: '#fffdf6',
          backgroundImage:
            'linear-gradient(#f0ecda 1px, transparent 1px)',
          backgroundSize: '100% 22px',
          backgroundPosition: '0 32px',
        }}
      >
        {/* Date header */}
        <div className="flex items-end justify-between border-b-2 border-dashed border-rose-200 pb-2 mb-3">
          <div>
            <div className="text-[22px] font-black text-rose-500 leading-none">
              {dateStr}
            </div>
            <div className="text-[10px] text-zinc-500 mt-1">{weekday}요일 · 나의 YouTube 일기</div>
          </div>
          <div className="text-2xl">📓</div>
        </div>

        {/* Mood sticker + name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-dashed border-orange-300 flex items-center justify-center text-4xl">
            {personality.emoji}
          </div>
          <div>
            <div className="text-[10px] text-zinc-500">오늘의 나는…</div>
            <div className="text-lg font-black text-zinc-900 leading-tight">{personality.name}</div>
            {personality.vibe && (
              <div className="text-[10px] text-rose-500">#{personality.vibe}</div>
            )}
          </div>
        </div>

        {/* Journal entry */}
        <div className="text-[12px] text-zinc-800 leading-[22px] italic space-y-0">
          <p>"{personality.tagline}"</p>
          <p>✏️ 오늘 본 영상 <b>{stats?.total?.toLocaleString() || 0}</b>편!</p>
          <p>🎀 가장 좋아한 카테고리:</p>
          {top3.map((c) => (
            <p key={c.id} className="pl-3">
              ⭐ {c.emoji} {c.label} ({Math.round(c.ratio * 100)}%)
            </p>
          ))}
          <p>
            🕒 피크는 <b>{stats?.peakHour || 0}시</b>, {stats?.peakDay || '?'}요일 집중
          </p>
          <p>🏠 발굴한 채널 <b>{stats?.uniqueChannels?.toLocaleString() || 0}</b>개</p>
        </div>

        {/* Sticker row */}
        <div className="mt-3 pt-3 border-t-2 border-dashed border-rose-200 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="inline-block px-2 py-0.5 rounded-full bg-pink-100 border border-pink-300 text-[9px] text-pink-600 font-bold">
              D-{stats?.spanDays || 1}
            </span>
            <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 border border-sky-300 text-[9px] text-sky-600 font-bold">
              채널 {stats?.uniqueChannels?.toLocaleString() || 0}
            </span>
          </div>
          <div className="text-2xl">🌸</div>
        </div>

        <div className="text-center text-[10px] text-rose-400 mt-2 font-bold">#내YT다이어리</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 8 — MAGAZINE (Snowww 스타일) ===================== */
function MagazineCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const blocks = [
    { bg: '#ffd9e0', fg: '#c2185b', title: '🔎 프로필', lines: [
      `유형  ${personality.name}`,
      `바이브  #${personality.vibe || '유튜버'}`,
      `한 줄  "${personality.tagline}"`,
    ]},
    { bg: '#fff0b8', fg: '#9a6400', title: '📊 통계', lines: [
      `총  ${stats?.total?.toLocaleString() || 0}편`,
      `평균  ${stats?.avgPerDay?.toFixed(1) || 0}편/일`,
      `채널  ${stats?.uniqueChannels?.toLocaleString() || 0}개`,
    ]},
    { bg: '#c8e9ff', fg: '#0d4a7a', title: '🎯 TOP 3', lines: top3.map((c) => `${c.emoji} ${c.label}  ${Math.round(c.ratio * 100)}%`) },
    { bg: '#d8f3d1', fg: '#2b6e1c', title: '⚡ 지수', lines: [
      `도파민 ${i.dopamine ?? 0} · 야행성 ${i.nocturnal ?? 0}`,
      `탐험력 ${i.explorer ?? 0} · 집중도 ${i.picky ?? 0}`,
    ]},
  ];

  return (
    <div
      className="w-[320px] p-5 shadow-glow-lg relative"
      style={{ backgroundColor: '#111' }}
    >
      {/* Title block — multicolor */}
      <div className="relative mb-3">
        <div className="flex flex-wrap gap-1">
          {['YOU', 'TUBE', 'TYPE', 'ZINE'].map((w, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-black font-black text-2xl tracking-tight"
              style={{ backgroundColor: ['#ff5577', '#ffcc33', '#66ddaa', '#6699ff'][idx] }}
            >
              {w}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-white text-[10px] tracking-widest">VOL.01</span>
          <span className="text-white text-[10px]">
            {new Date().toLocaleDateString('ko-KR')}
          </span>
        </div>
      </div>

      {/* Cover hero */}
      <div className="flex items-center gap-3 bg-white px-3 py-3 mb-3 border-4 border-black relative">
        <div className="text-5xl">{personality.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-black tracking-widest text-rose-500">EXCLUSIVE</div>
          <div className="text-base font-black text-black leading-tight truncate">
            {personality.name}
          </div>
          {personality.vibe && (
            <div className="text-[10px] text-zinc-700">#{personality.vibe}</div>
          )}
        </div>
        <div className="absolute -top-2 -right-2 bg-yellow-300 border-2 border-black text-[10px] font-black px-2 py-0.5 rotate-6">
          FACT ✓
        </div>
      </div>

      {/* 4 color blocks */}
      <div className="grid grid-cols-2 gap-2">
        {blocks.map((b, idx) => (
          <div
            key={idx}
            className="p-2.5 relative"
            style={{ backgroundColor: b.bg }}
          >
            <div className="text-[10px] font-black mb-1" style={{ color: b.fg }}>
              {b.title}
            </div>
            <ul className="space-y-0.5">
              {b.lines.map((l, i2) => (
                <li key={i2} className="text-[10px] font-bold text-black leading-tight">
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tagline ribbon */}
      <div className="mt-3 bg-white border-2 border-black px-3 py-2 flex items-center justify-between">
        <span className="text-[11px] font-black text-black">"{personality.tagline}"</span>
        <span className="text-[9px] bg-black text-white px-1.5 py-0.5 font-black">FIN</span>
      </div>

      <div className="text-center text-[9px] text-white mt-2 font-bold tracking-widest">
        #유튜브매거진 #FACT
      </div>
    </div>
  );
}

// Exported list of variant ids — used by the share-link view to pick one at random.
export const VARIANT_IDS = VARIANTS.map((v) => v.id);
export { VARIANTS };

/* ===================== VARIANT SWITCH ===================== */
export function VariantSwitch({ variant, personality, top3, stats, indices, topCategories }) {
  switch (variant) {
    case 'classic':     return <ClassicCard personality={personality} top3={top3} stats={stats} />;
    case 'profile':     return <ProfileCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'diagnosis':   return <DiagnosisCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'diary':       return <DiaryCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'magazine':    return <MagazineCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'receipt':     return <ReceiptCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'tier':        return <TierCard personality={personality} categories={topCategories} stats={stats} />;
    case 'idcard':      return <IdCardVariant personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'stamp':       return <StampCard personality={personality} top3={top3} stats={stats} />;
    case 'polaroid':    return <PolaroidCard personality={personality} top3={top3} stats={stats} />;
    case 'ticket':      return <TicketCard personality={personality} top3={top3} stats={stats} />;
    case 'notice':      return <NoticeCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'postcard':    return <PostcardCard personality={personality} top3={top3} stats={stats} />;
    case 'manga':       return <MangaCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'menu':        return <MenuCard personality={personality} top3={top3} stats={stats} />;
    case 'badge':       return <BadgeCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'passport':    return <PassportCard personality={personality} top3={top3} stats={stats} />;
    case 'vinyl':       return <VinylCard personality={personality} top3={top3} stats={stats} />;
    case 'neon':        return <NeonCard personality={personality} top3={top3} stats={stats} />;
    case 'retro':       return <RetroCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'minimal':     return <MinimalCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'glitter':     return <GlitterCard personality={personality} top3={top3} stats={stats} />;
    case 'envelope':    return <EnvelopeCard personality={personality} top3={top3} stats={stats} />;
    case 'wanted':      return <WantedCard personality={personality} top3={top3} stats={stats} />;
    case 'certificate': return <CertificateCard personality={personality} top3={top3} stats={stats} />;
    case 'boardgame':   return <BoardGameCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'arcade':      return <ArcadeCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'stickernote': return <StickerNoteCard personality={personality} top3={top3} stats={stats} />;
    case 'chart':       return <ChartCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    case 'horoscope':   return <HoroscopeCard personality={personality} top3={top3} stats={stats} indices={indices} />;
    default:            return <ClassicCard personality={personality} top3={top3} stats={stats} />;
  }
}

/* Helper — a compact footer used across many variants to save space */
function CompactFooter({ stats, hash = '#ShortsInsight' }) {
  return (
    <div className="text-[9px] opacity-70 text-center mt-2">
      총 {stats?.total?.toLocaleString() || 0}편 · 채널 {stats?.uniqueChannels?.toLocaleString() || 0}개 · {hash}
    </div>
  );
}

/* ===================== VARIANT 9 — STAMP (출석/스탬프 카드) ===================== */
function StampCard({ personality, top3, stats }) {
  const stamps = Array.from({ length: 12 }, (_, i) => i + 1);
  const earned = Math.min(12, Math.max(1, Math.ceil(((stats?.total || 0) / 1000))));
  return (
    <div className="w-[320px] rounded-3xl p-5 shadow-glow-lg bg-amber-50 border-4 border-amber-700/60 relative">
      <div className="text-center mb-3">
        <div className="text-[10px] tracking-[0.4em] text-amber-800 font-black">YOUTUBE STAMP</div>
        <h3 className="text-xl font-black text-amber-900 mt-0.5">시청 출석부</h3>
        <div className="text-[9px] text-amber-700">{new Date().toLocaleDateString('ko-KR')}</div>
      </div>
      <div className="bg-white rounded-2xl p-3 border-2 border-amber-300 mb-3 flex items-center gap-2">
        <div className="text-4xl">{personality.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-amber-600 font-bold">유형</div>
          <div className="text-base font-black text-zinc-900 leading-tight truncate">{personality.name}</div>
          <div className="text-[10px] text-zinc-600 italic truncate">"{personality.tagline}"</div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-3 border-2 border-amber-300">
        {stamps.map((n) => (
          <div
            key={n}
            className={`aspect-square rounded-full border-2 flex items-center justify-center text-xs font-black ${
              n <= earned
                ? 'bg-red-500 border-red-700 text-white rotate-[-8deg]'
                : 'bg-amber-50 border-amber-300 text-amber-300'
            }`}
          >
            {n <= earned ? '✓' : n}
          </div>
        ))}
      </div>
      <div className="mt-3 text-center text-[10px] text-amber-800 font-bold">
        {earned}/12 스탬프 · {top3[0] ? `${top3[0].emoji} ${top3[0].label} 단골` : '시청 출석'}
      </div>
      <CompactFooter stats={stats} hash="#유튜브출석부" />
    </div>
  );
}

/* ===================== VARIANT 10 — POLAROID ===================== */
function PolaroidCard({ personality, top3, stats }) {
  return (
    <div
      className="w-[320px] p-4 pb-16 shadow-glow-lg rotate-[-2deg]"
      style={{ backgroundColor: '#fafaf5' }}
    >
      <div
        className={`aspect-square rounded-sm bg-gradient-to-br ${personality.gradient} flex items-center justify-center relative overflow-hidden`}
      >
        <div className="text-[120px] drop-shadow-lg">{personality.emoji}</div>
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 30%, white 0, transparent 55%)',
          }}
        />
        <div className="absolute top-2 right-3 text-white/70 text-[10px] font-mono">
          {new Date().toLocaleDateString('ko-KR')}
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="font-['Noto_Sans_KR',_cursive] text-lg text-zinc-800 font-bold italic">
          {personality.name}
        </div>
        <div className="text-[11px] text-zinc-600 italic mt-0.5">"{personality.tagline}"</div>
        {top3[0] && (
          <div className="text-[10px] text-zinc-500 mt-1">
            {top3[0].emoji} {top3[0].label} · 총 {stats?.total?.toLocaleString() || 0}편
          </div>
        )}
        <div className="text-[9px] text-zinc-400 mt-1 tracking-widest">#INSTA_YT</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 11 — MOVIE TICKET ===================== */
function TicketCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] shadow-glow-lg flex">
      <div
        className="flex-1 rounded-l-2xl p-4 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #6b0f2b, #170921)' }}
      >
        <div className="text-[10px] tracking-[0.3em] opacity-80">YOUTUBE CINEMA</div>
        <div className="text-2xl font-black mt-1 leading-tight">{personality.emoji} {personality.name}</div>
        <div className="text-[10px] italic opacity-90 mt-1">"{personality.tagline}"</div>
        <div className="border-t border-white/30 my-2" />
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div><div className="opacity-60">SCREEN</div><div className="font-bold">#1 MAIN</div></div>
          <div><div className="opacity-60">DATE</div><div className="font-bold">{new Date().toLocaleDateString('ko-KR')}</div></div>
          <div><div className="opacity-60">TOTAL</div><div className="font-bold">{stats?.total?.toLocaleString() || 0}편</div></div>
          <div><div className="opacity-60">AVG/DAY</div><div className="font-bold">{stats?.avgPerDay?.toFixed(1) || 0}</div></div>
        </div>
        {top3[0] && (
          <div className="mt-2 text-[10px] opacity-90">상영: {top3.map((c) => `${c.emoji}${c.label}`).join(' · ')}</div>
        )}
      </div>
      <div
        className="w-20 rounded-r-2xl p-3 flex flex-col items-center justify-between text-center bg-amber-100 border-l-2 border-dashed border-amber-700"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 4px, #00000008 4px 5px)' }}
      >
        <div className="text-[9px] text-amber-900 font-black tracking-widest rotate-90 mt-6">ADMIT ONE</div>
        <div className="text-xl font-black text-amber-900">{personality.emoji}</div>
        <div className="text-[9px] text-amber-900 font-mono">
          {String(stats?.total || 0).padStart(5, '0').slice(-5)}
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 12 — NOTICE (공고문) ===================== */
function NoticeCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  return (
    <div className="w-[320px] rounded-2xl p-5 shadow-glow-lg bg-yellow-50 border-4 border-black">
      <div className="text-center border-b-4 border-double border-black pb-2 mb-3">
        <div className="text-[10px] tracking-[0.4em] font-black">🚨 긴급 공고문 🚨</div>
        <div className="text-2xl font-black mt-1">YOUTUBE 시청 경보</div>
        <div className="text-[9px] text-zinc-600 mt-0.5">발령일 {new Date().toLocaleDateString('ko-KR')}</div>
      </div>
      <div className="text-center mb-3">
        <div className="text-5xl">{personality.emoji}</div>
        <div className="text-lg font-black mt-1">"{personality.name}" 확인</div>
      </div>
      <div className="bg-white border-2 border-black p-3 mb-2">
        <div className="text-[11px] font-black mb-1">【 시청 현황 】</div>
        <ul className="text-[11px] space-y-0.5">
          <li>· 총 시청: <b>{stats?.total?.toLocaleString() || 0}</b>편</li>
          <li>· 하루 평균: <b>{stats?.avgPerDay?.toFixed(1) || 0}</b>편</li>
          <li>· 본 채널: <b>{stats?.uniqueChannels?.toLocaleString() || 0}</b>개</li>
          {top3[0] && <li>· 편식 카테고리: <b>{top3[0].emoji} {top3[0].label}</b> ({Math.round(top3[0].ratio * 100)}%)</li>}
        </ul>
      </div>
      <div className="bg-white border-2 border-black p-3">
        <div className="text-[11px] font-black mb-1">【 조치 사항 】</div>
        <ul className="text-[11px] space-y-0.5">
          <li>1. 도파민 {i.dopamine ?? 0} · 야행성 {i.nocturnal ?? 0} 관찰</li>
          <li>2. 탐험력 {i.explorer ?? 0} · 충성도 {i.loyalty ?? 0}</li>
          <li>3. 적정 수면 권장 · 외출 장려</li>
        </ul>
      </div>
      <div className="mt-3 text-center text-[10px] font-black tracking-widest">— YT 공보과 —</div>
    </div>
  );
}

/* ===================== VARIANT 13 — POSTCARD (엽서) ===================== */
function PostcardCard({ personality, top3, stats }) {
  return (
    <div
      className="w-[320px] aspect-[5/3] rounded-lg p-4 shadow-glow-lg flex relative"
      style={{
        background: 'linear-gradient(135deg, #fff5e1, #ffe4c4)',
        backgroundImage: 'radial-gradient(#00000010 1px, transparent 1px)',
        backgroundSize: '14px 14px',
      }}
    >
      {/* Left — message */}
      <div className="flex-1 border-r-2 border-dashed border-amber-700/40 pr-3">
        <div className="text-[10px] tracking-widest text-amber-800 font-black">FROM YOUTUBE</div>
        <div className="text-[12px] text-zinc-800 italic mt-1 leading-[18px]">
          안녕,<br/>
          여기 알고리즘 나라.<br/>
          너는 <b>{personality.name}</b>,<br/>
          "{personality.tagline}"<br/>
          총 {stats?.total?.toLocaleString() || 0}편 잘 봤어.
        </div>
      </div>
      {/* Right — stamp + address */}
      <div className="w-24 pl-2 flex flex-col items-end justify-between">
        <div
          className={`w-16 h-20 rounded-sm bg-gradient-to-br ${personality.gradient} flex items-center justify-center border-2 border-amber-800`}
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 4px, #00000015 4px 5px)' }}
        >
          <span className="text-3xl drop-shadow">{personality.emoji}</span>
        </div>
        <div className="w-full border-t border-amber-700/40 my-1" />
        <div className="w-full text-right text-[9px] text-amber-900">
          <div>TO:</div>
          <div className="font-bold">나의 YouTube</div>
          <div>{top3[0]?.label || '알고리즘'} 동</div>
          <div className="tabular-nums">{stats?.peakHour || 0}시 {stats?.peakDay || ''}</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 14 — MANGA (만화 4컷) ===================== */
function MangaCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const panels = [
    { bubble: '오늘 하루도...', img: '😐' },
    { bubble: `${personality.emoji} ${top3[0]?.emoji || '📱'} 또 켰다`, img: '😏' },
    { bubble: `어느덧 ${stats?.total?.toLocaleString() || 0}편...?!`, img: '😱' },
    { bubble: `"${personality.tagline}"`, img: personality.emoji },
  ];
  return (
    <div className="w-[320px] rounded-2xl p-3 shadow-glow-lg bg-white border-4 border-black">
      <div className="text-center mb-2">
        <div className="text-[10px] tracking-widest font-black">4컷 만화</div>
        <div className="text-lg font-black leading-tight">내 YouTube 하루 😅</div>
      </div>
      <div className="grid grid-cols-2 gap-1 bg-black p-1">
        {panels.map((p, idx) => (
          <div key={idx} className="bg-white aspect-square p-2 flex flex-col justify-between relative">
            <div className="text-[10px] bg-white border-2 border-black rounded-xl px-2 py-1 leading-tight relative max-w-[90%]">
              {p.bubble}
            </div>
            <div className="text-5xl text-center self-center">{p.img}</div>
            <div className="absolute bottom-1 right-1 text-[8px] font-black text-zinc-400">{idx + 1}</div>
          </div>
        ))}
      </div>
      <div className="text-[9px] text-center mt-2 font-bold">
        도파민 {i.dopamine ?? 0} · 야행성 {i.nocturnal ?? 0} · #내YT만화
      </div>
    </div>
  );
}

/* ===================== VARIANT 15 — MENU (메뉴판) ===================== */
function MenuCard({ personality, top3, stats }) {
  const dishes = top3.length
    ? top3.map((c, i) => ({
        name: `${c.emoji} ${c.label} 정식`,
        desc: ['인기 메뉴', '주방장 추천', '오늘의 특선'][i] || '시그니처',
        price: `${Math.round(c.ratio * 100)}%`,
      }))
    : [{ name: '기본 정식', desc: '주방장 추천', price: '—' }];
  return (
    <div className="w-[320px] rounded-3xl p-6 shadow-glow-lg bg-stone-900 text-amber-100 relative">
      <div className="absolute top-3 left-4 text-2xl">🍽️</div>
      <div className="absolute top-3 right-4 text-2xl">🕯️</div>
      <div className="text-center mb-3 border-b-2 border-amber-200/30 pb-2">
        <div className="text-[10px] tracking-[0.4em] text-amber-300/80">YOUTUBE BISTRO</div>
        <div className="text-2xl font-serif italic mt-1">오늘의 메뉴</div>
        <div className="text-[10px] text-amber-300/60 mt-0.5">Chef — {personality.name} {personality.emoji}</div>
      </div>
      <ul className="space-y-3">
        {dishes.map((d, idx) => (
          <li key={idx} className="flex items-baseline justify-between gap-2">
            <div className="min-w-0">
              <div className="text-base font-serif">{d.name}</div>
              <div className="text-[10px] italic text-amber-200/60">{d.desc}</div>
            </div>
            <div className="text-sm font-serif tabular-nums border-b border-dotted border-amber-200/40 flex-1 mx-2" />
            <div className="text-base font-bold">{d.price}</div>
          </li>
        ))}
      </ul>
      <div className="border-t-2 border-amber-200/30 mt-3 pt-2 text-[10px] text-amber-200/70 text-center italic">
        "{personality.tagline}"
      </div>
      <div className="text-[9px] text-amber-200/60 text-center mt-1">총 {stats?.total?.toLocaleString() || 0}편 제공</div>
    </div>
  );
}

/* ===================== VARIANT 16 — BADGE (업적) ===================== */
function BadgeCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const achievements = [
    { icon: '🔥', label: '도파민', val: i.dopamine ?? 0 },
    { icon: '🌙', label: '야행성', val: i.nocturnal ?? 0 },
    { icon: '🧭', label: '탐험가', val: i.explorer ?? 0 },
    { icon: '🎯', label: '몰입', val: i.picky ?? 0 },
    { icon: '💖', label: '충성도', val: i.loyalty ?? 0 },
    { icon: '⚡', label: '폭식', val: i.binge ?? 0 },
  ];
  return (
    <div className="w-[320px] rounded-3xl p-5 shadow-glow-lg bg-indigo-950 border border-indigo-500/40 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/20 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="text-center mb-3">
          <div className="text-[10px] tracking-[0.4em] text-fuchsia-300 font-black">ACHIEVEMENTS</div>
          <h3 className="text-xl font-black text-white mt-0.5">내 YT 업적판 🏅</h3>
        </div>
        <div
          className={`rounded-2xl p-3 bg-gradient-to-br ${personality.gradient} flex items-center gap-3 mb-3`}
        >
          <div className="text-5xl">{personality.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-sm truncate">{personality.name}</div>
            <div className="text-white/80 text-[10px]">LV. {Math.min(99, Math.floor((stats?.total || 0) / 100))}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded-full flex flex-col items-center justify-center text-center border-2 ${
                a.val >= 60
                  ? 'border-amber-400 bg-gradient-to-br from-amber-600/30 to-amber-900/30 text-amber-100'
                  : a.val >= 30
                  ? 'border-zinc-400 bg-zinc-800 text-zinc-200'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-500'
              }`}
            >
              <div className="text-2xl">{a.icon}</div>
              <div className="text-[9px] font-bold">{a.label}</div>
              <div className="text-[10px] tabular-nums">{a.val}</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] text-fuchsia-300/70 text-center mt-3 tracking-widest">#YT업적판</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 17 — PASSPORT ===================== */
function PassportCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] rounded-2xl p-5 shadow-glow-lg bg-[#0a1d3a] text-amber-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #ffd700 1px, transparent 1px)', backgroundSize: '18px 18px' }}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b-2 border-amber-300/40 pb-2 mb-3">
          <div>
            <div className="text-[10px] tracking-[0.3em] font-black">PASSPORT</div>
            <div className="text-[9px] text-amber-300/70">YOUTUBE REPUBLIC</div>
          </div>
          <div className="text-3xl">✈️</div>
        </div>
        <div className="flex gap-3 mb-3">
          <div className={`w-20 h-24 rounded-md bg-gradient-to-br ${personality.gradient} flex items-center justify-center border-2 border-amber-300/50`}>
            <span className="text-5xl drop-shadow-lg">{personality.emoji}</span>
          </div>
          <div className="flex-1 min-w-0 text-[11px]">
            <div className="text-amber-300/70 text-[9px]">SURNAME / 성</div>
            <div className="font-bold text-base leading-tight truncate">{personality.name}</div>
            <div className="text-amber-300/70 text-[9px] mt-1">NATIONALITY</div>
            <div>REPUBLIC OF YOUTUBE</div>
            <div className="text-amber-300/70 text-[9px] mt-1">DATE OF ISSUE</div>
            <div className="tabular-nums">{new Date().toLocaleDateString('ko-KR')}</div>
          </div>
        </div>
        <div className="bg-amber-100/10 rounded-md p-2 border border-amber-300/20 text-[10px] space-y-0.5">
          <div>VISITED · 방문한 카테고리</div>
          {top3.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <span>{c.emoji} {c.label}</span>
              <span className="tabular-nums">{Math.round(c.ratio * 100)}% · STAMP ✓</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-[9px] font-mono tabular-nums tracking-widest">
          P{'<'}YTK{String(stats?.total || 0).padStart(8, '0')}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}{'<'}
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 18 — VINYL RECORD ===================== */
function VinylCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] rounded-3xl p-5 shadow-glow-lg bg-zinc-900 text-white relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="relative w-32 h-32 rounded-full bg-black border-2 border-zinc-700 flex items-center justify-center shrink-0"
          style={{
            backgroundImage:
              'repeating-radial-gradient(circle at center, #18181b 0 1px, #09090b 1px 2px)',
          }}
        >
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${personality.gradient} flex items-center justify-center`}>
            <span className="text-3xl">{personality.emoji}</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-widest text-zinc-500">LP · SIDE A</div>
          <div className="text-lg font-black leading-tight truncate">{personality.name}</div>
          <div className="text-[10px] text-zinc-400 italic truncate">"{personality.tagline}"</div>
          <div className="text-[9px] text-zinc-500 mt-1">
            {new Date().getFullYear()} · YT Records
          </div>
        </div>
      </div>
      <div className="mt-3 bg-zinc-800 rounded-lg p-3 border border-zinc-700">
        <div className="text-[10px] tracking-widest text-zinc-400 mb-1">🎵 TRACKLIST</div>
        <ul className="space-y-0.5 text-[11px]">
          {top3.map((c, idx) => (
            <li key={c.id} className="flex items-baseline justify-between">
              <span>
                <span className="text-zinc-500 tabular-nums mr-2">{String(idx + 1).padStart(2, '0')}</span>
                {c.emoji} {c.label}
              </span>
              <span className="text-zinc-400 tabular-nums">{Math.round(c.ratio * 100)}%</span>
            </li>
          ))}
          <li className="text-zinc-600 text-[10px] italic">... 총 {stats?.total?.toLocaleString() || 0}편 믹스</li>
        </ul>
      </div>
      <div className="text-[9px] text-zinc-600 text-center mt-2 tracking-widest">#내유튜브앨범</div>
    </div>
  );
}

/* ===================== VARIANT 19 — NEON ===================== */
function NeonCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] rounded-3xl p-6 shadow-glow-lg bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(#00000080 1px, transparent 1px), linear-gradient(90deg, #00000080 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }} />
      <div className="relative z-10 text-center">
        <div
          className="text-[10px] tracking-[0.4em] font-black"
          style={{ color: '#ff4db5', textShadow: '0 0 8px #ff4db5, 0 0 16px #ff4db5' }}
        >
          NEON TOKYO
        </div>
        <h3
          className="text-3xl font-black my-3 leading-tight"
          style={{ color: '#5ce1ff', textShadow: '0 0 8px #5ce1ff, 0 0 22px #5ce1ff' }}
        >
          {personality.name}
        </h3>
        <div className="text-6xl mb-2">{personality.emoji}</div>
        <div
          className="inline-block px-3 py-1 text-xs font-black tracking-widest rounded"
          style={{ border: '2px solid #ffb84d', color: '#ffb84d', textShadow: '0 0 6px #ffb84d' }}
        >
          "{personality.tagline}"
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {top3.map((c, idx) => (
            <div
              key={c.id}
              className="rounded-lg p-2"
              style={{
                border: '1.5px solid',
                borderColor: ['#ff4db5', '#5ce1ff', '#ffb84d'][idx],
                color: ['#ff4db5', '#5ce1ff', '#ffb84d'][idx],
                textShadow: '0 0 6px currentColor',
              }}
            >
              <div className="text-xl">{c.emoji}</div>
              <div className="text-[10px] font-black">{c.label}</div>
              <div className="text-[9px]">{Math.round(c.ratio * 100)}%</div>
            </div>
          ))}
        </div>
        <div className="text-[9px] text-white/60 mt-3 tracking-widest">
          총 {stats?.total?.toLocaleString() || 0}편 · #내YT네온
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 20 — RETRO TV ===================== */
function RetroCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  return (
    <div
      className="w-[320px] rounded-3xl p-5 shadow-glow-lg"
      style={{ background: 'linear-gradient(180deg, #2a1810 0%, #1a0f08 100%)' }}
    >
      <div className="rounded-2xl p-4 relative overflow-hidden" style={{
        background: '#0a0a0a',
        border: '6px solid #d4a373',
        boxShadow: 'inset 0 0 30px #00000080',
      }}>
        {/* scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 2px, #ffffff0d 2px 3px)' }}
        />
        <div className="relative z-10 text-center">
          <div className="text-[10px] tracking-[0.4em] text-green-400 font-mono">◉ ON AIR</div>
          <div className="text-5xl my-2 text-amber-200 drop-shadow">{personality.emoji}</div>
          <h3 className="text-xl font-black text-amber-100 leading-tight" style={{ fontFamily: 'monospace' }}>
            {personality.name}
          </h3>
          <div className="text-[10px] italic text-amber-300/80 font-mono">"{personality.tagline}"</div>
          <div className="border-t border-amber-400/30 my-2" />
          <div className="text-[11px] text-amber-100/80 font-mono space-y-0.5">
            <div>CH 01 · TOTAL {stats?.total?.toLocaleString() || 0}</div>
            <div>CH 02 · AVG  {stats?.avgPerDay?.toFixed(1) || 0}/DAY</div>
            <div>CH 03 · NIGHT {i.nocturnal ?? 0}% · DOPAMINE {i.dopamine ?? 0}</div>
            {top3[0] && <div>CH 04 · {top3[0].emoji} {top3[0].label.toUpperCase()} {Math.round(top3[0].ratio * 100)}%</div>}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-3">
        <div className="w-3 h-3 rounded-full bg-amber-700" />
        <div className="w-3 h-3 rounded-full bg-amber-900" />
        <div className="w-3 h-3 rounded-full bg-amber-700" />
      </div>
      <div className="text-[9px] text-amber-300/70 text-center mt-2 font-mono tracking-widest">#레트로유튜브</div>
    </div>
  );
}

/* ===================== VARIANT 21 — MINIMAL (흑백) ===================== */
function MinimalCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  return (
    <div className="w-[320px] rounded-3xl p-7 shadow-glow-lg bg-white text-black relative">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-[10px] tracking-[0.4em] text-zinc-500">YT TYPE</div>
          <div className="text-[9px] text-zinc-400 mt-0.5">{new Date().toLocaleDateString('ko-KR')}</div>
        </div>
        <div className="w-6 h-6 rounded-full bg-black" />
      </div>
      <div className="mb-6">
        <div className="text-6xl">{personality.emoji}</div>
        <h3 className="text-3xl font-black leading-tight mt-3">{personality.name}</h3>
        <div className="text-xs text-zinc-500 italic mt-1">"{personality.tagline}"</div>
      </div>
      <div className="space-y-1 text-[11px] border-t border-black pt-3">
        <Row l="TOTAL" v={`${stats?.total?.toLocaleString() || 0}편`} />
        <Row l="AVG/DAY" v={`${stats?.avgPerDay?.toFixed(1) || 0}`} />
        <Row l="CHANNELS" v={`${stats?.uniqueChannels?.toLocaleString() || 0}`} />
        <Row l="PEAK" v={`${stats?.peakHour || 0}:00 · ${stats?.peakDay || '-'}`} />
        {top3[0] && <Row l="TOP" v={`${top3[0].emoji} ${top3[0].label} ${Math.round(top3[0].ratio * 100)}%`} />}
        <Row l="DOPAMINE" v={i.dopamine ?? 0} />
        <Row l="NOCTURNAL" v={i.nocturnal ?? 0} />
      </div>
      <div className="text-[9px] text-zinc-400 mt-4 tracking-widest">— MINIMAL</div>
    </div>
  );
}
function Row({ l, v }) {
  return (
    <div className="flex justify-between border-b border-zinc-200 py-1">
      <span className="text-zinc-500">{l}</span>
      <span className="font-bold tabular-nums">{v}</span>
    </div>
  );
}

/* ===================== VARIANT 22 — GLITTER (아이돌 포토카드) ===================== */
function GlitterCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] rounded-[28px] p-0.5 shadow-glow-lg"
      style={{ background: 'conic-gradient(from 0deg, #ff80ab, #64b5f6, #ffd54f, #81c784, #ff80ab)' }}
    >
      <div className="rounded-[26px] p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fff0f5 0%, #e3f2fd 50%, #fff3e0 100%)',
          backgroundImage: 'radial-gradient(#ffffff90 1px, transparent 1.5px)',
          backgroundSize: '10px 10px',
        }}
      >
        <div className="absolute top-2 left-3 text-lg">✨</div>
        <div className="absolute top-4 right-4 text-sm">♡</div>
        <div className="absolute bottom-20 left-5 text-lg">⭐</div>
        <div className="absolute bottom-4 right-6 text-sm">💖</div>

        <div className="text-center">
          <div className="text-[10px] tracking-[0.3em] font-black text-fuchsia-500">♡ PHOTOCARD ♡</div>
          <div className={`mx-auto mt-2 w-28 h-36 rounded-xl bg-gradient-to-br ${personality.gradient} flex items-center justify-center border-4 border-white shadow-md`}>
            <span className="text-6xl drop-shadow-lg">{personality.emoji}</span>
          </div>
          <h3 className="text-xl font-black text-zinc-800 mt-2 leading-tight">{personality.name}</h3>
          <div className="text-[10px] text-fuchsia-500 font-bold">#{personality.vibe || 'MY_TYPE'}</div>
          <div className="text-[11px] text-zinc-600 italic mt-1">"{personality.tagline}"</div>
          {top3[0] && (
            <div className="inline-flex gap-1 mt-2 flex-wrap justify-center">
              {top3.map((c) => (
                <span key={c.id} className="px-2 py-0.5 rounded-full bg-white/80 border border-pink-200 text-[10px]">
                  {c.emoji} {c.label}
                </span>
              ))}
            </div>
          )}
          <div className="text-[9px] text-fuchsia-400 mt-2 font-bold">
            MEMBER 01 · {stats?.total?.toLocaleString() || 0}편
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 23 — ENVELOPE (편지) ===================== */
function EnvelopeCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] rounded-xl p-5 shadow-glow-lg relative"
      style={{ background: '#fdfaf3', border: '2px dashed #c2a16a' }}
    >
      {/* seal */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-md border-2 border-rose-800">
        <span className="text-white text-xl">💌</span>
      </div>
      <div className="mt-3 text-center mb-3">
        <div className="text-[10px] tracking-widest text-rose-700 font-black">알고리즘이 보낸 편지</div>
        <div className="text-xs text-zinc-500">{new Date().toLocaleDateString('ko-KR')}</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-rose-200 text-[12px] text-zinc-800 leading-[20px] italic"
        style={{
          backgroundImage: 'linear-gradient(#fce7f3 1px, transparent 1px)',
          backgroundSize: '100% 20px',
        }}
      >
        <p>친애하는 시청자께,</p>
        <p className="mt-1">
          귀하의 취향을 오래 지켜봤습니다. <b>{personality.emoji} {personality.name}</b>,
          당신의 본질은 이 한 문장에 있습니다:
        </p>
        <p className="mt-1 text-center font-bold">"{personality.tagline}"</p>
        <p className="mt-1">
          지금까지 <b>{stats?.total?.toLocaleString() || 0}편</b>을 함께했고,
          {top3[0] && <> 특히 <b>{top3[0].emoji} {top3[0].label}</b>을 {Math.round(top3[0].ratio * 100)}% 사랑하셨죠.</>}
        </p>
        <p className="mt-1 text-right">— 알고리즘 드림</p>
      </div>
      <div className="text-[9px] text-rose-500 text-center mt-2 font-bold">#YT러브레터</div>
    </div>
  );
}

/* ===================== VARIANT 24 — WANTED ===================== */
function WantedCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] p-5 shadow-glow-lg relative"
      style={{
        backgroundColor: '#e8d9a8',
        backgroundImage:
          'radial-gradient(#8b6914 0.6px, transparent 0.8px), radial-gradient(#5a3e0a 0.4px, transparent 0.6px)',
        backgroundSize: '22px 22px, 33px 33px',
        border: '6px double #5a3e0a',
      }}
    >
      <div className="text-center" style={{ color: '#3a2400', fontFamily: 'serif' }}>
        <div className="text-[28px] font-black tracking-[0.15em] leading-none">WANTED</div>
        <div className="text-[10px] tracking-[0.3em] mt-1">DEAD · ALIVE · BINGE-WATCHING</div>
      </div>
      <div
        className="my-3 mx-auto w-40 h-40 rounded-lg flex items-center justify-center border-4 border-amber-900"
        style={{
          background: 'repeating-linear-gradient(45deg, #d4c088 0 8px, #c7b17a 8px 10px)',
        }}
      >
        <span className="text-7xl drop-shadow-lg">{personality.emoji}</span>
      </div>
      <div className="text-center" style={{ color: '#3a2400', fontFamily: 'serif' }}>
        <div className="text-xl font-black leading-tight">"{personality.name}"</div>
        <div className="text-[10px] italic mt-1">aka "{personality.tagline}"</div>
        <div className="text-[28px] font-black mt-2">REWARD</div>
        <div className="text-2xl font-black">${(stats?.total || 0).toLocaleString()} 편</div>
        <div className="text-[10px] mt-1">LAST SEEN · {stats?.peakHour || 0}시 {stats?.peakDay || ''}요일</div>
        {top3[0] && <div className="text-[10px]">HIDEOUT · {top3[0].emoji} {top3[0].label}</div>}
        <div className="text-[9px] tracking-widest mt-2">#YT현상수배</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 25 — CERTIFICATE (상장) ===================== */
function CertificateCard({ personality, top3, stats }) {
  return (
    <div className="w-[320px] p-5 shadow-glow-lg relative"
      style={{
        background: '#fffdf5',
        border: '10px double #c9a13b',
      }}
    >
      <div className="text-center text-amber-900" style={{ fontFamily: 'serif' }}>
        <div className="text-4xl mb-1">🏆</div>
        <div className="text-[10px] tracking-[0.5em] font-black">CERTIFICATE</div>
        <div className="text-2xl italic font-black mt-1">YouTube Laureate</div>
        <div className="text-[10px] italic mt-1">— 수 여 증 —</div>
      </div>
      <div className="my-3 text-center text-zinc-800 leading-relaxed" style={{ fontFamily: 'serif' }}>
        <div className="text-[11px]">위 사람은 아래와 같이</div>
        <div className="text-lg font-black mt-1">{personality.emoji} {personality.name}</div>
        <div className="text-[10px] italic text-amber-800">"{personality.tagline}"</div>
        <div className="text-[11px] mt-2">
          칭호를 획득하였으므로<br />이 상장을 수여함
        </div>
      </div>
      <div className="bg-amber-50 rounded border border-amber-200 p-2 text-[10px] text-center space-y-0.5 my-2">
        <div>총 시청 <b>{stats?.total?.toLocaleString() || 0}</b>편 · 채널 <b>{stats?.uniqueChannels?.toLocaleString() || 0}</b>개</div>
        {top3[0] && <div>주 분야: {top3[0].emoji} {top3[0].label} ({Math.round(top3[0].ratio * 100)}%)</div>}
      </div>
      <div className="flex items-end justify-between text-[10px] text-amber-900 mt-3" style={{ fontFamily: 'serif' }}>
        <div>
          <div>{new Date().toLocaleDateString('ko-KR')}</div>
          <div className="text-[9px]">발행일</div>
        </div>
        <div className="text-right">
          <div className="text-2xl">🖋️</div>
          <div className="text-[9px]">YT 학장 직인</div>
        </div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 26 — BOARD GAME CARD ===================== */
function BoardGameCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  return (
    <div className="w-[320px] rounded-2xl p-1 shadow-glow-lg"
      style={{ background: 'linear-gradient(135deg, #b91c1c, #7f1d1d)' }}
    >
      <div className="rounded-xl p-4 bg-stone-100 border-4 border-amber-900">
        <div className="flex items-center justify-between">
          <div className="text-[10px] tracking-widest font-black text-amber-900">LEGENDARY · ★★★★★</div>
          <div className="text-[10px] font-black bg-amber-900 text-stone-100 px-2 py-0.5">
            LV.{Math.min(99, Math.floor((stats?.total || 0) / 100))}
          </div>
        </div>
        <div className="text-center mt-2">
          <h3 className="text-lg font-black text-amber-900 leading-tight">{personality.name}</h3>
          <div className="text-[10px] italic text-amber-800">"{personality.tagline}"</div>
        </div>
        <div className={`my-3 aspect-square rounded-lg bg-gradient-to-br ${personality.gradient} flex items-center justify-center border-2 border-amber-900`}>
          <span className="text-8xl drop-shadow-lg">{personality.emoji}</span>
        </div>
        <div className="bg-white rounded border border-amber-900 p-2 text-[10px] text-zinc-800 space-y-1">
          <div className="font-black text-amber-900">【 능력치 】</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
            <span>ATK 도파민</span><span className="font-bold tabular-nums text-right">{i.dopamine ?? 0}</span>
            <span>DEF 규칙성</span><span className="font-bold tabular-nums text-right">{i.steady ?? 0}</span>
            <span>SPD 폭식</span><span className="font-bold tabular-nums text-right">{i.binge ?? 0}</span>
            <span>INT 탐험력</span><span className="font-bold tabular-nums text-right">{i.explorer ?? 0}</span>
          </div>
          <div className="border-t border-amber-200 pt-1">
            <span className="font-black text-amber-900">【 필살기 】</span>{' '}
            {top3[0] ? `${top3[0].label} 소환 (${Math.round(top3[0].ratio * 100)}% 확률)` : '알고리즘 파괴광선'}
          </div>
        </div>
        <div className="text-[9px] text-center text-amber-800 mt-2 tracking-widest">#YT카드게임</div>
      </div>
    </div>
  );
}

/* ===================== VARIANT 27 — ARCADE (8bit) ===================== */
function ArcadeCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  return (
    <div className="w-[320px] rounded-lg p-4 shadow-glow-lg"
      style={{
        background: '#000',
        fontFamily: '"Press Start 2P", "Courier New", monospace',
        imageRendering: 'pixelated',
      }}
    >
      <div className="text-center" style={{ color: '#ffcc00' }}>
        <div className="text-[11px] tracking-[0.2em]">★ HIGH SCORE ★</div>
        <div className="text-2xl font-black mt-1" style={{ color: '#ff3366' }}>
          {String(stats?.total || 0).padStart(8, '0')}
        </div>
      </div>
      <div className="my-3 p-3 rounded text-center"
        style={{
          background: '#111',
          border: '2px solid #5cff5c',
          boxShadow: 'inset 0 0 20px #5cff5c40',
        }}
      >
        <div className="text-5xl">{personality.emoji}</div>
        <div className="text-sm font-black mt-1" style={{ color: '#5cff5c' }}>
          {personality.name.toUpperCase()}
        </div>
        <div className="text-[9px] mt-1" style={{ color: '#ffff80' }}>
          "{personality.tagline}"
        </div>
      </div>
      <div className="text-[10px] space-y-0.5" style={{ color: '#80dfff' }}>
        <div>DAYS &gt; {stats?.spanDays || 0}</div>
        <div>AVG  &gt; {stats?.avgPerDay?.toFixed(1) || 0}/D</div>
        <div>CHS  &gt; {stats?.uniqueChannels?.toLocaleString() || 0}</div>
        <div>NITE &gt; {i.nocturnal ?? 0}%</div>
        {top3[0] && <div>BOSS &gt; {top3[0].label.toUpperCase()}</div>}
      </div>
      <div className="mt-3 text-center text-[10px]" style={{ color: '#ff3366' }}>
        &gt; PRESS START &lt;
      </div>
      <div className="text-[8px] text-center mt-1" style={{ color: '#666' }}>
        #YT아케이드
      </div>
    </div>
  );
}

/* ===================== VARIANT 28 — STICKER NOTE ===================== */
function StickerNoteCard({ personality, top3, stats }) {
  const notes = [
    { bg: '#fff59d', rot: '-3deg', txt: `${personality.emoji} ${personality.name}` },
    { bg: '#ffccbc', rot: '2deg', txt: `"${personality.tagline}"` },
    { bg: '#c8e6c9', rot: '-1deg', txt: `총 ${stats?.total?.toLocaleString() || 0}편` },
    { bg: '#b3e5fc', rot: '3deg', txt: `하루 ${stats?.avgPerDay?.toFixed(1) || 0}편` },
    { bg: '#e1bee7', rot: '-2deg', txt: `채널 ${stats?.uniqueChannels?.toLocaleString() || 0}개` },
  ];
  const categoryNotes = top3.map((c, idx) => ({
    bg: ['#ffab91', '#90caf9', '#a5d6a7'][idx],
    rot: `${(idx - 1) * 4}deg`,
    txt: `${c.emoji} ${c.label} ${Math.round(c.ratio * 100)}%`,
  }));

  return (
    <div className="w-[320px] rounded-2xl p-5 shadow-glow-lg"
      style={{
        background: '#f5efe0',
        backgroundImage:
          'linear-gradient(#d7ccb0 1px, transparent 1px), linear-gradient(90deg, #d7ccb0 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="text-center mb-3">
        <div className="text-[10px] tracking-[0.3em] text-zinc-600 font-black">MY STICKY BOARD</div>
        <h3 className="text-lg font-black text-zinc-800">내 취향 메모판 📌</h3>
      </div>
      <div className="space-y-2">
        {[...notes, ...categoryNotes].map((n, idx) => (
          <div
            key={idx}
            className="px-3 py-2 text-sm font-bold text-zinc-900 shadow-md"
            style={{
              background: n.bg,
              transform: `rotate(${n.rot})`,
              fontFamily: 'Comic Sans MS, cursive',
            }}
          >
            {n.txt}
          </div>
        ))}
      </div>
      <div className="text-[9px] text-zinc-500 text-center mt-3 tracking-widest">#YT포스트잇</div>
    </div>
  );
}

/* ===================== VARIANT 29 — CHART (인포그래픽) ===================== */
function ChartCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const bars = [
    { label: '도파민', val: i.dopamine ?? 0, c: '#ef4444' },
    { label: '야행성', val: i.nocturnal ?? 0, c: '#6366f1' },
    { label: '탐험력', val: i.explorer ?? 0, c: '#14b8a6' },
    { label: '취향집중', val: i.picky ?? 0, c: '#ec4899' },
    { label: '충성도', val: i.loyalty ?? 0, c: '#f97316' },
    { label: '폭식형', val: i.binge ?? 0, c: '#eab308' },
    { label: '주말러', val: i.weekend ?? 0, c: '#0ea5e9' },
    { label: '아침형', val: i.morning ?? 0, c: '#fbbf24' },
    { label: '쇼츠력', val: i.shortsness ?? 0, c: '#22c55e' },
    { label: '규칙성', val: i.steady ?? 0, c: '#8b5cf6' },
  ];
  return (
    <div className="w-[320px] rounded-2xl p-5 shadow-glow-lg bg-white text-zinc-900">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${personality.gradient} flex items-center justify-center shrink-0`}>
          <span className="text-3xl">{personality.emoji}</span>
        </div>
        <div className="min-w-0">
          <div className="text-[10px] tracking-widest text-zinc-500">YT ANALYTICS</div>
          <div className="font-black leading-tight truncate">{personality.name}</div>
          <div className="text-[10px] text-zinc-500 italic truncate">"{personality.tagline}"</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {bars.map((b, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-14 text-[10px] font-bold text-zinc-600 shrink-0">{b.label}</div>
            <div className="flex-1 h-4 bg-zinc-100 rounded-sm overflow-hidden">
              <div className="h-full" style={{ width: `${b.val}%`, background: b.c }} />
            </div>
            <div className="w-7 text-[10px] tabular-nums text-right font-bold">{b.val}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        <div className="bg-zinc-100 rounded p-2">
          <div className="text-[9px] text-zinc-500">TOTAL</div>
          <div className="text-sm font-black">{stats?.total?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-zinc-100 rounded p-2">
          <div className="text-[9px] text-zinc-500">AVG/DAY</div>
          <div className="text-sm font-black">{stats?.avgPerDay?.toFixed(1) || 0}</div>
        </div>
        <div className="bg-zinc-100 rounded p-2">
          <div className="text-[9px] text-zinc-500">CHANNELS</div>
          <div className="text-sm font-black">{stats?.uniqueChannels?.toLocaleString() || 0}</div>
        </div>
      </div>
      <div className="text-[9px] text-zinc-400 text-center mt-2 tracking-widest">#YT인포그래픽</div>
    </div>
  );
}

/* ===================== VARIANT 30 — HOROSCOPE (별자리 운세) ===================== */
function HoroscopeCard({ personality, top3, stats, indices }) {
  const i = indices || {};
  const lucky = ((stats?.total || 0) % 9) + 1;
  const luckyDir = ['북', '북동', '동', '남동', '남', '남서', '서', '북서'][(stats?.peakHour || 0) % 8];
  return (
    <div className="w-[320px] rounded-3xl p-5 shadow-glow-lg relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #3b0764 100%)' }}
    >
      {/* stars */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff70 0.8px, transparent 1.5px), radial-gradient(#ffffff40 0.5px, transparent 1px)', backgroundSize: '26px 26px, 17px 17px' }}
      />
      <div className="relative z-10 text-indigo-100">
        <div className="text-center">
          <div className="text-[10px] tracking-[0.4em] font-black text-amber-300">✦ YT HOROSCOPE ✦</div>
          <div className="text-[10px] italic mt-0.5 text-indigo-300">{new Date().toLocaleDateString('ko-KR')}</div>
        </div>
        <div className="mt-3 bg-indigo-950/60 rounded-2xl p-3 border border-indigo-400/30 text-center">
          <div className="text-5xl">{personality.emoji}</div>
          <div className="text-lg font-black mt-1 leading-tight">{personality.name}</div>
          <div className="text-[10px] italic text-indigo-200">"{personality.tagline}"</div>
        </div>
        <div className="mt-3 space-y-1 text-[11px] leading-[18px]">
          <p>
            <b className="text-amber-300">💫 오늘의 운세:</b>{' '}
            {i.dopamine >= 60
              ? '폭풍 같은 도파민이 몰려온다. 쇼츠는 그만!'
              : i.explorer >= 60
              ? '새로운 채널과의 운명적 만남이 기다린다.'
              : '알고리즘이 당신을 특별히 총애하는 날.'}
          </p>
          <p>
            <b className="text-amber-300">🌙 주의:</b>{' '}
            {i.nocturnal >= 35 ? '새벽 3시의 연속재생을 경계하세요.' : '오후 6시경 한눈팔지 않도록.'}
          </p>
          <p>
            <b className="text-amber-300">✨ 행운의 방향:</b> {luckyDir}쪽 {stats?.peakDay || '오늘'}요일
          </p>
          <p>
            <b className="text-amber-300">🔢 행운의 숫자:</b> {lucky}
          </p>
          {top3[0] && (
            <p>
              <b className="text-amber-300">🎬 행운의 장르:</b> {top3[0].emoji} {top3[0].label}
            </p>
          )}
        </div>
        <div className="text-[9px] text-indigo-300/70 text-center mt-3 tracking-widest">#YT점성술</div>
      </div>
    </div>
  );
}
