import { formatFact } from '$lib/facts/format';
import { SPACE_TABS, STEEL_FACT_GROUPS, steelTabOf } from '$lib/facts/groups';
import { RULE_SECTION_TITLE, RULE_SECTIONS } from '$lib/facts/rules';
import { lookup, type Locale, type MessageKey } from '$lib/i18n/messages';
import type { RebarFile } from '$lib/schema/concrete';
import type { DrawingFile } from '$lib/schema/drawing';
import type { Chart, Fact, FactGroup } from '$lib/schema/fact';
import type { Bilingual } from '$lib/schema/source';
import type { ProfiledSheetFile, SteelFamily, SteelFile } from '$lib/schema/steel';
import type { TimberFile } from '$lib/schema/timber';
import { seriesSlug, sizeSlug } from '$lib/steel/series';
import { TOOLS } from '$lib/tools';
import { compact, normalize } from './normalize';
import type { SearchEntry, SearchIndex, Text } from './types';

/**
 * Builds the search index from validated content. Runs at build time only (prerendered
 * /data/search.json), so the browser never loads the content files just to search.
 */
export interface SearchContent {
	steel: SteelFile[];
	timber: TimberFile;
	rebar: RebarFile;
	sheets: ProfiledSheetFile;
	bbl: Fact[];
	steelFacts: Fact[];
	drawing: DrawingFile;
	/** Rules of thumb per material, as in content/facts/{timber,concrete,masonry}.json. */
	rules: Record<'timber' | 'concrete' | 'masonry', RuleFile>;
}

export interface RuleFile {
	facts: Fact[];
	groups: FactGroup[];
	charts: Chart[];
}

const INTL: Record<Locale, string> = { nl: 'nl-NL', en: 'en-GB' };

function formatter(locale: Locale) {
	return (value: number, options: Intl.NumberFormatOptions = {}) =>
		new Intl.NumberFormat(INTL[locale], { maximumFractionDigits: 2, ...options }).format(value);
}

/** The same text in both languages, built per locale; one string when they are equal. */
function both(make: (locale: Locale, fmt: ReturnType<typeof formatter>) => string): Text {
	const nl = make('nl', formatter('nl'));
	const en = make('en', formatter('en'));
	return nl === en ? nl : { nl, en };
}

const msg = (key: MessageKey): Bilingual => ({ nl: lookup('nl', key), en: lookup('en', key) });

/** Searchable words from several texts, normalised, duplicates dropped. */
function words(...texts: (Text | undefined)[]): string {
	const all = texts.flatMap((t) =>
		t === undefined ? [] : typeof t === 'string' ? [t] : [t.nl, t.en]
	);
	return [...new Set(normalize(all.join(' ')).split(' '))].join(' ');
}

const names = (...spellings: string[]) => [...new Set(spellings.map((s) => compact(normalize(s))))];

/** Other words people use for a family, in both languages. Names only, no values. */
const FAMILY_WORDS: Record<SteelFamily, string> = {
	HE: 'staal profiel staalprofiel breedflensbalk h-profiel steel section wide flange beam',
	IPE: 'staal profiel staalprofiel i-profiel steel section i-beam',
	UNP: 'staal profiel staalprofiel u-profiel steel section channel',
	SHS: 'staal koker kokerprofiel vierkant steel hollow section square box',
	RHS: 'staal koker kokerprofiel rechthoekig steel hollow section rectangular box',
	CHS: 'staal buis buisprofiel rond steel tube circular hollow section'
};

function steelEntries(files: SteelFile[]): SearchEntry[] {
	return files.flatMap((file) =>
		file.sections.map((s): SearchEntry => {
			const hollow = s.shape === 'box' || s.shape === 'tube';
			// Hollow sections in locale decimals (CHS 48,3×4 in NL); I- and U-sections keep their name.
			const title = hollow
				? both(
						(_, fmt) =>
							`${s.series} ${s.size
								.split('x')
								.map((p) => fmt(Number(p)))
								.join('×')}`
					)
				: s.name;
			return {
				kind: 'steel',
				title,
				sub: both((l, fmt) => `G ${fmt(s.G, { maximumFractionDigits: 1 })} kg/m`),
				path: `/steel/${seriesSlug(s.series)}/${sizeSlug(s)}`,
				names: names(s.name, s.sourceName, ...s.aliases, ...(hollow ? [s.size] : [])),
				group: s.family,
				flagged: s.status === 'flagged'
			};
		})
	);
}

function timberEntries(file: TimberFile): SearchEntry[] {
	const kind = { sawn: msg('timber.sawn'), glulam: msg('timber.glulam') };
	return file.sections.map((s) => ({
		kind: 'timber',
		title: both((_, fmt) => `${fmt(s.b)} × ${fmt(s.h)} mm`),
		sub: kind[s.kind],
		path: `/timber?kind=${s.kind}&b=${s.b}&h=${s.h}`,
		names: names(`${s.b}x${s.h}`),
		group: s.kind,
		flagged: s.status === 'flagged'
	}));
}

function rebarEntries(file: RebarFile): SearchEntry[] {
	return file.rows.map((r) => ({
		kind: 'rebar',
		title: `Ø${r.d} mm`,
		sub: both((l, fmt) => `${lookup(l, 'concrete.rebar')} · 1 × ${fmt(r.As[0]!)} mm²`),
		path: `/concrete?d=${r.d}`,
		names: names(`ø${r.d}`, `d${r.d}`, `ø${r.d}mm`),
		text: words(
			msg('concrete.rebar'),
			msg('concrete.title'),
			'wapening betonstaal rebar staaf bar'
		),
		flagged: r.status === 'flagged'
	}));
}

function sheetEntries(file: ProfiledSheetFile): SearchEntry[] {
	return file.sheets.map((s) => ({
		kind: 'sheet',
		title: both((_, fmt) => `h ${fmt(s.h)} · t ${fmt(s.t)} mm`),
		sub: msg('sheets.title'),
		path: `/steel/sheets?h=${s.h}&t=${s.t}`,
		names: names(`h${s.h}`, `h${s.h} t${s.t}`),
		text: words(msg('sheets.title'), 'staalplaat plaat dakplaat vloerplaat steel sheet deck'),
		flagged: s.status === 'flagged'
	}));
}

function factEntry(fact: Fact, path: string, group?: Bilingual): SearchEntry {
	return {
		kind: fact.type,
		title: fact.label,
		sub: fact.scope ?? group,
		value: both((_, fmt) => formatFact(fact, fmt)),
		path,
		names: [],
		text: words(fact.label, fact.scope, fact.explain, group, fact.source.ref),
		flagged: fact.status === 'flagged'
	};
}

function bblEntries(facts: Fact[]): SearchEntry[] {
	return facts.map((f) => {
		const tab = SPACE_TABS.find((t) => t.groups.some((g) => g.key === f.group));
		const group = tab?.groups.find((g) => g.key === f.group);
		const entry = factEntry(
			f,
			`/space?tab=${tab?.key ?? 'rooms'}#${f.id}`,
			group && msg(group.title)
		);
		entry.text = words(entry.text, 'bbl bouwbesluit eis requirement');
		return entry;
	});
}

function steelFactEntries(facts: Fact[]): SearchEntry[] {
	return facts.map((f) => {
		const group = STEEL_FACT_GROUPS.find((g) => g.key === f.group);
		const entry = factEntry(
			f,
			`/steel?tab=${steelTabOf(f.type)}#${f.id}`,
			group && msg(group.title)
		);
		entry.text = words(entry.text, 'staal steel');
		return entry;
	});
}

/** Words people use for a material, both languages, so 'vuistregel hout' finds timber rules. */
const MATERIAL_WORDS = {
	timber: 'hout houten timber wood',
	concrete: 'beton betonnen concrete',
	masonry: 'metselwerk kalkzandsteen muur masonry calcium silicate'
} as const;

/**
 * Timber and concrete: one entry per shape page and per rule on it. A rule's label is often
 * generic ('Liggerhoogte'), so the shape is its second line.
 */
function ruleEntries(material: 'timber' | 'concrete', file: RuleFile): SearchEntry[] {
	const rules = msg('rules.title');
	const title = msg(`${material}.title`);
	const extra = `${MATERIAL_WORDS[material]} vuistregel vuistregels rule of thumb`;
	return RULE_SECTIONS[material].flatMap((section) =>
		section.groups.flatMap((id): SearchEntry[] => {
			const group = file.groups.find((g) => g.id === id);
			if (!group) return [];
			const sectionTitle = msg(RULE_SECTION_TITLE[section.key]);
			const path = `/rules/${material}/${id}`;
			const facts = file.facts.filter((f) => f.group === id);
			const charts = file.charts.filter((c) => c.group === id);
			return [
				{
					kind: 'page',
					title: group.label,
					sub: both((l) => `${lookup(l, 'rules.title')} · ${lookup(l, `${material}.title`)}`),
					path,
					names: names(group.label.nl, group.label.en),
					text: words(sectionTitle, rules, title, ...(group.notes ?? []).map((n) => n.text), extra)
				},
				...facts.map((f): SearchEntry => {
					const entry = factEntry(f, `${path}#${f.id}`, group.label);
					entry.sub = group.label;
					entry.text = words(entry.text, sectionTitle, title, extra);
					return entry;
				}),
				...charts.map((c): SearchEntry => ({
					kind: 'data',
					title: c.label,
					sub: both((l) => `${lookup(l, 'rules.chart')} · ${group.label[l]}`),
					path: `${path}#${c.id}`,
					names: [],
					text: words(c.label, c.explain, group.label, title, 'ontwerpgrafiek grafiek chart'),
					flagged: c.status === 'flagged'
				}))
			];
		})
	);
}

/** Masonry: the table per wall type, not its 40 cells, which would all match 'kalkzandsteen'. */
function masonryEntries(file: RuleFile): SearchEntry[] {
	return file.groups.map((g) => ({
		kind: 'rule_of_thumb',
		title: g.label,
		sub: msg('masonry.heading'),
		path: `/masonry?wall=${g.id}`,
		names: names(g.label.nl, g.label.en),
		text: words(
			msg('masonry.title'),
			msg('masonry.thickness'),
			msg('masonry.storeys'),
			msg('masonry.bay'),
			MATERIAL_WORDS.masonry,
			'wanddikte eindgevel tussenwand npr 6791 vuistregel'
		),
		flagged: file.facts.some((f) => f.group === g.id && f.status === 'flagged')
	}));
}

function drawingEntries(file: DrawingFile): SearchEntry[] {
	const drawing = msg('drawing.title');
	const scales = (list: number[]) =>
		list.length === 6 ? '' : ` · ${list.map((n) => `1:${n}`).join(', ')}`;
	return [
		...file.hatches.map((h) => ({
			kind: 'drawing' as const,
			title: h.name,
			sub: both((l) => `${lookup(l, `drawing.group.${h.group}`)}${scales(h.scales)}`),
			path: `/drawing/hatch/${h.group}#hatch-${h.id}`,
			names: names(h.name.nl, h.name.en),
			text: words(
				drawing,
				msg('drawing.hatch'),
				h.note,
				'arcering arceren hatch hatching nen 2302'
			),
			flagged: h.status === 'flagged'
		})),
		...file.lines.map((l) => ({
			kind: 'drawing' as const,
			title: l.name,
			sub: msg('drawing.lines'),
			path: `/drawing?tab=lines#line-${l.id}`,
			names: names(l.name.nl, l.name.en),
			text: words(
				drawing,
				msg('drawing.lines'),
				'lijn lijnsoort lijndikte line type weight nen 2302'
			),
			flagged: l.status === 'flagged'
		})),
		...file.guides.map((g) => ({
			kind: 'drawing' as const,
			title: g.title,
			sub: msg('drawing.guides'),
			path: `/drawing/guide/${g.id}`,
			names: names(g.title.nl, g.title.en),
			text: words(
				drawing,
				msg('drawing.guides'),
				g.intro,
				...g.steps.map((s) => s.title),
				'tekening tekeninstructie drawing'
			),
			flagged: g.status === 'flagged'
		}))
	];
}

/** Screens, with the messages and extra words people may type for them. */
const PAGES: { path: string; title: MessageKey; also: MessageKey[]; extra?: string }[] = [
	{ path: '/steel', title: 'home.steel', also: ['home.structureTitle'], extra: 'staalprofielen' },
	{ path: '/steel/sheets', title: 'sheets.title', also: [], extra: 'staalplaat' },
	{ path: '/timber', title: 'home.timber', also: ['timber.sawn', 'timber.glulam', 'rules.title'] },
	{
		path: '/concrete',
		title: 'home.concrete',
		also: ['concrete.rebar', 'rules.title'],
		extra: 'wapening'
	},
	{
		path: '/masonry',
		title: 'home.masonry',
		also: ['masonry.heading'],
		extra: 'kalkzandsteen muur wanddikte'
	},
	{ path: '/space', title: 'spacePage.title', also: ['home.spaceTitle'], extra: 'bbl bouwbesluit' },
	{
		path: '/drawing',
		title: 'home.drawing',
		also: ['home.drawingTitle'],
		extra: 'tekenen arcering nen 2302'
	},
	{ path: '/tools', title: 'tools.title', also: ['nav.tools'], extra: 'calculator' },
	{ path: '/saved', title: 'nav.saved', also: [], extra: 'stuklijst favorieten' },
	{ path: '/settings', title: 'common.settings', also: ['common.language'] }
];

/** Extra words per tool, both languages; names only, no values. */
const TOOL_WORDS: Record<string, string> = {
	beam: 'ligger balk spant hoogte overspanning vuistregel schatten beam depth span estimate'
};

function pageEntries(): SearchEntry[] {
	return [
		...TOOLS.map((tool): SearchEntry => ({
			kind: 'tool',
			title: msg(tool.title),
			path: tool.path,
			names: names(...Object.values(msg(tool.title))),
			text: words(msg('tools.title'), 'rekentool calculator', TOOL_WORDS[tool.id])
		})),
		...PAGES.map((p): SearchEntry => ({
			kind: 'page',
			title: msg(p.title),
			path: p.path,
			names: names(...Object.values(msg(p.title))),
			text: words(...p.also.map(msg), p.extra)
		}))
	];
}

export function buildSearchIndex(c: SearchContent): SearchIndex {
	const shared: Record<string, string> = {
		...Object.fromEntries(Object.entries(FAMILY_WORDS).map(([f, w]) => [f, words(w)])),
		sawn: words(msg('timber.title'), msg('timber.sawn')),
		glulam: words(msg('timber.title'), msg('timber.glulam'), 'glulam')
	};
	const entries = [
		...pageEntries(),
		...steelEntries(c.steel),
		...timberEntries(c.timber),
		...rebarEntries(c.rebar),
		...sheetEntries(c.sheets),
		...bblEntries(c.bbl),
		...steelFactEntries(c.steelFacts),
		...drawingEntries(c.drawing),
		...ruleEntries('timber', c.rules.timber),
		...ruleEntries('concrete', c.rules.concrete),
		...masonryEntries(c.rules.masonry)
	];
	return { shared, entries };
}
