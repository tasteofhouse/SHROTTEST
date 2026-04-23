import { useEffect, useMemo, useState } from 'react';
import LandingPage from './components/LandingPage';
import FileUpload from './components/FileUpload';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import { VariantSwitch, VARIANT_IDS } from './components/ShareCard';
import { buildSampleResult } from './utils/sampleData';
import { Play, Info, Shuffle, ExternalLink } from 'lucide-react';
import './App.css';

// Build synthetic personality/stats/top3/indices objects from a compact shared payload
function hydratePayload(payload) {
  if (!payload) return null;
  const personality = {
    id: payload.p,
    name: payload.n,
    emoji: payload.e,
    gradient: payload.g || 'from-rose-500 to-pink-500',
    vibe: payload.v || '',
    tagline: payload.tg || '',
    description: payload.tg || '',
  };
  const stats = {
    total: payload.t || 0,
    avgPerDay: payload.a || 0,
    uniqueChannels: payload.u || 0,
    peakHour: payload.h || 0,
    peakDay: payload.d || '',
    spanDays: payload.sd || 0,
    shortsCount: payload.sc || 0,
    maxDayCount: 0,
    maxDayDate: null,
  };
  const top3 = (payload.top || []).map((c) => ({
    id: c.id,
    emoji: c.e,
    label: c.l,
    ratio: (c.r || 0) / 100,
    count: c.c || 0,
  }));
  // For TierCard (uses full category list) — synthesize from top3 plus "기타"
  const topCategories = [...top3];
  const indices = payload.i || {
    dopamine: 0, nocturnal: 0, explorer: 0, picky: 0, loyalty: 0,
    binge: 0, weekend: 0, morning: 0, shortsness: 0, steady: 0,
  };
  return { personality, stats, top3, topCategories, indices };
}

// Shared result view — picks 1 of 30 variants at random (seeded by payload or fresh)
function SharedResultView({ payload, onStart }) {
  const data = useMemo(() => hydratePayload(payload), [payload]);
  const [variant, setVariant] = useState(() => {
    return VARIANT_IDS[Math.floor(Math.random() * VARIANT_IDS.length)];
  });

  if (!data) return null;

  const reshuffle = () => {
    const others = VARIANT_IDS.filter((v) => v !== variant);
    setVariant(others[Math.floor(Math.random() * others.length)]);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-full max-w-sm space-y-5">
        <div>
          <p className="text-xs text-zinc-500 tracking-wider">친구의 YouTube 취향</p>
          <p className="text-[10px] text-zinc-600 mt-0.5">랜덤으로 고른 카드 · 총 {VARIANT_IDS.length}종</p>
        </div>

        <div className="flex justify-center">
          <VariantSwitch
            variant={variant}
            personality={data.personality}
            top3={data.top3}
            stats={data.stats}
            indices={data.indices}
            topCategories={data.topCategories}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={reshuffle}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-100 text-sm hover:bg-zinc-800 transition"
          >
            <Shuffle className="w-4 h-4" />
            다른 카드 보기
          </button>
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-grad-yt text-white text-sm font-bold shadow-glow hover:opacity-90 transition"
          >
            <ExternalLink className="w-4 h-4" />
            나도 테스트
          </button>
        </div>

        <p className="text-[10px] text-zinc-600">
          새로고침하면 다른 스타일의 카드가 나와요
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // step: 'landing' | 'shared' | 'upload' | 'analyzing' | 'result' | 'sample'
  const [step, setStep] = useState('landing');
  const [views, setViews] = useState(null);
  const [result, setResult] = useState(null);
  const [sampleResult, setSampleResult] = useState(null);
  const [sharedPayload, setSharedPayload] = useState(null);

  // Parse shared link on first load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const payload = JSON.parse(decodeURIComponent(atob(hash.slice(7))));
        setSharedPayload(payload);
        setStep('shared');
      } catch {
        // Invalid hash, stay on landing
      }
    }
  }, []);

  const handleFileReady = (parsedViews) => {
    setViews(parsedViews);
    setStep('analyzing');
  };

  const handleAnalysisDone = (analysisResult) => {
    setViews(null); // clear raw data from memory immediately
    setResult(analysisResult);
    setStep('result');
  };

  const handleReset = () => {
    setViews(null);
    setResult(null);
    setSampleResult(null);
    // Clear hash if present
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    setStep('landing');
  };

  const handleStartSample = () => {
    setSampleResult(buildSampleResult());
    setStep('sample');
  };

  return (
    <div className="min-h-screen bg-bg text-zinc-100">
      {/* Ambient gradient background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-yt-red/20 blur-3xl" />
        <div className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full bg-yt-orange/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-yt-pink/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-20 bg-bg/80 backdrop-blur border-b border-zinc-900">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 rounded-lg bg-grad-yt flex items-center justify-center">
            <Play className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-bold text-zinc-100">Shorts Insight</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Info className="w-4 h-4" />
          <span className="hidden sm:inline">Privacy-first · 클라이언트사이드</span>
        </div>
      </header>

      {/* Content */}
      {step === 'landing' && (
        <LandingPage
          onStart={() => setStep('upload')}
          onTrySample={handleStartSample}
        />
      )}

      {step === 'shared' && sharedPayload && (
        <SharedResultView
          payload={sharedPayload}
          onStart={() => {
            setSharedPayload(null);
            history.replaceState(null, '', window.location.pathname);
            setStep('upload');
          }}
        />
      )}

      {step === 'upload' && (
        <FileUpload onParsed={handleFileReady} onBack={() => setStep('landing')} />
      )}

      {step === 'analyzing' && views && (
        <AnalysisProgress views={views} onDone={handleAnalysisDone} />
      )}

      {step === 'result' && result && (
        <Dashboard data={result} onReset={handleReset} />
      )}

      {step === 'sample' && sampleResult && (
        <Dashboard data={sampleResult} onReset={handleReset} isSample />
      )}
    </div>
  );
}
