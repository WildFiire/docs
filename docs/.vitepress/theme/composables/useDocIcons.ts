export function getDocIconName(slug: string, title: string): string {
  const s = (slug || '').toLowerCase();
  const t = (title || '').toLowerCase();

  // Informatii & General
  if (s.includes('staff/comenzi') || t.includes('comenzi staff')) return 'lucide:terminal';
  if (s.includes('staff/cum-aplici') || t.includes('cum sa aplici') || t.includes('cum sa intri')) return 'lucide:user-plus';
  if (s.includes('staff/motive') || t.includes('motive oficiale')) return 'lucide:alert-circle';
  if (s.includes('staff')) return 'lucide:shield';

  if (s.includes('regulament-go') || s.includes('regulamente/go/regulament-go') || t === 'regulament jucatori') return 'lucide:gamepad-2';
  if (s.includes('regulament-staff') || t === 'regulament staff') return 'lucide:shield';
  if (s.includes('regulament-vip') || t === 'regulament vip') return 'lucide:crown';
  if (s.includes('regulament') || s.includes('regulamente')) return 'lucide:file-text';

  if (s.includes('about') || t.includes('despre')) return 'lucide:star';
  if (s.includes('faq') || t.includes('intrebari') || t.includes('faq')) return 'lucide:help-circle';
  if (s.includes('patch-notes') || t.includes('patch notes')) return 'lucide:clock';
  if (s.includes('getting-started') || t.includes('incepe') || t.includes('getting started')) return 'lucide:flame';

  // Currency
  if (s.includes('phoenixcoins') || t.includes('phoenix coins')) return 'lucide:flame';
  if (s.includes('credits') || t.includes('credits') || t.includes('credite')) return 'lucide:credit-card';
  if (s === 'currency' || t === 'currency') return 'lucide:coins';

  // Weapon Skins
  if (s.includes('skins/informatiiws') || t.includes('sistemul de weaponskins')) return 'lucide:swords';
  if (s.includes('skins/cases') || t.includes('cases') || t.includes('cutii')) return 'lucide:package';
  if (s.includes('skins/gloves') || t.includes('gloves') || t.includes('manusi')) return 'lucide:hand';
  if (s.includes('skins/agents') || t.includes('agents') || t.includes('agenti')) return 'lucide:user';
  if (s.includes('skins/knives') || t.includes('knives') || t.includes('cutite')) return 'lucide:sparkles';
  if (s.includes('skins') || t.includes('weapon skins')) return 'lucide:swords';

  // Gambling
  if (s.includes('gambling/roulette') || t.includes('roulette') || t.includes('ruleta')) return 'lucide:refresh-cw';
  if (s.includes('gambling/slots') || t.includes('slots') || t.includes('aparate')) return 'lucide:dollar-sign';
  if (s.includes('gambling/dices') || t.includes('dices') || t.includes('barbut')) return 'lucide:dice-5';
  if (s.includes('gambling') || t.includes('gambling')) return 'lucide:clover';

  // In-Game Shop
  if (s.includes('shop/tracers') || t.includes('weapon tracers')) return 'lucide:flame';
  if (s.includes('shop/color-smokes') || t.includes('color smokes')) return 'lucide:cloud';
  if (s.includes('shop/chat-tags') || t.includes('chat') || t.includes('tag')) return 'lucide:message-square';
  if (s.includes('shop') || t.includes('in-game shop')) return 'lucide:shopping-cart';

  // Other Systems
  if (s.includes('hit-effect') || t.includes('hit effect')) return 'lucide:target';
  if (s.includes('anti-rush') || t.includes('anti rush')) return 'lucide:shield-alert';
  if (s.includes('settings') || t.includes('client settings')) return 'lucide:sliders';
  if (s.includes('hide-teammates') || t.includes('hide teammates')) return 'lucide:users';
  if (s.includes('c4-planter') || t.includes('c4 planter')) return 'lucide:bomb';
  if (s.includes('private-messages') || t.includes('private messages')) return 'lucide:mail';
  if (s.includes('mention-system') || t.includes('mention')) return 'lucide:at-sign';
  if (s.includes('mvp-rewards') || t.includes('mvp rewards')) return 'lucide:gift';
  if (s.includes('mvp') || t.includes('mvp')) return 'lucide:music';
  if (s.includes('gold-member') || t.includes('gold member')) return 'lucide:crown';
  if (s.includes('map-chooser') || t.includes('map chooser') || t.includes('rtv')) return 'lucide:map-pin';
  if (s.includes('missions') || t.includes('missions')) return 'lucide:check-square';
  if (s.includes('ranks') || s.includes('rank-phases') || t.includes('rank')) return 'lucide:trophy';
  if (s.includes('faceit-badge') || t.includes('faceit')) return 'lucide:award';
  if (s.includes('teambalance') || t.includes('team balance')) return 'lucide:scale';
  if (s === 'systems' || t === 'systems' || t === 'other systems') return 'lucide:cpu';

  // Market & Donatii
  if (s.includes('entry-songs') || t.includes('entry songs')) return 'lucide:volume-2';
  if (s.includes('sanks') || t.includes('sank sounds')) return 'lucide:volume-2';
  if (s.includes('server-slots') || t.includes('server slots')) return 'lucide:server';
  if (s.includes('premium-shop') || t.includes('premium shop')) return 'lucide:sparkles';

  // VIP
  if (s.includes('vip-overview') || t.includes('comparatie vip') || t.includes('vip overview')) return 'lucide:bar-chart-3';
  if (s.includes('vip-night') || t.includes('vip night')) return 'lucide:moon';
  if (s.includes('vip-test') || t.includes('vip test')) return 'lucide:sparkles';
  if (s.includes('rebirth') || s.includes('immortal') || s.includes('mythic') || s.includes('vip')) return 'lucide:crown';
  if (s === 'market' || t.includes('market')) return 'lucide:shopping-bag';

  // Hub & About
  if (s.includes('privacy') || t.includes('privacy')) return 'lucide:lock';
  if (s.includes('terms') || t.includes('terms')) return 'lucide:scroll';
  if (s.includes('changelogs') || s.includes('changelog')) return 'lucide:git-commit';
  if (s.includes('contribute') || t.includes('contribuie')) return 'lucide:git-pull-request';
  if (s.includes('versions') || t.includes('versiuni')) return 'lucide:layers';
  if (s.includes('hub') || t.includes('hub')) return 'lucide:compass';

  return 'lucide:file-text';
}

export function getCategoryIconName(category: string): string {
  const c = (category || '').toLowerCase();

  if (c.includes('informații') || c.includes('informatii')) return 'lucide:flame';
  if (c.includes('currency')) return 'lucide:coins';
  if (c.includes('systems')) return 'lucide:cpu';
  if (c.includes('market') || c.includes('donații') || c.includes('donatii')) return 'lucide:shopping-bag';
  if (c.includes('hub') || c.includes('resurse')) return 'lucide:compass';
  if (c.includes('despre') || c.includes('about')) return 'lucide:info';
  if (c.includes('wiki') || c.includes('actualizări')) return 'lucide:sparkles';

  return 'lucide:book-open';
}
