// Parses Google Takeout YouTube watch-history.json and normalizes entries.
//
// Note on Shorts detection:
// Google Takeout stores ALL YouTube views as /watch?v=... URLs — Shorts are NOT
// separately marked. The only reliable in-data signal is a #shorts hashtag in
// the title, but that only covers ~8% of real Shorts. So we analyze ALL YouTube
// views by default and tag hashtag-confirmed Shorts as a bonus stat.

const SHORTS_HASHTAG_RE = /#shorts?\b|#쇼츠|#숏츠|#shortslive/i;

export function isYouTubeView(entry) {
  if (!entry || !entry.titleUrl) return false;
  if (entry.header && entry.header !== 'YouTube') return false;
  // Any youtube.com URL (watch, shorts, live) counts
  return /youtube\.com\/(watch|shorts|live)/i.test(entry.titleUrl);
}

export function isLikelyShort(entry) {
  if (!entry) return false;
  if ((entry.titleUrl || '').includes('/shorts/')) return true;
  if (SHORTS_HASHTAG_RE.test(entry.title || '')) return true;
  return false;
}

function cleanTitle(rawTitle) {
  if (!rawTitle) return '';
  let t = rawTitle;
  // Korean Takeout format: "제목 을(를) 시청했습니다."
  t = t.replace(/\s+을\(를\)\s*시청했습니다\.?\s*$/, '');
  // English: "Watched 제목"
  t = t.replace(/^Watched\s+/i, '');
  // Other Korean variant
  t = t.replace(/^시청함\s+/, '');
  return t.trim();
}

export function normalizeEntry(entry) {
  const title = cleanTitle(entry.title || '');
  const sub = entry.subtitles && entry.subtitles[0];
  const channel = sub ? sub.name : '알 수 없는 채널';
  const channelUrl = sub ? sub.url : null;
  const time = entry.time ? new Date(entry.time) : null;

  const url = entry.titleUrl || '';
  let videoId = null;
  const shortsMatch = url.match(/\/shorts\/([\w-]+)/);
  const watchMatch = url.match(/[?&]v=([\w-]+)/);
  if (shortsMatch) videoId = shortsMatch[1];
  else if (watchMatch) videoId = watchMatch[1];

  return {
    title,
    channel,
    channelUrl,
    time,
    videoId,
    url,
    isShort: isLikelyShort(entry),
  };
}

export function parseWatchHistory(rawJson) {
  if (!Array.isArray(rawJson)) {
    throw new Error('올바른 watch-history.json 형식이 아닙니다.');
  }

  const views = [];
  for (const entry of rawJson) {
    if (isYouTubeView(entry)) {
      const n = normalizeEntry(entry);
      if (n.time && !isNaN(n.time.getTime())) {
        views.push(n);
      }
    }
  }
  views.sort((a, b) => b.time - a.time);
  return views;
}

export async function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (err) {
        reject(new Error('JSON 파싱에 실패했습니다: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsText(file);
  });
}
