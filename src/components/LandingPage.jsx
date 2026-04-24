import { useState } from 'react';
import {
  Play,
  Shield,
  Zap,
  BarChart2,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Beaker,
  Plane,
} from 'lucide-react';
import { useT } from '../i18n/index.jsx';

// Pre-configured URL: deep-links into Takeout with YouTube pre-selected, so
// the user only has to scroll, toggle "history" and download.
const TAKEOUT_DIRECT = 'https://takeout.google.com/takeout/custom/youtube';

// Inline SVG illustrations for each step — keeps it visual without hosting images.
// Palettes match YouTube / Takeout brand vibe.
function TakeoutPortal() {
  return (
    <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden>
      <defs>
        <linearGradient id="tp-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f2937" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="118" height="70" rx="6" fill="url(#tp-bg)" stroke="#334155" />
      {/* browser chrome */}
      <circle cx="8" cy="8" r="2" fill="#ef4444" />
      <circle cx="14" cy="8" r="2" fill="#f59e0b" />
      <circle cx="20" cy="8" r="2" fill="#10b981" />
      <rect x="30" y="4" width="80" height="8" rx="4" fill="#1e293b" stroke="#334155" />
      <text x="34" y="10" fontSize="5" fill="#94a3b8">takeout.google.com</text>
      {/* google-colored logo */}
      <g transform="translate(14,26)">
        <circle r="4" fill="#4285F4" />
        <circle cx="10" r="4" fill="#EA4335" />
        <circle cx="20" r="4" fill="#FBBC05" />
        <circle cx="30" r="4" fill="#34A853" />
      </g>
      <rect x="10" y="40" width="100" height="6" rx="2" fill="#1e293b" />
      <rect x="10" y="50" width="65" height="6" rx="2" fill="#1e293b" />
      <rect x="10" y="60" width="40" height="6" rx="2" fill="#3b82f6" />
    </svg>
  );
}

function SelectYouTubeIllustration() {
  return (
    <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden>
      <rect x="1" y="1" width="118" height="70" rx="6" fill="#0f172a" stroke="#334155" />
      {/* unchecked item */}
      <rect x="8" y="8" width="104" height="14" rx="3" fill="#1e293b" />
      <rect x="12" y="12" width="6" height="6" rx="1" fill="none" stroke="#475569" strokeWidth="1" />
      <text x="22" y="17" fontSize="5" fill="#64748b">Google Photos</text>
      {/* checked YouTube row */}
      <rect x="8" y="26" width="104" height="14" rx="3" fill="#1e293b" stroke="#ef4444" />
      <rect x="12" y="30" width="6" height="6" rx="1" fill="#ef4444" />
      <path d="M13 33 l1.5 1.5 L17 32" stroke="#fff" strokeWidth="1" fill="none" />
      <rect x="22" y="30" width="4" height="3" rx="1" fill="#ef4444" />
      <polygon points="24.5,30.5 24.5,32.5 26,31.5" fill="#fff" />
      <text x="30" y="35" fontSize="5.5" fill="#f1f5f9" fontWeight="bold">YouTube 및 YouTube Music ✓</text>
      {/* unchecked items */}
      <rect x="8" y="44" width="104" height="14" rx="3" fill="#1e293b" />
      <rect x="12" y="48" width="6" height="6" rx="1" fill="none" stroke="#475569" strokeWidth="1" />
      <text x="22" y="53" fontSize="5" fill="#64748b">Google Drive</text>
    </svg>
  );
}

function HistoryOnlyIllustration() {
  return (
    <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden>
      <rect x="1" y="1" width="118" height="70" rx="6" fill="#0f172a" stroke="#334155" />
      {/* Format: JSON badge */}
      <rect x="8" y="6" width="104" height="10" rx="2" fill="#1e293b" />
      <text x="11" y="13" fontSize="5" fill="#94a3b8">형식</text>
      <rect x="85" y="7" width="23" height="8" rx="2" fill="#3b82f6" />
      <text x="88" y="13" fontSize="5" fill="#fff" fontWeight="bold">JSON ✓</text>
      {/* item list */}
      {[
        { y: 20, label: '구독', on: false },
        { y: 32, label: '기록 (history)', on: true },
        { y: 44, label: '댓글', on: false },
        { y: 56, label: '재생목록', on: false },
      ].map((it, i) => (
        <g key={i}>
          <rect x="8" y={it.y} width="104" height="10" rx="2" fill={it.on ? '#1e293b' : '#111827'} stroke={it.on ? '#10b981' : 'none'} />
          <rect x="12" y={it.y + 3} width="5" height="5" rx="1" fill={it.on ? '#10b981' : 'none'} stroke={it.on ? 'none' : '#475569'} />
          {it.on && <path d={`M13 ${it.y + 5.5} l1.2 1.2 L16.5 ${it.y + 4}`} stroke="#fff" strokeWidth="1" fill="none" />}
          <text x="22" y={it.y + 7} fontSize="5.5" fill={it.on ? '#f1f5f9' : '#64748b'} fontWeight={it.on ? 'bold' : 'normal'}>
            {it.label} {it.on ? '✓' : ''}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ExportIllustration() {
  return (
    <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden>
      <rect x="1" y="1" width="118" height="70" rx="6" fill="#0f172a" stroke="#334155" />
      {/* section header */}
      <text x="10" y="14" fontSize="6" fill="#94a3b8">내보내기 방식</text>
      <rect x="10" y="20" width="100" height="10" rx="2" fill="#1e293b" />
      <text x="14" y="27" fontSize="5" fill="#f1f5f9">📥 1회 내보내기 · .zip · 2GB</text>
      {/* email preview */}
      <rect x="10" y="36" width="100" height="20" rx="2" fill="#1e293b" stroke="#475569" />
      <rect x="14" y="40" width="30" height="4" rx="1" fill="#ef4444" />
      <text x="14" y="50" fontSize="4.5" fill="#94a3b8">📧 "다운로드 준비 완료" 메일 대기</text>
      {/* big button */}
      <rect x="30" y="60" width="60" height="9" rx="3" fill="#3b82f6" />
      <text x="42" y="66" fontSize="5.5" fill="#fff" fontWeight="bold">내보내기 만들기 ▶</text>
    </svg>
  );
}

function UnzipIllustration() {
  return (
    <svg viewBox="0 0 120 72" className="w-full h-full" aria-hidden>
      <rect x="1" y="1" width="118" height="70" rx="6" fill="#0f172a" stroke="#334155" />
      {/* zip file */}
      <g transform="translate(8,10)">
        <rect width="24" height="30" rx="3" fill="#fbbf24" />
        <rect x="2" y="4" width="20" height="3" fill="#f59e0b" />
        <rect x="2" y="9" width="20" height="3" fill="#f59e0b" />
        <text x="6" y="23" fontSize="5" fill="#78350f" fontWeight="bold">.zip</text>
      </g>
      {/* arrow */}
      <path d="M38 25 L48 25 M44 21 L48 25 L44 29" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      {/* folder */}
      <g transform="translate(52,8)">
        <path d="M0 5 L8 5 L10 0 L28 0 L28 34 L0 34 Z" fill="#60a5fa" />
        <rect x="0" y="5" width="28" height="29" fill="#3b82f6" />
        <text x="3" y="20" fontSize="4.5" fill="#fff">Takeout /</text>
        <text x="3" y="26" fontSize="4.5" fill="#fff">YouTube /</text>
        <text x="3" y="32" fontSize="4.5" fill="#fff">기록 /</text>
      </g>
      {/* JSON file */}
      <g transform="translate(88,12)">
        <rect width="24" height="26" rx="2" fill="#10b981" />
        <text x="3" y="10" fontSize="4" fill="#064e3b" fontWeight="bold">watch-</text>
        <text x="3" y="16" fontSize="4" fill="#064e3b" fontWeight="bold">history</text>
        <text x="3" y="22" fontSize="4.5" fill="#064e3b" fontWeight="bold">.json</text>
      </g>
    </svg>
  );
}

const GUIDE_STEPS = [
  {
    num: '1',
    emoji: '🌐',
    title: 'Google Takeout · YouTube 전용 페이지 열기',
    desc: (
      <>
        아래 <strong className="text-zinc-200">바로가기 링크</strong>를 누르면 YouTube가 이미 선택된
        상태로 Takeout 페이지가 열려요. 평소 쓰는 구글 계정으로 자동 로그인돼요.
      </>
    ),
    action: { text: 'Takeout (YouTube 선택됨) 열기', href: TAKEOUT_DIRECT },
    tip: '💡 스마트폰보다 PC에서 하면 편해요. 여러 계정 쓰신다면 YouTube 쓰는 계정으로 로그인!',
    Illustration: TakeoutPortal,
  },
  {
    num: '2',
    emoji: '☑️',
    title: 'YouTube만 선택됐는지 확인',
    desc: (
      <>
        링크로 들어가면 자동으로 <strong className="text-zinc-200">"YouTube 및 YouTube Music"</strong>만
        체크돼 있어요. 다른 항목이 체크돼 있지 않은지 한 번 훑어주세요.
      </>
    ),
    tip: '💡 다른 항목이 체크되면 파일이 수 GB까지 커질 수 있어요',
    Illustration: SelectYouTubeIllustration,
  },
  {
    num: '3',
    emoji: '🗂️',
    title: '시청 기록(history)만 체크',
    desc: (
      <>
        YouTube 항목 오른쪽{' '}
        <strong className="text-zinc-200">"포함된 데이터 모두"</strong> 버튼 클릭 →{' '}
        <strong className="text-zinc-200">"기록(history)"</strong>만 남기고 나머지는 체크 해제.
        <br />
        <strong className="text-emerald-300">
          ✨ 기본 설정인 HTML 파일 그대로 받아도 완벽하게 분석해 드려요!
        </strong>{' '}
        JSON으로 바꿔도 OK지만 필수 아님 — 그대로 두면 시간 절약!
      </>
    ),
    tip: '💡 HTML · JSON 둘 다 완벽 지원 · 형식 변경 생략해도 돼요',
    Illustration: HistoryOnlyIllustration,
  },
  {
    num: '4',
    emoji: '📤',
    title: '내보내기 만들기',
    desc: (
      <>
        아래로 스크롤 → <strong className="text-zinc-200">"다음 단계"</strong> →{' '}
        <strong className="text-zinc-200">"내보내기 만들기"</strong>.
        잠시 뒤 이메일로 "다운로드 준비 완료" 알림이 와요. 링크를 눌러{' '}
        <strong className="text-zinc-200">zip 파일</strong>을 저장해요.
      </>
    ),
    tip: '💡 파일 준비에 1분~몇 시간 걸려요 (시청량에 따라 다름)',
    Illustration: ExportIllustration,
  },
  {
    num: '5',
    emoji: '📂',
    title: '압축 풀고 파일 찾기',
    desc: (
      <>
        zip 파일 압축 해제 →{' '}
        <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
          Takeout / YouTube 및 YouTube Music / 기록
        </code>{' '}
        폴더 안에 파일이 있어요. HTML이든 JSON이든 이 페이지의{' '}
        <strong className="text-zinc-200">"분석 시작하기"</strong> 버튼 → 업로드 창에 끌어놓으면 끝!
      </>
    ),
    fileNames: ['watch-history.html', 'watch-history.json', '시청 기록.html', '시청 기록.json'],
    tip: '💡 HTML / JSON · 한글 파일명 모두 OK. 언어 설정에 따라 이름만 달라져요',
    Illustration: UnzipIllustration,
  },
];

const FAQ = [
  {
    q: '파일이 너무 큰데 업로드 되나요?',
    a: '500MB 이하면 OK. 대부분 시청 기록은 5~50MB 사이라 걱정 없어요.',
  },
  {
    q: 'HTML 파일로 받았는데 괜찮나요?',
    a: '완벽해요! HTML · JSON 둘 다 지원합니다. 그대로 업로드하시면 돼요.',
  },
  {
    q: '"시청 기록 저장" 기능을 꺼놨는데도 분석되나요?',
    a: '그동안 기록된 데이터는 남아있어요. 다만 끈 이후부터는 새로 쌓이지 않아요.',
  },
  {
    q: '분석 결과가 서버에 저장되나요?',
    a: '아니요. 파일은 내 브라우저 밖을 절대 나가지 않아요. 분석이 끝나면 메모리에서도 즉시 지워져요.',
  },
];

export default function LandingPage({ onStart, onTrySample }) {
  const { t } = useT();
  // Guide opens by default now — MVP users said the flow wasn't obvious.
  const [guideOpen, setGuideOpen] = useState(true);
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-zinc-800 text-xs text-zinc-400 mb-6 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-yt-orange" />
          {t('landing.hero.badge')}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 leading-tight mb-5 max-w-2xl animate-fade-up">
          <span className="bg-grad-yt bg-clip-text text-transparent">
            {t('landing.hero.title')}
          </span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-xl mb-6 animate-fade-up">
          {t('landing.hero.subtitle')}
        </p>

        {/* Two primary actions — Takeout download first, then analyze */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up">
          <a
            href={TAKEOUT_DIRECT}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-bg-elevated border border-zinc-700 text-zinc-100 font-semibold text-base hover:bg-zinc-800 transition"
          >
            <ExternalLink className="w-4 h-4" />
            1️⃣ Takeout 파일 받기
          </a>
          <button
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-grad-yt text-white font-bold text-lg shadow-glow hover:opacity-90 hover:scale-[1.02] transition-all"
          >
            <Play className="w-5 h-5" fill="white" />
            {t('landing.hero.ctaStart')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary CTA — sample result for the curious + the non-committal */}
        {onTrySample && (
          <button
            onClick={onTrySample}
            className="mt-3 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-zinc-700 text-zinc-200 text-sm hover:bg-white/10 transition animate-fade-up"
          >
            <Beaker className="w-4 h-4 text-yt-orange" />
            {t('landing.hero.ctaSample')}
          </button>
        )}

        {/* Privacy — larger, stronger emphasis with 비행기 모드 challenge */}
        <div className="mt-6 max-w-md px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-left animate-fade-up">
          <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <Plane className="w-4 h-4 text-emerald-400/80" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              {t('landing.privacyBox.title')}
            </p>
            <p className="text-xs text-emerald-400/80 leading-relaxed mt-0.5">
              {t('landing.privacyBox.body')}
            </p>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 pb-6 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              icon: Shield,
              title: '완전한 프라이버시',
              desc: '파일이 어디에도 업로드되지 않아요. 내 브라우저에서만 분석해요.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
            },
            {
              icon: Zap,
              title: '빠른 분석',
              desc: '수십만 건의 시청 기록도 순식간에 분석해드려요.',
              color: 'text-yellow-400',
              bg: 'bg-yellow-400/10',
            },
            {
              icon: BarChart2,
              title: '풍부한 인사이트',
              desc: '취향 유형, 시간대, Top 채널, 카테고리, 변화 추이까지 한눈에.',
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl bg-bg-card border border-zinc-800 p-5 hover:border-zinc-700 transition"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Guide section — open by default */}
        <div className="rounded-2xl bg-bg-card border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setGuideOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-base">📁</span>
              <span className="text-sm font-semibold text-zinc-200">
                시청 기록 파일 받는 방법 — 이미지로 보는 단계별 안내
              </span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-yt-orange/20 text-yt-orange font-medium">
                5분 소요
              </span>
            </div>
            {guideOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            )}
          </button>

          {guideOpen && (
            <div className="px-5 pb-5 space-y-5 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 pt-4">
                Google Takeout은 구글 계정에 저장된 내 데이터를 내려받는 공식 서비스예요.
                첫 단계 링크는 <strong className="text-zinc-300">YouTube가 이미 선택된 상태</strong>로 열리니 그대로 따라오시면 돼요.
              </p>

              {GUIDE_STEPS.map((step, i) => {
                const Ill = step.Illustration;
                return (
                  <div key={i} className="flex gap-3">
                    {/* Step badge */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-grad-yt flex items-center justify-center text-white text-xs font-bold shadow-glow">
                        {step.num}
                      </div>
                      {i < GUIDE_STEPS.length - 1 && (
                        <div className="w-px flex-1 bg-zinc-800" style={{ minHeight: 16 }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>{step.emoji}</span>
                        <h4 className="text-sm font-semibold text-zinc-100">{step.title}</h4>
                      </div>

                      {/* Illustration */}
                      {Ill && (
                        <div className="my-2 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/60">
                          <Ill />
                        </div>
                      )}

                      <p className="text-sm text-zinc-400 leading-relaxed mb-1.5">{step.desc}</p>

                      {/* File names */}
                      {step.fileNames && (
                        <div className="flex flex-wrap gap-2 my-2">
                          {step.fileNames.map((name) => (
                            <code
                              key={name}
                              className="text-xs bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-lg text-emerald-400"
                            >
                              📄 {name}
                            </code>
                          ))}
                        </div>
                      )}

                      {/* Action link */}
                      {step.action && (
                        <a
                          href={step.action.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-yt-orange hover:underline mt-1 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          {step.action.text}
                        </a>
                      )}

                      {/* Tip */}
                      <p className="text-xs text-zinc-600 mt-1.5">{step.tip}</p>
                    </div>
                  </div>
                );
              })}

              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                ✅ 파일을 받았다면 위의 <strong>"분석 시작하기"</strong> 버튼을 눌러 업로드하면 끝!
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="rounded-2xl bg-bg-card border border-zinc-800 overflow-hidden mt-4">
          <button
            onClick={() => setFaqOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-semibold text-zinc-200">
                자주 묻는 질문
              </span>
            </div>
            {faqOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          {faqOpen && (
            <div className="px-5 pb-5 border-t border-zinc-800">
              <div className="space-y-3 pt-4">
                {FAQ.map((item, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-zinc-200 mb-1">Q. {item.q}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed pl-4">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-zinc-700">
        Shorts Insight · {t('upload.footer')}
      </footer>
    </div>
  );
}
