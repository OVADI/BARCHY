import { describe, expect, it } from 'vitest';
import { interpolate, keyPaths, lookup, messages } from './messages';

describe('i18n messages', () => {
	it('nl and en have exactly the same keys', () => {
		expect(keyPaths(messages.en).sort()).toEqual(keyPaths(messages.nl).sort());
	});

	it('has no empty strings', () => {
		for (const locale of ['nl', 'en'] as const) {
			for (const key of keyPaths(messages[locale])) {
				expect(lookup(locale, key as never).trim(), `${locale}:${key}`).not.toBe('');
			}
		}
	});

	it('uses the same placeholders in every locale', () => {
		const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
		for (const key of keyPaths(messages.nl)) {
			expect(placeholders(lookup('en', key as never)), key).toEqual(
				placeholders(lookup('nl', key as never))
			);
		}
	});

	it('interpolates named placeholders and leaves unknown ones', () => {
		expect(interpolate('{label} plus {step}', { label: 'Lengte', step: '500 mm' })).toBe(
			'Lengte plus 500 mm'
		);
		expect(interpolate('{a} {b}', { a: 1 })).toBe('1 {b}');
	});
});
