<script lang="ts">
	import type { LucideIcon } from '@lucide/svelte';

	interface Props {
		icon: LucideIcon;
		/** Required: the button has no visible text. */
		label: string;
		href?: string;
		onclick?: (event: MouseEvent) => void;
		tone?: 'surface' | 'raised' | 'paper' | 'ghost' | 'shade';
		/** 44 (default) or 48 px */
		size?: 44 | 48;
		expanded?: boolean;
		pressed?: boolean;
		disabled?: boolean;
		controls?: string;
	}

	let {
		icon: Icon,
		label,
		href,
		onclick,
		tone = 'surface',
		size = 44,
		expanded,
		pressed,
		disabled = false,
		controls
	}: Props = $props();
</script>

{#if href}
	<a {href} class="icon-btn tone-{tone}" style:--size="{size}px" aria-label={label}>
		<Icon size={22} strokeWidth={1.5} aria-hidden="true" />
	</a>
{:else}
	<button
		type="button"
		class="icon-btn tone-{tone}"
		style:--size="{size}px"
		{onclick}
		{disabled}
		aria-label={label}
		aria-expanded={expanded}
		aria-pressed={pressed}
		aria-controls={controls}
	>
		<Icon size={22} strokeWidth={1.5} aria-hidden="true" />
	</button>
{/if}

<style>
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: var(--size);
		height: var(--size);
		border-radius: var(--radius-pill);
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
	.tone-ghost {
		background: transparent;
		color: inherit;
	}
	/* Inside orange tiles */
	.tone-shade {
		background: var(--orange-shade);
		color: var(--paper);
	}
	.tone-surface:hover,
	.tone-ghost:hover {
		background: var(--surface-raised);
	}
	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
