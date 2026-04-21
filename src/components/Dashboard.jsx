import { useState } from 'react';
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
import { RotateCcw, User, BarChart2, Compass, History, Share2 } from 'lucide-react';

const TABS = [
  { id: 'result', label: '내 유형', icon: User },
  { id: 'stats', label: '통계', icon: BarChart2 },
  { id: 'guide', label: '알고리즘 가이드', icon: Compass },
  { id: 'history', label: '변화 추적', icon: History },
  { id: 'share', label: '공유하기', icon: Share2 },
];

export default function Dashboard({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('result');

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

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500">분석 완료</div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">내 YouTube 인사이트</h1>
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
          새 파일 분석
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-bg-card border border-zinc-800 rounded-2xl p-1.5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex-shrink-0
              ${activeTab === id
                ? 'bg-grad-yt text-white shadow-glow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
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
                className="rounded-2xl bg-bg-card border border-zinc-800 p-4 text-center"
              >
                <div className="text-xl font-bold text-zinc-100">{value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
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

      <footer className="pt-2 pb-10 text-center text-xs text-zinc-700">
        모든 분석은 내 브라우저에서만 처리됩니다 · Shorts Insight
      </footer>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl bg-bg-card border border-zinc-800 p-5 md:p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
