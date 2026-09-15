import 'server-only';

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|embedly|quora link preview|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python-requests|axios|node-fetch|go-http-client|vercel-screenshot|google-inspectiontool|chrome-lighthouse|gtmetrix/i;

export const isBot = (ua: string) => !ua || BOT.test(ua);

export function parseUserAgent(ua: string) {
  const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua) ? 'Tablet' : /Mobi|iPhone|iPod|Android|IEMobile|Opera Mini/i.test(ua) ? 'Mobile' : 'Desktop';

  let browser = 'Other';
  if (/Instagram/i.test(ua)) browser = 'Instagram app';
  else if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) browser = 'TikTok app';
  else if (/Snapchat/i.test(ua)) browser = 'Snapchat app';
  else if (/FBAN|FBAV|FB_IAB/i.test(ua)) browser = 'Facebook app';
  else if (/Twitter/i.test(ua)) browser = 'X app';
  else if (/WhatsApp/i.test(ua)) browser = 'WhatsApp';
  else if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/Firefox|FxiOS/i.test(ua)) browser = 'Firefox';
  else if (/Chrome|CriOS/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && /Version\//i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/iPad/i.test(ua)) os = 'iPadOS';
  else if (/iPhone|iPod/i.test(ua)) os = 'iOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows NT/i.test(ua)) os = 'Windows';
  else if (/CrOS/i.test(ua)) os = 'ChromeOS';
  else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  return { device, browser, os };
}

const SOURCES: [RegExp, string][] = [
  [/(^|\.)google\./, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'],
  [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'],
  [/(^|\.)yahoo\./, 'Yahoo'],
  [/(^|\.)yandex\./, 'Yandex'],
  [/(^|\.)instagram\.com$/, 'Instagram'],
  [/(^|\.)tiktok\.com$/, 'TikTok'],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, 'Facebook'],
  [/(^|\.)(t\.co|x\.com|twitter\.com)$/, 'X / Twitter'],
  [/(^|\.)snapchat\.com$/, 'Snapchat'],
  [/(^|\.)linkedin\.com$|(^|\.)lnkd\.in$/, 'LinkedIn'],
  [/(^|\.)(youtube\.com|youtu\.be)$/, 'YouTube'],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, 'WhatsApp'],
  [/(^|\.)(t\.me|telegram\.org)$/, 'Telegram'],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, 'ChatGPT'],
  [/(^|\.)perplexity\.ai$/, 'Perplexity'],
  [/(^|\.)github\.com$/, 'GitHub'],
  [/(^|\.)behance\.net$/, 'Behance'],
  [/(^|\.)dribbble\.com$/, 'Dribbble'],
];

/** Traffic source: UTM source wins, then a known referrer, then the raw host, else Direct. */
export function classifySource(referrerHost: string | null, utmSource: string | null) {
  if (utmSource) {
    const u = utmSource.toLowerCase();
    const known = SOURCES.find(([, name]) => name.toLowerCase().startsWith(u) || u.startsWith(name.toLowerCase().split(' ')[0]));
    return known ? known[1] : utmSource.slice(0, 40);
  }
  if (!referrerHost) return 'Direct';
  const match = SOURCES.find(([pattern]) => pattern.test(referrerHost));
  return match ? match[1] : referrerHost.replace(/^www\./, '');
}
