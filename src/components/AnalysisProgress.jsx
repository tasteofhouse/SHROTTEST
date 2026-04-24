import { useEffect, useRef, useState } from 'react';
import { aggregateCategories } from '../utils/categorize';
import {
  analyzeHourDayHeatmap,
  analyzeTopChannels,
  analyzeDailyTrend,
  summaryStats,
  buildInsights,
  computeIndices,
  splitBySource,
  analyzeMusicViews,
} from '../utils/analyzePattern';
import { detectPersonality } from '../utils/detectPersonality';
import { saveAnalysis } from '../utils/historyStorage';
import AdBanner from './AdBanner';
import { useT } from '../i18n/index.jsx';

// Enforce a minimum duration on the loading screen — the analysis itself is
// usually sub-second for 5k views, but the user deserves a beat to absorb
// the transition (and we monetize the dwell with an interstitial ad).
const MIN_LOADING_MS = 5000;

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function AnalysisProgress({ views, onDone }) {
  const { t } = useT();
  const flavorList = t('analysis.flavor');
  const flavorArr = Array.isArray(flavorList) ? flavorList : [];
  const STEPS = [
    { label: t('analysis.step0.label'), desc: t('analysis.step0.desc') },
    { label: t('analysis.step1.label'), desc: t('analysis.step1.desc') },
    { label: t('analysis.step2.label'), desc: t('analysis.step2.desc') },
    { label: t('analysis.step3.label'), desc: t('analysis.step3.desc') },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(8);
  const [flavorIdx, setFlavorIdx] = useState(0);
  const ran = useRef(false);

  // Rotate the flavor tagline every ~1.2s to keep the screen alive.
  useEffect(() => {
    const h = setInterval(() => {
      setFlavorIdx((i) => (i + 1) % Math.max(1, flavorArr.length));
    }, 1200);
    return () => clearInterval(h);
  }, [flavorArr.length]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const startedAt = Date.now();

    async function run() {
      // Step 0 — file already uploaded. Split views by source first so music
      // (YouTube Music) is tracked separately and doesn't pollute category/
      // personality analysis, which should reflect YouTube side only.
      setCurrentStep(0);
      setProgress(15);
      const { music: musicViews, shorts: shortsViews, video: videoViews, yt: ytViews } = splitBySource(views);
      const sourceCounts = {
        total: views.length,
        video: videoViews.length,
        shorts: shortsViews.length,
        music: musicViews.length,
        youtubeTotal: ytViews.length,
      };
      await delay(350);

      // Step 1 — categorize + top channels (YouTube side only)
      setCurrentStep(1);
      setProgress(35);
      await delay(50); // yield to paint
      const topChannels = analyzeTopChannels(ytViews, 25);
      const categoryDist = aggregateCategories(ytViews);
      await delay(400);

      // Step 2 — stats + heatmap + trend (YouTube side) + music listen stats
      setCurrentStep(2);
      setProgress(62);
      await delay(50);
      const stats = summaryStats(ytViews);
      const heatmap = analyzeHourDayHeatmap(ytViews);
      const trend = analyzeDailyTrend(ytViews, 30);
      const musicInsight = analyzeMusicViews(musicViews);
      await delay(450);

      // Step 3 — personality + insights
      setCurrentStep(3);
      setProgress(85);
      await delay(50);
      const indices = computeIndices(stats, categoryDist, topChannels, ytViews);
      const personality = detectPersonality(categoryDist, stats, {
        top3Share: indices.top3Share,
        indices,
      });
      const insights = buildInsights(stats, categoryDist, topChannels, indices);
      const topCategories = [...categoryDist]
        .filter((c) => c.count > 0)
        .sort((a, b) => b.ratio - a.ratio);
      await delay(400);

      setProgress(100);

      // Enforce minimum dwell time — user sees the ad, the flavor rotates,
      // and the transition feels substantive rather than flickering.
      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_LOADING_MS) {
        await delay(MIN_LOADING_MS - elapsed);
      } else {
        await delay(300);
      }

      const result = {
        categoryDist,
        stats,
        heatmap,
        trend,
        topChannels: topChannels.slice(0, 20),
        indices,
        personality,
        insights,
        topCategories,
        sourceCounts,
        musicInsight,
      };
      saveAnalysis(result);
      onDone(result);
    }

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center animate-fade-up">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-zinc-100">{t('analysis.title')}</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {t('analysis.subtitle', { n: views?.length?.toLocaleString?.() ?? 0 })}
          </p>
          {/* Rotating flavor line — text fades between rotations */}
          <p
            key={flavorIdx}
            className="mt-3 text-sm font-semibold text-yt-orange animate-fade-up"
          >
            {flavorArr[flavorIdx] || ''}
          </p>
        </div>

        {/* Interstitial square ad — the main monetization surface of the loading screen */}
        <AdBanner slot="analysis-interstitial" variant="square" />

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{STEPS[currentStep]?.desc}</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-grad-yt rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step list */}
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300
                  ${i < currentStep
                    ? 'bg-emerald-500 text-white'
                    : i === currentStep
                    ? 'bg-yt-red text-white shadow-glow animate-pulse'
                    : 'bg-zinc-800 text-zinc-500'
                  }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <span
                  className={`text-sm transition-colors duration-300
                    ${i < currentStep
                      ? 'text-emerald-400'
                      : i === currentStep
                      ? 'text-zinc-100 font-medium'
                      : 'text-zinc-600'
                    }`}
                >
                  {step.label}
                </span>
              </div>
              {i < currentStep && (
                <span className="text-xs text-emerald-500">{t('analysis.stepDone')}</span>
              )}
              {i === currentStep && (
                <span className="text-xs text-yt-orange animate-pulse">{t('analysis.stepInProgress')}</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600">
          {t('analysis.privacyNote')}
        </p>
      </div>
    </div>
  );
}
