import type { MessageKey } from '$lib/i18n/messages';

/** Materials with a rules-of-thumb section; each has its own facts file in content/facts. */
export const RULE_MATERIALS = ['timber', 'concrete', 'masonry'] as const;
export type RuleMaterial = (typeof RULE_MATERIALS)[number];

export type RuleSection = 'beams' | 'floors' | 'walls' | 'columns' | 'stability';

/**
 * Order of the groups on the Rules tab, by section, following the build-up of a structure.
 * Every group in a facts file must be listed here (rules.test.ts checks it), so nothing is hidden.
 */
export const RULE_SECTIONS: Record<
	Exclude<RuleMaterial, 'masonry'>,
	{ key: RuleSection; groups: string[] }[]
> = {
	timber: [
		{
			key: 'beams',
			groups: [
				'beams-straight',
				'beams-cantilever',
				'beams-continuous',
				'beams-pitched',
				'beams-curved',
				'beams-trussed',
				'trusses-straight',
				'trusses-triangular',
				'frames-portal',
				'frames-three-hinged',
				'frames-three-hinged-bent',
				'arches',
				'beams-glulam-chart'
			]
		},
		{ key: 'floors', groups: ['floors'] },
		{ key: 'walls', groups: ['walls'] },
		{ key: 'columns', groups: ['columns'] },
		{ key: 'stability', groups: ['stability-hsb', 'stability-clt'] }
	],
	concrete: [
		{ key: 'beams', groups: ['beams'] },
		{
			key: 'floors',
			groups: [
				'floors-hollow-core',
				'floors-hollow-core-dycore',
				'floors-wide-slab',
				'floors-ribbed',
				'floors-composite-deck'
			]
		},
		{ key: 'walls', groups: ['walls'] },
		{ key: 'columns', groups: ['columns'] },
		{ key: 'stability', groups: ['stability'] }
	]
};

export const RULE_SECTION_TITLE: Record<RuleSection, MessageKey> = {
	beams: 'rules.beams',
	floors: 'rules.floors',
	walls: 'rules.walls',
	columns: 'rules.columns',
	stability: 'rules.stability'
};
