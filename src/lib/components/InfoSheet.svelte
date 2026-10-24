<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import type { Snippet } from 'svelte';
	import { t } from '$lib/i18n/index.svelte';
	import type { SourceRef } from '$lib/schema/source';
	import IconButton from './IconButton.svelte';

	interface Props {
		id: string;
		sources: SourceRef[];
		/** Extra screen-specific info under the sources. */
		children?: Snippet;
		onclose: () => void;
	}

	let { id, sources, children, onclose }: Props = $props();

	let card: HTMLElement;
	const headingId = $derived(`${id}-heading`);

	$effect(() => {
		card.focus();
	});

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onclose();
		}
	}
</script>

<div
	{id}
	bind:this={card}
	class="sheet"
	role="dialog"
	aria-labelledby={headingId}
	tabindex="-1"
	{onkeydown}
>
	<div class="head">
		<h2 id={headingId} class="t-label">{t('info.heading')}</h2>
		<IconButton icon={X} label={t('common.close')} tone="ghost" onclick={onclose} />
	</div>
	<ul class="sources">
		{#each sources as source (source.title + source.ref)}
			<li class="t-body-sm">
				{#if source.url}
					<a href={source.url} target="_blank" rel="noopener noreferrer" class="link"
						>{source.title}</a
					>
				{:else}
					<span>{source.title}</span>
				{/if}
				<span class="ref">{source.ref}</span>
				{#if source.license}<span class="ref">{t('info.license')}: {source.license}</span>{/if}
			</li>
		{/each}
	</ul>
	{#if children}<div class="extra t-body-sm">{@render children()}</div>{/if}
</div>

<style>
	.sheet {
		width: min(320px, calc(100vw - 2 * var(--gutter)));
		max-height: 60dvh;
		overflow-y: auto;
		background: var(--paper);
		color: var(--on-tile);
		border-radius: var(--radius-md);
		padding: var(--space-2) var(--space-2) var(--space-4) var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.sheet:focus-visible {
		outline-color: var(--focus);
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.sources {
		list-style: none;
		margin: 0;
		padding: 0 var(--space-2) 0 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.sources li {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.link {
		text-decoration: underline;
		text-underline-offset: 2px;
		/* Make the link a comfortable touch target without changing the layout */
		padding: 4px 0;
		margin: -4px 0;
	}
	.ref,
	.extra {
		color: var(--on-tile-muted);
	}
	.extra {
		padding-right: var(--space-2);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
</style>
