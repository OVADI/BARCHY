<script lang="ts">
	import { tick } from 'svelte';
	import { resolve } from '$app/paths';
	import type { SteelSeries } from '$lib/schema/steel';
	import { t } from '$lib/i18n/index.svelte';
	import { sizeLabel } from '$lib/steel/names';
	import type { ClientSection } from '$lib/steel/client';
	import {
		MORE_SERIES,
		PRIMARY_SERIES,
		seriesLabel,
		seriesSlug,
		sizeSlug
	} from '$lib/steel/series';

	interface Props {
		series: SteelSeries;
		/** Sections of the current series, in table order. */
		sections: ClientSection[];
		currentId: string;
	}

	let { series, sections, currentId }: Props = $props();

	let more = $state(false);
	let sizesEl: HTMLElement;

	// A variant series stays visible while it is the current one.
	const showMore = $derived(more || MORE_SERIES.includes(series));
	const visibleSeries = $derived(showMore ? [...PRIMARY_SERIES, ...MORE_SERIES] : PRIMARY_SERIES);

	// Keep the chosen size in view.
	$effect(() => {
		void currentId;
		void tick().then(() =>
			sizesEl
				?.querySelector<HTMLElement>('[aria-current="page"]')
				?.scrollIntoView({ block: 'nearest', inline: 'center' })
		);
	});
</script>

<nav class="picker" aria-label={t('profile.picker')}>
	<div class="row" aria-label={t('profile.series')} role="group">
		{#each visibleSeries as s (s)}
			<a
				class="pill"
				class:selected={s === series}
				aria-current={s === series ? 'page' : undefined}
				href={resolve('/steel/[series]', { series: seriesSlug(s) })}>{seriesLabel(s)}</a
			>
		{/each}
		<button
			type="button"
			class="pill toggle"
			aria-expanded={showMore}
			onclick={() => (more = !showMore)}
			>{showMore ? t('profile.fewerVariants') : t('profile.moreVariants')}</button
		>
	</div>
	<div class="row sizes" bind:this={sizesEl} aria-label={t('profile.sizes')} role="group">
		{#each sections as s (s.id)}
			<a
				class="pill size"
				class:selected={s.id === currentId}
				aria-current={s.id === currentId ? 'page' : undefined}
				href={resolve('/steel/[series]/[size]', { series: seriesSlug(series), size: sizeSlug(s) })}
				>{sizeLabel(s)}{#if s.status === 'flagged'}<span class="sr-only"
						>, {t('status.flagged')}</span
					><span class="dot" aria-hidden="true">!</span>{/if}</a
			>
		{/each}
	</div>
</nav>

<style>
	.picker {
		position: fixed;
		z-index: 25;
		left: 0;
		right: 0;
		bottom: var(--nav-total);
		background: var(--ground);
		border-top: 1px solid var(--line);
		padding: var(--space-3) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.row {
		display: flex;
		gap: var(--space-2);
		overflow-x: auto;
		scrollbar-width: none;
		padding: 2px max(var(--gutter), calc((100vw - var(--content-max)) / 2 + var(--gutter)));
		scroll-padding-inline: var(--gutter);
	}
	.row::-webkit-scrollbar {
		display: none;
	}
	.pill {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		min-height: var(--touch);
		padding: 0 16px;
		border-radius: var(--radius-pill);
		background: var(--surface);
		color: var(--ink);
		font: 500 15px/1 var(--font-sans);
		white-space: nowrap;
	}
	.pill:hover {
		background: var(--surface-raised);
	}
	.pill.selected {
		background: var(--paper);
		color: var(--on-tile);
	}
	.toggle {
		color: var(--ink-muted);
	}
	.size {
		font-variant-numeric: tabular-nums;
	}
	.dot {
		display: inline-grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--warn);
		color: var(--on-tile);
		font: 700 11px/1 var(--font-sans);
	}
</style>
