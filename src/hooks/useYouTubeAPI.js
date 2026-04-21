// Optional: enrich channel -> category mapping via YouTube Data API v3.
// Used only when VITE_YOUTUBE_API_KEY is set. Safe fallback to local classification.

import { useEffect, useState } from 'react';

const YT_CATEGORY_MAP = {
  // YouTube videoCategoryId -> our category id
  '1': 'etc',      // Film & Animation
  '2': 'etc',      // Autos & Vehicles
  '10': 'music',   // Music
  '15': 'animal',  // Pets & Animals
  '17': 'sports',  // Sports
  '19': 'etc',     // Travel & Events
  '20': 'game',    // Gaming
  '22': 'etc',     // People & Blogs
  '23': 'etc',     // Comedy
  '24': 'etc',     // Entertainment
  '25': 'news',    // News & Politics
  '26': 'education', // Howto & Style
  '27': 'education', // Education
  '28': 'education', // Science & Technology
  '29': 'news',    // Nonprofits & Activism
};

async function fetchChannelIdsByName(channels, apiKey) {
  // YouTube API does not support batch search by name cleanly. We use `search`
  // with q=channelName and type=channel, one call per unique channel.
  const results = {};
  await Promise.all(
    channels.map(async (ch) => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(ch)}&key=${apiKey}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        if (data.items && data.items[0]) {
          results[ch] = data.items[0].snippet.channelId || data.items[0].id.channelId;
        }
      } catch {
        // ignore
      }
    })
  );
  return results;
}

async function fetchLatestVideoCategory(channelId, apiKey) {
  try {
    // Grab most recent upload's category as a proxy for the channel's theme.
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=1&channelId=${channelId}&key=${apiKey}`;
    const sRes = await fetch(searchUrl);
    if (!sRes.ok) return null;
    const sData = await sRes.json();
    const videoId = sData.items && sData.items[0] && sData.items[0].id.videoId;
    if (!videoId) return null;

    const vUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
    const vRes = await fetch(vUrl);
    if (!vRes.ok) return null;
    const vData = await vRes.json();
    const catId = vData.items && vData.items[0] && vData.items[0].snippet.categoryId;
    return catId ? YT_CATEGORY_MAP[catId] || null : null;
  } catch {
    return null;
  }
}

/**
 * Returns { map, loading, enabled } where map is channel -> our category id.
 * Only fetches once per unique channel list.
 */
export function useYouTubeChannelCategories(topChannels) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const [map, setMap] = useState({});
  const [loading, setLoading] = useState(false);
  const enabled = Boolean(apiKey);

  useEffect(() => {
    if (!apiKey || !topChannels || topChannels.length === 0) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      const channelNames = topChannels.map((c) => c.channel);
      const idMap = await fetchChannelIdsByName(channelNames, apiKey);
      const entries = await Promise.all(
        Object.entries(idMap).map(async ([name, cid]) => {
          const cat = await fetchLatestVideoCategory(cid, apiKey);
          return [name, cat];
        })
      );
      if (cancelled) return;
      const next = {};
      for (const [name, cat] of entries) if (cat) next[name] = cat;
      setMap(next);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [apiKey, JSON.stringify(topChannels?.map((c) => c.channel))]);

  return { map, loading, enabled };
}
