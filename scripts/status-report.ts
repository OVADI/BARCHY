/**
 * Counts the review status of every content record and lists the ones still on "Controleren".
 * Writes reports/controle.md. Run with `npm run report:status`.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const STATUSES = ['flagged', 'auto_checked', 'human_verified'] as const;
type Status = (typeof STATUSES)[number];

interface Issue {
	severity?: string;
	message?: string;
}
interface Record_ {
	id?: string;
	name?: unknown;
	title?: unknown;
	status: Status;
	issues?: Issue[];
}

const root = join(import.meta.dirname, '..');
const contentDir = join(root, 'content');

function jsonFiles(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
		e.isDirectory()
			? jsonFiles(join(dir, e.name))
			: e.name.endsWith('.json')
				? [join(dir, e.name)]
				: []
	);
}

/** Every object with a review status, at any depth. */
function records(node: unknown): Record_[] {
	if (Array.isArray(node)) return node.flatMap(records);
	if (!node || typeof node !== 'object') return [];
	const obj = node as Record<string, unknown>;
	const own = STATUSES.includes(obj.status as Status) ? [obj as unknown as Record_] : [];
	return [...own, ...Object.values(obj).flatMap(records)];
}

function label(r: Record_): string {
	const value = r.name ?? r.title;
	const text =
		typeof value === 'string'
			? value
			: value && typeof value === 'object' && 'nl' in value
				? String((value as { nl: string }).nl)
				: '';
	return [r.id, text && text !== r.id ? text : ''].filter(Boolean).join(' · ');
}

const rows: { file: string; counts: Record<Status, number>; flagged: Record_[] }[] = [];
for (const path of jsonFiles(contentDir).sort()) {
	const found = records(JSON.parse(readFileSync(path, 'utf8')));
	if (!found.length) continue;
	const counts = { flagged: 0, auto_checked: 0, human_verified: 0 };
	for (const r of found) counts[r.status]++;
	rows.push({
		file: relative(root, path),
		counts,
		flagged: found.filter((r) => r.status === 'flagged')
	});
}

const total = (s: Status) => rows.reduce((sum, r) => sum + r.counts[s], 0);
const lines = [
	'# Controle-overzicht',
	'',
	'Gegenereerd met `npm run report:status`. Niet met de hand bewerken.',
	'',
	'- **flagged**: staat in de app op "Controleren"; nog na te lopen',
	'- **auto_checked**: haalt de automatische samenhangcontroles',
	'- **human_verified**: door een persoon gecontroleerd',
	'',
	'| Bestand | flagged | auto_checked | human_verified |',
	'| --- | ---: | ---: | ---: |',
	...rows.map(
		(r) =>
			`| \`${r.file}\` | ${r.counts.flagged} | ${r.counts.auto_checked} | ${r.counts.human_verified} |`
	),
	`| **Totaal** | **${total('flagged')}** | **${total('auto_checked')}** | **${total('human_verified')}** |`,
	'',
	'## Nog te controleren',
	''
];
for (const r of rows.filter((r) => r.flagged.length)) {
	lines.push(`### \`${r.file}\` (${r.flagged.length})`, '');
	for (const rec of r.flagged) {
		const errors = (rec.issues ?? []).filter((i) => i.severity !== 'warning' && i.message);
		lines.push(
			`- [ ] ${label(rec)}${errors.length ? `: ${errors.map((i) => i.message).join('; ')}` : ''}`
		);
	}
	lines.push('');
}

const out = join(root, 'reports', 'controle.md');
writeFileSync(out, lines.join('\n'));
console.log(`${relative(root, out)}: ${total('flagged')} flagged`);
