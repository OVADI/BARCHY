import { describe, expect, it } from 'vitest';
import { formatNumber, i18n } from './index.svelte';

describe('formatNumber', () => {
	it('uses Dutch notation in NL', () => {
		i18n.locale = 'nl';
		expect(formatNumber(42.3)).toBe('42,3');
		expect(formatNumber(2363)).toBe('2.363');
	});

	it('uses English notation in EN', () => {
		i18n.locale = 'en';
		expect(formatNumber(42.3)).toBe('42.3');
		expect(formatNumber(2363)).toBe('2,363');
	});
});
