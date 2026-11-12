// First-touch attribution for the contact form: the UTM tags, landing page and
// external referrer of the visitor's first page in this tab. Kept in sessionStorage
// (cleared when the tab closes) and sent only when the visitor submits the form;
// ContactForm.astro reads the 72ai_first_touch key directly.
const KEY = '72ai_first_touch';
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type FirstTouch = Partial<Record<(typeof UTM)[number] | 'landing_page' | 'referrer', string>>;

export function firstTouchFrom(href: string, referrer: string): FirstTouch {
  const url = new URL(href);
  const touch: FirstTouch = { landing_page: url.pathname };
  for (const key of UTM) {
    const value = url.searchParams.get(key);
    if (value) touch[key] = value.slice(0, 100);
  }
  try {
    const ref = new URL(referrer);
    // Origin and path only: a referrer's query string can carry personal data.
    if (ref.host !== url.host) touch.referrer = `${ref.origin}${ref.pathname}`.slice(0, 300);
  } catch {
    // No referrer, or not a URL.
  }
  return touch;
}

export function captureFirstTouch(): void {
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, JSON.stringify(firstTouchFrom(location.href, document.referrer)));
  } catch {
    // Storage blocked (private mode): the form still works, without attribution.
  }
}

