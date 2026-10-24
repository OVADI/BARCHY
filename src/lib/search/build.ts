import { formatFact } from '$lib/facts/format';
import { SPACE_TABS, STEEL_FACT_GROUPS, steelTabOf } from '$lib/facts/groups';
import { lookup, type Locale, type MessageKey } from '$lib/i18n/messages';
import type { RebarFile } from '$lib/schema/concrete';
import type { DrawingFile } from '$lib/schema/drawing';
import type { Fact } from '$lib/schema/fact';
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

function drawingEntries(file: DrawingFile): SearchEntry[] {
	const drawing = msg('drawing.title');
	const scales = (list: number[]) =>
		list.length === 6 ? '' : ` · ${list.map((n) => `1:${n}`).join(', ')}`;
	return [
		...file.hatches.map((h) => ({
			kind: 'drawing' as const,
			title: h.name,
			sub: both((l) => `${lookup(l, `drawing.group.${h.group}`)}${scales(h.scales)}`),
			path: `/drawing?tab=hatch#hatch-${h.id}`,
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
			path: `/drawing?tab=guides#guide-${g.id}`,
			names: names(g.title.nl, g.title.en),
			text: words(drawing, msg('drawing.guides'), g.intro, 'tekening tekeninstructie drawing'),
			flagged: g.status === 'flagged'
		}))
	];
}

/** Screens, with the messages and extra words people may type for them. */
const PAGES: { path: string; title: MessageKey; also: MessageKey[]; extra?: string }[] = [
	{ path: '/steel', title: 'home.steel', also: ['home.structureTitle'], extra: 'staalprofielen' },
	{ path: '/steel/sheets', title: 'sheets.title', also: [], extra: 'staalplaat' },
	{ path: '/timber', title: 'home.timber', also: ['timber.sawn', 'timber.glulam'] },
	{ path: '/concrete', title: 'home.concrete', also: ['concrete.rebar'], extra: 'wapening' },
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

function pageEntries(): SearchEntry[] {
	return [
		...TOOLS.map((tool): SearchEntry => ({
			kind: 'tool',
			title: msg(tool.title),
			path: tool.path,
			names: names(...Object.values(msg(tool.title))),
			text: words(msg('tools.title'), 'rekentool calculator')
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
		...drawingEntries(c.drawing)
	];
	return { shared, entries };
}
