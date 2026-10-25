/**
 * Cookieless visitor counting via GoatCounter. Only active in production builds, so dev and
 * preview are not counted.
 * The script is cross-origin and never precached; offline it simply fails to load.
 */
const ENDPOINT = 'https://ovadi.goatcounter.com/count';

export function initAnalytics(): void {
	if (!import.meta.env.PROD) return;
	if (['localhost', '127.0.0.1'].includes(location.hostname)) return;

	const script = document.createElement('script');
	script.async = true;
	script.src = 'https://gc.zgo.at/count.js';
	script.dataset.goatcounter = ENDPOINT;
	document.head.append(script);
}
