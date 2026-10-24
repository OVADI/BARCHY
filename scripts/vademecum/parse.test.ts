import { describe, expect, it } from 'vitest';
import { dims, htmlTables, num, pipeTables, short, slug } from './parse';

describe('num', () => {
	it('reads English and Dutch notation', () => {
		expect(num('1,234.5', 'en')).toBe(1234.5);
		expect(num('1.234,5', 'nl')).toBe(1234.5);
		expect(num('2,20', 'nl')).toBe(2.2);
	});

	it('scales by a power of ten without float noise', () => {
		expect(num('8.78', 'en', 2)).toBe(878);
		expect(num('0.1', 'en', 4)).toBe(1000);
		expect(num('3692', 'en', 4)).toBe(36_920_000);
	});

	it('returns null for an empty cell and throws on text', () => {
		expect(num(' ', 'en')).toBeNull();
		expect(() => num('n.v.t.', 'en')).toThrow();
	});
});

describe('names', () => {
	it('splits sizes and builds ids', () => {
		expect(dims('50x30')).toEqual([50, 30]);
		expect(dims('100 × 50')).toEqual([100, 50]);
		expect(short(3.0)).toBe('3');
		expect(short(3.2)).toBe('3.2');
		expect(slug('CHS', '48.3x3.2')).toBe('chs-48-3x3-2');
		expect(slug('HE', '400', 'x107')).toBe('he-400-x107');
	});
});

describe('htmlTables', () => {
	it('expands colspan and keeps the section and bold label', () => {
		const md = `## Hout\n\n**Gezaagd**\n<table><thead><tr><th></th><th colspan="2">Breedte 33mm</th></tr></thead>
<tbody><tr><td>69</td><td>2,20</td><td></td></tr></tbody></table>`;
		const [t] = htmlTables(md);
		expect(t?.section).toBe('Hout');
		expect(t?.label).toBe('Gezaagd');
		expect(t?.head[0]).toEqual(['', 'Breedte 33mm', 'Breedte 33mm']);
		expect(t?.rows).toEqual([['69', '2,20', '']]);
	});
});

describe('pipeTables', () => {
	it('reads Markdown tables and skips the separator', () => {
		const md = '## Platen\n\n| h | t |\n|---|---|\n| 40 | 0.88 |\n| | 1.00 |\n';
		const [t] = pipeTables(md);
		expect(t?.section).toBe('Platen');
		expect(t?.rows).toEqual([
			['h', 't'],
			['40', '0.88'],
			['', '1.00']
		]);
	});
});
