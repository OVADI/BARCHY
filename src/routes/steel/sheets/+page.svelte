<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { resolve } from '$app/paths';
	import ChoiceRow from '$lib/components/ChoiceRow.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ValueGrid from '$lib/components/ValueGrid.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { scaled, unitLabel, type Quantity } from '$lib/steel/quantities';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const heights = $derived([...new Set(data.sheets.map((s) => s.h))].sort((x, y) => x - y));
	let pickH = $state<number | null>(null);
	const h = $derived(pickH !== null && heights.includes(pickH) ? pickH : heights[0]!);
	const thicknesses = $derived(
		data.sheets
			.filter((s) => s.h === h)
			.map((s) => s.t)
			.sort((x, y) => x - y)
	);
	let pickT = $state<number | null>(null);
	const th = $derived(pickT !== null && thicknesses.includes(pickT) ? pickT : thicknesses[0]!);
	const s = $derived(data.sheets.find((x) => x.h === h && x.t === th)!);
	const flagged = $derived(s.status === 'flagged');

	// Per metre width, interpreted as ×10⁴ mm⁴/m and ×10³ mm³/m (see the issue on each record).
	const IY: Quantity = { field: 'Iy', pow: 4, unit: 'mm⁴/m' };
	const WY: Quantity = { field: 'Wy', pow: 3, unit: 'mm³/m' };
	const values = $derived([
		{ symbol: 'h', name: t('quantity.h.name'), value: s.h, unit: 'mm' },
		{ symbol: 't', name: t('sheets.t'), value: s.t, unit: 'mm' },
		{
			symbol: 'Iy',
			name: t('sheets.Iy'),
			value: scaled(s.Iy, IY),
			unit: unitLabel(IY),
			flagged
		},
		{
			symbol: 'Wy',
			name: t('sheets.Wy'),
			value: scaled(s.Wy, WY),
			unit: unitLabel(WY),
			flagged
		},
		{ symbol: 'σ', name: t('sheets.sigma'), value: s.sigma, unit: 'N/mm²', flagged }
	]);

	const PATH = '/steel/sheets';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('sheets.title')} back={resolve('/steel')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('sheets.title') })}
		/>
	{/snippet}
</PageHeader>

{#if flagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.flagged')} tone="light" />
		<p class="t-body-sm">{t('sheets.flagged')}</p>
	</div>
{/if}

<div class="picker">
	<ChoiceRow
		label={t('sheets.height')}
		options={heights}
		value={h}
		unit="mm"
		onchange={(v) => (pickH = v)}
	/>
	<ChoiceRow
		label={t('sheets.t')}
		options={thicknesses}
		value={th}
		unit="mm"
		onchange={(v) => (pickT = v)}
	/>
</div>

<ValueGrid {values} label={t('sheets.properties')} />

<InfoFab sources={[data.source, ...(s.source ? [s.source] : [])]}>
	<p>{flagged ? t('status.flaggedLong') : t('status.auto_checked')}</p>
	<p>{t('sheets.units')}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
</InfoFab>

<style>
	.banner {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
	}
	.picker {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-2);
	}
</style>
