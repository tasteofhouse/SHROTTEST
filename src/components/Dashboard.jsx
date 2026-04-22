import { useEffect, useState } from 'react';
import PersonalityCard from './PersonalityCard';
import CategoryChart from './CategoryChart';
import TimeHeatmap from './TimeHeatmap';
import TrendChart from './TrendChart';
import TopChannels from './TopChannels';
import InsightCards from './InsightCards';
import ShareCard from './ShareCard';
import FeedbackPanel from './FeedbackPanel';
import AlgorithmGuide from './AlgorithmGuide';
import ChangeTracker from './ChangeTracker';
import { RotateCcw, User, BarChart2, Compass, History, Share2, Palette, Shuffle } from 'lucide-react';
import { DASHBOARD_THEMES, getThemeById, themeStyle } from '../utils/dashboardThemes';

const THEME_STORAGE_KEY = 'shortsInsight.dashboardTheme';

const TABS = [
  { id: 'result', label: '내 유형', icon: User },
  { id: 'stats', label: '통계', icon: BarChart2 },
  { id: 'guide', label: '알고리즘 가이드', icon: Compass },
  { id: 'history', label: '변화 추적', icon: History },
  { id: 'share', label: '공유하기', icon: Share2 },
];

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('result');
  const [themeId, setThemeId] = useState('midnight');
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Persist theme across sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) setThemeId(saved);
    } catch {/* ignore */}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(THEME_STORAGE_KEY, themeId); } catch {/* ignore */}
  }, [themeId]);

  const theme = getThemeById(themeId);
  const themeDark = theme.dark !== false;

  const {
    categoryDist,
    stats,
    heatmap,
    trend,
    topChannels,
    indices,
    personality,
    insights,
    topCategories,
  } = data;

  const pickRandomTheme = () => {
    const others = DASHBOARD_THEMES.filter((t) => t.id !== themeId);
    const next = others[Math.floor(Math.random() * others.length)];
    setThemeId(next.id);
  };

  return (
    <div
      className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5 rounded-3xl"
      style={themeStyle(theme)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs opacity-60">분석 완료 · {theme.emoji} {theme.label}</div>
          <h1 className="text-2xl md:text-3xl font-bold">내 YouTube 인사이트</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={pickRandomTheme}
            title="테마 랜덤"
            className={`inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs transition ${
              themeDark ? 'bg-black/30 border border-white/10 text-white hover:bg-black/50' : 'bg-white/60 border border-black/10 hover:bg-white/90'
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowThemePicker((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${
              themeDark ? 'bg-black/30 border border-white/10 text-white hover:bg-black/50' : 'bg-white/60 border border-black/10 hover:bg-white/90'
            }`}
          >
            <Palette className="w-4 h-4" />
            테마
          </button>
          <button
            onClick={onReset}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
              themeDark ? 'bg-black/30 border border-white/10 text-white hover:bg-black/50' : 'bg-white/60 border border-black/10 hover:bg-white/90'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            새 파일 분석
          </button>
        </div>
      </div>

      {/* Theme picker */}
      {showThemePicker && (
        <div
          className="rounded-2xl p-3 space-y-2"
          style={{ background: themeDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)', border: themeDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}
        >
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-70">테마 선택 · 총 {DASHBOARD_THEMES.length}종</div>
            <button
              onClick={() => setShowThemePicker(false)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              닫기
            </button>
          </div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 max-h-[220px] overflow-y-auto">
            {DASHBOARD_THEMES.map((t) => {
              const active = t.id === themeId;
              return (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[9px] font-semibold transition relative ${
                    active ? 'ring-2 ring-offset-1 ring-offset-transparent' : 'hover:scale-105'
                  }`}
                  style={{
                    background: t.bg.includes('gradient') ? t.bg : t.card,
                    color: t.text,
                    boxShadow: active ? `0 0 0 2px ${t.accent}` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                  }}
                  title={t.label}
                >
                  <span className="text-sm leading-none">{t.emoji}</span>
                  <span className="mt-0.5 leading-tight text-[8px] opacity-80">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div
        className="flex gap-1 rounded-2xl p-1.5 overflow-x-auto"
        style={{
          background: themeDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.6)',
          border: themeDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                active ? '' : 'opacity-70 hover:opacity-100'
              }`}
              style={
                active
                  ? { background: theme.accent, color: themeDark ? '#0a0a0a' : '#ffffff' }
                  : {}
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab: 내 유형 */}
      {activeTab === 'result' && (
        <div className="space-y-5 animate-fade-up">
          <PersonalityCard
            personality={personality}
            stats={stats}
            topCategories={topCategories}
            indices={indices}
          />
          <FeedbackPanel personalityId={personality.id} />
        </div>
      )}

      {/* Tab: 통계 */}
      {activeTab === 'stats' && (
        <div className="space-y-5 animate-fade-up">
          <InsightCards insights={insights} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="카테고리 분포" subtitle="어떤 영상을 많이 봤나요?">
              <CategoryChart categoryDist={categoryDist} />
            </Card>
            <Card title="Top 채널" subtitle="가장 자주 본 채널 · 카테고리 자동 분류">
              <TopChannels topChannels={topChannels} />
            </Card>
          </div>

          <Card
            title="시간대 × 요일 히트맵"
            subtitle="언제 YouTube를 가장 많이 보나요?"
          >
            <TimeHeatmap heatmap={heatmap} />
          </Card>

          <Card title="최근 30일 시청량" subtitle="일별 시청 추이">
            <TrendChart trend={trend} />
          </Card>

          {/* Quick stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '총 시청', value: stats.total.toLocaleString() + '편' },
              { label: '하루 평균', value: stats.avgPerDay.toFixed(1) + '편' },
              { label: '본 채널 수', value: stats.uniqueChannels.toLocaleString() + '개' },
              { label: '피크 시간', value: stats.peakHour + '시' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: themeDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
                  border: themeDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <div className="text-xl font-bold">{value}</div>
                <div className="text-xs opacity-60 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: 알고리즘 가이드 */}
      {activeTab === 'guide' && (
        <div className="animate-fade-up">
          <Card
            title="알고리즘 맞춤 가이드"
            subtitle="내 시청 카테고리를 기반으로 YouTube 알고리즘을 조정해보세요"
          >
            <AlgorithmGuide topCategories={topCategories} />
          </Card>
        </div>
      )}

      {/* Tab: 변화 추적 */}
      {activeTab === 'history' && (
        <div className="animate-fade-up">
          <Card
            title="변화 추적"
            subtitle="분석 히스토리를 비교해 시청 패턴의 변화를 확인해보세요"
          >
            <ChangeTracker />
          </Card>
        </div>
      )}

      {/* Tab: 공유하기 */}
      {activeTab === 'share' && (
        <div className="animate-fade-up">
          <Card
            title="공유 카드 만들기"
            subtitle="친구에게 내 YouTube 취향을 자랑해보세요"
          >
            <ShareCard
              personality={personality}
              topCategories={topCategories}
              stats={stats}
              indices={indices}
            />
          </Card>
        </div>
      )}

      <footer className="pt-2 pb-10 text-center text-xs opacity-50">
        모든 분석은 내 브라우저에서만 처리됩니다 · Shorts Insight · 테마 {theme.emoji} {theme.label}
      </footer>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section
      className="rounded-2xl p-5 md:p-6"
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
