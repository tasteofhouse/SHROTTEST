import { useEffect, useMemo, useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Target,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, CATEGORY_BY_ID } from '../utils/categorize';

// -------------------------------------------------------------------------
// LocalStorage keys
// -------------------------------------------------------------------------
// algorithmTarget    → { want: <catId>|null, avoid: <catId>|null }
// algorithmTips      → { [`${catId}:${like|dislike}:${index}`]: boolean }
// algorithmPrefs     → { [catId]: 'like' | 'dislike' | null }
const LS_TARGET = 'algorithmTarget';
const LS_TIPS = 'algorithmTips';
const LS_PREFS = 'algorithmPrefs';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / disabled — ignore */
  }
}

// -------------------------------------------------------------------------
// Search query hints per category — used to build the YouTube search deep
// link. Reasonable defaults tuned for Korean audiences.
// -------------------------------------------------------------------------
const SEARCH_HINTS = {
  game: '재밌는 게임 방송',
  animal: '귀여운 동물',
  food: '맛집 먹방',
  comedy: '예능 꿀잼',
  drama: '드라마 명장면',
  music: 'K-POP 라이브',
  sports: '스포츠 하이라이트',
  news: '뉴스 속보',
  education: '교양 다큐',
  lifestyle: '브이로그',
  tech: 'IT 리뷰',
  kids: '어린이 애니',
  asmr: 'ASMR 힐링',
  etc: '추천 영상',
};

const YOUTUBE_ACTIVITY_URL = 'https://myactivity.google.com/product/youtube';
const YOUTUBE_FEED_SETTINGS_URL = 'https://www.youtube.com/feed/history';

function buildYouTubeSearchUrl(label) {
  const q = encodeURIComponent(SEARCH_HINTS[label?.id] || label?.label || label || '');
  return `https://www.youtube.com/results?search_query=${q}`;
}

// -------------------------------------------------------------------------
// Category-specific tips
// -------------------------------------------------------------------------
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

// -------------------------------------------------------------------------
// Sub-component: Target selector (top of guide)
// -------------------------------------------------------------------------
function TargetPicker({ options, target, onChange }) {
  const handle = (key) => (e) => {
    const next = { ...target, [key]: e.target.value || null };
    onChange(next);
  };

  return (
    <div className="rounded-2xl border border-yt-orange/30 bg-gradient-to-br from-yt-red/10 via-yt-orange/5 to-transparent p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-yt-orange" />
        <h3 className="text-sm font-bold text-zinc-100">알고리즘 다이어트 목표 설정</h3>
      </div>
      <p className="text-xs text-zinc-400 -mt-1">
        한 달 뒤 비교할 목표 카테고리를 정해두면, 다음 분석 때 성공 여부를 채점해드려요.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block space-y-1">
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" /> 더 보고 싶은 카테고리
          </span>
          <select
            value={target.want || ''}
            onChange={handle('want')}
            className="w-full px-3 py-2 rounded-lg bg-bg-card border border-zinc-700 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none transition"
          >
            <option value="">선택 안 함</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-red-400 flex items-center gap-1">
            <ThumbsDown className="w-3 h-3" /> 그만 보고 싶은 카테고리
          </span>
          <select
            value={target.avoid || ''}
            onChange={handle('avoid')}
            className="w-full px-3 py-2 rounded-lg bg-bg-card border border-zinc-700 text-sm text-zinc-100 focus:border-red-500 focus:outline-none transition"
          >
            <option value="">선택 안 함</option>
            {options.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {(target.want || target.avoid) && (
        <p className="text-[11px] text-zinc-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          저장됐어요. 다음 분석부터 [알고리즘 다이어트 성적표]가 표시됩니다.
        </p>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// Main component
// -------------------------------------------------------------------------
export default function AlgorithmGuide({ topCategories }) {
  const [prefs, setPrefs] = useState(() => loadJSON(LS_PREFS, {}));
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState(() => loadJSON(LS_TIPS, {}));
  const [target, setTarget] = useState(() =>
    loadJSON(LS_TARGET, { want: null, avoid: null })
  );

  // Persist whenever state changes
  useEffect(() => saveJSON(LS_PREFS, prefs), [prefs]);
  useEffect(() => saveJSON(LS_TIPS, checked), [checked]);
  useEffect(() => saveJSON(LS_TARGET, target), [target]);

  const displayCats = (topCategories || []).slice(0, 6);

  // Options for the Select: union of top cats + all CATEGORIES (deduped).
  const selectOptions = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const c of displayCats) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(c);
      }
    }
    for (const c of CATEGORIES) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(c);
      }
    }
    return out;
  }, [displayCats]);

  const toggle = (id, val) => {
    setPrefs((prev) => ({ ...prev, [id]: prev[id] === val ? null : val }));
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTip = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedCount = Object.values(prefs).filter(Boolean).length;

  // How many of the shown tips the user has ticked off
  const completedCount = useMemo(() => {
    let n = 0;
    for (const cat of displayCats) {
      const p = prefs[cat.id];
      if (!p) continue;
      const tips = (TIPS[cat.id] || TIPS.etc)[p] || [];
      tips.forEach((_, i) => {
        if (checked[`${cat.id}:${p}:${i}`]) n += 1;
      });
    }
    return n;
  }, [displayCats, prefs, checked]);

  return (
    <div className="space-y-5">
      {/* Goal picker */}
      <TargetPicker options={selectOptions} target={target} onChange={setTarget} />

      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-zinc-300">
          내 시청 기록 상위 카테고리를 가져왔어요. 각 카테고리에 <b>좋아요/줄이기</b>를 표시하고,
          미션 팁의 체크박스를 하나씩 눌러보세요. 진행 상태는 이 브라우저에 자동 저장돼요.
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
                      <div className="px-4 pb-4 space-y-3">
                        <ul className="space-y-2">
                          {(pref === 'like' ? tips.like : tips.dislike).map((tip, i) => {
                            const key = `${cat.id}:${pref}:${i}`;
                            const done = !!checked[key];
                            return (
                              <li key={key} className="flex items-start gap-2 text-sm">
                                <button
                                  onClick={() => toggleTip(key)}
                                  aria-pressed={done}
                                  aria-label={`${done ? '완료 해제' : '완료 표시'}: ${tip}`}
                                  className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center text-[11px] font-bold transition
                                    ${done
                                      ? pref === 'like'
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'bg-red-500 border-red-500 text-white'
                                      : 'bg-transparent border-zinc-600 text-transparent hover:border-zinc-400'
                                    }`}
                                >
                                  ✓
                                </button>
                                <span
                                  className={`leading-relaxed ${
                                    done ? 'text-zinc-500 line-through' : 'text-zinc-300'
                                  }`}
                                >
                                  {tip}
                                </span>
                              </li>
                            );
                          })}
                        </ul>

                        {/* Deep link actions */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {pref === 'like' ? (
                            <a
                              href={buildYouTubeSearchUrl(cat)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20 transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              YouTube에서 "{cat.label}" 바로 보기
                            </a>
                          ) : (
                            <>
                              <a
                                href={YOUTUBE_ACTIVITY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium hover:bg-red-500/20 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Google 활동기록에서 삭제하기
                              </a>
                              <a
                                href={YOUTUBE_FEED_SETTINGS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium hover:bg-zinc-700 transition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                YouTube 시청 기록 관리
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer summary */}
      {(selectedCount > 0 || completedCount > 0) && (
        <div className="p-4 rounded-xl bg-yt-orange/10 border border-yt-orange/20 text-sm text-zinc-300 space-y-1">
          <div>
            <strong className="text-yt-orange">{selectedCount}개 카테고리</strong>에 대한 가이드를
            설정했어요.
          </div>
          {completedCount > 0 && (
            <div className="text-xs text-zinc-400">
              ✅ 실천 미션 <strong className="text-emerald-400">{completedCount}개</strong> 완료 —
              잘하고 있어요!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------
// Shared helper — allow other components (e.g. ChangeTracker) to read
// the user's saved target without duplicating the key.
// -------------------------------------------------------------------------
export function loadAlgorithmTarget() {
  return loadJSON(LS_TARGET, { want: null, avoid: null });
}

export function describeCategory(catId) {
  return CATEGORY_BY_ID[catId] || null;
}
