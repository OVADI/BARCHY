<script lang="ts">
	import Bookmark from '@lucide/svelte/icons/bookmark';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import IconButton from '$lib/components/IconButton.svelte';
	import InfoFab from '$lib/components/InfoFab.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Pill from '$lib/components/Pill.svelte';
	import Stat from '$lib/components/Stat.svelte';
	import Stepper from '$lib/components/Stepper.svelte';
	import Tile from '$lib/components/Tile.svelte';
	import TypeTag from '$lib/components/TypeTag.svelte';
	import { t } from '$lib/i18n/index.svelte';
	import { source } from '$lib/sources';

	// Token names are code identifiers, shown as-is.
	const colours = [
		['ground', 'ink'],
		['surface', 'ink'],
		['surface-raised', 'ink'],
		['line', 'ink'],
		['ink', 'ground'],
		['ink-muted', 'ground'],
		['paper', 'on-tile'],
		['orange', 'on-tile'],
		['orange-shade', 'paper'],
		['cobalt', 'on-cobalt'],
		['cobalt-track', 'ink'],
		['lavender', 'on-tile'],
		['lime', 'on-tile'],
		['focus', 'on-tile']
	] as const;
	const typeStyles = [
		['numeral-xl', '17'],
		['numeral-lg', '42,3'],
		['numeral-md', '2.363'],
		['heading', 'BARCHY'],
		['title', 'HEA 200'],
		['body', ''],
		['body-sm', ''],
		['label', 'Vuistregel']
	] as const;
	const spaces = [1, 2, 3, 4, 5, 6, 7];
	const radii = ['sm', 'md', 'lg', 'pill'];

	let values = $state<Record<string, string>>({});
	onMount(() => {
		const css = getComputedStyle(document.documentElement);
		for (const [name] of colours) values[name] = css.getPropertyValue(`--${name}`).trim();
	});

	let length = $state(6000);
	let tab = $state<'a' | 'b' | 'c'>('a');
	let saved = $state(false);
	let explain = $state(false);
</script>

<svelte:head><meta name="robots" content="noindex" /></svelte:head>

<PageHeader title={t('dev.tokensTitle')} back={resolve('/')}>
	{#snippet actions()}
		<IconButton
			icon={Bookmark}
			tone="ghost"
			label={t('nav.saved')}
			pressed={saved}
			onclick={() => (saved = !saved)}
		/>
	{/snippet}
</PageHeader>

<h2 class="t-title section">{t('dev.colour')}</h2>
<div class="swatches">
	{#each colours as [name, fg] (name)}
		<div class="swatch" style:background="var(--{name})" style:color="var(--{fg})">
			<span class="t-label">{name}</span>
			<code class="t-body-sm">{values[name] ?? ''}</code>
		</div>
	{/each}
</div>

<h2 class="t-title section">{t('dev.type')}</h2>
{#each typeStyles as [name, sample] (name)}
	<div class="type-row">
		<span class="t-label t-muted">{name}</span>
		<span class="t-{name}">{sample || t('dev.sampleText')}</span>
	</div>
{/each}

<h2 class="t-title section">{t('dev.spacing')}</h2>
{#each spaces as n (n)}
	<div class="space-row">
		<span class="t-label t-muted">space-{n}</span>
		<span class="bar" style:width="var(--space-{n})"></span>
	</div>
{/each}

<h2 class="t-title section">{t('dev.radius')}</h2>
<div class="radii">
	{#each radii as r (r)}
		<div class="radius" style:border-radius="var(--radius-{r})">
			<span class="t-label">{r}</span>
		</div>
	{/each}
</div>

<h2 class="t-title section">{t('dev.components')}</h2>

<div class="grid">
	<Tile tone="paper">
		<span class="t-label">G</span>
		<Stat value={42.3} unit="kg/m" size="md" />
	</Tile>
	<Tile tone="orange">
		<span class="t-label">{t('type.rule_of_thumb')}</span>
		<Stat value={236} unit="mm" size="md" />
	</Tile>
	<Tile tone="cobalt">
		<span class="t-label">{t('type.requirement')}</span>
		<Stat value={17} size="lg" />
	</Tile>
	<Tile tone="surface" onclick={() => (explain = !explain)} expanded={explain}>
		<span class="t-label t-muted">Iy</span>
		<Stat value={3692} unit="×10⁴ mm⁴" size="md" />
	</Tile>
</div>
{#if explain}
	<Tile tone="lavender">
		<span class="t-title">{t('dev.sampleTileTitle')}</span>
		<p class="t-body-sm">{t('dev.sampleTileBody')}</p>
	</Tile>
{/if}

<div class="tags">
	<TypeTag type="requirement" />
	<TypeTag type="rule_of_thumb" />
	<TypeTag type="data" />
</div>

<div class="pills" role="tablist">
	<Pill kind="tab" selected={tab === 'a'} onclick={() => (tab = 'a')}>HEA</Pill>
	<Pill kind="tab" selected={tab === 'b'} onclick={() => (tab = 'b')}>HEB</Pill>
	<Pill kind="tab" selected={tab === 'c'} onclick={() => (tab = 'c')}>IPE</Pill>
</div>

<Tile>
	<Stepper
		label={t('dev.sampleLength')}
		value={length}
		step={500}
		min={500}
		unit="mm"
		onchange={(v) => (length = v)}
	/>
</Tile>

<Tile tone="orange" pad="lg" as="section">
	<Stat value={17} size="xl" label={t('tools.stair')} />
</Tile>

<InfoFab sources={[source('vademecum')]} />

<style>
	.section {
		margin: var(--space-6) 0 var(--space-2);
	}
	.swatches {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.swatch {
		height: 88px;
		border-radius: var(--radius-md);
		padding: var(--space-3);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		outline: 1px solid var(--line);
		outline-offset: -1px;
	}
	.type-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-2) 0;
		overflow: hidden;
	}
	.space-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}
	.space-row .t-label {
		width: 64px;
	}
	.bar {
		height: 16px;
		background: var(--orange);
	}
	.radii {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--tile-gap);
	}
	.radius {
		height: 72px;
		background: var(--surface);
		display: flex;
		align-items: flex-end;
		padding: var(--space-3);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--tile-gap);
	}
	.tags,
	.pills {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
		padding: var(--space-2) 0;
	}
</style>
