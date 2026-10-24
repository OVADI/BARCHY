import { BOX_CORNER, STEEL_DENSITY, TOL } from '../../src/lib/checks/steel';
import type { Correction, Issue } from '../../src/lib/schema/source';
import { REPO } from './source';

const UNIT: Record<string, string> = {
	G: 'kg/m',
	h: 'mm',
	b: 'mm',
	tw: 'mm',
	tf: 'mm',
	t: 'mm',
	D: 'mm',
	A: 'mm²',
	Iy: 'mm⁴',
	Iz: 'mm⁴',
	Wy: 'mm³',
	Wz: 'mm³',
	iy: 'mm',
	iz: 'mm'
};

const CHECK_NAME: Record<string, string> = {
	mass: 'G ≈ A·ρ',
	gyration: 'i ≈ √(I/A)',
	modulus: 'W ≈ I/(h/2)',
	order: 'Iy > Iz, iy > iz',
	plausible: 'plausibele maten',
	duplicate: 'dubbele naam',
	missing: 'lege cel',
	geometry: 'geometrie',
	scale: 'eenheid',
	table: 'tabelwaarde'
};

function fmt(n: number | undefined, field?: string): string {
	if (n === undefined) return '';
	const s =
		Math.abs(n) >= 1000
			? Math.round(n).toLocaleString('nl-NL')
			: String(Number(n.toPrecision(4))).replace('.', ',');
	return field && UNIT[field] ? `${s} ${UNIT[field]}` : s;
}

interface Row {
	table: string;
	name: string;
	issue: Issue;
	hint: string | null;
}

/** Collects findings and renders reports/vademecum-issues.md (Dutch, for TeachBooks). */
export class Report {
	private rows: Row[] = [];
	private counts: { table: string; total: number; flagged: number }[] = [];
	private skips: string[] = [];
	private problems: string[] = [];
	private notes: { title: string; body: string }[] = [];
	private corrections: { table: string; name: string; c: Correction }[] = [];

	constructor(private commit: string) {}

	issue(table: string, name: string, issue: Issue, hint: string | null = null) {
		this.rows.push({ table, name, issue, hint });
	}
	count(table: string, total: number, flagged: number) {
		this.counts.push({ table, total, flagged });
	}
	skipped(table: string, name: string, why: string) {
		this.skips.push(`- ${table} \`${name}\`: ${why}`);
	}
	problem(text: string) {
		this.problems.push(`- ${text}`);
	}
	corrected(table: string, name: string, c: Correction) {
		this.corrections.push({ table, name, c });
	}
	note(title: string, body: string) {
		this.notes.push({ title, body });
	}

	summary(): string {
		const lines = this.counts.map(
			(c) =>
				`${c.table.padEnd(8)} ${String(c.total).padStart(4)} records, ${String(c.flagged).padStart(3)} flagged`
		);
		const errors = this.rows.filter((r) => r.issue.severity === 'error').length;
		const warnings = this.rows.length - errors;
		return [
			...lines,
			`${errors} fouten, ${warnings} waarschuwingen, ${this.skips.length} rijen niet geïmporteerd`
		].join('\n');
	}

	private table(rows: Row[]): string {
		const head =
			'| Tabel | Rij | Check | Veld | Verwacht | Gevonden | Toelichting |\n|---|---|---|---|---|---|---|';
		const body = rows.map((r) => {
			const i = r.issue;
			const note = [i.message, r.hint].filter(Boolean).join('. ');
			return `| ${r.table} | ${r.name} | ${CHECK_NAME[i.check] ?? i.check} | ${i.field ?? ''} | ${fmt(i.expected, i.field)} | ${fmt(i.found, i.field)} | ${note} |`;
		});
		return [head, ...body].join('\n');
	}

	markdown(): string {
		const errors = this.rows.filter((r) => r.issue.severity === 'error');
		const flagged = new Set(errors.map((r) => `${r.table} ${r.name}`));
		// Rows with errors are listed above; their geometry warnings only repeat the same fault.
		const warnings = this.rows.filter(
			(r) => r.issue.severity === 'warning' && !flagged.has(`${r.table} ${r.name}`)
		);
		const byRow = new Map<string, Set<string>>();
		for (const r of errors) {
			const key = `${r.table} ${r.name}`;
			byRow.set(key, (byRow.get(key) ?? new Set()).add(r.issue.check));
		}
		// Keys are '<table> <name>'; the name alone already says the table.
		const mangled = [...byRow]
			.filter(([, checks]) => checks.size >= 3)
			.map(([k]) => `\`${k.slice(k.indexOf(' ') + 1)}\``);

		return `# Vademecum: bevindingen in de dimensietabellen

Gegenereerd door \`scripts/import-vademecum.ts\` (BARCHY). Bron: [TeachBooks/vademecum](${REPO}) op commit \`${this.commit}\`.
Alle waarden hieronder in basiseenheden (mm, mm², mm³, mm⁴, kg/m); de bron gebruikt ×10², ×10³, ×10⁴.

## Samenvatting

| Tabel | Rijen | Met fout (flagged) |
|---|---|---|
${this.counts.map((c) => `| ${c.table} | ${c.total} | ${c.flagged} |`).join('\n')}

- ${errors.length} fouten (blokkerend: het record krijgt status \`flagged\` in BARCHY)
- ${warnings.length} waarschuwingen (geometrie, niet blokkerend)
- ${this.skips.length} rijen niet geïmporteerd
${mangled.length ? `\nRijen met drie of meer soorten fouten, vermoedelijk verschoven kolommen: ${mangled.join(', ')}.\n` : ''}
## Vraag over herkomst en licentie

De inleiding van \`staal.md\` noemt de staalprofielen-app van *Bouwen met Staal* als bron. Het Vademecum staat onder CC BY 4.0.
Valt de overgenomen profieldata ook onder die licentie, of geldt voor de tabellen een andere voorwaarde of bronvermelding?

## Gecorrigeerd in BARCHY

Deze rijen zijn in BARCHY gecorrigeerd met een externe bron. De fout zit nog in het Vademecum.

${
	this.corrections.length
		? `| Tabel | Rij in bron | Veld | In Vademecum | Correctie | Reden | Gecontroleerd tegen |\n|---|---|---|---|---|---|---|\n${this.corrections
				.map(
					({ table, name, c }) =>
						`| ${table} | ${name} | ${c.field} | ${fmt(typeof c.from === 'number' ? c.from : undefined, c.field) || (c.from ?? '')} | ${typeof c.to === 'number' ? fmt(c.to, c.field) : c.to} | ${c.reason} | ${c.source.title}, ${c.source.ref} |`
				)
				.join('\n')}`
		: 'Geen.'
}

## Fouten

${errors.length ? this.table(errors) : 'Geen.'}

## Waarschuwingen

<details><summary>${warnings.length} waarschuwingen: tabelwaarde wijkt af van de geïdealiseerde geometrie</summary>

${warnings.length ? this.table(warnings) : 'Geen.'}

</details>

## Niet geïmporteerd

${this.skips.length ? this.skips.join('\n') : 'Geen.'}
${this.problems.length ? `\n## Problemen met correcties\n\n${this.problems.join('\n')}\n` : ''}
${this.notes.map((n) => `## ${n.title}\n\n${n.body}\n`).join('\n')}
## Methode

| Check | Regel | Tolerantie | Ernst |
|---|---|---|---|
| G ≈ A·ρ | G = A · ${STEEL_DENSITY} kg/m³ | ±${TOL.mass * 100} % | fout |
| i ≈ √(I/A) | per as | ±${TOL.gyration * 100} % | fout |
| W ≈ I/(h/2) | symmetrische assen (UNP alleen y) | ±${TOL.modulus * 100} % | fout |
| Iy > Iz | I-, U- en rechthoekige profielen | – | fout |
| plausibele maten | I: tw < tf ≤ b, h > b/2; buis/koker: 2t < maat | – | fout |
| dubbele naam | reeks + maat komt één keer voor | – | fout |
| lege cel | ontbrekende waarde, berekend waar mogelijk | – | fout |
| geometrie I | A, Iy, Wy uit h, b, tw, tf zonder afrondingen | ${TOL.geometryIMin * 100} % … +${TOL.geometryIMax * 100} % | waarschuwing |
| geometrie CHS | exact uit D, t | ±${TOL.geometryTube * 100} % | waarschuwing |
| geometrie SHS/RHS | A, Iy, Wy met hoekstralen ${BOX_CORNER.ro}t / ${BOX_CORNER.ri}t (aanname) | ±${TOL.geometryBox * 100} % | waarschuwing |

De kolom "Toelichting" noemt waar een verwachte waarde in dezelfde rij wél voorkomt (op een andere schaal). Dat is een hint, geen correctie.
`;
	}
}
