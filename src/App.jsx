import { useEffect, useState } from 'react';
import LandingPage from './components/LandingPage';
import FileUpload from './components/FileUpload';
import AnalysisProgress from './components/AnalysisProgress';
import Dashboard from './components/Dashboard';
import { Play, Info } from 'lucide-react';
import './App.css';

// Shared result view shown when someone opens a shared link
function SharedResultView({ payload, onStart }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-sm space-y-5">
        <p className="text-xs text-zinc-500 tracking-wider">친구의 YouTube 취향</p>
        <div className="text-7xl">{payload.e}</div>
        <h2 className="text-3xl font-bold text-zinc-100">{payload.n}</h2>
        {payload.top?.length > 0 && (
          <div className="flex flex-col gap-2">
            {payload.top.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-4 py-2 rounded-xl bg-bg-card border border-zinc-800"
              >
                <span className="text-sm text-zinc-300">{c.e} {c.l}</span>
                <span className="text-sm font-semibold text-zinc-100">{c.r}%</span>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-zinc-500">총 {payload.t?.toLocaleString()}편 시청</p>
        <button
          onClick={onStart}
          className="w-full py-3 rounded-2xl bg-grad-yt text-white font-bold shadow-glow hover:opacity-90 transition"
        >
          나도 테스트해보기
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // step: 'landing' | 'shared' | 'upload' | 'analyzing' | 'result'
  const [step, setStep] = useState('landing');
  const [views, setViews] = useState(null);
  const [result, setResult] = useState(null);
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
    // Clear hash if present
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
    }
    setStep('landing');
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
      {step === 'landing' && <LandingPage onStart={() => setStep('upload')} />}

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
    </div>
  );
}
