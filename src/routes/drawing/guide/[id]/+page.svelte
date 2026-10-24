<script lang="ts">
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Type from '@lucide/svelte/icons/type';
	import { resolve } from '$app/paths';
	import FlagMark from '$lib/components/FlagMark.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import IssueNotes from '$lib/components/IssueNotes.svelte';
	import LineSample from '$lib/components/LineSample.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { GuideStep } from '$lib/schema/drawing';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// All steps in the source order, which is also the drawing order.
	const steps = $derived(data.guide.steps.map((s, i) => ({ ...s, n: i + 1 })));
	let open = $state<number | null>(null);

	// "Streeplijn · 0,13 mm · grijs": only the parts the source gives.
	const specText = (s: GuideStep) =>
		[
			s.line && data.lines.find((l) => l.id === s.line)?.name[i18n.locale],
			s.weight && t('drawing.weight', { w: formatNumber(s.weight) }),
			s.color && t(`drawing.color.${s.color}`)
		]
			.filter(Boolean)
			.join(' · ');
</script>

<PageHeader
	title={data.guide.title[i18n.locale]}
	back="{resolve('/drawing')}?tab=guides"
	backLabel={t('drawing.title')}
/>

<p class="t-body-sm intro">{data.guide.intro[i18n.locale]}</p>

{#if data.guide.status === 'flagged'}
	<div class="banner" role="note">
		<FlagMark label={t('status.factFlagged')} tone="light" />
		<p class="t-body-sm">{t('drawing.flagged')}</p>
	</div>
{/if}

<p class="t-body-sm t-muted">{t('drawing.stepHint')}</p>

<ol class="steps">
	{#each steps as s (s.n)}
		{@const expanded = open === s.n}
		<li class="step" class:expanded>
			<button
				type="button"
				class="head"
				aria-expanded={expanded}
				onclick={() => (open = expanded ? null : s.n)}
			>
				<span class="num t-label">{s.n}</span>
				<span class="what">
					<span class="title">{s.title[i18n.locale]}</span>
					{#if s.line || s.weight}<span class="t-body-sm spec">{specText(s)}</span>{/if}
				</span>
				{#if s.line}
					<span class="paper sample">
						<LineSample line={s.line} weight={s.weight} symbol={s.symbol} color={s.color} />
					</span>
				{:else}
					<!-- Empty slot keeps the chevrons in one column. -->
					<span class="icon"
						>{#if s.part === 'labels'}<Type size={20} aria-hidden="true" />{/if}</span
					>
				{/if}
				<span class="chev"><ChevronDown size={18} aria-hidden="true" /></span>
			</button>
			{#if expanded}<p class="t-body-sm text">{s.text[i18n.locale]}</p>{/if}
		</li>
	{/each}
</ol>

<IssueNotes issues={data.guide.issues} />

<InfoFab sources={[data.source]}>
	<p>{t('drawing.flagged')}</p>
	<p>
		{t('info.origin', {
			path: data.origin.path.split('/').pop() ?? '',
			commit: data.origin.commit.slice(0, 7)
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
	.steps {
		display: flex;
		flex-direction: column;
		gap: var(--tile-gap);
		margin: var(--space-2) 0 var(--space-3);
		padding: 0;
		list-style: none;
	}
	.step {
		border-radius: var(--radius-md);
		background: var(--surface);
	}
	.head {
		display: grid;
		grid-template-columns: 24px 1fr auto 18px;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		min-height: 64px;
		padding: var(--space-3) var(--space-4);
		text-align: left;
		color: var(--ink);
		border-radius: inherit;
	}
	.head:hover {
		background: var(--surface-raised);
	}
	.num {
		color: var(--ink-muted);
	}
	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	.title {
		font: var(--body);
	}
	.spec {
		color: var(--ink-muted);
	}
	/* Samples sit on white, as on a drawing. */
	.paper {
		background: var(--paper);
		border-radius: var(--radius-sm);
	}
	.sample {
		width: 72px;
		padding: 4px;
	}
	.icon {
		display: grid;
		place-items: center;
		width: 72px;
		color: var(--ink-muted);
	}
	.chev {
		display: grid;
		color: var(--ink-muted);
		transition: transform 0.15s;
	}
	.expanded .chev {
		transform: rotate(180deg);
	}
	.text {
		margin: 0;
		padding: 0 var(--space-4) var(--space-4) calc(var(--space-4) + 24px + var(--space-3));
	}
	@media (prefers-reduced-motion: reduce) {
		.chev {
			transition: none;
		}
	}
</style>
