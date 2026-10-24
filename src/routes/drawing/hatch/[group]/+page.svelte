<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import HatchSwatch from '$lib/components/HatchSwatch.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import IssueNotes from '$lib/components/IssueNotes.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import { revealHash } from '$lib/deeplink';
	import { SCALES } from '$lib/drawing/constants';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import type { Hatch, Scale } from '$lib/schema/drawing';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let scale = $state<Scale | null>(null);
	// Opened from search: /drawing/hatch/stone#hatch-beton-1
	onMount(() => void revealHash());

	const shown = (h: Hatch) => scale === null || h.scales.includes(scale);
	const scaleText = (n: number) => t('drawing.scaleValue', { n });
	const anyFlagged = $derived(data.hatches.some((h) => h.status === 'flagged'));
</script>

<PageHeader
	title={t(`drawing.group.${data.group}`)}
	back="{resolve('/drawing')}?tab=hatch"
	backLabel={t('drawing.title')}
/>

{#if anyFlagged}
	<div class="banner" role="note">
		<FlagMark label={t('status.factFlagged')} tone="light" />
		<p class="t-body-sm">{t('drawing.flagged')}</p>
	</div>
{/if}

<div class="scales" role="group" aria-label={t('drawing.scale')}>
	<Pill selected={scale === null} onclick={() => (scale = null)}>{t('drawing.allScales')}</Pill>
	{#each SCALES as s (s)}
		<Pill selected={scale === s} onclick={() => (scale = s)}>{scaleText(s)}</Pill>
	{/each}
</div>

{#if data.hatches.some(shown)}
	<div class="grid">
		{#each data.hatches.filter(shown) as h (h.id)}
			<article class="card" id="hatch-{h.id}">
				<div class="paper">
					<HatchSwatch hatch={h.id} label={h.name[i18n.locale]} />
				</div>
				<h2 class="name">
					{h.name[i18n.locale]}
					{#if h.variant}<span class="t-label t-muted"
							>{t('drawing.variant', { n: h.variant })}</span
						>{/if}
				</h2>
				<ul class="marks" aria-label={t('drawing.scale')}>
					{#each SCALES as s (s)}
						<li class:on={h.scales.includes(s)} aria-hidden={!h.scales.includes(s)}>
							{scaleText(s)}
						</li>
					{/each}
				</ul>
				{#if h.note}<p class="t-body-sm t-muted">{h.note[i18n.locale]}</p>{/if}
				<IssueNotes issues={h.issues} />
			</article>
		{/each}
	</div>
{:else}
	<p class="t-body-sm t-muted">{t('drawing.noHatch')}</p>
{/if}

<InfoFab sources={[data.source, data.hatchSource]}>
	<p>{t('drawing.flagged')}</p>
	<p>{t('drawing.hatchSource', { ref: `${data.hatchSource.title}, ${data.hatchSource.ref}` })}</p>
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
		margin-bottom: var(--space-3);
	}
	.scales {
		display: flex;
		gap: var(--space-2);
		scrollbar-width: none;
		overflow-x: auto;
		margin-bottom: var(--space-2);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: var(--surface);
		min-width: 0;
		scroll-margin: var(--space-6);
	}
	/* Opened from search: outline the hatch that was looked for. */
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
</style>
