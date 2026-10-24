import { describe, expect, it } from 'vitest';
import { bomCsv } from './csv';

const item = {
	id: '1',
	sectionId: 'he-200-a',
	name: 'HEA 200',
	path: '/steel/hea/200',
	G: 42.3,
	length: 6000,
	count: 2
};
const headers = ['Profiel', 'Aantal', 'Lengte (mm)', 'G (kg/m)', 'Massa (kg)'] as [
	string,
	string,
	string,
	string,
	string
];

describe('bomCsv', () => {
	it('writes Dutch CSV with semicolons and comma decimals', () => {
		const nl = new Intl.NumberFormat('nl-NL', { useGrouping: false });
		const csv = bomCsv([item], {
			separator: ';',
			headers,
			number: (v, d) =>
				new Intl.NumberFormat('nl-NL', { useGrouping: false, maximumFractionDigits: d }).format(v)
		});
		expect(nl.format(1.5)).toBe('1,5');
		expect(csv).toBe(
			'Profiel;Aantal;Lengte (mm);G (kg/m);Massa (kg)\r\nHEA 200;2;6000;42,3;507,6\r\n'
		);
	});

	it('quotes cells that contain the separator or quotes', () => {
		const csv = bomCsv([{ ...item, name: 'CHS 48.3×3.2, "test"' }], {
			separator: ',',
			headers,
			number: (v, d) =>
				new Intl.NumberFormat('en-GB', { useGrouping: false, maximumFractionDigits: d }).format(v)
		});
		expect(csv.split('\r\n')[1]).toBe('"CHS 48.3×3.2, ""test""",2,6000,42.3,507.6');
	});
});
