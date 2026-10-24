import { json } from '@sveltejs/kit';
import bbl from '../../../../content/facts/bbl.json';
import steelFacts from '../../../../content/facts/steel.json';
import rebar from '../../../../content/concrete/rebar.json';
import sheets from '../../../../content/steel/sheets.json';
import timber from '../../../../content/timber/sections.json';
import { RebarFile } from '$lib/schema/concrete';
import { FactFile } from '$lib/schema/fact';
import { ProfiledSheetFile, SteelFile } from '$lib/schema/steel';
import { TimberFile } from '$lib/schema/timber';
import { buildSearchIndex } from '$lib/search/build';
import type { RequestHandler } from './$types';

// Content is validated by the build plugin; parsing again here keeps the types honest.
const steel = import.meta.glob('../../../../content/steel/{he,ipe,unp,shs,rhs,chs}.json', {
	eager: true,
	import: 'default'
});

const index = buildSearchIndex({
	steel: Object.values(steel).map((raw) => SteelFile.parse(raw)),
	timber: TimberFile.parse(timber),
	rebar: RebarFile.parse(rebar),
	sheets: ProfiledSheetFile.parse(sheets),
	bbl: FactFile.parse(bbl).facts,
	steelFacts: FactFile.parse(steelFacts).facts
});

export const prerender = true;

export const GET: RequestHandler = () => json(index);
