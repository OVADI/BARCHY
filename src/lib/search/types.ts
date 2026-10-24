import type { Bilingual } from '$lib/schema/source';

/** What a hit is; decides the label and the order when scores tie. */
export const SEARCH_KINDS = [
	'tool',
	'page',
	'steel',
	'timber',
	'rebar',
	'sheet',
	'drawing',
	'requirement',
	'rule_of_thumb',
	'data'
] as const;
export type SearchKind = (typeof SEARCH_KINDS)[number];

/** Display text: one string when both languages read the same ('HEA 200'). */
export type Text = string | Bilingual;

export const localText = (text: Text, locale: keyof Bilingual) =>
	typeof text === 'string' ? text : text[locale];

/** One searchable item. Built at build time into /data/search.json, so the browser only matches. */
export interface SearchEntry {
	kind: SearchKind;
	title: Text;
	/** Second line, e.g. 'G 42,3 kg/m' or the scope of a requirement. */
	sub?: Text;
	/** Formatted value of a fact, e.g. '≥ 0,85 m'. */
	value?: Text;
	/** App path without the base, may carry a query or hash: '/timber?kind=sawn&b=71&h=171'. */
	path: string;
	/** Names and spellings, normalised and without spaces: 'hea200', 'he200a'. */
	names: string[];
	/** All other searchable words, normalised, both languages. */
	text?: string;
	/** Key into SearchIndex.shared: words that hundreds of entries share, stored once. */
	group?: string;
	flagged?: boolean;
}

export interface SearchIndex {
	shared: Record<string, string>;
	entries: SearchEntry[];
}
