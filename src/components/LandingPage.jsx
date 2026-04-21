import { useState } from 'react';
import { Play, Shield, Zap, BarChart2, ChevronRight, Sparkles, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const GUIDE_STEPS = [
  {
    num: '1',
    emoji: '🌐',
    title: 'Google Takeout 접속',
    desc: '아래 링크를 눌러 Google Takeout에 접속해요. 평소 쓰는 구글 계정으로 자동 로그인돼요.',
    action: { text: 'takeout.google.com 열기', href: 'https://takeout.google.com' },
    tip: '💡 스마트폰보다 PC에서 하는 게 훨씬 편해요',
  },
  {
    num: '2',
    emoji: '☑️',
    title: 'YouTube만 선택하기',
    desc: (
      <>
        화면 상단 <strong className="text-zinc-200">"모두 선택 해제"</strong> 버튼을 먼저 눌러요.
        그 다음 스크롤을 내려{' '}
        <strong className="text-zinc-200">"YouTube 및 YouTube Music"</strong>
        을 찾아서 체크해요.
      </>
    ),
    tip: '💡 다른 항목이 체크되면 파일이 수 GB가 될 수 있어요',
  },
  {
    num: '3',
    emoji: '🗂️',
    title: '시청 기록(history)만 선택',
    desc: (
      <>
        YouTube 항목 오른쪽{' '}
        <strong className="text-zinc-200">"포함된 데이터 모두"</strong> 버튼 클릭 →{' '}
        <strong className="text-zinc-200">"기록(history)"</strong>만 남기고 나머지는 체크 해제.
        형식이 <strong className="text-zinc-200">JSON</strong>인지 꼭 확인해요.
      </>
    ),
    tip: '💡 형식이 HTML이면 JSON으로 꼭 변경해주세요',
  },
  {
    num: '4',
    emoji: '📤',
    title: '내보내기 시작',
    desc: (
      <>
        아래로 스크롤 → <strong className="text-zinc-200">"다음 단계"</strong> →{' '}
        <strong className="text-zinc-200">"내보내기 만들기"</strong> 클릭.
        잠시 뒤 이메일로 "다운로드 준비 완료" 알림이 와요. 링크 클릭해서 <strong className="text-zinc-200">zip 파일</strong>을 저장해요.
      </>
    ),
    tip: '💡 파일 준비에 1분~몇 시간 걸릴 수 있어요 (시청 기록 양에 따라 다름)',
  },
  {
    num: '5',
    emoji: '📂',
    title: 'JSON 파일 찾아서 올리기',
    desc: (
      <>
        다운받은 <strong className="text-zinc-200">zip 파일 압축 해제</strong> →{' '}
        <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
          Takeout / YouTube 및 YouTube Music / 기록
        </code>{' '}
        폴더 안에 파일이 있어요.
      </>
    ),
    fileNames: ['watch-history.json', '시청 기록.json'],
    tip: '💡 이 파일을 "분석 시작" 후 업로드 창에 끌어다 놓으면 끝!',
  },
];

export default function LandingPage({ onStart }) {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-zinc-800 text-xs text-zinc-400 mb-6 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-yt-orange" />
          내 YouTube 시청 취향을 15초 만에 분석
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-50 leading-tight mb-5 max-w-2xl animate-fade-up">
          당신의 시청 기록은
          <br />
          <span className="bg-grad-yt bg-clip-text text-transparent">
            당신을 말해줍니다
          </span>
        </h1>

        <p className="text-zinc-400 text-base md:text-lg max-w-xl mb-10 animate-fade-up">
          Google Takeout에서 받은 YouTube 시청 기록 파일만 올리면,
          <br className="hidden md:block" />
          취향 유형과 숨겨진 시청 패턴을 한눈에 보여드려요.
        </p>

        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-grad-yt text-white font-bold text-lg shadow-glow hover:opacity-90 hover:scale-[1.02] transition-all animate-fade-up"
        >
          <Play className="w-5 h-5" fill="white" />
          분석 시작하기
          <ChevronRight className="w-5 h-5" />
        </button>

        <p className="mt-5 text-xs text-zinc-500 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          파일은 서버로 전송되지 않아요. 100% 내 브라우저에서만 분석해요.
        </p>
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
              title: '7가지 인사이트',
              desc: '취향 유형, 시간대, 채널, 카테고리 패턴을 한눈에.',
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

        {/* Guide section */}
        <div className="rounded-2xl bg-bg-card border border-zinc-800 overflow-hidden">
          <button
            onClick={() => setGuideOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📁</span>
              <span className="text-sm font-semibold text-zinc-200">
                시청 기록 파일 받는 방법 — 단계별 안내
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-yt-orange/20 text-yt-orange font-medium">
                5분 소요
              </span>
            </div>
            {guideOpen ? (
              <ChevronUp className="w-4 h-4 text-zinc-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {guideOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 pt-4">
                Google Takeout은 구글 계정에 저장된 내 데이터를 내려받는 공식 서비스예요.
              </p>

              {GUIDE_STEPS.map((step, i) => (
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
                        className="inline-flex items-center gap-1.5 text-xs text-yt-orange hover:underline mt-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {step.action.text}
                      </a>
                    )}

                    {/* Tip */}
                    <p className="text-xs text-zinc-600 mt-1.5">{step.tip}</p>
                  </div>
                </div>
              ))}

              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                ✅ 파일을 받았다면 위의 <strong>"분석 시작하기"</strong> 버튼을 눌러 업로드하면 끝!
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-zinc-700">
        Shorts Insight · 모든 분석은 내 브라우저에서만 처리됩니다
      </footer>
    </div>
  );
}
