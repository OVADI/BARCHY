<script lang="ts">
	import { i18n, t } from '$lib/i18n/index.svelte';
	import { locales } from '$lib/i18n/messages';
</script>

<div class="toggle" role="group" aria-label={t('common.language')}>
	{#each locales as locale (locale)}
		<button
			type="button"
			lang={locale}
			aria-pressed={i18n.locale === locale}
			onclick={() => (i18n.locale = locale)}>{locale.toUpperCase()}</button
		>
	{/each}
</div>

<style>
	.toggle {
		display: flex;
		background: var(--surface);
		border-radius: var(--radius-pill);
		padding: 2px;
	}
	button {
		width: var(--touch);
		height: 40px;
		border-radius: var(--radius-pill);
		font: var(--label);
		font-size: 13px;
		letter-spacing: var(--label-tracking);
		color: var(--ink-muted);
	}
	button[aria-pressed='true'] {
		background: var(--paper);
		color: var(--on-tile);
	}
</style>
