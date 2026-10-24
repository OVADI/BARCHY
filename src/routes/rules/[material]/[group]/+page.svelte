<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ChartCard from '$lib/components/ChartCard.svelte';
	import FactTile from '$lib/components/FactTile.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import RuleNotes from '$lib/components/RuleNotes.svelte';
	import { revealHash } from '$lib/deeplink';
	import { RULE_SECTION_TITLE, RULE_SECTIONS } from '$lib/facts/rules';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import type { SourceRef } from '$lib/schema/source';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	onMount(() => void revealHash());

	const back = $derived(data.material === 'timber' ? resolve('/timber') : resolve('/concrete'));
	const materialTitle = $derived(t(data.material === 'timber' ? 'timber.title' : 'concrete.title'));

	// The header names the section (short); the group label, often long, is the heading below it.
	const section = $derived(
		RULE_SECTIONS[data.material].find((s) => s.groups.includes(data.group.id))!
	);
	// Sources of everything on this screen, once each.
	const sources = $derived(
		[...data.facts, ...data.charts]
			.map((r) => r.source)
			.filter((s, i, all): s is SourceRef => all.findIndex((x) => x.ref === s.ref) === i)
	);
</script>

<PageHeader
	title={t(RULE_SECTION_TITLE[section.key])}
	back="{back}?tab=rules"
	backLabel={materialTitle}
/>

{#if section.groups.length > 1}
	<h2 class="t-title heading">{data.group.label[i18n.locale]}</h2>
{/if}

{#if data.group.notes}
	<div class="group-notes"><RuleNotes notes={data.group.notes} /></div>
{/if}

<div class="facts">
	{#each data.facts as fact (fact.id)}
		<FactTile {fact} />
	{/each}
	{#each data.charts as chart (chart.id)}
		<ChartCard {chart} />
	{/each}
</div>

<InfoFab {sources}>
	<p>{t('rules.flagged')}</p>
	<p>{t('rules.method')}</p>
</InfoFab>

<style>
	.heading {
		margin: 0 0 var(--space-3);
	}
	.group-notes {
		padding: 0 var(--space-1);
		margin-bottom: var(--space-3);
		color: var(--ink);
	}
	.facts {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	/* Rules of thumb on material screens are white, as on the steel screen; the orange tag names the type. */
	.facts :global(.fact.type-rule_of_thumb) {
		background: var(--paper);
		color: var(--on-tile);
	}
</style>
