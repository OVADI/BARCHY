import en from '../../../content/i18n/en.json';
import nl from '../../../content/i18n/nl.json';

export const locales = ['nl', 'en'] as const;
export type Locale = (typeof locales)[number];

/** nl.json is the reference: every other locale must have exactly the same keys. */
export type Messages = typeof nl;

type Leaves<T, P extends string = ''> = {
	[K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

/** Dotted path to a message, e.g. 'nav.home'. Unknown keys are a type error. */
export type MessageKey = Leaves<Messages>;

// Assigning en to Messages makes a missing key in en.json a type error.
export const messages: Record<Locale, Messages> = { nl, en: en satisfies Messages };

export function isLocale(value: unknown): value is Locale {
	return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function lookup(locale: Locale, key: MessageKey): string {
	let node: unknown = messages[locale];
	for (const part of key.split('.')) node = (node as Record<string, unknown> | undefined)?.[part];
	return typeof node === 'string' ? node : key;
}

/** Replaces {name} placeholders. */
export function interpolate(template: string, params?: Record<string, string | number>): string {
	if (!params) return template;
	return template.replace(/\{(\w+)\}/g, (match, name: string) =>
		name in params ? String(params[name]) : match
	);
}

/** All leaf paths of a message tree, used to compare locales in tests and at build time. */
export function keyPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([k, v]) =>
		typeof v === 'string' ? [`${prefix}${k}`] : keyPaths(v as object, `${prefix}${k}.`)
	);
}
