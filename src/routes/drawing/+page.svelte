<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import BookmarkCheck from '@lucide/svelte/icons/bookmark-check';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import HatchSwatch from '$lib/components/HatchSwatch.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import LineSample from '$lib/components/LineSample.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { param, revealHash } from '$lib/deeplink';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import { HATCH_GROUPS, SCALES } from '$lib/drawing/constants';
	import type { GuideStep, Hatch, LineType, Scale } from '$lib/schema/drawing';
	import type { Issue } from '$lib/schema/source';
	import { saved } from '$lib/storage/saved.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const TABS = ['hatch', 'lines', 'guides'] as const;
	type Tab = (typeof TABS)[number];
	let tab = $state<Tab>('hatch');
	let scale = $state<Scale | null>(null);

	// Opened from search: /drawing?tab=hatch#hatch-beton-1
	onMount(() => {
		const wanted = param('tab');
		if (TABS.includes(wanted as Tab)) tab = wanted as Tab;
		void revealHash();
	});

	const anyFlagged = $derived(
		[...data.lines, ...data.hatches, ...data.guides].some((r) => r.status === 'flagged')
	);

	const shown = (h: Hatch) => scale === null || h.scales.includes(scale);
	const scaleText = (n: number) => t('drawing.scaleValue', { n });
	const weightText = (w: number) => t('drawing.weight', { w: formatNumber(w) });
	// "Streeplijn · 0,13 mm · grijs": only the parts the source gives.
	const specText = (s: GuideStep) =>
		[
			s.line && data.lines.find((l) => l.id === s.line)?.name[i18n.locale],
			s.weight && weightText(s.weight),
			s.color && t(`drawing.color.${s.color}`)
		]
			.filter(Boolean)
			.join(' · ');

	// Where each line type is used in the guides, so the line tab shows it in context.
	const usage = $derived(
		Object.fromEntries(
			data.lines.map((l) => [
				l.id,
				data.guides.flatMap((g) =>
					g.steps.filter((s) => s.line === l.id).map((s) => ({ guide: g, step: s }))
				)
			])
		) as Record<LineType, { guide: (typeof data.guides)[number]; step: GuideStep }[]>
	);

	const PATH = '/drawing';
	const favorite = $derived(saved.isFavorite(PATH));
</script>

{#snippet issues(list: Issue[])}
	{#each list as issue (issue.check)}
		<p class="issue t-body-sm">
			<FlagMark label={t('drawing.issue')} />
			<span>{issue.message}</span>
		</p>
	{/each}
{/snippet}

<PageHeader title={t('drawing.title')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={favorite ? BookmarkCheck : Bookmark}
			tone="ghost"
			label={favorite ? t('common.unsave') : t('common.save')}
			pressed={favorite}
			onclick={() => saved.toggleFavorite({ path: PATH, name: t('drawing.title') })}
		/>
	{/snippet}
</PageHeader>

<p class="t-body-sm t-muted intro">{t('drawing.intro')}</p>

{#if anyFlagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.factFlagged')} tone="light" />
		<p class="t-body-sm">{t('drawing.flagged')}</p>
	</div>
{/if}

<div class="tabs" role="tablist" aria-label={t('drawing.tabs')}>
	{#each TABS as x (x)}
		<Pill kind="tab" selected={tab === x} onclick={() => (tab = x)}>{t(`drawing.${x}`)}</Pill>
	{/each}
</div>

<div class="panel" role="tabpanel">
	{#if tab === 'lines'}
		<p class="t-body-sm t-muted">{t('drawing.relative')}</p>
		{#each data.lines as l (l.id)}
			<section class="card" id="line-{l.id}">
				<div class="paper"><LineSample line={l.id} weight={0.3} label={l.name[i18n.locale]} /></div>
				<h2 class="t-title">{l.name[i18n.locale]}</h2>
				{#if usage[l.id].length}
					<span class="t-label t-muted">{t('drawing.usedFor')}</span>
					<ul class="uses t-body-sm">
						{#each usage[l.id] as u, i (i)}
							<li>
								<span class="weight">{u.step.weight ? weightText(u.step.weight) : '–'}</span>
								<span class="use">
									<span>{u.step.text[i18n.locale]}</span>
									<span class="t-muted">{u.guide.title[i18n.locale]}</span>
								</span>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="t-body-sm t-muted">{t('drawing.notUsed')}</p>
				{/if}
				{@render issues(l.issues)}
			</section>
		{/each}
	{:else if tab === 'hatch'}
		<div class="scales" role="group" aria-label={t('drawing.scale')}>
			<Pill selected={scale === null} onclick={() => (scale = null)}>{t('drawing.allScales')}</Pill>
			{#each SCALES as s (s)}
				<Pill selected={scale === s} onclick={() => (scale = s)}>{scaleText(s)}</Pill>
			{/each}
		</div>
		{#each HATCH_GROUPS as g (g)}
			{@const list = data.hatches.filter((h) => h.group === g)}
			<section class="group">
				<h2 class="t-label t-muted">{t(`drawing.group.${g}`)}</h2>
				{#if list.some(shown)}
					<div class="grid">
						{#each list.filter(shown) as h (h.id)}
							<article class="card hatch" id="hatch-{h.id}">
								<div class="paper">
									<HatchSwatch hatch={h.id} label={h.name[i18n.locale]} />
								</div>
								<h3 class="name">
									{h.name[i18n.locale]}
									{#if h.variant}<span class="t-label t-muted"
											>{t('drawing.variant', { n: h.variant })}</span
										>{/if}
								</h3>
								<ul class="marks" aria-label={t('drawing.scale')}>
									{#each SCALES as s (s)}
										<li class:on={h.scales.includes(s)} aria-hidden={!h.scales.includes(s)}>
											{scaleText(s)}
										</li>
									{/each}
								</ul>
								{#if h.note}<p class="t-body-sm t-muted">{h.note[i18n.locale]}</p>{/if}
								{@render issues(h.issues)}
							</article>
						{/each}
					</div>
				{:else}
					<p class="t-body-sm t-muted">{t('drawing.noHatch')}</p>
				{/if}
			</section>
		{/each}
	{:else}
		<p class="t-body-sm t-muted">{t('drawing.relative')}</p>
		{#each data.guides as g (g.id)}
			<section class="card" id="guide-{g.id}">
				<h2 class="t-title">{g.title[i18n.locale]}</h2>
				<p class="t-body-sm">{g.intro[i18n.locale]}</p>
				<ol class="steps">
					{#each g.steps as s, i (i)}
						<li>
							<span class="num t-label t-muted">{i + 1}</span>
							<span class="text t-body-sm">
								{s.text[i18n.locale]}
								{#if s.line || s.weight}<span class="spec">{specText(s)}</span>{/if}
							</span>
							{#if s.line}
								<span class="paper sample">
									<LineSample line={s.line} weight={s.weight} symbol={s.symbol} color={s.color} />
								</span>
							{/if}
						</li>
					{/each}
				</ol>
				{@render issues(g.issues)}
			</section>
		{/each}
	{/if}
</div>

<InfoFab sources={[data.source, data.hatchSource]}>
	<p>{t('drawing.flagged')}</p>
	<p>{t('drawing.hatchSource', { ref: `${data.hatchSource.title}, ${data.hatchSource.ref}` })}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
		})}
	</p>
	<p>
		{t('info.origin', {
			path: data.guideOrigin.path.split('/').pop() ?? '',
			commit: data.guideOrigin.commit.slice(0, 7)
		})}
	</p>
</InfoFab>

<style>
	.intro {
		margin: 0 0 var(--space-3);
	}
	.banner {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		background: var(--surface);
		margin-bottom: var(--space-3);
	}
	.tabs,
	.scales {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		overflow-x: auto;
	}
	.tabs {
		margin-bottom: var(--space-2);
	}
	.panel,
	.group {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
	}
	.group > h2 {
		margin: var(--space-4) 0 var(--space-1);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--surface);
		min-width: 0;
		scroll-margin: var(--space-6);
	}
	.card.hatch {
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
	}
	/* Opened from search: outline the item that was looked for. */
	.card:global([data-found]) {
		outline: 3px solid var(--paper);
		outline-offset: 3px;
	}
	/* Samples sit on white, as on a drawing. */
	.paper {
		background: var(--paper);
		border-radius: var(--radius-sm);
		padding: var(--space-2);
	}
	.name {
		margin: 0;
		font: var(--body);
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: var(--space-2);
	}
	.marks {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.marks li {
		font: var(--label);
		padding: 3px 6px;
		border-radius: var(--radius-pill);
		color: var(--ink-muted);
		opacity: 0.45;
		text-decoration: line-through;
	}
	.marks li.on {
		background: var(--surface-raised);
		color: var(--ink);
		opacity: 1;
		text-decoration: none;
	}
	.uses {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.uses li {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: var(--space-2);
	}
	.use {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.weight {
		font-variant-numeric: tabular-nums;
		color: var(--ink-muted);
	}
	.steps {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.steps li {
		display: grid;
		grid-template-columns: 20px 1fr 88px;
		gap: var(--space-2);
		align-items: start;
	}
	.num {
		padding-top: 2px;
	}
	.text {
		display: flex;
		flex-direction: column;
		gap: 2px;
		grid-column: 2 / span 1;
	}
	.steps li:not(:has(.sample)) .text {
		grid-column: 2 / span 2;
	}
	.spec {
		color: var(--ink-muted);
	}
	.sample {
		padding: 4px;
	}
	.issue {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-1);
		margin: 0;
		color: var(--ink-muted);
	}
</style>
