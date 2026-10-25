<script lang="ts">
	import { sketchGeometry, SKETCH_H } from '$lib/checks/stair-sketch';
	import { formatNumber, t } from '$lib/i18n/index.svelte';

	/** Section of the stair being calculated, drawn to the scale of the input, with every term named next to its dimension. */
	let {
		rise,
		risers,
		going,
		riser,
		run,
		failed = []
	}: {
		rise: number;
		risers: number;
		going: number;
		/** Height per riser (mm). */
		riser: number;
		/** Length of the straight stair (mm). */
		run: number;
		/** Terms that fail their Bbl check: 'rise', 'riser', 'going'. */
		failed?: ('rise' | 'riser' | 'going')[];
	} = $props();

	const geo = $derived(sketchGeometry({ rise, risers, going }));
	const mm = (v: number, digits = 0) => `${formatNumber(v, { maximumFractionDigits: digits })} mm`;
	const bad = (key: 'rise' | 'riser' | 'going') => failed.includes(key);

	const tick = (x: number, y: number) => `M${x - 3},${y + 3}L${x + 3},${y - 3}`;

	// Label strings; the badge sits before the text, whose width is estimated at 6.1 units per character.
	const riserText = $derived(mm(riser, 1));
	const goingText = $derived(mm(going));
	const risersText = $derived(formatNumber(risers));
	const runText = $derived(mm(run));
	const textW = (s: string) => s.length * 6.1;

	const top = $derived(geo.n);
	const riseX = $derived(geo.x0 - 26);
	const riserDimX = $derived(geo.riserX(top) - 10);
	const goingStep = $derived(Math.max(1, Math.floor(geo.n / 2)));
	const goingA = $derived(geo.riserX(goingStep));
	const goingB = $derived(geo.riserX(goingStep + 1));
	const goingY = $derived(geo.riserTop(goingStep) - 10);
	const runY = $derived(geo.y0 + 28);
	const runEnd = $derived(geo.riserX(top));
</script>

{#snippet badge(n: number, x: number, y: number)}
	<g class="badge">
		<circle cx={x} cy={y} r="8" />
		<text {x} y={y + 4} text-anchor="middle">{n}</text>
	</g>
{/snippet}

<figure class="figure">
	<svg
		viewBox="0 0 {geo.width} {SKETCH_H}"
		role="img"
		aria-label={t('stair.sketchLabel')}
		class="svg"
	>
		<rect class="mass" x="26" y={geo.y0} width={geo.width - 34} height="10" />
		<path class="mass" d={geo.path} />
		<line
			class="guide"
			x1={geo.riserX(1) - 10}
			y1={geo.riserTop(1) + 10 * (geo.h / geo.g)}
			x2={geo.riserX(top)}
			y2={geo.riserTop(top)}
		/>

		<g class="dim" class:fail={bad('rise')}>
			<line x1={riseX} y1={geo.y0} x2={riseX} y2={geo.yTop} />
			<line class="ext" x1={riseX - 6} y1={geo.yTop} x2={geo.x0 - 4} y2={geo.yTop} />
			<line class="ext" x1={riseX - 6} y1={geo.y0} x2={geo.x0 - 4} y2={geo.y0} />
			<path d={tick(riseX, geo.y0)} />
			<path d={tick(riseX, geo.yTop)} />
			{@render badge(1, riseX + 12, (geo.y0 + geo.yTop) / 2)}
			<text
				x={riseX - 6}
				y={(geo.y0 + geo.yTop) / 2}
				text-anchor="middle"
				transform="rotate(-90 {riseX - 6} {(geo.y0 + geo.yTop) / 2})">{mm(rise)}</text
			>
		</g>

		<g class="dim" class:fail={bad('riser')}>
			<line x1={riserDimX} y1={geo.riserTop(top - 1)} x2={riserDimX} y2={geo.riserTop(top)} />
			<path d={tick(riserDimX, geo.riserTop(top - 1))} />
			<path d={tick(riserDimX, geo.riserTop(top))} />
			{@render badge(
				3,
				riserDimX - 6 - textW(riserText) - 14,
				(geo.riserTop(top - 1) + geo.riserTop(top)) / 2
			)}
			<text
				x={riserDimX - 6}
				y={(geo.riserTop(top - 1) + geo.riserTop(top)) / 2 + 4}
				text-anchor="end">{riserText}</text
			>
		</g>

		<g class="dim" class:fail={bad('going')}>
			<line x1={goingA} y1={goingY} x2={goingB} y2={goingY} />
			<line class="ext" x1={goingA} y1={goingY - 4} x2={goingA} y2={geo.riserTop(goingStep)} />
			<line class="ext" x1={goingB} y1={goingY - 4} x2={goingB} y2={geo.riserTop(goingStep)} />
			<path d={tick(goingA, goingY)} />
			<path d={tick(goingB, goingY)} />
			{@render badge(4, goingB - 4 - textW(goingText) - 16, goingY - 12)}
			<text x={goingB - 4} y={goingY - 8} text-anchor="end">{goingText}</text>
		</g>

		{@render badge(2, runEnd - 6 - textW(risersText) - 16, geo.y0 - 16)}
		<text class="plain" x={runEnd - 6} y={geo.y0 - 12} text-anchor="end">{risersText}</text>

		<g class="dim">
			<line x1={geo.x0} y1={runY} x2={runEnd} y2={runY} />
			<line class="ext" x1={geo.x0} y1={geo.y0 + 12} x2={geo.x0} y2={runY + 6} />
			<line class="ext" x1={runEnd} y1={geo.y0 + 12} x2={runEnd} y2={runY + 6} />
			<path d={tick(geo.x0, runY)} />
			<path d={tick(runEnd, runY)} />
			{@render badge(5, (geo.x0 + runEnd) / 2 - textW(runText) / 2 - 16, runY + 12)}
			<text x={(geo.x0 + runEnd) / 2} y={runY + 16} text-anchor="middle">{runText}</text>
		</g>
	</svg>
</figure>

<style>
	.figure {
		margin: 0 0 var(--space-4);
		color: var(--ink);
	}
	.svg {
		width: 100%;
		max-height: 260px;
		overflow: visible;
	}
	.mass {
		fill: color-mix(in srgb, var(--ink) 8%, transparent);
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.guide {
		stroke: var(--ink-muted);
		stroke-width: 0.75;
		stroke-dasharray: 4 3;
	}
	.dim line,
	.dim path {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
	}
	.dim .ext {
		stroke-width: 0.6;
	}
	.dim.fail line,
	.dim.fail path {
		stroke: var(--orange);
	}
	text {
		font: 500 11px var(--font-sans);
		letter-spacing: 0.02em;
		fill: var(--ink);
		paint-order: stroke;
		stroke: var(--ground);
		stroke-width: 3px;
		stroke-linejoin: round;
	}
	.badge circle {
		fill: var(--ink);
		stroke: var(--ground);
		stroke-width: 2;
	}
	.badge text {
		fill: var(--ground);
		stroke: none;
		font-weight: 700;
		font-size: 10px;
	}
	.dim.fail .badge circle {
		fill: var(--orange);
	}
	.dim.fail .badge text {
		fill: var(--on-tile);
	}
	.dim.fail text {
		fill: var(--orange);
	}
</style>
