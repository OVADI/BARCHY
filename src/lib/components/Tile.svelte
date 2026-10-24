<script lang="ts" module>
	export type TileTone = 'surface' | 'raised' | 'paper' | 'orange' | 'cobalt' | 'lavender' | 'lime';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		tone?: TileTone;
		/** md = 16px inner padding, lg = 24px */
		pad?: 'md' | 'lg';
		/** md = 20px (low tiles, list rows), lg = 28px (standard) */
		radius?: 'md' | 'lg';
		/** Renders an <a>. */
		href?: string;
		/** Renders a <button>. */
		onclick?: (event: MouseEvent) => void;
		/** Element when neither href nor onclick is set. */
		as?: 'div' | 'section' | 'article' | 'li';
		label?: string;
		expanded?: boolean;
		pressed?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		tone = 'surface',
		pad = 'md',
		radius = 'lg',
		href,
		onclick,
		as = 'div',
		label,
		expanded,
		pressed,
		class: className = '',
		children
	}: Props = $props();

	const classes = $derived(`tile tone-${tone} pad-${pad} radius-${radius} ${className}`);
</script>

{#if href}
	<a {href} class={classes} aria-label={label}>{@render children()}</a>
{:else if onclick}
	<button
		type="button"
		{onclick}
		class={classes}
		aria-label={label}
		aria-expanded={expanded}
		aria-pressed={pressed}
	>
		{@render children()}
	</button>
{:else}
	<svelte:element this={as} class={classes} aria-label={label}>{@render children()}</svelte:element>
{/if}

<style>
	.tile {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		min-width: 0;
		text-align: left;
		width: 100%;
	}
	button.tile,
	a.tile {
		min-height: var(--touch);
		cursor: pointer;
	}
	.pad-md {
		padding: var(--space-4);
	}
	.pad-lg {
		padding: var(--space-5);
	}
	.radius-md {
		border-radius: var(--radius-md);
	}
	.radius-lg {
		border-radius: var(--radius-lg);
	}
	.tone-surface {
		background: var(--surface);
		color: var(--ink);
	}
	.tone-raised {
		background: var(--surface-raised);
		color: var(--ink);
	}
	.tone-paper {
		background: var(--paper);
		color: var(--on-tile);
	}
	.tone-orange {
		background: var(--orange);
		color: var(--on-tile);
	}
	.tone-cobalt {
		background: var(--cobalt);
		color: var(--on-cobalt);
	}
	.tone-lavender {
		background: var(--lavender);
		color: var(--on-tile);
	}
	.tone-lime {
		background: var(--lime);
		color: var(--on-tile);
	}
	button.tone-surface:hover,
	a.tone-surface:hover {
		background: var(--surface-raised);
	}
</style>
