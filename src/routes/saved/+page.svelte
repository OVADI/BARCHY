<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { base } from '$app/paths';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import { bomTotals, memberMass } from '$lib/calc/weight';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';
	import { bomCsv } from '$lib/storage/csv';
	import { saved } from '$lib/storage/saved.svelte';

	let tab = $state<'bom' | 'favorites'>('bom');
	let announce = $state('');

	const totals = $derived(bomTotals([...saved.bom]));
	const kg = (v: number) => formatNumber(v, { maximumFractionDigits: 1 });

	function csv(): string {
		const nl = i18n.locale === 'nl';
		return bomCsv(saved.bom, {
			separator: nl ? ';' : ',',
			number: (v, d) => formatNumber(v, { maximumFractionDigits: d, useGrouping: false }),
			headers: [
				t('saved.csvName'),
				t('saved.csvCount'),
				t('saved.csvLength'),
				t('saved.csvG'),
				t('saved.csvMass')
			]
		});
	}

	function download() {
		// BOM so spreadsheet programs read UTF-8 (×, ²) correctly.
		const blob = new Blob(['﻿', csv()], { type: 'text/csv;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = t('saved.csvFile');
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	function text(): string {
		const lines = saved.bom.map(
			(i) =>
				`${i.name}: ${t('saved.line', { count: i.count, length: formatNumber(i.length) })} = ${kg(memberMass(i.G, i.length, i.count))} kg`
		);
		return [t('saved.shareTitle'), ...lines, `${t('saved.total')}: ${kg(totals.mass)} kg`].join(
			'\n'
		);
	}

	async function share() {
		const body = text();
		try {
			if (navigator.share) {
				await navigator.share({ title: t('saved.shareTitle'), text: body });
				return;
			}
			await navigator.clipboard.writeText(body);
			announce = t('saved.copied');
		} catch {
			// Share sheet dismissed or clipboard blocked: nothing to do.
		}
	}

	function clear() {
		if (confirm(t('saved.clearConfirm'))) saved.clearBom();
	}
</script>

<PageHeader title={t('saved.title')} />

<div class="tabs" role="tablist" aria-label={t('saved.title')}>
	<Pill kind="tab" selected={tab === 'bom'} onclick={() => (tab = 'bom')}>{t('saved.bom')}</Pill>
	<Pill kind="tab" selected={tab === 'favorites'} onclick={() => (tab = 'favorites')}
		>{t('saved.favorites')}</Pill
	>
</div>

<div role="tabpanel" class="panel">
	{#if !saved.ready}
		<p class="t-body-sm t-muted">{t('common.loading')}</p>
	{:else if tab === 'bom'}
		{#if saved.bom.length}
			<section class="total" aria-label={t('saved.total')}>
				<span class="t-label">{t('saved.total')}</span>
				<Stat value={totals.mass} unit="kg" size="lg" format={{ maximumFractionDigits: 1 }} />
				<p class="t-body-sm">
					{t(totals.positions === 1 ? 'saved.positionsOne' : 'saved.positions', {
						n: formatNumber(totals.positions)
					})} · {t(totals.pieces === 1 ? 'saved.piecesOne' : 'saved.pieces', {
						n: formatNumber(totals.pieces)
					})}
				</p>
				<div class="actions">
					<button type="button" class="action" onclick={share}
						><Share2 size={20} strokeWidth={1.5} aria-hidden="true" />{t('saved.share')}</button
					>
					<button type="button" class="action" onclick={download}
						><Download size={20} strokeWidth={1.5} aria-hidden="true" />{t('saved.csv')}</button
					>
				</div>
			</section>

			<ul class="lines">
				{#each saved.bom as item (item.id)}
					<li class="line">
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- stored app path -->
						<a href={`${base}${item.path}`} class="what">
							<span class="t-title">{item.name}</span>
							<span class="t-body-sm t-muted"
								>{t('saved.line', {
									count: formatNumber(item.count),
									length: formatNumber(item.length)
								})}</span
							>
						</a>
						<span class="mass">{kg(memberMass(item.G, item.length, item.count))} kg</span>
						<IconButton
							icon={Trash2}
							tone="ghost"
							label={t('saved.removeLine', { name: item.name })}
							onclick={() => saved.removeFromBom(item.id)}
						/>
					</li>
				{/each}
			</ul>
			<button type="button" class="clear t-body-sm" onclick={clear}>{t('saved.clear')}</button>
		{:else}
			<p class="t-body-sm t-muted">{t('saved.emptyBom')}</p>
		{/if}
	{:else if saved.favorites.length}
		<ul class="lines">
			{#each saved.favorites as f (f.path)}
				<li class="line">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- stored app path -->
					<a href={`${base}${f.path}`} class="what"><span class="t-title">{f.name}</span></a>
					<IconButton
						icon={Trash2}
						tone="ghost"
						label={t('saved.removeLine', { name: f.name })}
						onclick={() => saved.toggleFavorite(f)}
					/>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="t-body-sm t-muted">{t('saved.emptyFavorites')}</p>
	{/if}
</div>
<p class="sr-only" aria-live="polite">{announce}</p>

<InfoFab sources={[source('vademecum')]}>
	<p>{t('info.calcNote')}</p>
	<p>{t('info.savedNote')}</p>
</InfoFab>

<style>
	.tabs {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		margin-bottom: var(--space-2);
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.total {
		background: var(--orange);
		color: var(--on-tile);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}
	.action {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: var(--touch);
		padding: 0 18px;
		border-radius: var(--radius-pill);
		background: var(--orange-shade);
		color: var(--paper);
		font: 500 15px/1 var(--font-sans);
	}
	.lines {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.line {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
	}
	.what {
		flex: 1;
		min-width: 0;
		min-height: var(--touch);
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
	}
	.mass {
		font: 500 18px/1 var(--font-sans);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.clear {
		align-self: flex-start;
		min-height: var(--touch);
		color: var(--ink-muted);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
</style>
