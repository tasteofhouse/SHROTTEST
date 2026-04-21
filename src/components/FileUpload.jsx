import { useCallback, useRef, useState } from 'react';
import { Upload, FileJson, Shield, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { readFileAsJSON, parseWatchHistory } from '../utils/parseHistory';

export default function FileUpload({ onParsed, onBack }) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.json')) {
        setError('JSON 파일만 업로드할 수 있어요.');
        return;
      }
      if (file.size > 300 * 1024 * 1024) {
        setError('파일 크기가 너무 커요. 300MB 이하만 지원해요.');
        return;
      }
      setError(null);
      setLoading(true);
      setProgress('파일 읽는 중...');
      try {
        const raw = await readFileAsJSON(file);
        setProgress('시청 기록 파싱 중...');
        await new Promise((r) => setTimeout(r, 30));
        const views = parseWatchHistory(raw);
        if (views.length === 0) {
          setError(
            'YouTube 시청 기록이 없어요. watch-history.json 또는 시청 기록.json 맞는지 확인해주세요.'
          );
          setLoading(false);
          return;
        }
        setProgress('분석 준비 중...');
        await new Promise((r) => setTimeout(r, 50));
        onParsed(views);
      } catch (err) {
        setError(err.message || '알 수 없는 오류가 발생했어요.');
        setLoading(false);
      } finally {
        setProgress('');
      }
    },
    [onParsed]
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl space-y-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          돌아가기
        </button>

        <div>
          <h2 className="text-2xl font-bold text-zinc-100">시청 기록 업로드</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Google Takeout에서 받은 JSON 파일을 올려주세요.
          </p>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-3xl border-2 border-dashed
            transition-all duration-200 p-12 text-center
            ${dragOver ? 'border-yt-red bg-yt-red/5 scale-[1.01]' : 'border-zinc-700 bg-bg-card hover:border-zinc-500'}
            ${loading ? 'pointer-events-none opacity-70' : ''}
          `}
          role="button"
          tabIndex={0}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <Loader2 className="w-14 h-14 text-yt-red animate-spin" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-grad-yt flex items-center justify-center shadow-glow">
                <Upload className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold text-zinc-100 mb-2">
                {loading ? progress || '읽는 중...' : '시청 기록 JSON 파일을 올려주세요'}
              </h3>
              <p className="text-zinc-400 text-sm">
                {loading
                  ? '잠시만 기다려주세요. 수십만 건도 문제없어요.'
                  : '드래그 앤 드롭 또는 클릭해서 업로드'}
              </p>
            </div>
            {!loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
                <FileJson className="w-4 h-4" />
                <span>watch-history.json 또는 시청 기록.json</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>모든 분석은 내 브라우저에서만 처리됩니다. 파일은 서버로 전송되지 않아요.</span>
        </div>
      </div>
    </div>
  );
}
