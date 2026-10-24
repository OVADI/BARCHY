<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import Plus from '@lucide/svelte/icons/plus';
	import { resolve } from '$app/paths';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import QuantityGrid from '$lib/components/QuantityGrid.svelte';
	import SectionSvg from '$lib/components/SectionSvg.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import SteelPicker from '$lib/components/SteelPicker.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { memberMass } from '$lib/calc/weight';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import { fieldsFor, quantity, scaled, unitLabel } from '$lib/steel/quantities';
	import { displayName } from '$lib/steel/names';
	import { seriesSlug, sizeSlug } from '$lib/steel/series';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const s = $derived(data.section);
	const name = $derived(displayName(s));
	const path = $derived(`/steel/${seriesSlug(data.series)}/${sizeSlug(s)}`);
	const fields = $derived(fieldsFor(s));
	const hasFieldErrors = $derived(s.issues.some((i) => i.severity === 'error' && i.field));
	const recordFlagged = $derived(s.status === 'flagged' && !hasFieldErrors);
	const favorite = $derived(saved.isFavorite(path));

	// Weight calculator (defaults are UI starting points, not building values)
	let length = $state(6000);
	let count = $state(1);
	const total = $derived(memberMass(s.G, length, count));
	let announce = $state('');

	$effect(() => {
		saved.visit({ path, name });
	});

	function addToBom() {
		saved.addToBom({ sectionId: s.id, name, path, G: s.G, length, count });
		announce = t('profile.added', { name });
	}

	const sources = $derived([
		data.source,
		...s.corrections.map((c) => c.source),
		...(s.source ? [s.source] : [])
	]);
	const fieldUnit = (f: string) => {
		const known = ['h', 'b', 'tw', 'tf', 't', 'D', 'G', 'A', 'Iy', 'Iz', 'Wy', 'Wz', 'iy', 'iz'];
		return known.includes(f) ? quantity(f as 'h') : null;
	};
	function correctionText(c: (typeof s.corrections)[number]): string {
		const q = fieldUnit(c.field);
		const fmt = (v: number | string | null) =>
			typeof v === 'number' && q
				? `${formatNumber(scaled(v, q), { maximumFractionDigits: 3 })} ${unitLabel(q)}`
				: String(v ?? '–');
		return t('info.corrected', { field: c.field, from: fmt(c.from), to: fmt(c.to) });
	}
</script>

<PageHeader title={name} back={resolve('/steel')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path, name })}
		/>
	{/snippet}
</PageHeader>

{#if recordFlagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.flagged')} tone="light" />
		<p class="t-body-sm">{t('status.recordFlagged')}</p>
	</div>
{/if}

<Tile tone="orange" pad="lg">
	<div class="hero-top">
		<span class="hero-label"
			><span class="t-symbol">G</span> <span class="t-label">{t('quantity.G.name')}</span></span
		>
		{#if s.issues.some((i) => i.severity === 'error' && i.field === 'G')}
			<FlagMark label={t('status.flagged')} />
		{/if}
	</div>
	<Stat value={s.G} unit="kg/m" size="lg" format={{ maximumFractionDigits: 3 }} />
	<SectionSvg section={s} />
</Tile>

<QuantityGrid section={s} fields={fields.dims} label={t('profile.dimensions')} />
<QuantityGrid section={s} fields={fields.props} label={t('profile.properties')} />

<Tile tone="surface" pad="md" as="section" label={t('profile.weight')}>
	<h2 class="t-label t-muted">{t('profile.weight')}</h2>
	<Stepper
		label={t('profile.length')}
		value={length}
		step={500}
		min={500}
		unit="mm"
		onchange={(v) => (length = v)}
	/>
	<Stepper
		label={t('profile.count')}
		value={count}
		step={1}
		min={1}
		onchange={(v) => (count = v)}
	/>
	<div class="total">
		<Stat
			value={total}
			unit="kg"
			size="md"
			label={t('profile.total')}
			format={{ maximumFractionDigits: 1 }}
		/>
		<button
			type="button"
			class="add"
			onclick={addToBom}
			aria-label={t('profile.addToBomLabel', { name })}
		>
			<Plus size={20} strokeWidth={2} aria-hidden="true" />{t('profile.addToBom')}
		</button>
	</div>
	<p class="sr-only" aria-live="polite">{announce}</p>
</Tile>

<div class="picker-space" aria-hidden="true"></div>

<SteelPicker series={data.series} sections={data.inSeries} currentId={s.id} />

<InfoFab {sources} lift={124}>
	<p>
		{#if s.status === 'human_verified'}
			{t('status.human_verified', { by: s.verifiedBy ?? '', on: s.verifiedOn ?? '' })}
		{:else if s.status === 'auto_checked'}
			{t('status.auto_checked')}
		{:else}
			{t('status.flaggedLong')}
		{/if}
	</p>
	{#each s.corrections as c (c.field)}
		<p>
			{correctionText(c)}{#if i18n.locale === 'nl'}. {c.reason}{/if}
		</p>
	{/each}
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
	<p>{t('info.calcNote')}</p>
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
	.hero-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-2);
	}
	.total {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: var(--space-3);
		padding-top: var(--space-2);
		border-top: 1px solid var(--line);
	}
	.total > :global(:first-child) {
		flex: 1 0 auto;
	}
	.add {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 48px;
		padding: 0 20px;
		border-radius: var(--radius-pill);
		background: var(--orange);
		color: var(--on-tile);
		font: 500 16px/1 var(--font-sans);
	}
	.picker-space {
		height: 124px;
	}
</style>
