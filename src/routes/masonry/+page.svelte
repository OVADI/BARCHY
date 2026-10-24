<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ChoiceRow from '$lib/components/ChoiceRow.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import RuleNotes from '$lib/components/RuleNotes.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { numberParam, param } from '$lib/deeplink';
	import { masonryTable } from '$lib/facts/masonry';
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// One tab per wall type (eindgevel, tussenwand), in the source order.
	let pickGroup = $state<string | null>(null);
	const group = $derived(data.groups.find((g) => g.id === pickGroup) ?? data.groups[0]!);
	const groupId = $derived(group.id);
	const table = $derived(masonryTable(data.facts.filter((f) => f.group === groupId)));

	let n = $state(3);
	let l = $state(5);
	const cell = $derived(table.cell(n, l));
	const ht = $derived(table.spans.find((s) => s.l === l)?.ht);

	// Opened from search: /masonry?wall=calcium-silicate-party-wall&n=4&l=6
	onMount(() => {
		const wall = param('wall');
		if (wall) pickGroup = wall;
		n = numberParam('n') ?? n;
		l = numberParam('l') ?? l;
	});

	const PATH = '/masonry';
	const favorite = $derived(saved.isFavorite(PATH));
	const sources = $derived(data.facts.slice(0, 1).map((f) => f.source));
</script>

<PageHeader title={t('masonry.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('masonry.title') })}
		/>
	{/snippet}
</PageHeader>

<h2 class="t-title">{t('masonry.heading')}</h2>

<div class="tabs" role="tablist" aria-label={t('masonry.wallType')}>
	{#each data.groups as g (g.id)}
		<Pill kind="tab" selected={groupId === g.id} onclick={() => (pickGroup = g.id)}
			>{t(g.id === 'calcium-silicate-end-wall' ? 'masonry.endWall' : 'masonry.partyWall')}</Pill
		>
	{/each}
</div>

<div class="picker" role="tabpanel">
	<ChoiceRow
		label={t('masonry.storeys')}
		options={table.storeys}
		value={n}
		onchange={(v) => (n = v)}
	/>
	<ChoiceRow
		label={t('masonry.bay')}
		options={table.spans.map((s) => s.l)}
		value={l}
		unit="m"
		onchange={(v) => (l = v)}
	/>
</div>

{#if cell}
	<Tile tone="orange" pad="lg">
		<div class="hero-top">
			<span class="hero-label"
				><span class="t-symbol">d</span>
				<span class="t-label">{t('masonry.thickness')}</span></span
			>
			{#if cell.status === 'flagged'}<FlagMark label={t('status.factFlagged')} />{/if}
		</div>
		<Stat
			value={`≥ ${formatNumber(cell.value as number)}`}
			unit="mm"
			size="lg"
			label={t('masonry.caption', { n, l: formatNumber(l), ht: formatNumber(ht ?? 0) })}
		/>
	</Tile>
{/if}

<section class="table-tile" aria-labelledby="masonry-table">
	<h2 class="t-label t-muted" id="masonry-table">{t('masonry.table')}</h2>
	<div class="scroll">
		<table class="t-body-sm">
			<caption class="sr-only">{t('masonry.tableCaption')}</caption>
			<thead>
				<tr>
					<th scope="col">n</th>
					{#each table.spans as s (s.l)}
						<th scope="col"
							>{formatNumber(s.l)} m<span class="ht">h<sub>t</sub> {formatNumber(s.ht)}</span></th
						>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each table.storeys as row (row)}
					<tr class:current={row === n}>
						<th scope="row">{row}</th>
						{#each table.spans as s (s.l)}
							{@const v = table.cell(row, s.l)?.value}
							<td class:hit={row === n && s.l === l}>
								<button
									type="button"
									aria-pressed={row === n && s.l === l}
									onclick={() => {
										n = row;
										l = s.l;
									}}>{typeof v === 'number' ? formatNumber(v) : '–'}</button
								>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="t-body-sm t-muted">{t('masonry.tableNote')}</p>
</section>

{#if group.notes}<div class="notes"><RuleNotes notes={group.notes} /></div>{/if}

<InfoFab {sources}>
	<p>{t('rules.flagged')}</p>
	<p>{t('masonry.method')}</p>
</InfoFab>

<style>
	.tabs {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		overflow-x: auto;
	}
	.picker {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}
	.hero-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}
	.hero-label {
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-2);
	}
	.table-tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--surface);
		min-width: 0;
	}
	.scroll {
		overflow-x: auto;
	}
	table {
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
		width: 100%;
	}
	th,
	td {
		padding: 6px 8px;
		text-align: right;
		white-space: nowrap;
	}
	td {
		padding: 0;
	}
	td button {
		width: 100%;
		min-height: 40px;
		padding: 6px 8px;
		text-align: right;
		color: inherit;
		border-radius: var(--radius-sm);
	}
	thead th {
		color: var(--ink-muted);
		border-bottom: 1px solid var(--line);
		vertical-align: bottom;
	}
	.ht {
		display: block;
		font-size: 12px;
	}
	tbody th {
		color: var(--ink-muted);
	}
	td {
		color: var(--ink-muted);
	}
	tr.current th,
	tr.current td {
		color: var(--ink);
	}
	td.hit button {
		background: var(--orange);
		color: var(--on-tile);
	}
	.notes {
		padding: var(--space-3) var(--space-1) 0;
	}
</style>
