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

// In-feed Google Ads get written to watch history with a 'From Google Ads'
// marker in details. Exclude — these aren't real watches.
// Also catches the Korean locale variant ("Google 광고") and any other
// "From ... Ads" formulations Takeout has used over the years.
export function isAdEntry(entry) {
  if (Array.isArray(entry?.details)) {
    const hit = entry.details.some(
      (d) => d && typeof d.name === 'string' && /google.*ads?|광고/i.test(d.name)
    );
    if (hit) return true;
  }
  // HTML fallback — some Takeout HTML cells don't have `details` at all.
  // Check titleUrl / channelUrl for ad-serving domains as a second signal.
  const urls = [entry?.titleUrl, entry?.subtitles?.[0]?.url].filter(Boolean);
  for (const u of urls) {
    if (/googleadservices\.com|doubleclick\.net|\/pagead\//i.test(u)) return true;
  }
  return false;
}

// Normalize a raw channel-name string: trims whitespace, rejects URLs
// mistakenly stored as the name, and collapses to empty if it's just a
// placeholder ("YouTube", "Google Ads", etc).
function cleanChannelName(raw) {
  if (typeof raw !== 'string') return '';
  const t = raw.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return '';
  if (/^(YouTube|Google Ads?|광고)$/i.test(t)) return '';
  return t;
}

// Deleted / private / region-blocked / taken-down videos: Takeout keeps the
// row but drops the `subtitles` array (no channel) and stores the raw URL as
// the `title`. There is nothing useful to classify — they just inflate the
// "알 수 없는 채널" bucket. Drop at parse time.
//
// Also covers the "subtitles present but name missing/whitespace/URL" case
// that was slipping through the original filter.
export function isUnavailableEntry(entry) {
  const rawChannel =
    Array.isArray(entry?.subtitles) && entry.subtitles.length > 0
      ? entry.subtitles[0]?.name
      : '';
  const channel = cleanChannelName(rawChannel);
  const hasChannel = !!channel;

  const rawTitle = (entry?.title || '').trim();
  const titleIsPlaceholder =
    !rawTitle ||
    /^https?:\/\//i.test(rawTitle) ||
    /^동영상\s*을\(를\)?\s*시청했습니다\.?$/.test(rawTitle) ||
    /^watched\s+https?:\/\//i.test(rawTitle);

  // Both missing → definitely unusable
  if (!hasChannel && titleIsPlaceholder) return true;
  // No channel, and the only title hint is the "Watched a video" stub → drop
  if (!hasChannel && /^(watched\s+)?a video that/i.test(rawTitle)) return true;
  // No channel AT ALL — we'd only be able to display '알 수 없는 채널',
  // which is the exact bucket the user complained about. Drop it even if
  // there's a title, since it's unrecoverable signal for channel analysis.
  if (!hasChannel) return true;
  return false;
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
  // Some Takeout rows have `subtitles: [{}]` — a present array with an empty
  // object. Also `{ url: "..."}` with no `name`. Normalize so we never end
  // up with literal "undefined" or URL-looking channel strings.
  const cleanedChannel = cleanChannelName(sub?.name);
  const channel = cleanedChannel || '알 수 없는 채널';
  const channelUrl = sub && sub.url ? sub.url : null;
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
  let skipped = 0;
  for (const entry of rawJson) {
    if (!isYouTubeView(entry)) continue;
    if (isAdEntry(entry)) { skipped++; continue; }
    if (isUnavailableEntry(entry)) { skipped++; continue; }
    const n = normalizeEntry(entry);
    if (n.time && !isNaN(n.time.getTime())) {
      views.push(n);
    }
  }
  views.sort((a, b) => b.time - a.time);
  // Stash skip count on the array — non-enumerable so it doesn't serialize but
  // accessible to the analyzer if it wants to show "N건 제외됨" context.
  Object.defineProperty(views, 'skippedUnavailable', {
    value: skipped,
    enumerable: false,
  });
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

export async function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsText(file);
  });
}

// ────────────────────────────────────────────────────────────
// HTML Takeout support
// ────────────────────────────────────────────────────────────
// Google Takeout's default export format is HTML, not JSON. Many users never
// switch the format and end up with "시청 기록.html". We parse those natively
// using DOMParser so they don't have to redo the Takeout export.
//
// Typical cell shape (simplified):
//   <div class="outer-cell ...">
//     <div class="header-cell"><p>YouTube</p></div>
//     <div class="content-cell ...">
//       Watched <a href="https://www.youtube.com/watch?v=...">Title</a><br>
//       <a href="https://www.youtube.com/channel/...">Channel</a><br>
//       2024. 3. 14. 오후 9:12:34 GMT+9
//     </div>
//     <div class="content-cell ... text-right">
//       Products:<br>&emsp;YouTube<br>
//     </div>
//   </div>

// Classify an HTML anchor: is it a YouTube *channel* link (not a video,
// not an ad redirect, not a playlist)?
function isChannelHref(href) {
  if (!href) return false;
  // Ad redirects / tracking
  if (/googleadservices\.com|doubleclick\.net|\/pagead\//i.test(href)) return false;
  // YouTube channel URL shapes: /channel/UC..., /@handle, /c/name, /user/name
  return /youtube\.com\/(channel\/|@|c\/|user\/)/i.test(href);
}

function cellMentionsAd(cellText) {
  if (!cellText) return false;
  // Google locale strings that Takeout sprinkles into ad cells.
  return /From Google Ads|Google Ads에서 제공|Google 광고|광고.*표시/i.test(cellText);
}

function buildEntryFromCell(cell) {
  // Skip header cells — we only want content cells with watch data.
  const anchors = cell.querySelectorAll('a');
  if (anchors.length === 0) return null;
  const firstA = anchors[0];
  const titleText = firstA.textContent || '';
  const titleUrl = firstA.getAttribute('href') || '';
  if (!/youtube\.com|music\.youtube\.com/i.test(titleUrl)) return null;

  // Reconstruct the raw "title" field the way the JSON export would.
  // The cell text is: "Watched <title><br><channel><br><time>" — we grab
  // just the first text node + the first anchor's text.
  const childNodes = Array.from(cell.childNodes);
  let prefix = '';
  for (const n of childNodes) {
    if (n.nodeType === Node.TEXT_NODE) {
      prefix = (n.textContent || '').trim();
      break;
    }
  }
  // prefix is often "Watched " / "시청함 " / "" — combine with title text
  const rawTitle = prefix ? `${prefix}${titleText}` : titleText;

  // Find the CHANNEL anchor specifically — second anchor isn't always the
  // channel; it can be an ad redirect or a playlist link. Walk all anchors
  // and pick the first one whose href is a YouTube channel URL.
  let subtitles;
  for (let i = 1; i < anchors.length; i++) {
    const href = anchors[i].getAttribute('href') || '';
    if (isChannelHref(href)) {
      subtitles = [
        { name: (anchors[i].textContent || '').trim(), url: href },
      ];
      break;
    }
  }

  // Time is the last line of text in the cell. Takeout emits a long form like:
  // "2024. 3. 14. 오후 9:12:34 GMT+9" (ko) or "Mar 14, 2024, 9:12:34 PM KST" (en)
  const cellText = cell.textContent || '';

  // Synthesize a `details` entry when the cell looks like an ad, so the
  // shared `isAdEntry` predicate catches HTML ads too.
  const details = cellMentionsAd(cellText) ? [{ name: 'From Google Ads' }] : undefined;

  // last non-empty line
  const lines = cellText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const timeText = lines[lines.length - 1] || '';
  const parsedTime = parseTakeoutDate(timeText);

  return {
    header: 'YouTube',
    title: rawTitle,
    titleUrl,
    subtitles,
    details,
    time: parsedTime ? parsedTime.toISOString() : null,
    // We can't easily recover `products` from HTML, but leaving it undefined
    // is fine — isYouTubeView already treats header === 'YouTube' as enough.
  };
}

// Takeout HTML uses locale-formatted dates. JS Date can parse most English
// variants directly, but Korean long-form needs help.
function parseTakeoutDate(raw) {
  if (!raw) return null;
  // Fast path — English "Mar 14, 2024, 9:12:34 PM KST"
  const direct = new Date(raw);
  if (!isNaN(direct.getTime())) return direct;
  // Korean "2024. 3. 14. 오후 9:12:34 GMT+9"
  const m = raw.match(
    /(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?\s*(오전|오후)?\s*(\d{1,2}):(\d{2}):(\d{2})/
  );
  if (m) {
    const [, y, mo, d, ampm, hh, mm, ss] = m;
    let hour = parseInt(hh, 10);
    if (ampm === '오후' && hour < 12) hour += 12;
    if (ampm === '오전' && hour === 12) hour = 0;
    // Assume local tz if parsing fails — good enough for histograms.
    const d2 = new Date(
      parseInt(y, 10),
      parseInt(mo, 10) - 1,
      parseInt(d, 10),
      hour,
      parseInt(mm, 10),
      parseInt(ss, 10)
    );
    return isNaN(d2.getTime()) ? null : d2;
  }
  return null;
}

export function parseWatchHistoryHTML(htmlText) {
  if (typeof htmlText !== 'string' || htmlText.length < 50) {
    throw new Error('HTML 내용이 비어있거나 올바르지 않습니다.');
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlText, 'text/html');

  // Takeout HTML cells — prefer the inner `content-cell` that has the
  // watched video info (there are separate cells for metadata / products
  // that we don't want).
  const cells = doc.querySelectorAll('div.content-cell');
  if (!cells.length) {
    throw new Error(
      'Takeout HTML 형식이 아닌 것 같아요. (div.content-cell 없음) watch-history.html 맞는지 확인해주세요.'
    );
  }

  const views = [];
  let skipped = 0;
  for (const cell of cells) {
    // The "right" content-cell holds Products metadata, not watches.
    if (cell.classList.contains('mdl-typography--text-right')) continue;
    const pseudo = buildEntryFromCell(cell);
    if (!pseudo) continue;
    if (!isYouTubeView(pseudo)) continue;
    if (isAdEntry(pseudo)) { skipped++; continue; }
    if (isUnavailableEntry(pseudo)) { skipped++; continue; }
    const n = normalizeEntry(pseudo);
    if (n.time && !isNaN(n.time.getTime())) views.push(n);
  }
  views.sort((a, b) => b.time - a.time);
  Object.defineProperty(views, 'skippedUnavailable', {
    value: skipped,
    enumerable: false,
  });
  return views;
}

// Convenience entry point — sniff based on extension / content heuristics.
export function parseWatchHistoryAuto(input, hint = '') {
  // Already-parsed JSON array
  if (Array.isArray(input)) return parseWatchHistory(input);
  if (typeof input !== 'string') {
    throw new Error('지원하지 않는 입력 형식입니다.');
  }
  const trimmed = input.trimStart();
  const looksHTML = /\.html?$/i.test(hint) || trimmed.startsWith('<');
  if (looksHTML) return parseWatchHistoryHTML(input);
  // Fallback: try JSON first, then HTML
  try {
    return parseWatchHistory(JSON.parse(input));
  } catch {
    return parseWatchHistoryHTML(input);
  }
}
