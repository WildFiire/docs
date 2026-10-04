export function steamProfileXml(input: string): string {
  const clean = input.trim();
  if (/^https?:\/\//i.test(clean)) {
    const url = new URL(clean);
    if (url.protocol !== 'https:' || url.hostname !== 'steamcommunity.com' || url.port ||
        url.username || url.password || !/^\/(id|profiles)\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname))
      throw new Error('Invalid Steam profile URL');
    return `https://steamcommunity.com${url.pathname.replace(/\/+$/, '')}/?xml=1`;
  }
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(clean)) throw new Error('Invalid Steam identifier');
  return `https://steamcommunity.com/${/^7656119\d{10}$/.test(clean) ? 'profiles' : 'id'}/${clean}/?xml=1`;
}
