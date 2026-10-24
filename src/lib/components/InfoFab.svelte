<script lang="ts">
	import Info from '@lucide/svelte/icons/info';
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n/index.svelte';
	import type { SourceRef } from '$lib/schema/source';
	import IconButton from './IconButton.svelte';
	import InfoSheet from './InfoSheet.svelte';

	interface Props {
		sources: SourceRef[];
		/** Extra px above the bottom bar, e.g. for the profile picker. */
		lift?: number;
		children?: Snippet;
	}

	let { sources, lift = 0, children }: Props = $props();

	let open = $state(false);
	let wrapper: HTMLElement;
	const sheetId = $props.id();

	function close() {
		open = false;
		wrapper.querySelector<HTMLElement>('button[aria-controls]')?.focus();
	}

	function onWindowClick(event: MouseEvent) {
		if (open && !wrapper.contains(event.target as Node)) open = false;
	}
</script>

<svelte:window onclick={onWindowClick} />

<div class="fab" bind:this={wrapper} style:--lift="{lift}px">
	{#if open}
		<InfoSheet id={sheetId} {sources} onclose={close}>{@render children?.()}</InfoSheet>
	{/if}
	<IconButton
		icon={Info}
		label={t('info.open')}
		tone={open ? 'paper' : 'raised'}
		expanded={open}
		controls={sheetId}
		onclick={() => (open = !open)}
	/>
</div>

<style>
	.fab {
		position: fixed;
		z-index: 20;
		/* Align with the content column on wide screens */
		left: max(var(--gutter), calc((100vw - var(--content-max)) / 2 + var(--gutter)));
		bottom: calc(var(--nav-total) + var(--space-4) + var(--lift));
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-2);
	}
</style>
