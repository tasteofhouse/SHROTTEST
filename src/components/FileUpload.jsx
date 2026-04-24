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
import { useT } from '../i18n/index.jsx';

// --- Lightweight mobile UA detection (heuristic only — no server round-trip) ---
function detectIsMobile() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /android|iphone|ipad|ipod|mobile|opera mini/i.test(ua);
}

export default function FileUpload({ onParsed, onBack }) {
  const { t } = useT();
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
      setProgress(t('upload.progress.parsing'));
      try {
        await new Promise((r) => setTimeout(r, 20));
        let views;
        if (typeof raw === 'string') {
          views = parseWatchHistoryAuto(raw, filenameHint);
        } else {
          views = parseWatchHistory(raw);
        }
        if (views.length === 0) {
          setError(t('upload.errors.noHistory'));
          setLoading(false);
          return;
        }
        setProgress(t('upload.progress.ready'));
        await new Promise((r) => setTimeout(r, 40));
        onParsed(views);
      } catch (err) {
        setError(err.message || t('upload.errors.unknown'));
        setLoading(false);
      } finally {
        setProgress('');
      }
    },
    [onParsed, t]
  );

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      // Accept JSON and HTML. Google Takeout defaults to HTML, so many users
      // arrive with watch-history.html without ever switching the format.
      const nameOk = /\.(json|html?|txt)$/i.test(file.name);
      const mimeOk = !file.type || /json|text|octet|html/i.test(file.type);
      if (!nameOk && !mimeOk) {
        setError(t('upload.errors.invalidType'));
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        setError(t('upload.errors.tooLarge'));
        return;
      }
      setError(null);
      setLoading(true);
      setProgress(t('upload.progress.reading'));
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
        setError(err.message || t('upload.errors.unknown'));
        setLoading(false);
        setProgress('');
      }
    },
    [processRaw, t]
  );

  const handlePaste = useCallback(async () => {
    if (!pasteText.trim()) {
      setError(t('upload.errors.empty'));
      return;
    }
    // Auto-detect JSON vs HTML — user might paste either one.
    await processRaw(pasteText, 'paste');
  }, [pasteText, processRaw, t]);

  const handleClipboard = useCallback(async () => {
    try {
      if (!navigator.clipboard?.readText) {
        setError(t('upload.errors.clipboardUnsupported'));
        setShowPaste(true);
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || text.length < 10) {
        setError(t('upload.errors.clipboardEmpty'));
        return;
      }
      setPasteText(text);
      setShowPaste(true);
      // Auto-process — handles both JSON and HTML via sniffing.
      await processRaw(text, 'clipboard');
    } catch (e) {
      setError(t('upload.errors.clipboardDenied', { msg: e.message || '' }));
    }
  }, [processRaw, t]);

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
          {t('common.back')}
        </button>

        <div>
          <h2 className="text-2xl font-bold text-zinc-100">{t('upload.title')}</h2>
          <p className="text-zinc-400 text-sm mt-1">
            {t('upload.subtitle')}
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
              {t('upload.airplane.title')}
            </p>
            <p className="text-xs text-emerald-400/80 leading-relaxed mt-1">
              {t('upload.airplane.body')}
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
                {loading ? progress || t('common.loading') : t('upload.dropzone.heading')}
              </h3>
              <p className="text-zinc-400 text-sm">
                {loading
                  ? t('upload.dropzone.loading')
                  : isMobile
                  ? t('upload.dropzone.hintMobile')
                  : t('upload.dropzone.hintDesktop')}
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
                  {t('upload.dropzone.btnPrimary')}
                </button>

                {/* Mobile fallback: all-file picker (iOS Safari sometimes hides .json) */}
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => inputAltRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-200 text-sm hover:bg-zinc-800 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    {t('upload.dropzone.btnMobileFallback')}
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
                    {t('upload.dropzone.btnClipboard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPaste((v) => !v)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-bg-elevated border border-zinc-700 text-zinc-200 text-xs hover:bg-zinc-800 transition"
                  >
                    <FileJson className="w-3.5 h-3.5" />
                    {showPaste ? t('upload.dropzone.btnPasteClose') : t('upload.dropzone.btnPasteOpen')}
                  </button>
                </div>
              </div>
            )}

            {!loading && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                <FileJson className="w-4 h-4" />
                <span>{t('upload.dropzone.formatHint')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Paste-text area */}
        {showPaste && !loading && (
          <div className="rounded-2xl bg-bg-card border border-zinc-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-200 font-semibold">{t('upload.paste.title')}</div>
              <span className="text-[10px] text-zinc-500">{t('upload.paste.hint')}</span>
            </div>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={t('upload.paste.placeholder')}
              className="w-full h-40 rounded-xl bg-bg border border-zinc-800 p-3 text-xs text-zinc-200 font-mono resize-y"
            />
            <button
              onClick={handlePaste}
              className="w-full py-2.5 rounded-xl bg-grad-yt text-white text-sm font-semibold hover:opacity-90 transition"
            >
              {t('upload.paste.submit')}
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
            {showHelp ? t('upload.help.close') : t('upload.help.open')}
          </button>
        )}

        {showHelp && (
          <div className="rounded-2xl bg-bg-card border border-zinc-800 p-4 text-xs text-zinc-300 leading-relaxed space-y-2">
            <p className="font-semibold text-zinc-100">{t('upload.help.title')}</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>{t('upload.help.step1')}</li>
              <li>{t('upload.help.step2')}</li>
              <li>{t('upload.help.step3')}</li>
              <li>{t('upload.help.step4')}</li>
              <li>{t('upload.help.step5')}</li>
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
          <span>{t('upload.footer')}</span>
        </div>
      </div>
    </div>
  );
}
