<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import BeamDiagram from './BeamDiagram.svelte';
	import { resolve } from '$app/paths';
	import { formatFact } from '$lib/facts/format';
	import { RULE_SECTION_TITLE, RULE_SECTIONS } from '$lib/facts/rules';
	import { shapeOf } from '$lib/facts/shapes';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { RulesOverviewGroup } from '$lib/server/rules';

	/** The Rules tab of a material: its sections, with one row per group that opens the group page. */
	let { material, groups }: { material: keyof typeof RULE_SECTIONS; groups: RulesOverviewGroup[] } =
		$props();

	const byId = $derived(new Map(groups.map((g) => [g.id, g])));
	function preview(id: string): string {
		const g = byId.get(id);
		if (g?.lead) return formatFact(g.lead, formatNumber);
		return t('rules.chartCount', { n: g?.charts ?? 0 });
	}
	const label = (id: string) => byId.get(id)?.label[i18n.locale] ?? id;
</script>

<div class="overview">
	{#each RULE_SECTIONS[material] as s (s.key)}
		<section aria-labelledby="rules-{s.key}">
			<h2 id="rules-{s.key}" class="t-label t-muted section">{t(RULE_SECTION_TITLE[s.key])}</h2>
			<ul class="rows">
				{#each s.groups as g (g)}
					{@const shape = shapeOf(g)}
					<li>
						<a
							class="row"
							class:with-shape={shape}
							href={resolve('/rules/[material]/[group]', { material, group: g })}
						>
							{#if shape}<BeamDiagram {shape} labels={false} label={label(g)} />{/if}
							<span class="what">
								<span class="title">{label(g)}</span>
								<span class="t-body-sm sub">{preview(g)}</span>
							</span>
							<ChevronRight size={18} aria-hidden="true" />
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.overview {
		display: flex;
		flex-direction: column;
	}
	.section {
		margin: var(--space-4) 0 var(--space-2);
	}
	.rows {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 18px;
		--diagram-bg: var(--surface);
		align-items: center;
		gap: var(--space-3);
		min-height: 64px;
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
		color: var(--ink);
	}
	.with-shape {
		grid-template-columns: 88px 1fr 18px;
	}
	.row:hover {
		--diagram-bg: var(--surface-raised);
		background: var(--surface-raised);
	}
	.row > :global(svg:last-child) {
		color: var(--ink-muted);
	}
	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.title {
		font: var(--body);
	}
	.sub {
		color: var(--ink-muted);
	}
</style>
