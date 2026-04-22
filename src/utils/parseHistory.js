// Parses Google Takeout YouTube watch-history.json and normalizes entries.
//
// Sources split (important):
//   - 'music'  → YouTube Music listens (music.youtube.com or products includes 'YouTube Music')
//   - 'shorts' → YouTube Shorts (URL contains /shorts/ or #shorts hashtag in title)
//   - 'video'  → regular YouTube video watches
//
// Category/personality analysis runs on YouTube side only (video + shorts).
// Music is tracked as its own dimension — users typically listen to music
// on YouTube Music, so mixing it into category stats would distort results.
//
// Note on Shorts detection:
// Google Takeout stores most YouTube views as /watch?v=... — only some have
// /shorts/ preserved. We additionally match an explicit #shorts hashtag in
// the title, but real Shorts coverage is partial. So treat `shorts` source
// as a lower-bound; `video` count may include some undetected shorts.

const SHORTS_HASHTAG_RE = /#shorts?\b|#쇼츠|#숏츠|#shortslive/i;

export function isYouTubeMusic(entry) {
  if (!entry) return false;
  if (entry.header === 'YouTube Music') return true;
  if (Array.isArray(entry.products) && entry.products.includes('YouTube Music')) return true;
  if (entry.titleUrl && /music\.youtube\.com/i.test(entry.titleUrl)) return true;
  return false;
}

export function isYouTubeView(entry) {
  if (!entry || !entry.titleUrl) return false;
  const h = entry.header;
  const prods = Array.isArray(entry.products) ? entry.products : [];
  const looksLikeYouTube =
    h === 'YouTube' || h === 'YouTube Music' ||
    prods.includes('YouTube') || prods.includes('YouTube Music');
  if (!looksLikeYouTube) return false;
  return /youtube\.com\/(watch|shorts|live)|music\.youtube\.com/i.test(entry.titleUrl);
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
  // YouTube Music: "Listened to 제목"
  t = t.replace(/^Listened to\s+/i, '');
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

  // Decide source. Music takes precedence since those entries often use
  // regular /watch?v=... URLs but have products: ['YouTube Music'].
  const short = isLikelyShort(entry);
  let source;
  if (isYouTubeMusic(entry)) source = 'music';
  else if (short) source = 'shorts';
  else source = 'video';

  return {
    title,
    channel,
    channelUrl,
    time,
    videoId,
    url,
    source,
    isShort: short,
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
