import type { Issue } from '../../src/lib/schema/source';
import { num } from './parse';

/** Power of ten the source prints each field at. */
const SCALE: Record<string, number> = { A: 2, Iy: 4, Iz: 4, Wy: 3, Wz: 3 };

/**
 * Report-only hints: where in the source row an expected value actually appears.
 * Helps upstream maintainers see column shifts; never used to change data.
 */
export function locate(issue: Issue, raw: string[], columns: string[]): string | null {
	if (issue.expected === undefined || issue.severity !== 'error') return null;
	const target = issue.expected;
	const hits: string[] = [];
	raw.forEach((cell, i) => {
		let value: number | null;
		try {
			value = num(cell, 'en');
		} catch {
			return;
		}
		if (value === null || value === 0) return;
		// Same printed scale only: a match at another power of ten is usually coincidence.
		const col = columns[i] ?? `kolom ${i + 1}`;
		const pow = SCALE[issue.field ?? ''] ?? 0;
		if (col !== issue.field && Math.abs(value * 10 ** pow - target) / target < 0.01) {
			hits.push(`kolom ${col} (${cell})`);
		}
	});
	return hits.length ? `verwachte ${issue.field} staat mogelijk in ${hits.join(', ')}` : null;
}
