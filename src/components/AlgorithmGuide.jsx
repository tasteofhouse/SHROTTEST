import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

const TIPS = {
  game: {
    like: [
      '좋아하는 게임 채널에서 알림 🔔을 켜면 새 영상을 바로 받아볼 수 있어요.',
      '게임 영상에 좋아요를 누르면 알고리즘이 유사 콘텐츠를 더 추천해줘요.',
      '게임 재생목록을 만들고 저장하면 알고리즘이 해당 장르를 파악해요.',
    ],
    dislike: [
      '게임 영상 점 3개 → "이 동영상에 관심 없음" 클릭으로 줄일 수 있어요.',
      '"이 채널의 동영상 추천 안 함"으로 반복 노출을 완전히 차단해요.',
      '시청 기록에서 게임 영상을 삭제하면 추천 데이터가 초기화돼요.',
    ],
  },
  animal: {
    like: [
      '동물 채널 구독 + 알림 설정으로 귀여운 영상을 놓치지 마세요.',
      '동물 영상에 댓글을 달면 해당 채널 콘텐츠가 더 자주 노출돼요.',
      '동물 재생목록을 만들어 힐링 콘텐츠를 한곳에 모아보세요.',
    ],
    dislike: [
      '동물 영상 우측 메뉴 → "관심 없음"으로 피드에서 줄여요.',
      '동물·펫 관련 채널을 "추천 안 함" 처리하면 피드가 바뀌어요.',
      '내 YouTube → 기록 관리에서 동물 영상 기록을 일괄 삭제해요.',
    ],
  },
  food: {
    like: [
      '좋아하는 먹방·요리 채널 알림을 켜서 새 콘텐츠를 먼저 받아봐요.',
      '레시피 영상을 저장 목록에 추가하면 비슷한 추천이 늘어나요.',
      '식당·맛집 영상에 좋아요와 댓글을 남기면 노출이 강화돼요.',
    ],
    dislike: [
      '먹방 영상 → "관심 없음" 또는 "이 채널 추천 안 함" 설정.',
      '검색 기록에서 음식 관련 키워드를 삭제해 추천 패턴을 바꿔요.',
      '음식 카테고리 채널을 일괄 차단하면 알고리즘이 빠르게 학습해요.',
    ],
  },
  comedy: {
    like: [
      '예능·유머 채널 알림을 켜두면 업로드 즉시 알림을 받아요.',
      '재밌는 영상을 공유하면 해당 채널의 도달이 높아져요.',
      '예능 재생목록을 만들면 알고리즘이 취향을 더 잘 파악해요.',
    ],
    dislike: [
      '유머 영상 → "이 동영상에 관심 없음"으로 노출을 줄여요.',
      '예능 채널을 "추천 안 함" 처리하면 피드에서 사라져요.',
      '시청 기록에서 코미디·예능 기록을 선택해 삭제해요.',
    ],
  },
  drama: {
    like: [
      '드라마·영화 채널의 알림을 설정해 신규 영상을 바로 받아요.',
      '정주행 중인 시리즈를 재생목록에 저장해 연속 시청을 유도해요.',
      '예고편·리뷰 영상에 반응하면 알고리즘이 드라마 취향을 학습해요.',
    ],
    dislike: [
      '드라마·영화 영상 → "관심 없음" 클릭으로 빠르게 줄여요.',
      'OTT·드라마 채널을 "추천 안 함" 처리해요.',
      '시청 기록에서 드라마 키워드 영상을 일괄 삭제해요.',
    ],
  },
  music: {
    like: [
      '좋아하는 아티스트 채널 알림을 켜면 MV·라이브를 바로 받아봐요.',
      '음악 재생목록을 만들면 유사 장르의 추천이 풍부해져요.',
      '음악 영상에 좋아요를 누르면 플레이리스트 추천이 정교해져요.',
    ],
    dislike: [
      '음악 영상 → "이 동영상에 관심 없음" 클릭.',
      '음악·아이돌 채널을 "추천 안 함" 처리해 피드를 정리해요.',
      '검색 기록에서 가수·노래 키워드를 삭제해요.',
    ],
  },
  sports: {
    like: [
      '좋아하는 구단·리그 공식 채널 알림을 켜면 하이라이트를 바로 받아요.',
      '경기 하이라이트에 좋아요를 누르면 유사 스포츠 추천이 늘어나요.',
      '스포츠 재생목록을 만들어 종목별로 정리해봐요.',
    ],
    dislike: [
      '스포츠 영상 → "관심 없음"으로 피드에서 줄여요.',
      '스포츠 채널을 "추천 안 함" 처리해요.',
      '시청 기록에서 경기 하이라이트 영상을 삭제해요.',
    ],
  },
  news: {
    like: [
      '신뢰하는 뉴스 채널 알림을 켜면 속보를 빠르게 받아봐요.',
      '뉴스 영상에 댓글과 반응을 남기면 해당 채널 노출이 강화돼요.',
      '시사 재생목록을 만들어 관심 토픽별로 모아봐요.',
    ],
    dislike: [
      '뉴스 영상 → "이 동영상에 관심 없음" 또는 채널 차단.',
      '정치·시사 채널을 "추천 안 함" 처리해 피드를 정리해요.',
      '뉴스 관련 검색 기록을 삭제하면 추천이 변화해요.',
    ],
  },
  education: {
    like: [
      '교육·강의 채널 알림을 켜면 새 콘텐츠를 바로 받아볼 수 있어요.',
      '배운 내용의 영상을 저장 목록에 추가해 학습 흐름을 만들어요.',
      '교육 재생목록을 주제별로 구성하면 연관 추천이 정교해져요.',
    ],
    dislike: [
      '교육 영상 → "관심 없음" 클릭으로 피드에서 줄여요.',
      '강의·교육 채널을 "추천 안 함" 처리해요.',
      '시청 기록에서 학습 관련 영상을 일괄 삭제해요.',
    ],
  },
  lifestyle: {
    like: [
      '좋아하는 뷰티·브이로그 채널 알림을 켜두세요.',
      '라이프스타일 영상을 저장하면 비슷한 취향의 추천이 늘어나요.',
      '뷰티·패션 재생목록을 만들면 알고리즘이 취향을 잘 파악해요.',
    ],
    dislike: [
      '브이로그·뷰티 영상 → "이 동영상에 관심 없음" 클릭.',
      '라이프스타일 채널을 "추천 안 함" 처리해요.',
      '뷰티·패션 검색 기록을 삭제하면 피드가 바뀌어요.',
    ],
  },
  tech: {
    like: [
      'IT·테크 리뷰 채널 알림을 켜두면 신제품 소식을 먼저 받아요.',
      '언박싱·리뷰 영상에 반응하면 관심 제품 추천이 늘어나요.',
      '테크 재생목록을 브랜드·카테고리별로 만들어 정리해봐요.',
    ],
    dislike: [
      '테크 리뷰 영상 → "관심 없음" 클릭.',
      'IT·테크 채널을 "추천 안 함" 처리해요.',
      '자동차·가전 검색 기록을 삭제하면 피드 패턴이 바뀌어요.',
    ],
  },
  etc: {
    like: [
      '좋아하는 채널에 구독·알림을 설정해 취향을 알고리즘에 알려줘요.',
      '영상에 좋아요·댓글을 달면 알고리즘이 취향을 학습해요.',
      '저장 목록과 재생목록을 적극 활용해 추천을 정교하게 다듬어요.',
    ],
    dislike: [
      '원하지 않는 영상에 "관심 없음"을 꾸준히 클릭해요.',
      '반복 노출 채널은 "추천 안 함" 처리로 빠르게 차단해요.',
      '기록 관리에서 원치 않는 시청 기록을 삭제해요.',
    ],
  },
};

export default function AlgorithmGuide({ topCategories }) {
  const [prefs, setPrefs] = useState({});
  const [expanded, setExpanded] = useState({});

  const displayCats = (topCategories || []).slice(0, 6);

  const toggle = (id, val) => {
    setPrefs((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }));
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(prefs).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-300">
          내 시청 기록에서 상위 카테고리를 가져왔어요. 각 카테고리에 대한 선호도를 설정하면
          알고리즘을 조정하는 맞춤 가이드를 보여드릴게요.
        </p>
      </div>

      {displayCats.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">
          분석 데이터가 없어요. 먼저 시청 기록을 분석해주세요.
        </p>
      ) : (
        <div className="space-y-3">
          {displayCats.map((cat) => {
            const pref = prefs[cat.id];
            const tips = TIPS[cat.id] || TIPS.etc;
            const isOpen = expanded[cat.id];

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-zinc-800 bg-bg-card overflow-hidden"
              >
                {/* Category row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-100">{cat.label}</div>
                    <div className="text-xs text-zinc-500">
                      전체의 {Math.round(cat.ratio * 100)}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggle(cat.id, 'like')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition
                        ${pref === 'like'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      좋아요
                    </button>
                    <button
                      onClick={() => toggle(cat.id, 'dislike')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition
                        ${pref === 'dislike'
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      줄이기
                    </button>
                  </div>
                </div>

                {/* Guide tips */}
                {pref && (
                  <div className="border-t border-zinc-800">
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 transition"
                    >
                      <span>
                        {pref === 'like' ? '📈 늘리는 방법' : '📉 줄이는 방법'} 보기 (3가지)
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {isOpen && (
                      <ul className="px-4 pb-4 space-y-2">
                        {(pref === 'like' ? tips.like : tips.dislike).map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                            <span
                              className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                                ${pref === 'like'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedCount > 0 && (
        <div className="p-4 rounded-xl bg-yt-orange/10 border border-yt-orange/20 text-sm text-zinc-300">
          <strong className="text-yt-orange">{selectedCount}개 카테고리</strong>에 대한 가이드를
          설정했어요. 각 항목을 펼쳐서 상세 팁을 확인해보세요!
        </div>
      )}
    </div>
  );
}
