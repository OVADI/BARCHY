<script lang="ts">
	import { disclaimer } from '$lib/disclaimer.svelte';
	import { t } from '$lib/i18n/index.svelte';

	let dialog: HTMLDialogElement;

	// Modal, so focus stays inside and the page behind is inert until it is accepted.
	$effect(() => {
		if (disclaimer.open && !dialog.open) dialog.showModal();
		else if (!disclaimer.open && dialog.open) dialog.close();
	});
</script>

<!-- Esc closes the dialog natively ('cancel'); that counts as read, like the button. -->
<dialog
	bind:this={dialog}
	class="dialog"
	aria-labelledby="disclaimer-title"
	aria-describedby="disclaimer-body"
	oncancel={() => disclaimer.accept()}
>
	<h2 id="disclaimer-title" class="t-title">{t('disclaimer.title')}</h2>
	<div id="disclaimer-body" class="body t-body">
		<p>{t('disclaimer.body')}</p>
		<p class="muted">{t('disclaimer.unofficial')}</p>
	</div>
	<button type="button" class="ok" onclick={() => disclaimer.accept()}>{t('disclaimer.ok')}</button>
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
	.body {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	p {
		margin: 0;
	}
	.muted {
		color: var(--on-tile-muted);
	}
	.ok {
		align-self: stretch;
		min-height: var(--touch);
		border: 0;
		border-radius: var(--radius-pill);
		background: var(--on-tile);
		color: var(--paper);
		font: 500 16px/1 var(--font-sans);
		cursor: pointer;
	}
	.ok:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
</style>
