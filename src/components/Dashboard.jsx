import { useState } from 'react';
import PersonalityCard from './PersonalityCard';
import MbtiCard from './MbtiCard';
import CategoryChart from './CategoryChart';
import TimeHeatmap from './TimeHeatmap';
import TrendChart from './TrendChart';
import TopChannels from './TopChannels';
import InsightCards from './InsightCards';
import ShareCard from './ShareCard';
import FeedbackPanel from './FeedbackPanel';
import AlgorithmGuide from './AlgorithmGuide';
import ChangeTracker from './ChangeTracker';
import DopamineBlock from './DopamineBlock';
import AdBanner from './AdBanner';
import { RotateCcw, User, BarChart2, Compass, History, Share2, Film, Zap, Music2, Beaker } from 'lucide-react';
import { useT } from '../i18n/index.jsx';

export default function Dashboard({ data, onReset, isSample = false }) {
  const { t } = useT();
  const TABS = [
    { id: 'result', label: t('dashboard.tabs.result'), icon: User },
    { id: 'stats', label: t('dashboard.tabs.stats'), icon: BarChart2 },
    { id: 'guide', label: t('dashboard.tabs.guide'), icon: Compass },
    { id: 'history', label: t('dashboard.tabs.history'), icon: History },
    { id: 'share', label: t('dashboard.tabs.feedback'), icon: Share2 },
  ];
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
    sourceCounts,
    musicInsight,
  } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-5">
      {/* Top ad banner — horizontal strip */}
      <AdBanner slot="dashboard-top" variant="leaderboard" />

      {/* Sample-data warning banner — only shown when rendering the demo */}
      {isSample && (
        <div className="rounded-2xl p-4 bg-gradient-to-r from-yt-orange/20 via-yt-red/15 to-yt-pink/10 border border-yt-orange/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yt-orange/30 flex items-center justify-center flex-shrink-0">
            <Beaker className="w-5 h-5 text-yt-orange" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-yt-orange">{t('dashboard.sampleBanner.title')}</div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {t('dashboard.sampleBanner.body')}
            </div>
          </div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-grad-yt text-white text-xs font-bold shadow-glow hover:opacity-90 transition flex-shrink-0"
          >
            {t('dashboard.sampleBanner.cta')}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">{t('app.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-bg-elevated border border-zinc-800 text-zinc-200 hover:bg-zinc-800 transition"
          >
            <RotateCcw className="w-4 h-4" />
            {t('dashboard.reset')}
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 rounded-2xl p-1.5 overflow-x-auto bg-bg-elevated border border-zinc-800">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                active
                  ? 'bg-grad-yt text-white shadow-glow'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
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
          {/* Dopamine gauge + Reality check — THE attention-grabbing block */}
          <DopamineBlock
            personality={personality}
            indices={indices}
            stats={stats}
            sourceCounts={sourceCounts}
          />
          {sourceCounts && <SourceSummary counts={sourceCounts} />}
          <PersonalityCard
            personality={personality}
            stats={stats}
            topCategories={topCategories}
            indices={indices}
          />
          <MbtiCard indices={indices} />
          <FeedbackPanel personalityId={personality.id} />
        </div>
      )}

      {/* Tab: 통계 */}
      {activeTab === 'stats' && (
        <div className="space-y-5 animate-fade-up">
          <InsightCards insights={insights} />

          {musicInsight && musicInsight.total > 0 && (
            <Card title="🎵 YouTube Music 청취 기록" subtitle="별도 집계 · 아티스트/채널 Top 10">
              <MusicCard musicInsight={musicInsight} />
            </Card>
          )}

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
                className="rounded-2xl p-4 text-center bg-bg-card border border-zinc-800"
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

      {/* Bottom ad banner */}
      <AdBanner slot="dashboard-bottom" variant="leaderboard" />

      <footer className="pt-2 pb-10 text-center text-xs text-zinc-600">
        {t('upload.footer')} · Shorts Insight
      </footer>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl p-5 md:p-6 bg-bg-card border border-zinc-800">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// Shows how the raw watch history breaks down into YouTube 일반영상 / Shorts / Music
// so users understand exactly what the personality analysis covered (YouTube side)
// and what was set aside (Music listens).
function SourceSummary({ counts }) {
  const { video, shorts, music, youtubeTotal, total } = counts;
  const items = [
    {
      icon: Film,
      label: '일반 영상',
      value: video,
      tone: 'text-blue-400',
      bg: 'bg-blue-400/10',
      ring: 'border-blue-400/30',
    },
    {
      icon: Zap,
      label: '쇼츠',
      value: shorts,
      tone: 'text-yt-orange',
      bg: 'bg-yt-orange/10',
      ring: 'border-yt-orange/30',
    },
    {
      icon: Music2,
      label: 'YouTube Music',
      value: music,
      tone: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      ring: 'border-emerald-400/30',
    },
  ];

  return (
    <section className="rounded-2xl p-4 md:p-5 bg-bg-card border border-zinc-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">시청 기록 구성</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            총 <strong className="text-zinc-300">{total.toLocaleString()}</strong>건 ·
            유형/카테고리 분석은 <strong className="text-zinc-300">YouTube({youtubeTotal.toLocaleString()})</strong> 기준이에요
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {items.map(({ icon: Icon, label, value, tone, bg, ring }) => (
          <div
            key={label}
            className={`rounded-xl p-3 border ${ring} ${bg} flex flex-col items-start gap-1.5`}
          >
            <Icon className={`w-4 h-4 ${tone}`} />
            <div className={`text-lg font-bold ${tone} leading-none`}>
              {value.toLocaleString()}
            </div>
            <div className="text-[11px] text-zinc-400">{label}</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-600 mt-2.5">
        💡 YouTube Music은 음악 청취 채널이라 카테고리 분석에서 제외하고 별도로 보여드려요.
      </p>
    </section>
  );
}

// Music listens are shown as a flat top-channel list (YouTube Music treats
// "channel" as artist/album uploader). No category classification since
// genre detection from titles is unreliable.
function MusicCard({ musicInsight }) {
  const { total, uniqueArtists, topArtists, peakHour, nightRatio } = musicInsight;
  const maxCount = topArtists[0]?.count || 1;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: '총 청취', value: total.toLocaleString() + '회' },
          { label: '아티스트 수', value: uniqueArtists.toLocaleString() + '명' },
          { label: '피크 시간', value: peakHour + '시' },
          { label: '새벽 비율', value: Math.round(nightRatio * 100) + '%' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-3 text-center bg-bg-elevated border border-zinc-800"
          >
            <div className="text-lg font-bold text-zinc-100">{value}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-xs text-zinc-500 font-semibold">Top 10 아티스트 · 채널</div>
        {topArtists.slice(0, 10).map((a, i) => (
          <div key={a.channel} className="flex items-center gap-3">
            <div className="w-6 text-xs tabular-nums text-zinc-500 flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-sm text-zinc-200 truncate">{a.channel}</div>
                <div className="text-xs tabular-nums text-zinc-400 flex-shrink-0">
                  {a.count.toLocaleString()}회
                </div>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400/60 rounded-full"
                  style={{ width: `${(a.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
