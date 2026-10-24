<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import { i18n, t } from '$lib/i18n/index.svelte';
	import type { Note } from '$lib/schema/fact';

	/** Toelichting and Let op from the source. A warning carries an icon and a word, never colour alone. */
	let { notes }: { notes: Note[] } = $props();
</script>

<ul class="notes">
	{#each notes as n, i (i)}
		<li class="note kind-{n.kind}">
			{#if n.kind === 'warning'}
				<TriangleAlert size={16} strokeWidth={2} aria-hidden="true" />
			{:else}
				<Info size={16} strokeWidth={2} aria-hidden="true" />
			{/if}
			<p class="t-body-sm">
				<span class="kind">{t(n.kind === 'warning' ? 'rules.warning' : 'rules.note')}:</span>
				{n.text[i18n.locale]}
			</p>
		</li>
	{/each}
</ul>

<style>
	.notes {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.note {
		display: grid;
		grid-template-columns: 16px 1fr;
		gap: var(--space-2);
		align-items: start;
	}
	.note :global(svg) {
		margin-top: 2px;
	}
	.note p {
		margin: 0;
	}
	.kind {
		font-weight: 600;
	}
</style>
