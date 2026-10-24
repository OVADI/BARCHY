import type { MessageKey } from '$lib/i18n/messages';
import type { Fact } from '$lib/schema/fact';

/** Tabs and groups of /space; search links a Bbl fact to its tab. */
export type SpaceTab = 'rooms' | 'circulation' | 'guarding';
export const SPACE_TABS: {
	key: SpaceTab;
	title: MessageKey;
	groups: { key: string; title: MessageKey }[];
}[] = [
	{
		key: 'rooms',
		title: 'spacePage.rooms',
		groups: [
			{ key: 'living', title: 'spacePage.living' },
			{ key: 'sanitary', title: 'spacePage.sanitary' },
			{ key: 'outdoor', title: 'spacePage.outdoor' }
		]
	},
	{
		key: 'circulation',
		title: 'spacePage.circulation',
		groups: [
			{ key: 'stair', title: 'spacePage.stair' },
			{ key: 'ramp', title: 'spacePage.ramp' },
			{ key: 'access', title: 'spacePage.access' }
		]
	},
	{
		key: 'guarding',
		title: 'spacePage.guarding',
		groups: [{ key: 'guarding', title: 'spacePage.guarding' }]
	}
];

/** Fact groups of /steel: rules of thumb sit on the 'rules' tab, data on 'material'. */
export type SteelTab = 'profiles' | 'rules' | 'material';
export const STEEL_FACT_GROUPS: { key: string; title: MessageKey; type: Fact['type'] }[] = [
	{ key: 'beams-floor', title: 'steel.beamsFloor', type: 'rule_of_thumb' },
	{ key: 'beams-roof', title: 'steel.beamsRoof', type: 'rule_of_thumb' },
	{ key: 'purlins', title: 'steel.purlins', type: 'rule_of_thumb' },
	{ key: 'columns', title: 'steel.columns', type: 'rule_of_thumb' },
	{ key: 'stability', title: 'steel.stability', type: 'rule_of_thumb' },
	{ key: 'material', title: 'steel.properties', type: 'data' },
	{ key: 'grades', title: 'steel.grades', type: 'data' }
];

export const steelTabOf = (type: Fact['type']): SteelTab =>
	type === 'rule_of_thumb' ? 'rules' : 'material';
