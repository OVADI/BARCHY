import { describe, expect, it } from 'vitest';
import { formatFact, formatValue } from './format';

const nl = (v: number, o?: Intl.NumberFormatOptions) => new Intl.NumberFormat('nl-NL', o).format(v);
const en = (v: number, o?: Intl.NumberFormatOptions) => new Intl.NumberFormat('en-GB', o).format(v);

describe('formatFact', () => {
	it('writes divisor ranges as l/n – l/m', () => {
		expect(formatFact({ value: [15, 20], unit: '', divisorOf: 'l' }, nl)).toBe('l/15 – l/20');
		expect(formatFact({ value: 25, unit: '', divisorOf: 'L' }, nl)).toBe('L/25');
	});

	it('adds the unit and uses locale notation', () => {
		expect(formatFact({ value: 210000, unit: 'N/mm²' }, nl)).toBe('210.000 N/mm²');
		expect(formatFact({ value: 210000, unit: 'N/mm²' }, en)).toBe('210,000 N/mm²');
		expect(formatFact({ value: 1.12, unit: '%' }, nl)).toBe('1,12 %');
		expect(formatFact({ value: [600, 630], unit: 'mm' }, en)).toBe('600 – 630 mm');
	});

	it('marks limits and writes rectangles as a × b', () => {
		expect(formatFact({ value: 0.188, unit: 'm', bound: 'max' }, nl)).toBe('≤ 0,188 m');
		expect(formatFact({ value: 0.9, by: 1.2, unit: 'm', bound: 'min' }, nl)).toBe('≥ 0,9 × 1,2 m');
		expect(formatFact({ value: 12, unit: '', divisorOf: '1', bound: 'max' }, nl)).toBe('≤ 1/12');
		expect(formatFact({ value: [0.8, 1], unit: 'm', bound: 'range' }, en)).toBe('0.8 – 1 m');
	});

	it('writes very small numbers with a power of ten', () => {
		expect(formatValue(0.000012, nl)).toBe('12 · 10⁻⁶');
		expect(formatValue(0, nl)).toBe('0');
	});
});
