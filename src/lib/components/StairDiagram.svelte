<script lang="ts" module>
	export type StairView = 'section' | 'plan';

	/** Which drawing shows a fact, and which dimension in it. Two facts may share a dimension. */
	export const STAIR_DIMS: Record<string, { view: StairView; dim: string }> = {
		'bbl-trap-nodig': { view: 'section', dim: 'rise' },
		'bbl-trap-hoogteverschil': { view: 'section', dim: 'rise' },
		'bbl-trap-optrede': { view: 'section', dim: 'riser' },
		'bbl-trap-aantrede': { view: 'section', dim: 'going' },
		'bbl-trap-tredevlak-klimlijn': { view: 'section', dim: 'tread' },
		'bbl-trap-vrije-hoogte': { view: 'section', dim: 'clear' },
		'bbl-leuning-hoogte': { view: 'section', dim: 'rail' },
		'bbl-trap-breedte': { view: 'plan', dim: 'width' },
		'bbl-trap-klimlijn-zijkant': { view: 'plan', dim: 'side' },
		'bbl-trap-tredevlak': { view: 'plan', dim: 'treadMin' },
		'bbl-trapbordes': { view: 'plan', dim: 'landing' }
	};
</script>

<script lang="ts">
	import { formatFact } from '$lib/facts/format';
	import { formatNumber, i18n, t } from '$lib/i18n/index.svelte';
	import type { Fact } from '$lib/schema/fact';

	/**
	 * Schematic stair in section and plan, drawn straight on the ground (no tile). The values come from the facts; the geometry is
	 * illustrative only and not to scale.
	 */
	let {
		facts,
		selected = null,
		onselect
	}: {
		facts: Fact[];
		selected?: string | null;
		/** Called when a value in the drawing is tapped. */
		onselect?: (id: string) => void;
	} = $props();

	// Follows the selected fact; the toggle overrides it until the selection changes.
	let view = $derived<StairView>((selected && STAIR_DIMS[selected]?.view) || 'section');

	const byId = $derived(new Map(facts.map((f) => [f.id, f])));
	const activeDim = $derived(selected ? STAIR_DIMS[selected]?.dim : undefined);

	const value = (id: string) => {
		const f = byId.get(id);
		return f ? formatFact(f, formatNumber) : null;
	};
	const title = (id: string) => byId.get(id)?.label[i18n.locale] ?? '';
	const cls = (dim: string) => (activeDim === dim ? 'dim on' : activeDim ? 'dim off' : 'dim');

	// The floor-to-floor dimension carries two facts: the stair limit, or the "stair needed" threshold.
	const riseId = $derived(
		selected === 'bbl-trap-nodig' || !byId.has('bbl-trap-hoogteverschil')
			? 'bbl-trap-nodig'
			: 'bbl-trap-hoogteverschil'
	);
	const riseLabel = $derived.by(() => {
		const v = value(riseId);
		return v && riseId === 'bbl-trap-nodig' ? `> ${v}` : v;
	});

	const W = 360;
	const H = 230;

	// Section: n risers of r, goings of g, nosing overhang ov, tread thickness tt.
	const n = 7;
	const r = 20;
	const g = 38;
	const ov = 5;
	const tt = 3;
	const x0 = 84;
	const y0 = 206;
	const yTop = y0 - n * r;
	const slab = 12;
	const ceilingEdge = 112;
	const rail = 34;
	const riserX = (i: number) => x0 + (i - 1) * g;
	const nose = (i: number) => ({ x: riserX(i) - ov, y: y0 - i * r });
	const pitchY = (x: number) => y0 - r - ((x - (x0 - ov)) * r) / g;

	const stairPath = (() => {
		let d = `M${x0},${y0}`;
		for (let i = 1; i <= n; i++) {
			const x = riserX(i);
			const y = y0 - i * r;
			d += `L${x},${y + tt}L${x - ov},${y + tt}L${x - ov},${y}`;
			d += i < n ? `L${riserX(i + 1)},${y}` : `L${W - 8},${y}`;
		}
		// Underside runs parallel to the line through the inner corners, a waist below it.
		const waist = 8;
		const xAt = (y: number) => x0 + ((y0 - y + waist) * g) / r;
		return `${d}L${W - 8},${yTop + slab}L${xAt(yTop + slab)},${yTop + slab}L${xAt(y0)},${y0}Z`;
	})();

	// Plan: quarter-turn stair; band width B, inner corner C, walking line in the middle.
	const B = 56;
	const cx = 250;
	const cy = 168;
	const half = B / 2;
	const flightStart = 34;
	const bottomTreads = [214, 178, 142, 106, 70] as const;
	const upTreads = [132, 96, 60] as const;
	const landingTop = 60 - B;
	const walkPath = `M${flightStart + 6},${cy + half}L${cx},${cy + half}A${half},${half} 0 0 0 ${cx + half},${cy}L${cx + half},${upTreads[2] + 8}`;

	const tick = (x: number, y: number) => `M${x - 3},${y + 3}L${x + 3},${y - 3}`;

	// Hit box around a label; 11px mono is about 6.8 units per character.
	const CHAR = 6.8;
	const box = (text: string, x: number, anchor: 'start' | 'middle' | 'end') => {
		const w = text.length * CHAR + 12;
		const left = anchor === 'start' ? x - 6 : anchor === 'end' ? x - w + 6 : x - w / 2;
		return { left, w };
	};
	const onkey = (e: KeyboardEvent, id: string) => {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		onselect?.(id);
	};
</script>

{#snippet label(
	id: string,
	x: number,
	y: number,
	anchor: 'start' | 'middle' | 'end' = 'middle',
	rotate = false,
	text = value(id) ?? ''
)}
	{@const b = box(text, x, anchor)}
	{#if onselect}
		<g
			class="hit"
			role="button"
			tabindex="0"
			aria-label="{title(id)}: {text}"
			transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
			onclick={() => onselect(id)}
			onkeydown={(e) => onkey(e, id)}
		>
			<rect x={b.left} y={y - 13} width={b.w} height="18" rx="4" />
			<text {x} {y} text-anchor={anchor}>{text}</text>
		</g>
	{:else}
		<text {x} {y} text-anchor={anchor} transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
			>{text}</text
		>
	{/if}
{/snippet}

<figure class="figure">
	<div class="views" role="group" aria-label={t('stairDiagram.view')}>
		{#each ['section', 'plan'] as const as v (v)}
			<button type="button" class="view" aria-pressed={view === v} onclick={() => (view = v)}
				>{t(`stairDiagram.${v}`)}</button
			>
		{/each}
	</div>

	{#if view === 'section'}
		<svg
			viewBox="0 0 {W} {H}"
			role={onselect ? 'group' : 'img'}
			aria-label={t('stairDiagram.sectionLabel')}
			class="svg"
		>
			<rect class="mass" x="26" y={y0} width={W - 34} height="10" />
			<rect class="mass" x="26" y={yTop} width={ceilingEdge - 26} height={slab} />
			<path class="mass" d={stairPath} />
			<line
				class="guide"
				x1={nose(1).x - 10}
				y1={pitchY(nose(1).x - 10)}
				x2={nose(n).x}
				y2={pitchY(nose(n).x)}
			/>

			{#if byId.has('bbl-leuning-hoogte')}
				<g class={cls('rail')}>
					<title>{title('bbl-leuning-hoogte')}</title>
					<line
						class="rail"
						x1={nose(1).x}
						y1={pitchY(nose(1).x) - rail}
						x2={nose(n).x}
						y2={pitchY(nose(n).x) - rail}
					/>
					<line x1={nose(6).x} y1={nose(6).y} x2={nose(6).x} y2={nose(6).y - rail} />
					<path d={tick(nose(6).x, nose(6).y)} />
					<path d={tick(nose(6).x, nose(6).y - rail)} />
					{@render label('bbl-leuning-hoogte', nose(6).x, nose(6).y - rail - 8)}
				</g>
			{/if}

			{#if riseLabel}
				<g class={cls('rise')}>
					<title>{title(riseId)}</title>
					<line x1="18" y1={y0} x2="18" y2={yTop} />
					<line class="ext" x1="12" y1={yTop} x2="26" y2={yTop} />
					<line class="ext" x1="12" y1={y0} x2="26" y2={y0} />
					<path d={tick(18, y0)} />
					<path d={tick(18, yTop)} />
					{@render label(riseId, 11, (y0 + yTop) / 2, 'middle', true, riseLabel)}
				</g>
			{/if}

			{#if byId.has('bbl-trap-vrije-hoogte')}
				{@const x = ceilingEdge - 6}
				<g class={cls('clear')}>
					<title>{title('bbl-trap-vrije-hoogte')}</title>
					<line x1={x} y1={pitchY(x)} x2={x} y2={yTop + slab} />
					<path d={tick(x, pitchY(x))} />
					<path d={tick(x, yTop + slab)} />
					{@render label('bbl-trap-vrije-hoogte', x - 6, (pitchY(x) + yTop + slab) / 2 + 4, 'end')}
				</g>
			{/if}

			{#if byId.has('bbl-trap-optrede')}
				{@const x = riserX(2) - 8}
				<g class={cls('riser')}>
					<title>{title('bbl-trap-optrede')}</title>
					<line x1={x} y1={y0 - r} x2={x} y2={y0 - 2 * r} />
					<path d={tick(x, y0 - r)} />
					<path d={tick(x, y0 - 2 * r)} />
					{@render label('bbl-trap-optrede', x - 6, y0 - 1.5 * r + 4, 'end')}
				</g>
			{/if}

			{#if byId.has('bbl-trap-aantrede')}
				{@const a = nose(3)}
				{@const b = nose(4)}
				<g class={cls('going')}>
					<title>{title('bbl-trap-aantrede')}</title>
					<line x1={a.x} y1={a.y - 8} x2={b.x} y2={a.y - 8} />
					<line class="ext" x1={b.x} y1={b.y} x2={b.x} y2={a.y - 4} />
					<path d={tick(a.x, a.y - 8)} />
					<path d={tick(b.x, a.y - 8)} />
					{@render label('bbl-trap-aantrede', riserX(4) - 4, a.y - 14, 'end')}
				</g>
			{/if}

			{#if byId.has('bbl-trap-tredevlak-klimlijn')}
				{@const a = nose(4)}
				{@const bx = riserX(5)}
				<g class={cls('tread')}>
					<title>{title('bbl-trap-tredevlak-klimlijn')}</title>
					<line x1={a.x} y1={a.y - 8} x2={bx} y2={a.y - 8} />
					<path d={tick(a.x, a.y - 8)} />
					<path d={tick(bx, a.y - 8)} />
					{@render label('bbl-trap-tredevlak-klimlijn', bx - 4, a.y - 14, 'end')}
				</g>
			{/if}
		</svg>
	{:else}
		<svg
			viewBox="0 0 {W} {H}"
			role={onselect ? 'group' : 'img'}
			aria-label={t('stairDiagram.planLabel')}
			class="svg"
		>
			<path
				class="mass"
				d="M{flightStart},{cy}L{cx},{cy}L{cx},{landingTop}L{cx + B},{landingTop}L{cx + B},{cy +
					B}L{flightStart},{cy + B}Z"
			/>
			<path
				class="treads"
				d={[
					...bottomTreads.map((x) => `M${x},${cy}L${x},${cy + B}`),
					...upTreads.map((y) => `M${cx},${y}L${cx + B},${y}`),
					`M${cx - 10},${cy}L${cx + 26},${cy + B}`,
					`M${cx},${cy}L${cx + B},${cy + B}`,
					`M${cx},${cy - 10}L${cx + B},${cy + 26}`
				].join('')}
			/>

			<path class="walk" d={walkPath} />
			<circle class="walk-start" cx={flightStart + 6} cy={cy + half} r="3" />
			<path
				class="walk-end"
				d="M{cx + half - 4},{upTreads[2] + 14}L{cx + half},{upTreads[2] + 8}L{cx +
					half +
					4},{upTreads[2] + 14}"
			/>
			<text
				class="note"
				x={(bottomTreads[0] + bottomTreads[1]) / 2}
				y={cy + half - 5}
				text-anchor="middle">{t('stairDiagram.walkingLine')}</text
			>

			{#if byId.has('bbl-trap-breedte')}
				<g class={cls('width')}>
					<title>{title('bbl-trap-breedte')}</title>
					<line x1="18" y1={cy} x2="18" y2={cy + B} />
					<line class="ext" x1="12" y1={cy} x2={flightStart} y2={cy} />
					<line class="ext" x1="12" y1={cy + B} x2={flightStart} y2={cy + B} />
					<path d={tick(18, cy)} />
					<path d={tick(18, cy + B)} />
					{@render label('bbl-trap-breedte', 11, cy + half, 'middle', true)}
				</g>
			{/if}

			{#if byId.has('bbl-trap-klimlijn-zijkant')}
				{@const x = (bottomTreads[3] + bottomTreads[4]) / 2}
				<g class={cls('side')}>
					<title>{title('bbl-trap-klimlijn-zijkant')}</title>
					<line x1={x} y1={cy} x2={x} y2={cy + B} />
					<path d={tick(x, cy)} />
					<path d={tick(x, cy + half)} />
					<path d={tick(x, cy + B)} />
					{@render label('bbl-trap-klimlijn-zijkant', x + 5, cy + half / 2 + 4, 'start')}
					{@render label('bbl-trap-klimlijn-zijkant', x + 5, cy + 1.5 * half + 4, 'start')}
				</g>
			{/if}

			{#if byId.has('bbl-trap-tredevlak')}
				<g class={cls('treadMin')}>
					<title>{title('bbl-trap-tredevlak')}</title>
					<line x1={cx - 10} y1={cy - 8} x2={cx} y2={cy - 8} />
					<line class="ext" x1={cx - 10} y1={cy - 12} x2={cx - 10} y2={cy} />
					<path d={tick(cx - 10, cy - 8)} />
					<path d={tick(cx, cy - 8)} />
					{@render label('bbl-trap-tredevlak', cx - 16, cy - 12, 'end')}
				</g>
			{/if}

			{#if byId.has('bbl-trapbordes')}
				<g class={cls('landing')}>
					<title>{title('bbl-trapbordes')}</title>
					<rect class="area" x={cx} y={landingTop} width={B} height={B} />
					{@render label('bbl-trapbordes', cx - 8, landingTop + half + 4, 'end')}
				</g>
			{/if}
		</svg>
	{/if}
	<figcaption class="t-label caption">{t('stairDiagram.schematic')}</figcaption>
</figure>

<style>
	.figure {
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		color: var(--ink);
		/* Cobalt pulled towards the ink, so the highlight reads on the ground in both themes. */
		--accent: color-mix(in srgb, var(--cobalt) 70%, var(--ink));
	}
	.caption {
		color: var(--ink-muted);
		min-width: 0;
	}
	.views {
		display: flex;
		align-self: flex-end;
		padding: 2px;
		border-radius: var(--radius-pill);
		background: color-mix(in srgb, var(--ink) 8%, transparent);
	}
	.view {
		position: relative;
		min-height: 36px;
		padding: 0 14px;
		border-radius: var(--radius-pill);
		font: 500 14px/1 var(--font-sans);
		color: var(--ink);
	}
	/* Hit area up to the touch size; the visible pill stays compact. */
	.view::before {
		content: '';
		position: absolute;
		inset: -4px 0;
	}
	.view[aria-pressed='true'] {
		background: var(--ink);
		color: var(--ground);
	}
	.svg {
		width: 100%;
		max-height: 220px;
		overflow: visible;
	}
	.mass {
		fill: color-mix(in srgb, var(--ink) 8%, transparent);
		stroke: var(--ink);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.treads {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
	}
	.guide {
		stroke: var(--ink-muted);
		stroke-width: 0.75;
		stroke-dasharray: 4 3;
	}
	.walk {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1;
		stroke-dasharray: 5 3;
	}
	.walk-start {
		fill: var(--ground);
		stroke: var(--ink);
	}
	.walk-end {
		fill: none;
		stroke: var(--ink);
	}
	.dim {
		transition: opacity 150ms ease;
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
	.dim .rail {
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.dim .area {
		fill: none;
		stroke: none;
	}
	text {
		font: 500 11px var(--font-mono);
		letter-spacing: 0.02em;
		fill: var(--ink);
		paint-order: stroke;
		stroke: var(--ground);
		stroke-width: 3px;
		stroke-linejoin: round;
	}
	.note {
		font-size: 9px;
		fill: var(--ink-muted);
	}
	.hit {
		cursor: pointer;
		outline: none;
	}
	.hit rect {
		fill: transparent;
		stroke: none;
	}
	.hit:hover rect {
		fill: color-mix(in srgb, var(--accent) 16%, transparent);
	}
	.hit:focus-visible rect {
		stroke: var(--focus);
		stroke-width: 2;
	}
	.off {
		opacity: 0.3;
	}
	.on line,
	.on path {
		stroke: var(--accent);
		stroke-width: 2;
	}
	.on .rail {
		stroke-width: 3;
	}
	.on .area {
		fill: color-mix(in srgb, var(--accent) 18%, transparent);
		stroke: var(--accent);
		stroke-width: 2;
	}
	.on text {
		fill: var(--accent);
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.dim {
			transition: none;
		}
	}
</style>
