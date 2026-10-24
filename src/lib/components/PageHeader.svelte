<script lang="ts">
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n/index.svelte';
	import IconButton from './IconButton.svelte';

	interface Props {
		title: string;
		/** Shows a back button to this href. */
		back?: string;
		backLabel?: string;
		/** Back button that runs a handler instead of linking, e.g. history.back(). */
		onback?: () => void;
		/** Buttons on the right. */
		actions?: Snippet;
	}

	let { title, back, backLabel, onback, actions }: Props = $props();
</script>

<header class="header">
	{#if back}<IconButton icon={ChevronLeft} href={back} label={backLabel ?? t('common.back')} />
	{:else if onback}<IconButton
			icon={ChevronLeft}
			onclick={onback}
			label={backLabel ?? t('common.back')}
		/>{/if}
	<h1 class="t-heading">{title}</h1>
	{#if actions}<div class="actions">{@render actions()}</div>{/if}
</header>

<svelte:head><title>{title} · BARCHY</title></svelte:head>

<style>
	.header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}
	h1 {
		flex: 1;
		min-width: 0;
	}
	.actions {
		display: flex;
		gap: var(--space-2);
	}
</style>
