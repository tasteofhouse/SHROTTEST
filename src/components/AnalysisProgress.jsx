import { useEffect, useRef, useState } from 'react';
import { aggregateCategories } from '../utils/categorize';
import {
  analyzeHourDayHeatmap,
  analyzeTopChannels,
  analyzeDailyTrend,
  summaryStats,
  buildInsights,
  computeIndices,
} from '../utils/analyzePattern';
import { detectPersonality } from '../utils/detectPersonality';
import { saveAnalysis } from '../utils/historyStorage';

const STEPS = [
  { label: '파일 업로드 완료', desc: '시청 기록을 불러왔어요' },
  { label: '데이터 추출 중', desc: '채널과 카테고리를 분류하는 중...' },
  { label: '패턴 분석 중', desc: '시청 시간대·추이를 분석하는 중...' },
  { label: '결과 생성 중', desc: '취향 유형을 계산하는 중...' },
];

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function AnalysisProgress({ views, onDone }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(8);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function run() {
      // Step 0 — file already uploaded
      setCurrentStep(0);
      setProgress(15);
      await delay(350);

      // Step 1 — categorize + top channels
      setCurrentStep(1);
      setProgress(35);
      await delay(50); // yield to paint
      const topChannels = analyzeTopChannels(views, 25);
      const categoryDist = aggregateCategories(views);
      await delay(400);

      // Step 2 — stats + heatmap + trend
      setCurrentStep(2);
      setProgress(62);
      await delay(50);
      const stats = summaryStats(views);
      const heatmap = analyzeHourDayHeatmap(views);
      const trend = analyzeDailyTrend(views, 30);
      await delay(450);

      // Step 3 — personality + insights
      setCurrentStep(3);
      setProgress(85);
      await delay(50);
      const indices = computeIndices(stats, categoryDist, topChannels, views);
      const personality = detectPersonality(categoryDist, stats, {
        top3Share: indices.top3Share,
      });
      const insights = buildInsights(stats, categoryDist, topChannels, indices);
      const topCategories = [...categoryDist]
        .filter((c) => c.count > 0)
        .sort((a, b) => b.ratio - a.ratio);
      await delay(400);

      setProgress(100);
      await delay(300);

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
      };
      saveAnalysis(result);
      onDone(result);
    }

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center animate-fade-up">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-zinc-100">시청 기록 분석 중</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            {views?.length?.toLocaleString()}개 영상을 분석하고 있어요
          </p>
        </div>

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
                <span className="text-xs text-emerald-500">완료</span>
              )}
              {i === currentStep && (
                <span className="text-xs text-yt-orange animate-pulse">진행 중</span>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600">
          파일은 분석 완료 후 메모리에서 즉시 제거됩니다
        </p>
      </div>
    </div>
  );
}
