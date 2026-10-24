<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ChoiceRow from '$lib/components/ChoiceRow.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { numberParam } from '$lib/deeplink';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { formatNumber, t } from '$lib/i18n/index.svelte';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const diameters = $derived(data.rows.map((r) => r.d));
	const COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	let pickD = $state<number | null>(null);
	const d = $derived(
		pickD !== null && diameters.includes(pickD)
			? pickD
			: diameters[Math.floor(diameters.length / 2)]!
	);
	let count = $state(4);

	// Opened from search: /concrete?d=12
	onMount(() => (pickD = numberParam('d')));
	const row = $derived(data.rows.find((r) => r.d === d)!);
	const As = $derived(row.As[count - 1]!);
	const flagged = $derived(row.status === 'flagged');

	const PATH = '/concrete';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('concrete.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('concrete.title') })}
		/>
	{/snippet}
</PageHeader>

<h2 class="t-title">{t('concrete.rebar')}</h2>

<ChoiceRow
	label={t('concrete.diameter')}
	options={diameters}
	value={d}
	unit="mm"
	onchange={(v) => (pickD = v)}
/>

<Tile tone="paper" pad="lg">
	<div class="hero-top">
		<span class="hero-label"
			><span class="t-symbol">A<sub>s</sub></span>
			<span class="t-label">{t('concrete.area')}</span></span
		>
		{#if flagged}<FlagMark label={t('status.flagged')} />{/if}
	</div>
	<Stat
		value={As}
		unit="mm²"
		size="lg"
		label={t('concrete.bars', { n: count, d })}
		format={{ maximumFractionDigits: 0 }}
	/>
	<Stepper
		label={t('concrete.count')}
		value={count}
		step={1}
		min={1}
		max={10}
		onchange={(v) => (count = v)}
	/>
</Tile>

<section class="table-tile" aria-labelledby="rebar-table">
	<h2 class="t-label t-muted" id="rebar-table">{t('concrete.table')}</h2>
	<div class="scroll">
		<table class="t-body-sm">
			<caption class="sr-only">{t('concrete.tableCaption')}</caption>
			<thead>
				<tr>
					<th scope="col">Ø</th>
					{#each COUNTS as n (n)}<th scope="col">{n}</th>{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.rows as r (r.d)}
					<tr class:current={r.d === d}>
						<th scope="row">{r.d}</th>
						{#each r.As as a, i (i)}
							<td class:hit={r.d === d && i === count - 1}>{formatNumber(a)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="t-body-sm t-muted">{t('concrete.tableNote')}</p>
</section>

<InfoFab sources={[data.source, ...(row.source ? [row.source] : [])]}>
	<p>{flagged ? t('status.flaggedLong') : t('status.auto_checked')}</p>
	<p>{t('concrete.rounded')}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
</InfoFab>

<style>
	.hero-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
	thead th {
		color: var(--ink-muted);
		border-bottom: 1px solid var(--line);
	}
	tbody th {
		position: sticky;
		left: 0;
		background: var(--surface);
		color: var(--ink-muted);
	}
	tr.current th,
	tr.current td {
		color: var(--ink);
	}
	tr.current td.hit {
		background: var(--paper);
		color: var(--on-tile);
	}
</style>
