<script lang="ts">
	import { WEB3FORMS_KEY } from '$lib/config';
	import { sendFeedback, type FeedbackResult } from '$lib/feedback';
	import { t } from '$lib/i18n/index.svelte';

	let message = $state('');
	let email = $state('');
	let botcheck = $state('');
	let sending = $state(false);
	let result = $state<FeedbackResult | undefined>();

	const empty = $derived(message.trim() === '');
	const resultText: Record<FeedbackResult, string> = $derived({
		ok: t('about.sent'),
		offline: t('about.offline'),
		error: t('about.error')
	});

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!WEB3FORMS_KEY || empty || sending) return;
		sending = true;
		result = await sendFeedback(WEB3FORMS_KEY, { message, email, botcheck });
		sending = false;
		// Keep the text unless it arrived, so nothing is lost offline.
		if (result === 'ok') message = email = '';
	}
</script>

<form class="form" {onsubmit}>
	<label class="field">
		<span class="t-label t-muted">{t('about.message')}</span>
		<textarea
			bind:value={message}
			rows="5"
			required
			maxlength="4000"
			oninput={() => (result = undefined)}></textarea>
	</label>
	<label class="field">
		<span class="t-label t-muted">{t('about.email')}</span>
		<input type="email" bind:value={email} autocomplete="email" />
	</label>
	<!-- Honeypot: hidden from people and screen readers, bots fill it in. -->
	<input
		class="hp"
		type="checkbox"
		name="botcheck"
		tabindex="-1"
		aria-hidden="true"
		onchange={(e) => (botcheck = e.currentTarget.checked ? 'on' : '')}
	/>
	<button type="submit" class="send" disabled={empty || sending}>
		{sending ? t('about.sending') : t('about.send')}
	</button>
	<p class="status t-body-sm" class:ok={result === 'ok'} role="status">
		{result ? resultText[result] : ''}
	</p>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}
	textarea,
	input[type='email'] {
		width: 100%;
		min-height: var(--touch);
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		background: var(--ground);
		color: var(--ink);
		font: 400 16px/1.4 var(--font-sans);
		resize: vertical;
	}
	textarea:focus-visible,
	input[type='email']:focus-visible {
		outline: 2px solid var(--paper);
		outline-offset: 1px;
	}
	.hp {
		position: absolute;
		left: -9999px;
		opacity: 0;
	}
	.send {
		min-height: var(--touch);
		border: 0;
		border-radius: var(--radius-pill);
		background: var(--paper);
		color: var(--on-tile);
		font: 500 16px/1 var(--font-sans);
		cursor: pointer;
	}
	.send:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
	.status {
		margin: 0;
		min-height: 1.4em;
		color: var(--ink-muted);
	}
	.status.ok {
		color: var(--ink);
	}
</style>
