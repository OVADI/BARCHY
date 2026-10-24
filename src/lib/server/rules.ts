import concrete from '../../../content/facts/concrete.json';
import masonry from '../../../content/facts/masonry.json';
import timber from '../../../content/facts/timber.json';
import { FactFile } from '$lib/schema/fact';
import type { RuleMaterial } from '$lib/facts/rules';

const RAW: Record<RuleMaterial, unknown> = { timber, concrete, masonry };

/** A material's rules of thumb, parsed. Server only: the data lands in prerendered page data. */
export function rulesOf(material: RuleMaterial) {
	const { facts, groups = [], charts = [] } = FactFile.parse(RAW[material]);
	return { facts, groups, charts };
}

/**
 * What the Rules tab needs per group: its label, one rule to preview (the depth rule if there is
 * one, else a rule of thumb before product data) and the number of charts. Keeps the material page small; each group page loads the rest.
 */
export function rulesOverview(material: RuleMaterial) {
	const { facts, groups, charts } = rulesOf(material);
	return groups.map((g) => {
		const list = facts.filter((f) => f.group === g.id);
		const lead =
			list.find((f) => f.symbol === 'h') ?? list.find((f) => f.type === 'rule_of_thumb') ?? list[0];
		return {
			id: g.id,
			label: g.label,
			lead: lead && {
				value: lead.value,
				unit: lead.unit,
				divisorOf: lead.divisorOf,
				factorOf: lead.factorOf,
				symbol: lead.symbol,
				bound: lead.bound,
				by: lead.by
			},
			charts: charts.filter((c) => c.group === g.id).length
		};
	});
}
export type RulesOverviewGroup = ReturnType<typeof rulesOverview>[number];
