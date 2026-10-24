<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		onclick?: (event: MouseEvent) => void;
		/** Selected pills are white (paper); others neutral surface. */
		selected?: boolean;
		/** 'toggle' sets aria-pressed, 'tab' sets aria-selected with role=tab, 'link' sets aria-current. */
		kind?: 'toggle' | 'tab' | 'link';
		tone?: 'surface' | 'raised';
		label?: string;
		children: Snippet;
	}

	let {
		href,
		onclick,
		selected = false,
		kind = 'toggle',
		tone = 'surface',
		label,
		children
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		class="pill tone-{tone}"
		class:selected
		aria-label={label}
		aria-current={kind === 'link' && selected ? 'page' : undefined}>{@render children()}</a
	>
{:else}
	<button
		type="button"
		class="pill tone-{tone}"
		class:selected
		{onclick}
		aria-label={label}
		role={kind === 'tab' ? 'tab' : undefined}
		aria-selected={kind === 'tab' ? selected : undefined}
		aria-pressed={kind === 'toggle' ? selected : undefined}>{@render children()}</button
	>
{/if}

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		flex-shrink: 0;
		min-height: var(--touch);
		padding: 0 18px;
		border-radius: var(--radius-pill);
		font: 500 15px/1 var(--font-sans);
		white-space: nowrap;
		color: var(--ink);
	}
	.tone-surface {
		background: var(--surface);
	}
	.tone-raised {
		background: var(--surface-raised);
	}
	.pill:not(.selected):hover {
		background: var(--surface-raised);
	}
	.selected {
		background: var(--paper);
		color: var(--on-tile);
	}
</style>
