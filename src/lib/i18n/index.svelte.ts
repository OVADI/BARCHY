import { interpolate, isLocale, lookup, type Locale, type MessageKey } from './messages';

const STORAGE_KEY = 'barchy.locale';

const state = $state<{ locale: Locale }>({ locale: 'nl' });

export const i18n = {
	get locale(): Locale {
		return state.locale;
	},
	set locale(value: Locale) {
		state.locale = value;
		try {
			localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// Private mode or storage blocked: the choice lasts for this session only.
		}
		if (typeof document !== 'undefined') document.documentElement.lang = value;
	}
};

/** Stored choice first, then navigator.language; call once on the client. */
export function initLocale(): void {
	let stored: string | null = null;
	try {
		stored = localStorage.getItem(STORAGE_KEY);
	} catch {
		stored = null;
	}
	state.locale = isLocale(stored) ? stored : /^nl\b/i.test(navigator.language) ? 'nl' : 'en';
	document.documentElement.lang = state.locale;
}

/** Translated UI text. Reactive: re-renders when the locale changes. */
export function t(key: MessageKey, params?: Record<string, string | number>): string {
	return interpolate(lookup(state.locale, key), params);
}

const intlLocale: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB' };
// Plain cache, not state: formatters never need to trigger updates.
// eslint-disable-next-line svelte/prefer-svelte-reactivity
const formatters = new Map<string, Intl.NumberFormat>();

/** 42,3 / 2.363 in NL and 42.3 / 2,363 in EN. */
export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
	const id = `${state.locale}|${JSON.stringify(options)}`;
	let f = formatters.get(id);
	if (!f) {
		f = new Intl.NumberFormat(intlLocale[state.locale], { maximumFractionDigits: 2, ...options });
		formatters.set(id, f);
	}
	return f.format(value);
}

export type { Locale, MessageKey };
