<script lang="ts">
	import { resolve } from '$app/paths';
	import { version } from '$app/environment';
	import ExtLink from '$lib/components/ExtLink.svelte';
	import FeedbackForm from '$lib/components/FeedbackForm.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import { CORRECTION_URL, MISSING_URL, REPO_URL, WEB3FORMS_KEY } from '$lib/config';
	import { disclaimer } from '$lib/disclaimer.svelte';
	import { install } from '$lib/install.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { sources } from '$lib/sources';
</script>

<PageHeader title={t('about.title')} back={resolve('/')} />

<Tile tone="orange" pad="lg" as="section">
	<span class="t-label">{t('about.whyLabel')}</span>
	<h2 class="t-title">{t('about.whyTitle')}</h2>
	<p class="t-body">{t('about.why')}</p>
</Tile>

<Tile as="section" pad="lg">
	<h2 class="t-label t-muted">{t('about.sourcesLabel')}</h2>
	<p class="t-body">{t('about.sources')}</p>
	<ul class="list">
		{#each Object.values(sources) as s (s.title)}
			<li>
				{#if s.url}<ExtLink href={s.url}>{s.title}</ExtLink>{:else}<span>{s.title}</span>{/if}
				<span class="t-body-sm t-muted">{s.ref}</span>
				{#if s.license}<span class="t-body-sm t-muted">{t('info.license')}: {s.license}</span>{/if}
			</li>
		{/each}
	</ul>
</Tile>

<Tile as="section" pad="lg">
	<h2 class="t-label t-muted">{t('about.disclaimerLabel')}</h2>
	<p class="t-body">{t('disclaimer.body')} {t('disclaimer.unofficial')}</p>
	<button type="button" class="pill" onclick={() => disclaimer.show()}>
		{t('about.disclaimerRead')}
	</button>
</Tile>

<Tile as="section" pad="lg">
	<h2 class="t-label t-muted">{t('about.installLabel')}</h2>
	<p class="t-body">{t('about.installBody')}</p>
	<button type="button" class="pill" onclick={() => install.show()}>
		{t('about.installButton')}
	</button>
</Tile>

<Tile as="section" pad="lg">
	<h2 class="t-label t-muted">{t('about.openLabel')}</h2>
	<p class="t-body">{t('about.open')}</p>
	{#if REPO_URL}
		<ul class="list">
			<li>
				<ExtLink href={REPO_URL}>{t('about.repo')}</ExtLink>
			</li>
			{#if CORRECTION_URL}<li>
					<ExtLink href={CORRECTION_URL}>{t('about.reportError')}</ExtLink>
				</li>{/if}
			{#if MISSING_URL}<li>
					<ExtLink href={MISSING_URL}>{t('common.reportMissing')}</ExtLink>
				</li>{/if}
		</ul>
	{/if}
</Tile>

<Tile as="section" pad="lg">
	<div id="feedback" class="anchor">
		<span class="t-label t-muted">{t('about.feedbackLabel')}</span>
		<h2 class="t-title">{t('about.feedbackTitle')}</h2>
	</div>
	<p class="t-body">{t('about.feedbackIntro')}</p>
	{#if WEB3FORMS_KEY}
		<FeedbackForm />
	{:else if MISSING_URL}
		<ExtLink href={MISSING_URL}>{t('about.noForm')}</ExtLink>
	{/if}
</Tile>

<footer class="footer t-body-sm t-muted">
	<span>{t('about.version', { version })}</span>
	<span
		>{t('about.madeBy')}
		<ExtLink href="https://ovadi.nl" icon={false}>OVADI</ExtLink></span
	>
</footer>

<style>
	p {
		margin: 0;
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
	.list li {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.anchor {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		/* Clear of the page top when jumped to from Home. */
		scroll-margin-top: var(--space-6);
	}
	.pill {
		align-self: flex-start;
		min-height: var(--touch);
		padding: 0 18px;
		border: 0;
		border-radius: var(--radius-pill);
		background: var(--surface-raised);
		color: var(--ink);
		font: 500 15px/1 var(--font-sans);
		cursor: pointer;
	}
	.pill:hover {
		background: var(--line);
	}
	.footer {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-2) 0;
	}
</style>
