<script lang="ts">
	import Download from '@lucide/svelte/icons/download';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
	import Menu from '@lucide/svelte/icons/menu';
	import MonitorDown from '@lucide/svelte/icons/monitor-down';
	import Share from '@lucide/svelte/icons/share';
	import SquarePlus from '@lucide/svelte/icons/square-plus';
	import type { Component } from 'svelte';
	import { t } from '$lib/i18n/index.svelte';
	import type { MessageKey } from '$lib/i18n/messages';
	import { install } from '$lib/install.svelte';
	import type { InstallPlatform } from '$lib/install';

	interface Guide {
		/** Icon for the first step, the one people struggle to find. */
		icon: Component;
		steps: 1 | 2 | 3;
	}

	const guides: Record<InstallPlatform, Guide> = {
		'ios-safari': { icon: Share, steps: 3 },
		'ios-other': { icon: Ellipsis, steps: 3 },
		'android-chrome': { icon: EllipsisVertical, steps: 3 },
		'android-samsung': { icon: Menu, steps: 3 },
		'android-other': { icon: EllipsisVertical, steps: 3 },
		'desktop-chromium': { icon: MonitorDown, steps: 2 },
		'desktop-safari': { icon: Share, steps: 2 },
		'desktop-other': { icon: Download, steps: 1 }
	};

	const order = Object.keys(guides) as InstallPlatform[];
	const others = $derived(order.filter((p) => p !== install.platform));

	let dialog: HTMLDialogElement;

	// Modal, so focus stays inside and the page behind is inert until it is closed.
	$effect(() => {
		if (install.open && !dialog.open) dialog.showModal();
		else if (!install.open && dialog.open) dialog.close();
	});

	const key = (p: InstallPlatform, part: string) => `install.platforms.${p}.${part}` as MessageKey;
</script>

{#snippet steps(p: InstallPlatform)}
	{@const Icon = guides[p].icon}
	<ol class="steps">
		{#each Array.from({ length: guides[p].steps }, (_, i) => i + 1) as n (n)}
			<li>
				<span class="t-body">{t(key(p, `s${n}`))}</span>
				{#if n === 1 && guides[p].steps > 1}<Icon
						size={20}
						strokeWidth={1.5}
						aria-hidden="true"
					/>{/if}
			</li>
		{/each}
	</ol>
{/snippet}

<!-- Esc closes the dialog natively ('cancel'); that counts as shown, like the buttons. -->
<dialog
	bind:this={dialog}
	class="dialog"
	aria-labelledby="install-title"
	oncancel={() => install.dismiss()}
>
	<div class="head">
		<SquarePlus size={28} strokeWidth={1.5} aria-hidden="true" />
		<h2 id="install-title" class="t-title">{t('install.title')}</h2>
	</div>
	<p class="t-body">{t('install.intro')}</p>

	<section class="block" aria-labelledby="install-yours">
		<h3 id="install-yours" class="t-label muted">
			{t('install.yours')}: {t(key(install.platform, 'name'))}
		</h3>
		{@render steps(install.platform)}
		{#if install.canPrompt}
			<button type="button" class="primary" onclick={() => install.prompt()}>
				{t('install.now')}
			</button>
		{/if}
	</section>

	<details class="other">
		<summary class="t-label">{t('install.other')}</summary>
		{#each others as p (p)}
			<section class="block">
				<h3 class="t-label muted">{t(key(p, 'name'))}</h3>
				{@render steps(p)}
			</section>
		{/each}
	</details>

	<button type="button" class="ok" onclick={() => install.dismiss()}>{t('install.ok')}</button>
</dialog>

<style>
	.dialog {
		width: min(400px, calc(100vw - 2 * var(--gutter)));
		max-height: calc(100dvh - 2 * var(--gutter));
		overflow-y: auto;
		margin: auto;
		border: 0;
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		background: var(--paper);
		color: var(--on-tile);
		display: none;
		flex-direction: column;
		gap: var(--space-4);
	}
	.dialog[open] {
		display: flex;
	}
	.dialog::backdrop {
		background: rgb(0 0 0 / 0.7);
	}
	.head {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	h2,
	h3,
	p {
		margin: 0;
	}
	.muted {
		color: var(--on-tile-muted);
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.steps {
		margin: 0;
		padding-left: var(--space-5);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	.steps li::marker {
		font-weight: 700;
	}
	.steps li > :global(svg) {
		vertical-align: middle;
		margin-left: var(--space-1);
	}
	.other {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.other summary {
		cursor: pointer;
		min-height: var(--touch);
		display: flex;
		align-items: center;
	}
	.other[open] summary {
		margin-bottom: var(--space-2);
	}
	.other .block + .block {
		margin-top: var(--space-4);
	}
	.primary,
	.ok {
		align-self: stretch;
		min-height: var(--touch);
		border-radius: var(--radius-pill);
		font: 500 16px/1 var(--font-sans);
		cursor: pointer;
	}
	.primary {
		border: 2px solid var(--on-tile);
		background: none;
		color: var(--on-tile);
	}
	.ok {
		border: 0;
		background: var(--on-tile);
		color: var(--paper);
	}
	.primary:focus-visible,
	.ok:focus-visible,
	.other summary:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
</style>
