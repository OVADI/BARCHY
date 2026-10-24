<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { resolve } from '$app/paths';
	import ChoiceRow from '$lib/components/ChoiceRow.svelte';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import ValueGrid from '$lib/components/ValueGrid.svelte';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { TimberSection } from '$lib/schema/timber';
	import { quantity, scaled, unitLabel } from '$lib/steel/quantities';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	type Kind = TimberSection['kind'];
	let kind = $state<Kind>('sawn');
	const ofKind = $derived(data.sections.filter((s) => s.kind === kind));
	const widths = $derived([...new Set(ofKind.map((s) => s.b))].sort((x, y) => x - y));

	// Picked sizes; the shown section falls back to the nearest listed size when a pick does not exist.
	let pickB = $state<number | null>(null);
	let pickH = $state<number | null>(null);
	const b = $derived(
		pickB !== null && widths.includes(pickB) ? pickB : widths[Math.floor(widths.length / 2)]!
	);
	const heights = $derived(
		ofKind
			.filter((s) => s.b === b)
			.map((s) => s.h)
			.sort((x, y) => x - y)
	);
	const h = $derived(
		pickH === null
			? heights[Math.floor(heights.length / 2)]!
			: heights.reduce((best, x) => (Math.abs(x - pickH!) < Math.abs(best - pickH!) ? x : best))
	);
	const s = $derived(ofKind.find((x) => x.b === b && x.h === h)!);
	const flagged = $derived(s.status === 'flagged');

	const values = $derived(
		(['A', 'Wy', 'Iy', 'Wz', 'Iz'] as const).map((f) => {
			// Glulam beams run to 1800 mm deep: step to ×10⁶ or ×10⁹ when the steel scale gets too long.
			const base = quantity(f);
			const pow = [base.pow, 6, 9].find((p) => p >= base.pow && s[f] / 10 ** p < 1e4)!;
			const q = { ...base, pow };
			return {
				symbol: f,
				name: t(`quantity.${f}.name`),
				explain: t(`timber.explain.${f}`),
				value: scaled(s[f], q),
				unit: unitLabel(q),
				// Exact rectangle values have long tails; one decimal at this scale is plenty.
				digits: 1
			};
		})
	);

	const sizeText = $derived(`${formatNumber(s.b)} × ${formatNumber(s.h)}`);

	// Section drawn to scale inside a fixed box.
	const BOX = 120;
	const scale = $derived(BOX / Math.max(s.b, s.h));

	const PATH = '/timber';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

<PageHeader title={t('timber.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('timber.title') })}
		/>
	{/snippet}
</PageHeader>

<div class="tabs" role="tablist" aria-label={t('timber.kinds')}>
	{#each ['sawn', 'glulam'] as const as k (k)}
		<Pill kind="tab" selected={kind === k} onclick={() => (kind = k)}>{t(`timber.${k}`)}</Pill>
	{/each}
</div>

<div class="picker" role="tabpanel">
	<ChoiceRow
		label={t('timber.width')}
		options={widths}
		value={b}
		unit="mm"
		onchange={(v) => (pickB = v)}
	/>
	<ChoiceRow
		label={t('timber.height')}
		options={heights}
		value={h}
		unit="mm"
		onchange={(v) => (pickH = v)}
	/>
</div>

{#if flagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.flagged')} tone="light" />
		<p class="t-body-sm">{t('timber.flagged')}</p>
	</div>
{/if}

<Tile tone="paper" pad="lg">
	<span class="t-label">{t('timber.section')}</span>
	<Stat
		value={sizeText}
		unit="mm"
		size={sizeText.length > 8 ? 'md' : 'lg'}
		label={t(`timber.${kind}`)}
	/>
	<svg
		width={BOX}
		height={BOX}
		viewBox="0 0 {BOX} {BOX}"
		role="img"
		aria-label={t('timber.drawing', { b: s.b, h: s.h })}
	>
		<defs>
			<!-- Schematic only: sawn diagonal, glulam horizontal laminations; no drawing standard yet. -->
			<pattern id="hatch-sawn" width="6" height="6" patternUnits="userSpaceOnUse">
				<path d="M-1 7 7 -1M-1 1 1 -1M5 7 7 5" stroke="currentColor" stroke-width="1" />
			</pattern>
			<pattern id="hatch-glulam" width="6" height="6" patternUnits="userSpaceOnUse">
				<path d="M0 3h6" stroke="currentColor" stroke-width="1" />
			</pattern>
		</defs>
		<rect
			x={(BOX - s.b * scale) / 2 + 1}
			y={(BOX - s.h * scale) / 2 + 1}
			width={s.b * scale - 2}
			height={s.h * scale - 2}
			fill="url(#hatch-{kind})"
			stroke="currentColor"
			stroke-width="2"
		/>
	</svg>
	<p class="t-body-sm hatch">{t('timber.hatch')}</p>
</Tile>

<ValueGrid {values} label={t('timber.properties')} />

<InfoFab sources={[data.source, ...(s.source ? [s.source] : [])]}>
	<p>{flagged ? t('status.flaggedLong') : t('status.auto_checked')}</p>
	<p>{i18n.locale === 'nl' ? data.method : t('timber.method')}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
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
	.banner {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
	}
	svg {
		align-self: center;
	}
	.hatch {
		color: var(--on-tile-muted);
	}
</style>
