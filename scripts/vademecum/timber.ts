import { join } from 'node:path';
import { rectangle, type Props } from '../../src/lib/calc/section';
import type { Issue } from '../../src/lib/schema/source';
import { TimberFile, type TimberSection } from '../../src/lib/schema/timber';
import { htmlTables, num, slug } from './parse';
import type { Report } from './report';
import { FILES, TIMBER_SOURCE, load, origin } from './source';

const FIELD: Record<string, 'A' | 'Wy' | 'Iy'> = { A: 'A', W: 'Wy', I: 'Iy' };
const PROPS: (keyof Props)[] = ['A', 'Wy', 'Iy', 'Wz', 'Iz'];
const MATCH = 0.01;

interface Fit {
	b: number;
	h: number;
	prop: keyof Props;
	pow: number;
}

/** Which rectangle property (at some printed power of ten) a printed value belongs to. */
function fitsFor(value: number, h: number, widths: number[]): Fit[] {
	const fits: Fit[] = [];
	for (const b of widths) {
		const p = rectangle(b, h);
		for (const prop of PROPS) {
			const pow = Math.round(Math.log10(p[prop] / value));
			if (Math.abs(value * 10 ** pow - p[prop]) / p[prop] <= MATCH) fits.push({ b, h, prop, pow });
		}
	}
	return fits;
}

/** Fits on the table's own widths; only if there are none, on the nominal width b + 1. */
function identify(value: number, h: number, widths: number[]): { fits: Fit[]; nominal: boolean } {
	const exact = fitsFor(value, h, widths);
	if (exact.length) return { fits: exact, nominal: false };
	return {
		fits: fitsFor(
			value,
			h,
			widths.map((b) => b + 1)
		),
		nominal: true
	};
}

const describe = (f: Fit) => `${f.prop} van ${f.b}×${f.h}`;

/**
 * Timber sizes (§13.2). For a rectangle A, W and I follow exactly from b × h, so BARCHY computes them.
 * The table only decides which sizes are listed. Each printed cell is identified (which size and
 * which quantity it belongs to) so the report can show how the columns are mixed up.
 */
export async function importTimber(
	report: Report,
	writeJson: (p: string, d: unknown) => void,
	content: string
) {
	const md = await load(FILES.timber);
	const tables = htmlTables(md);
	const sections = new Map<string, TimberSection>();
	const findings: string[] = [];
	let cellCount = 0;
	let ownCount = 0;

	tables.forEach((t, ti) => {
		const kind = /gelijmd/i.test(t.label) ? 'glulam' : 'sawn';
		const widths = t.head[0]!.map((c) => Number(/(\d+)\s*mm/.exec(c)?.[1] ?? NaN));
		const fields = t.head[1]!.map((c) => FIELD[c.trim()[0] ?? '']);
		const tableWidths = [...new Set(widths.filter(Number.isFinite))];
		const tableName = `${kind === 'sawn' ? 'Gezaagd' : 'Gelamineerd'}, tabel ${ti + 1} (b = ${tableWidths.join(', ')} mm)`;
		/** Sizes some cell in the row belongs to; value = true if only via the nominal width b + 1. */
		const supported = new Map<string, boolean>();
		const listed = new Set<string>();
		const notes = new Map<string, Issue[]>();

		for (const row of t.rows) {
			const h = num(row[0]!, 'nl')!;
			row.forEach((text, i) => {
				if (i === 0) return;
				const value = num(text, 'nl');
				const b = widths[i]!;
				const field = fields[i];
				if (value === null || value === 0 || !field || !Number.isFinite(b)) return;
				listed.add(`${b}x${h}`);
				cellCount++;
				const { fits, nominal } = identify(value, h, tableWidths);
				for (const f of fits) {
					const key = `${nominal ? f.b - 1 : f.b}x${h}`;
					if (!supported.has(key) || supported.get(key)) supported.set(key, nominal);
				}
				if (!nominal && fits.some((f) => f.b === b && f.prop === field)) {
					ownCount++;
					return;
				}
				const explanation = fits.length
					? `past bij ${fits.map(describe).join(' of ')}`
					: 'past bij geen maat in deze rij';
				findings.push(`| ${tableName} | ${b}×${h} | ${field} | ${text} | ${explanation} |`);
				const issue: Issue = {
					check: 'table',
					severity: 'warning',
					field,
					found: value,
					message: `tabelcel ${text} onder ${field} ${explanation}`
				};
				notes.set(`${b}x${h}`, [...(notes.get(`${b}x${h}`) ?? []), issue]);
			});
		}

		// Only sizes whose own column is filled: a fit elsewhere in the row can be a coincidence.
		for (const key of listed) {
			const [b, h] = key.split('x').map(Number) as [number, number];
			const issues = notes.get(key) ?? [];
			// Checked on 2026-10-24: these sizes are genuine; only the table cells are shifted.
			if (!supported.has(key)) {
				issues.push({
					check: 'table',
					severity: 'warning',
					message: `geen tabelwaarde in deze rij hoort bij ${b}×${h}; de maat zelf klopt (gecontroleerd), A, W en I zijn berekend`
				});
			} else if (supported.get(key)) {
				issues.push({
					check: 'table',
					severity: 'warning',
					message: `de tabelwaarden horen bij ${b + 1}×${h}, niet bij ${b}×${h}`
				});
			}
			const id = slug(kind, `${b}x${h}`);
			const p = rectangle(b, h);
			sections.set(id, {
				id,
				kind,
				b,
				h,
				A: p.A,
				Wy: Math.round(p.Wy * 10) / 10,
				Iy: Math.round(p.Iy),
				Wz: Math.round(p.Wz * 10) / 10,
				Iz: Math.round(p.Iz),
				issues,
				status: issues.some((i) => i.severity === 'error') ? 'flagged' : 'auto_checked'
			});
		}
	});

	const list = [...sections.values()].sort(
		(a, b) => a.kind.localeCompare(b.kind) || a.b - b.b || a.h - b.h
	);
	const file = TimberFile.parse({
		source: TIMBER_SOURCE,
		origin: origin(FILES.timber, 'Hout'),
		method:
			'Maten (b × h) uit de tabel; A, W en I exact berekend voor een rechthoek. Elke tabelcel is gecontroleerd tegen deze berekening.',
		sections: list
	});
	writeJson(join(content, 'timber', 'sections.json'), file);
	const flagged = list.filter((s) => s.status === 'flagged');
	const unmatched = list.filter((s) =>
		s.issues.some((i) => i.message.startsWith('geen tabelwaarde'))
	);
	report.count('Hout', list.length, flagged.length);
	report.note(
		'Hout (dimensietabellen)',
		`Voor een rechthoek volgen A = b·h, W = b·h²/6 en I = b·h³/12 exact; BARCHY rekent ze zelf uit en gebruikt de tabel alleen voor de lijst met maten.
Van de ${cellCount} gevulde cellen passen er ${ownCount} bij hun eigen kolom (op een macht van tien na). Opvallend:

- De kolomkoppen zeggen A [mm²], W [mm³], I [mm⁴], maar de getallen zijn geschaald (×10², ×10³, ×10⁶), zonder dat dat erbij staat.
- In de gezaagde tabellen lijken per breedte vijf waarden te staan (A, W<sub>y</sub>, I<sub>y</sub>, W<sub>z</sub>, I<sub>z</sub>) onder een kop met drie kolommen, waardoor alles na de eerste breedte verschuift.
- Een deel van de waarden hoort bij b + 1 mm (bijv. 70 in plaats van 69): mogelijk berekend met de ongeschaafde maat.

Bij ${unmatched.length} maten hoort geen enkele cel in hun rij bij die maat: ${unmatched.map((s) => `${s.b}×${s.h}`).join(', ') || 'geen'}. Op 24-10-2026 is gecontroleerd dat deze maten wel kloppen; ze krijgen daarom alleen een waarschuwing.

<details><summary>${findings.length} cellen die niet bij hun kolom passen</summary>

| Tabel | Kolom (b×h) | Veld | Tabel­waarde | Herkend als |
|---|---|---|---|---|
${findings.join('\n')}

</details>`
	);
}
