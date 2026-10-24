<script lang="ts">
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		/** Small arrow after the text that marks a link leaving the app. */
		icon?: boolean;
		children: Snippet;
	}

	let { href, icon = true, children }: Props = $props();
</script>

<a class="link" {href} target="_blank" rel="noopener noreferrer"
	>{@render children()}{#if icon}<ExternalLink
			size={14}
			strokeWidth={1.5}
			aria-hidden="true"
		/>{/if}</a
>

<style>
	.link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		text-decoration: underline;
		text-underline-offset: 2px;
		/* Comfortable touch target without changing the layout */
		padding: 4px 0;
		margin: -4px 0;
	}
</style>
