/**
 * Imports the TU Delft Vademecum tables (CC BY 4.0) into /content and writes
 * reports/vademecum-issues.md. Run: npm run import:vademecum
 *
 * The source is pinned to one commit (scripts/vademecum/source.ts). Nothing is fixed silently:
 * a record that fails a check gets status 'flagged' and appears in the report; a change to a value
 * only happens through content/steel/corrections.json.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { checkDuplicates, checkSection } from '../src/lib/checks/steel';
import { SteelCorrectionsFile } from '../src/lib/schema/corrections';
import type { Correction } from '../src/lib/schema/source';
import { SteelFile, SteelSection, type SteelFamily } from '../src/lib/schema/steel';
import { locate } from './vademecum/hints';
import { htmlTables } from './vademecum/parse';
import { Report } from './vademecum/report';
import { importRebar } from './vademecum/rebar';
import { importSheets } from './vademecum/sheets';
import { COMMIT, FILES, SOURCE, load, origin } from './vademecum/source';
import { complete, draftId, LAYOUT, steelDrafts, type Draft } from './vademecum/steel';
import { short } from './vademecum/parse';
import { importTimber } from './vademecum/timber';

const ROOT = join(import.meta.dirname, '..');
const CONTENT = join(ROOT, 'content');

function writeJson(path: string, data: unknown) {
	mkdirSync(join(path, '..'), { recursive: true });
	writeFileSync(path, `${JSON.stringify(data, null, '\t')}\n`);
}

function columnsFor(d: Draft): string[] {
	const first = d.shape === 'I' ? 'naam' : d.shape === 'tube' ? 'D' : 'h×b';
	const key =
		d.shape === 'I'
			? 'I'
			: d.shape === 'U'
				? 'U'
				: d.family === 'CHS'
					? 'CHS'
					: (d.family as 'SHS' | 'RHS');
	return [first, ...LAYOUT[key].map(([f]) => f)];
}

function readCorrections() {
	return SteelCorrectionsFile.parse(
		JSON.parse(readFileSync(join(CONTENT, 'steel', 'corrections.json'), 'utf8'))
	);
}

/** The draft a correction or verification points at: name as in the source, nth occurrence. */
function find(drafts: Draft[], sourceName: string, occurrence = 1): Draft | undefined {
	return drafts.filter((d) => d.sourceName === sourceName)[occurrence - 1];
}

function applyCorrections(
	drafts: Draft[],
	family: SteelFamily,
	report: Report
): Map<Draft, Correction[]> {
	const applied = new Map<Draft, Correction[]>();
	for (const c of readCorrections().corrections.filter((x) => x.family === family)) {
		const target = find(drafts, c.sourceName, c.occurrence);
		if (!target) {
			report.problem(`Correctie voor ${c.family} "${c.sourceName}" vindt geen rij in de bron.`);
			continue;
		}
		let from: number | string | null;
		if (c.field === 'variant') {
			from = target.variant ?? null;
			rename(target, { variant: String(c.to) });
		} else {
			from = target.values[c.field] ?? null;
			target.values[c.field] = Number(c.to);
			// UNP is named after its height: a corrected h is a corrected name.
			if (target.family === 'UNP' && c.field === 'h') rename(target, { size: short(Number(c.to)) });
		}
		const correction = { field: c.field, from, to: c.to, reason: c.reason, source: c.source };
		applied.set(target, [...(applied.get(target) ?? []), correction]);
		report.corrected(family, c.sourceName, correction);
	}
	return applied;
}

/** Applies a new HE variant or UNP size to the names of a draft. */
function rename(d: Draft, change: { variant?: string; size?: string }) {
	if (change.variant && d.family === 'HE') {
		d.variant = change.variant;
		d.series = `HE${change.variant}` as Draft['series'];
		d.name = `HE${change.variant} ${d.size}`;
		d.aliases = [d.name, `HE ${d.size} ${change.variant}`, `HE${change.variant}${d.size}`];
	}
	if (change.size && d.family === 'UNP') {
		d.size = change.size;
		d.name = `UNP ${d.size}`;
		d.aliases = [d.name, `UNP${d.size}`, `U ${d.size}`, `UPN ${d.size}`];
	}
}

/** Human verifications from corrections.json; only for records without open errors. */
function applyVerifications(
	sections: SteelSection[],
	drafts: Map<string, Draft>,
	family: SteelFamily,
	report: Report
) {
	const all = [...drafts.values()];
	for (const v of readCorrections().verifications.filter((x) => x.family === family)) {
		const d = find(all, v.sourceName, v.occurrence);
		const s = sections.find((x) => drafts.get(x.id) === d);
		if (!s) {
			report.problem(`Verificatie voor ${v.family} "${v.sourceName}" vindt geen rij in de bron.`);
		} else if (s.status === 'flagged') {
			report.problem(`Verificatie voor ${s.name} genegeerd: het record heeft nog fouten.`);
		} else {
			Object.assign(s, {
				status: 'human_verified',
				verifiedBy: v.verifiedBy,
				verifiedOn: v.verifiedOn
			});
		}
	}
}

async function importSteel(report: Report) {
	const md = await load(FILES.steel);
	const byFamily = steelDrafts(htmlTables(md));
	for (const [family, { section, drafts }] of byFamily) {
		const corrections = applyCorrections(drafts, family, report);
		const sections: SteelSection[] = [];
		const raws = new Map<string, Draft>();
		const usedIds = new Map<string, number>();
		for (const d of drafts) {
			const { values, derived, issues, missing } = complete(d);
			if (missing.length) {
				report.skipped(family, d.sourceName, `ontbrekende waarden: ${missing.join(', ')}`);
				continue;
			}
			// A name that occurs twice gets a numbered id; the duplicate check flags both.
			let id = draftId(d);
			const n = (usedIds.get(id) ?? 0) + 1;
			usedIds.set(id, n);
			if (n > 1) id = `${id}-${n}`;
			const base = {
				id,
				family,
				series: d.series,
				variant: d.variant,
				size: d.size,
				name: d.name,
				sourceName: d.sourceName,
				aliases: d.aliases,
				issues,
				corrections: corrections.get(d) ?? [],
				derived,
				status: 'auto_checked' as const
			};
			const record = SteelSection.parse({ ...base, ...values, shape: d.shape });
			sections.push(record);
			raws.set(id, d);
		}
		const dupes = checkDuplicates(sections);
		for (const s of sections) {
			s.issues.push(...checkSection(s), ...(dupes.get(s.id) ?? []));
			s.status = s.issues.some((i) => i.severity === 'error') ? 'flagged' : 'auto_checked';
		}
		applyVerifications(sections, raws, family, report);
		const file = SteelFile.parse({
			family,
			source: SOURCE,
			origin: origin(FILES.steel, section),
			sections
		});
		writeJson(join(CONTENT, 'steel', `${family.toLowerCase()}.json`), file);
		for (const s of sections) {
			const d = raws.get(s.id)!;
			for (const i of s.issues)
				report.issue(family, s.sourceName, i, locate(i, d.raw, columnsFor(d)));
		}
		report.count(family, sections.length, sections.filter((s) => s.status === 'flagged').length);
	}
}

async function main() {
	const report = new Report(COMMIT);
	await importSteel(report);
	await importSheets(report, writeJson, CONTENT);
	await importTimber(report, writeJson, CONTENT);
	await importRebar(report, writeJson, CONTENT);
	const path = join(ROOT, 'reports', 'vademecum-issues.md');
	mkdirSync(join(ROOT, 'reports'), { recursive: true });
	writeFileSync(path, report.markdown());
	console.log(report.summary());
	console.log(`Rapport: ${path}`);
}

await main();
