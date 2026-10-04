import { reactive } from 'vue';
export const consent = reactive({
  loaded: false,
  saved: false,
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
});
export function loadConsent() {
  try {
    const raw = localStorage.getItem('wf_cookie_consent_v1');
    if (raw) {
      const data = JSON.parse(raw);
      for (const key of ['functional', 'analytics', 'marketing'] as const)
        consent[key] = data[key] === true;
      consent.saved = true;
    }
  } catch {}
  consent.loaded = true;
}
export function saveConsent() {
  consent.saved = true;
  localStorage.setItem(
    'wf_cookie_consent_v1',
    JSON.stringify({ ...consent, savedAt: new Date().toISOString() }),
  );
}
