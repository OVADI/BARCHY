<script lang="ts">
	import { AREA } from '$lib/drawing/hatches';
	import HatchFill from './HatchFill.svelte';

	interface Props {
		hatch: string;
		label: string;
	}

	/** A hatch sample as in the Vademecum table: a framed area, or the symbol for strips and lines. */
	let { hatch, label }: Props = $props();

	const uid = $props.id();
	const W = 120;
	const H = 60;

	// Maaiveld: ground line with a hatched trapezoid below; '\' on the left half, '/' on the right.
	const ground = [18, 20, 102, 20, 82, 46, 38, 46];
	const groundLines = Array.from({ length: 11 }, (_, i) => 5 + i * 10);
</script>

<svg viewBox="0 0 {W} {H}" role="img" aria-label={label} class="swatch">
	{#if hatch in AREA}
		<HatchFill {hatch} x={2} y={2} width={W - 4} height={H - 4} />
		<rect x="2" y="2" width={W - 4} height={H - 4} fill="none" stroke="currentColor" />
	{:else if hatch === 'lijmverbinding'}
		<path d="M0 30H{W}" stroke="currentColor" stroke-width="0.8" />
		{#each [11, 43, 75, 107] as cx (cx)}<circle {cx} cy="30" r="3.5" fill="currentColor" />{/each}
	{:else if hatch === 'metalen-overige'}
		<rect
			x="12"
			y="14"
			width="96"
			height="32"
			fill="currentColor"
			fill-opacity="0.15"
			stroke="currentColor"
			stroke-width="0.8"
		/>
	{:else if hatch === 'lood'}
		{#each [0, 2, 4] as k (k)}
			<rect x={12 + k * 19.2} y="20" width="19.2" height="20" fill="currentColor" />
		{/each}
		<rect
			x="12"
			y="20"
			width="96"
			height="20"
			fill="none"
			stroke="currentColor"
			stroke-width="0.8"
		/>
	{:else if hatch === 'zink'}
		<rect x="12" y="20" width="96" height="20" fill="currentColor" />
	{:else if hatch === 'glas'}
		{#each [0, 1, 2, 3, 4, 5] as k (k)}
			<path d="M8 {21 + k * 3.6}H112" stroke="currentColor" stroke-width="0.8" />
		{/each}
		<path d="M8 21V39M112 21V39" stroke="currentColor" stroke-width="0.8" />
	{:else if hatch === 'maaiveld'}
		<clipPath id="{uid}-ground">
			<polygon points={ground.join(' ')} />
		</clipPath>
		<g clip-path="url(#{uid}-ground)" stroke="currentColor" stroke-width="0.8">
			{#each groundLines as x (x)}
				{#if x < 60}<path d="M{x} 20l30 30" />{:else}<path d="M{x} 20l-30 30" />{/if}
			{/each}
		</g>
		<polygon points={ground.join(' ')} fill="none" stroke="currentColor" stroke-width="0.8" />
		<path d="M2 20H118" stroke="currentColor" stroke-width="1.6" />
	{:else if hatch === 'water'}
		<path d="M2 22H118" stroke="currentColor" stroke-width="1.6" />
		<path d="M42 31H78M48 38H72M54 45H66" stroke="currentColor" stroke-width="0.8" />
	{/if}
</svg>

<style>
	.swatch {
		display: block;
		width: 100%;
		height: auto;
		color: var(--on-tile);
	}
</style>
