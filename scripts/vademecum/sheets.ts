import { join } from 'node:path';
import type { Issue } from '../../src/lib/schema/source';
import { ProfiledSheetFile, type ProfiledSheet } from '../../src/lib/schema/steel';
import { num, pipeTables, short, slug } from './parse';
import type { Report } from './report';
import { FILES, SOURCE, load, origin } from './source';

/**
 * Profiled steel deck (§13.1). The header gives Iy in [mm⁴] and Wy as "·10⁴ [mm⁴]", which cannot
 * both be right. Read here as Iy ×10⁴ mm⁴/m and Wy ×10³ mm³/m; every row is flagged until checked.
 */
export async function importSheets(
	report: Report,
	writeJson: (p: string, d: unknown) => void,
	content: string
) {
	const md = await load(FILES.steel);
	const table = pipeTables(md).find((t) => t.section.startsWith('Geprofileerde'));
	if (!table) throw new Error('Profiled sheet table not found');
	const [, ...rows] = table.rows;
	let h = NaN;
	const sheets: ProfiledSheet[] = rows.map((cells) => {
		const hCell = num(cells[1] ?? '', 'en');
		if (hCell !== null) h = hCell;
		const t = num(cells[2]!, 'en')!;
		const issue: Issue = {
			check: 'scale',
			severity: 'error',
			message:
				'Eenheden in de kolomkop zijn tegenstrijdig (Wy als ·10⁴ mm⁴); hier gelezen als Iy ×10⁴ mm⁴/m en Wy ×10³ mm³/m. Ook de betekenis van σ is niet toegelicht.'
		};
		return {
			id: slug('sheet', `h${short(h)}`, `t${short(t)}`),
			h,
			t,
			sigma: num(cells[3]!, 'en')!,
			Iy: num(cells[4]!, 'en', 4)!,
			Wy: num(cells[5]!, 'en', 3)!,
			issues: [issue],
			status: 'flagged' as const
		};
	});
	const file = ProfiledSheetFile.parse({
		source: SOURCE,
		origin: origin(FILES.steel, table.section),
		units: { h: 'mm', t: 'mm', sigma: 'N/mm²', Iy: 'mm⁴/m', Wy: 'mm³/m' },
		sheets
	});
	writeJson(join(content, 'steel', 'sheets.json'), file);
	report.count('Platen', sheets.length, sheets.length);
	report.note(
		'Geprofileerde staalplaten',
		`De kolomkop geeft I<sub>y</sub> in [mm⁴] en W<sub>y;el</sub> als "·10⁴ [mm⁴]". Een weerstandsmoment heeft eenheid mm³, en de getallen (bijv. h = 40, t = 0,88: I = 30, W = 9,1) passen bij I ×10⁴ mm⁴/m en W ×10³ mm³/m. Graag bevestigen. De kolom σ [N/mm²] wordt niet toegelicht: welke spanning is dit?`
	);
}
