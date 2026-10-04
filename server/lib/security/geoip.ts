export interface GeoIpResult {
  ip: string;
  isLocal: boolean;
  country: string;
  countryCode?: string;
  city?: string;
  region?: string;
  countryCityString: string;
  countryString: string;
  locationString: string;
}

const geoCache = new Map<string, { data: GeoIpResult; cachedAt: number }>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

const COUNTRY_NAMES_RO: Record<string, string> = {
  RO: 'România',
  MD: 'Moldova',
  FR: 'Franța',
  DE: 'Germania',
  GB: 'Marea Britanie',
  UK: 'Marea Britanie',
  US: 'Statele Unite',
  IT: 'Italia',
  ES: 'Spania',
  NL: 'Olanda',
  BE: 'Belgia',
  AT: 'Austria',
  CH: 'Elveția',
  HU: 'Ungaria',
  PL: 'Polonia',
  BG: 'Bulgaria',
  GR: 'Grecia',
  TR: 'Turcia',
  CA: 'Canada',
  UA: 'Ucraina',
  SE: 'Suedia',
  NO: 'Norvegia',
  DK: 'Danemarca',
  FI: 'Finlanda',
  CZ: 'Cehia',
  PT: 'Portugalia',
  IE: 'Irlanda',
  LU: 'Luxemburg',
  RS: 'Serbia',
  HR: 'Croația',
  SK: 'Slovacia',
  SI: 'Slovenia',
  BA: 'Bosnia',
  AL: 'Albania',
  MK: 'Macedonia de Nord',
  XK: 'Kosovo',
  LT: 'Lituania',
  LV: 'Letonia',
  EE: 'Estonia',
  RU: 'Rusia',
};

function isPrivateIp(ip: string): boolean {
  if (!ip) return true;
  const clean = ip.trim().toLowerCase();
  return (
    clean === '::1' ||
    clean === '127.0.0.1' ||
    clean === 'localhost' ||
    clean === 'unknown' ||
    clean === '::ffff:127.0.0.1' ||
    clean.startsWith('192.168.') ||
    clean.startsWith('10.') ||
    clean.startsWith('172.16.') ||
    clean.startsWith('172.17.') ||
    clean.startsWith('172.18.') ||
    clean.startsWith('172.19.') ||
    clean.startsWith('172.2') ||
    clean.startsWith('172.30.') ||
    clean.startsWith('172.31.') ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fe80:')
  );
}

/**
 * Resolve the real WAN IP for local/private requests.
 * Tries ipify.org first -> falls back silently.
 */
async function resolveWanIp(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const d = await res.json();
      if (d.ip && !isPrivateIp(d.ip)) return d.ip;
    }
  } catch {}
  return null;
}

/**
 * High-accuracy Geolocation Resolver.
 *
 * - For local/private IPs: resolves the real WAN IP via ipify.org first.
 * - Primary engine: ipwho.is (MaxMind GeoLite2 database)
 * - Secondary engine: ip-api.com
 * - Fallback: "Unknown" — STRICTLY NO EMOJIS, NEVER fake country data.
 *
 * Output format: "România, București" or "Unknown"
 */
export async function resolveIpGeo(rawIp?: string): Promise<GeoIpResult> {
  const cleanIp = (rawIp || '127.0.0.1').split(',')[0].trim();
  const isPrivate = isPrivateIp(cleanIp);

  // For local/private IPs, return local network description directly without querying external WAN
  if (isPrivate) {
    return {
      country: 'Local Network',
      countryCode: 'LO',
      city: 'Localhost',
      location: 'Local Network',
      isp: 'Internal Loopback',
    };
  }

  const cacheKey = resolvedIp;
  const cached = geoCache.get(cacheKey);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  // ── Primary: ipwho.is (MaxMind database) ──
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const ipwhoUrl =
      resolvedIp && !isPrivateIp(resolvedIp)
        ? `https://ipwho.is/${encodeURIComponent(resolvedIp)}`
        : 'https://ipwho.is/';

    const res = await fetch(ipwhoUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false && (data.country_code || data.country)) {
        const code = (data.country_code || '').toUpperCase();
        const roName = COUNTRY_NAMES_RO[code] || data.country || '';
        const cityName = (data.city || '').trim();
        const displayName = roName || code || 'Unknown';
        const countryCityString = cityName ? `${displayName}, ${cityName}` : displayName;

        const result: GeoIpResult = {
          ip: data.ip || resolvedIp,
          isLocal: isPrivate,
          country: displayName,
          countryCode: code,
          city: cityName || undefined,
          region: data.region || undefined,
          countryCityString,
          countryString: displayName,
          locationString: countryCityString,
        };

        geoCache.set(cacheKey, { data: result, cachedAt: Date.now() });
        return result;
      }
    }
  } catch {
    // Proceed to secondary
  }

  // ── Secondary: ip-api.com ──
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const ipApiUrl =
      resolvedIp && !isPrivateIp(resolvedIp)
        ? `http://ip-api.com/json/${encodeURIComponent(resolvedIp)}?fields=status,country,countryCode,city,regionName,query`
        : 'http://ip-api.com/json/?fields=status,country,countryCode,city,regionName,query';

    const res = await fetch(ipApiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        const code = (data.countryCode || '').toUpperCase();
        const roName = COUNTRY_NAMES_RO[code] || data.country || '';
        const cityName = (data.city || '').trim();
        const displayName = roName || code || 'Unknown';
        const countryCityString = cityName ? `${displayName}, ${cityName}` : displayName;

        const result: GeoIpResult = {
          ip: data.query || resolvedIp,
          isLocal: isPrivate,
          country: displayName,
          countryCode: code,
          city: cityName || undefined,
          region: data.regionName || undefined,
          countryCityString,
          countryString: displayName,
          locationString: countryCityString,
        };

        geoCache.set(cacheKey, { data: result, cachedAt: Date.now() });
        return result;
      }
    }
  } catch {
    // Both engines failed -> honest Unknown
  }

  // ── Hard Fallback: Never fake data, NO emojis ──
  const fallbackResult: GeoIpResult = {
    ip: resolvedIp || cleanIp,
    isLocal: isPrivate,
    country: 'Unknown',
    countryCode: undefined,
    city: undefined,
    countryCityString: 'Unknown',
    countryString: 'Unknown',
    locationString: 'Unknown',
  };

  return fallbackResult;
}
