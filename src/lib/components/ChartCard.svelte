<script lang="ts">
	import ChartSpline from '@lucide/svelte/icons/chart-spline';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import type { Chart } from '$lib/schema/fact';
	import FlagMark from './FlagMark.svelte';
	import RuleNotes from './RuleNotes.svelte';

	/** A design chart in the source: what it is for and what it assumes. The chart itself is not copied. */
	let { chart }: { chart: Chart } = $props();
</script>

<article class="chart" id={chart.id}>
	<div class="head">
		<span class="t-label kind"
			><ChartSpline size={16} strokeWidth={2} aria-hidden="true" />{t('rules.chart')}</span
		>
		{#if chart.status === 'flagged'}<FlagMark label={t('status.factFlagged')} tone="light" />{/if}
	</div>
	<h3 class="t-body label">{chart.label[i18n.locale]}</h3>
	<p class="t-body-sm">{chart.explain[i18n.locale]}</p>
	{#if chart.assumptions.length}
		<h4 class="t-label t-muted">{t('rules.assumptions')}</h4>
		<ul class="t-body-sm list">
			{#each chart.assumptions as a, i (i)}<li>{a[i18n.locale]}</li>{/each}
		</ul>
	{/if}
	{#if chart.lines.length}
		<h4 class="t-label t-muted">{t('rules.lines')}</h4>
		<ul class="t-body-sm list">
			{#each chart.lines as l, i (i)}<li>{l[i18n.locale]}</li>{/each}
		</ul>
	{/if}
	{#if chart.notes}<RuleNotes notes={chart.notes} />{/if}
	<p class="t-body-sm where">
		{t('rules.chartWhere', { ref: chart.source.ref })}
		{#if chart.source.url}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external source link -->
			<a href={chart.source.url} target="_blank" rel="noopener noreferrer"
				>{t('rules.openSource')}</a
			>
		{/if}
	</p>
</article>

<style>
	.chart {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
		color: var(--ink);
		min-width: 0;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.kind {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--ink-muted);
	}
	.label {
		font-weight: 500;
		margin: 0;
	}
	p,
	h4 {
		margin: 0;
	}
	h4 {
		margin-top: var(--space-1);
	}
	.list {
		margin: 0;
		padding-left: var(--space-4);
	}
	.where {
		color: var(--ink-muted);
	}
	.where a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
