import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Upload, FileJson, Shield, Loader2, AlertCircle, ArrowLeft,
  Smartphone, ClipboardPaste, FolderOpen, HelpCircle, Plane,
} from 'lucide-react';
import {
  readFileAsText,
  parseWatchHistory,
  parseWatchHistoryHTML,
  parseWatchHistoryAuto,
} from '../utils/parseHistory';

// --- Lightweight mobile UA detection (heuristic only — no server round-trip) ---
function detectIsMobile() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /android|iphone|ipad|ipod|mobile|opera mini/i.test(ua);
}

export default function FileUpload({ onParsed, onBack }) {
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef(null);
  const inputAltRef = useRef(null); // fallback input with permissive accept

  const isMobile = useMemo(() => detectIsMobile(), []);

  // Run the parser appropriate to the source. Takes raw input (JSON value,
  // JSON text, or HTML text) plus an optional filename hint so HTML and JSON
  // take different fast paths.
  const processRaw = useCallback(
    async (raw, sourceLabel = 'paste', filenameHint = '') => {
      setError(null);
      setLoading(true);
      setProgress('시청 기록 파싱 중...');
      try {
        await new Promise((r) => setTimeout(r, 20));
        let views;
        if (typeof raw === 'string') {
          views = parseWatchHistoryAuto(raw, filenameHint);
        } else {
          views = parseWatchHistory(raw);
        }
        if (views.length === 0) {
          setError(
            'YouTube 시청 기록이 없어요. watch-history (JSON 또는 HTML) 맞는지 확인해주세요.'
          );
          setLoading(false);
          return;
        }
        setProgress('분석 준비 중...');
        await new Promise((r) => setTimeout(r, 40));
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

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      // Accept JSON and HTML. Google Takeout defaults to HTML, so many users
      // arrive with watch-history.html without ever switching the format.
      const nameOk = /\.(json|html?|txt)$/i.test(file.name);
      const mimeOk = !file.type || /json|text|octet|html/i.test(file.type);
      if (!nameOk && !mimeOk) {
        setError('JSON 또는 HTML 파일만 업로드할 수 있어요.');
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        setError('파일 크기가 너무 커요. 500MB 이하만 지원해요.');
        return;
      }
      setError(null);
      setLoading(true);
      setProgress('파일 읽는 중...');
      try {
        const isHTML = /\.html?$/i.test(file.name) || /html/i.test(file.type || '');
        if (isHTML) {
          const text = await readFileAsText(file);
          await processRaw(text, 'file', file.name);
        } else {
          // Read as text so we can sniff — JSON path still works via auto.
          const text = await readFileAsText(file);
          await processRaw(text, 'file', file.name);
        }
      } catch (err) {
        setError(err.message || '알 수 없는 오류가 발생했어요.');
        setLoading(false);
        setProgress('');
      }
    },
    [processRaw]
  );

  const handlePaste = useCallback(async () => {
    if (!pasteText.trim()) {
      setError('붙여넣을 내용이 비어 있어요.');
      return;
    }
    // Auto-detect JSON vs HTML — user might paste either one.
    await processRaw(pasteText, 'paste');
  }, [pasteText, processRaw]);

  const handleClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setError('이 브라우저는 클립보드 읽기를 지원하지 않아요. 아래 창에 직접 붙여넣어 주세요.');
        setShowPaste(true);
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || text.length < 10) {
        setError('클립보드가 비어있어요.');
        return;
      }
      setPasteText(text);
      setShowPaste(true);
      // Auto-process — handles both JSON and HTML via sniffing.
      await processRaw(text, 'clipboard');
    } catch (e) {
      setError('클립보드 접근 권한을 허용해주세요: ' + (e.message || ''));
    }
  }, [processRaw]);

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
            Google Takeout에서 받은 JSON 또는 HTML 파일을 올려주세요.
          </p>
        </div>

        {/* Airplane-mode / privacy hero badge — addresses the #1 trust
            concern ("will my data leave my machine?") head-on. */}
        <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Plane className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-300">
              서버 전송 절대 없음 · 의심스러우면 비행기 모드 켜고 테스트하세요
            </p>
            <p className="text-xs text-emerald-400/80 leading-relaxed mt-1">
              Wi-Fi / 셀룰러를 꺼도 분석이 정상 동작합니다. 네트워크 탭을 열어도
              업로드 요청은 나가지 않아요. 파일은 메모리에서 즉시 증발.
            </p>
          </div>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`
            relative rounded-3xl border-2 border-dashed
            transition-all duration-200 p-8 md:p-12 text-center
            ${dragOver ? 'border-yt-red bg-yt-red/5 scale-[1.01]' : 'border-zinc-700 bg-bg-card'}
            ${loading ? 'pointer-events-none opacity-70' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".json,.html,.htm,application/json,text/json,text/html,text/plain"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {/* Fallback input without accept (some mobile Files apps hide .json when accept is strict) */}
          <input
            ref={inputAltRef}
            type="file"
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
              <h3 className="text-xl md:text-2xl font-semibold text-zinc-100 mb-2">
                {loading ? progress || '읽는 중...' : '시청 기록 HTML 또는 JSON 파일을 올려주세요'}
              </h3>
              <p className="text-zinc-400 text-sm">
                {loading
                  ? '잠시만 기다려주세요. 수십만 건도 문제없어요.'
                  : isMobile
                  ? '아래 버튼을 눌러 파일을 선택하거나, 내용을 붙여넣으세요.'
                  : '드래그 앤 드롭하거나 아래 버튼을 눌러 업로드 (HTML · JSON 둘 다 OK)'}
              </p>
            </div>

            {!loading && (
              <div className="w-full max-w-sm flex flex-col gap-2 mt-2">
                {/* Primary: strict accept picker */}
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-grad-yt text-white font-semibold shadow-glow hover:opacity-90 transition"
                >
                  <FolderOpen className="w-4 h-4" />
                  파일 선택 (HTML · JSON)
                </button>

                {/* Mobile fallback: all-file picker (iOS Safari sometimes hides .json) */}
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => inputAltRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-200 text-sm hover:bg-zinc-800 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    모바일: 모든 파일에서 선택
                  </button>
                )}

                {/* Paste fallback */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleClipboard}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-800 transition"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    클립보드 붙여넣기
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaste((v) => !v)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-800 transition"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    {showPaste ? '붙여넣기 닫기' : '직접 붙여넣기 (HTML·JSON)'}
                  </button>
                </div>
              </div>
            )}

            {!loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                <FileJson className="w-4 h-4" />
                <span>watch-history.html / .json (기본 HTML 그대로도 OK)</span>
              </div>
            )}
          </div>
        </div>

        {/* Paste-text area */}
        {showPaste && !loading && (
          <div className="rounded-2xl bg-bg-card border border-zinc-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-200 font-semibold">직접 붙여넣기 (HTML · JSON)</div>
              <span className="text-[10px] text-zinc-500">모바일에서 파일 선택이 안될 때</span>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder='<!-- HTML 전체 복사 -->  또는  [ { "header": "YouTube", "title": "...", ... }, ... ]'
              className="w-full h-40 rounded-xl bg-bg border border-zinc-800 p-3 text-xs text-zinc-200 font-mono resize-y"
            />
            <button
              onClick={handlePaste}
              className="w-full py-2.5 rounded-xl bg-grad-yt text-white text-sm font-semibold hover:opacity-90 transition"
            >
              업로드
            </button>
          </div>
        )}

        {/* Help block — especially useful on mobile */}
        {!loading && (
          <button
            onClick={() => setShowHelp((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
          >
            <HelpCircle className="w-4 h-4" />
            {showHelp ? '도움말 닫기' : '파일을 못 찾겠어요'}
          </button>
        )}

        {showHelp && (
          <div className="rounded-2xl bg-bg-card border border-zinc-800 p-4 text-xs text-zinc-300 leading-relaxed space-y-2">
            <p className="font-semibold text-zinc-100">모바일에서 업로드가 안 되시나요?</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Takeout 압축파일(.zip)을 먼저 풀어주세요 — iOS는 "파일 앱 → 길게 눌러 압축 해제".</li>
              <li>압축을 풀면 <code className="text-yt-pink">Takeout/YouTube/시청기록/시청 기록.html</code> 또는 <code className="text-yt-pink">.json</code> 경로에 있어요 (기본 설정은 .html).</li>
              <li>파일 선택이 안 보이면 "모든 파일에서 선택"으로 .html 또는 .json을 직접 고르세요.</li>
              <li>여전히 안 되면 JSON 내용을 복사해서 "직접 붙여넣기"에 넣어도 돼요.</li>
              <li>데스크톱 크롬/사파리가 가장 안정적이에요 — 모바일에서 실패하면 PC를 권장드려요.</li>
            </ol>
          </div>
        )}

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
