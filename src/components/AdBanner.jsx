import { useEffect, useRef } from 'react';
import { Megaphone } from 'lucide-react';

// AdSense-compatible dummy banner. Wraps the <ins class="adsbygoogle"> tag so
// when the client plugs in their AdSense publisher ID + slot IDs, the same
// component renders real ads without layout shift.
//
// Until AdSense credentials are configured (VITE_ADSENSE_CLIENT env var),
// we show a fallback placeholder that maintains the same size as a real ad
// so the layout is stable and the user knows an ad slot exists here.
//
// Variants:
//   - leaderboard (728×90 / responsive ~100px tall)
//   - square (250×250 / responsive ~260px tall) — for in-stream
//   - banner (468×60) — compact

const VARIANT_META = {
  leaderboard: {
    minHeight: 'min-h-[92px]',
    label: '광고',
    format: 'horizontal',
  },
  square: {
    minHeight: 'min-h-[260px]',
    label: '광고',
    format: 'rectangle',
  },
  banner: {
    minHeight: 'min-h-[64px]',
    label: '광고',
    format: 'horizontal',
  },
};

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';

export default function AdBanner({ slot = 'default', variant = 'leaderboard' }) {
  const insRef = useRef(null);
  const pushed = useRef(false);
  const meta = VARIANT_META[variant] || VARIANT_META.leaderboard;

  useEffect(() => {
    // When a real AdSense client ID is configured, poke the ad queue so the
    // script fills this slot. Guarded so HMR doesn't double-push.
    if (!ADSENSE_CLIENT || pushed.current) return;
    try {
      // eslint-disable-next-line no-undef
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense script not loaded yet — placeholder stays visible */
    }
  }, [slot]);

  // No client ID → dev/staging fallback placeholder.
  if (!ADSENSE_CLIENT) {
    return (
      <div
        role="complementary"
        aria-label="광고 영역"
        className={`w-full ${meta.minHeight} rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/50 flex items-center justify-center gap-3 text-zinc-600`}
      >
        <Megaphone className="w-4 h-4" />
        <span className="text-xs tracking-wider">광고 영역 · {variant}</span>
        <span className="text-[10px] text-zinc-700">slot: {slot}</span>
      </div>
    );
  }

  // Real AdSense slot (when client ID is present via env).
  return (
    <div className={`w-full ${meta.minHeight} overflow-hidden rounded-2xl`}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={variant === 'square' ? 'rectangle' : 'auto'}
        data-full-width-responsive="true"
      />
    </div>
  );
}
