import { useEffect, useRef } from 'react';
import { Megaphone } from 'lucide-react';
import { useT } from '../i18n/index.jsx';

// Google AdSense slot wrapper.
//
// Configuration via build-time env (Vite's `import.meta.env`):
//   VITE_ADSENSE_CLIENT  — your `ca-pub-XXXXXXXXXXXXXXXX` publisher ID.
//   VITE_ADSENSE_SLOT_*  — optional per-slot data-ad-slot IDs (each slot is
//                          ten digits as shown in AdSense console). Falls
//                          back to the `slot` prop when not provided.
//
// The script tag is injected into <head> exactly once at runtime — see
// `ensureAdsScript` below. Without VITE_ADSENSE_CLIENT we render a dashed
// placeholder of the same height so layout doesn't shift between dev/prod.
//
// Variants and corresponding AdSense formats:
//   - leaderboard (728×90 / responsive ~100px tall)  →  data-ad-format="auto"
//   - square      (250×250 / responsive ~260px tall) →  data-ad-format="rectangle"
//   - banner      (468×60 / compact)                  →  data-ad-format="auto"

const VARIANT_META = {
  leaderboard: { minHeight: 'min-h-[92px]', format: 'auto' },
  square:      { minHeight: 'min-h-[260px]', format: 'rectangle' },
  banner:      { minHeight: 'min-h-[64px]', format: 'auto' },
};

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';
const ADSENSE_TEST   = import.meta.env.VITE_ADSENSE_TEST === 'true';

// Map slot key → real Ad slot ID from env (optional, falls back to slot prop).
const SLOT_FROM_ENV = {
  'dashboard-top':            import.meta.env.VITE_ADSENSE_SLOT_DASHBOARD_TOP,
  'dashboard-bottom':         import.meta.env.VITE_ADSENSE_SLOT_DASHBOARD_BOTTOM,
  'analysis-interstitial':    import.meta.env.VITE_ADSENSE_SLOT_ANALYSIS,
};

// Inject the AdSense loader script tag exactly once. Idempotent — safe to call
// from every <AdBanner /> instance.
function ensureAdsScript() {
  if (typeof document === 'undefined' || !ADSENSE_CLIENT) return;
  if (document.querySelector('script[data-adsense-loader]')) return;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.setAttribute('data-adsense-loader', 'true');
  document.head.appendChild(s);
}

export default function AdBanner({ slot = 'default', variant = 'leaderboard' }) {
  const { t } = useT();
  const insRef = useRef(null);
  const pushed = useRef(false);
  const meta = VARIANT_META[variant] || VARIANT_META.leaderboard;
  const slotId = SLOT_FROM_ENV[slot] || slot;

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    ensureAdsScript();
    if (pushed.current) return;
    // Defer push to next tick so the loader has a moment to attach.
    const id = window.setTimeout(() => {
      try {
        // eslint-disable-next-line no-undef
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        /* loader not ready yet — leave the <ins> for AdSense to fill later */
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [slot]);

  // No client ID → dev/staging fallback placeholder.
  if (!ADSENSE_CLIENT) {
    const label = t('app.adLabel') || '광고';
    return (
      <div
        role="complementary"
        aria-label={label}
        className={`w-full ${meta.minHeight} rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center gap-3 text-zinc-600`}
      >
        <Megaphone className="w-4 h-4" />
        <span className="text-xs tracking-wider">{label} · {variant}</span>
        <span className="text-[10px] text-zinc-700">slot: {slot}</span>
      </div>
    );
  }

  // Real AdSense slot.
  return (
    <div className={`w-full ${meta.minHeight} overflow-hidden rounded-2xl`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={meta.format}
        data-full-width-responsive="true"
        {...(ADSENSE_TEST ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  );
}
