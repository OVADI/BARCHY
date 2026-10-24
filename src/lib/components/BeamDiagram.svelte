<script lang="ts">
	import type { BeamShape } from '$lib/facts/shapes';

	/**
	 * Schematic elevation of a beam shape (a cross-section for floors), drawn after the figures in
	 * the Vademecum. With labels it shows the dimensions the rules use (l, h, a, f, r, g); without,
	 * it is a small icon next to a name, hidden from screen readers.
	 */
	let {
		shape,
		labels = true,
		label
	}: { shape: BeamShape; labels?: boolean; label: string } = $props();

	// Truss panels: 8 bays between x = 20 and x = 220.
	const BAYS = Array.from({ length: 8 }, (_, i) => 20 + i * 25);
</script>

{#snippet pin(x: number, y: number)}
	<path class="support" d="M{x} {y}l-5 8h10z" />
{/snippet}
{#snippet roller(x: number, y: number)}
	<path class="support" d="M{x} {y}l-5 8h10z" /><path class="thin" d="M{x - 6} {y + 11}h12" />
{/snippet}
{#snippet ends(y: number, left = 20, right = 220)}
	{@render pin(left, y)}{@render roller(right, y)}
{/snippet}
{#snippet vdim(x: number, y1: number, y2: number, text: string, side: 'left' | 'right' = 'right')}
	{#if labels}
		<path class="dim" d="M{x} {y1}V{y2}M{x - 3} {y1}h6M{x - 3} {y2}h6" />
		<text
			class="sym"
			x={side === 'right' ? x + 5 : x - 5}
			y={(y1 + y2) / 2 + 4}
			text-anchor={side === 'right' ? 'start' : 'end'}>{text}</text
		>
	{/if}
{/snippet}
{#snippet hdim(x1: number, x2: number, text: string, y = 86)}
	{#if labels}
		<path class="dim" d="M{x1} {y}H{x2}M{x1} {y - 3}v6M{x2} {y - 3}v6" />
		<text class="sym" x={(x1 + x2) / 2} y={y - 4} text-anchor="middle">{text}</text>
	{/if}
{/snippet}

<svg
	viewBox={labels
		? shape === 'three-hinged-bent'
			? '-28 4 284 92'
			: '-4 4 264 92'
		: '10 16 220 62'}
	role={labels ? 'img' : undefined}
	aria-label={labels ? label : undefined}
	aria-hidden={labels ? undefined : 'true'}
	class:icon={!labels}
>
	{#if shape === 'straight'}
		<rect class="member" x="20" y="40" width="200" height="12" />
		{@render ends(52)}
		{@render vdim(70, 40, 52, 'h')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'cantilever'}
		<rect class="member" x="4" y="40" width="216" height="12" />
		{@render ends(52, 52, 220)}
		{@render vdim(110, 40, 52, 'h')}
		{@render hdim(4, 52, 'a')}
		{@render hdim(52, 220, 'l')}
	{:else if shape === 'continuous'}
		<rect class="member" x="20" y="42" width="200" height="10" />
		{@render ends(52)}{@render roller(120, 52)}
		{@render vdim(70, 42, 52, 'h')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'pitched'}
		<path class="member" d="M20 52H220V44L120 28L20 44Z" />
		{@render ends(52)}
		{#if labels}<path class="guide" d="M120 28V52" />{/if}
		{@render vdim(120, 28, 52, 'h1', 'left')}
		{@render vdim(230, 44, 52, 'h2')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'curved'}
		<path class="member" d="M20 44L120 24L220 44V52Q120 30 20 52Z" />
		{@render ends(52)}
		{#if labels}
			<path class="guide" d="M120 41V52M20 52H246" />
			<text class="sym" x="126" y="50">r</text>
		{/if}
		{@render vdim(228, 44, 52, 'h')}
		{@render vdim(246, 41, 52, 'f')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'trussed'}
		<rect class="member" x="20" y="38" width="200" height="6" />
		<path class="bar" d="M20 44L80 64H160L220 44M68 44L80 64L92 44M148 44L160 64L172 44" />
		{@render ends(44)}
		{@render vdim(232, 38, 64, 'h')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'truss'}
		<rect class="member" x="20" y="32" width="200" height="5" />
		<rect class="member" x="20" y="57" width="200" height="5" />
		{#each BAYS as x (x)}
			<path class="bar" d="M{x} 37V57M{x} 37L{x + 25} 57" />
		{/each}
		<path class="bar" d="M220 37V57" />
		{@render ends(62)}
		{@render vdim(232, 32, 62, 'h')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'truss-triangle'}
		<path class="member" d="M20 58L120 22L220 58Z" />
		<path class="bar" d="M120 22V58M70 40V58M170 40V58M70 40L120 58L170 40" />
		{@render ends(58)}
		{@render vdim(232, 22, 58, 'h')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'portal'}
		<path class="member" d="M16 30H224V38H214L218 64H210L206 38H34L30 64H22L26 38H16Z" />
		{@render pin(26, 64)}{@render pin(214, 64)}
		{@render vdim(120, 30, 38, 'h')}
		{@render hdim(26, 214, 'l')}
	{:else if shape === 'three-hinged'}
		<path class="member" d="M20 58L118 24L118 31L20 64Z" />
		<path class="member" d="M220 58L122 24L122 31L220 64Z" />
		<circle class="hinge" cx="120" cy="26" r="2.5" />
		{#if labels}<path class="guide dashed" d="M20 61H220" />{/if}
		{@render pin(20, 64)}{@render pin(220, 64)}
		{@render vdim(234, 24, 61, 'f')}
		{@render hdim(20, 220, 'l')}
	{:else if shape === 'three-hinged-bent'}
		<path class="member" d="M22 66L20 40L118 20L118 27L30 46L28 66Z" />
		<path class="member" d="M218 66L220 40L122 20L122 27L210 46L212 66Z" />
		<circle class="hinge" cx="120" cy="22" r="2.5" />
		{@render pin(25, 66)}{@render pin(215, 66)}
		{#if labels}
			<path class="guide" d="M14 42H20M14 62H22" />
			<text class="sym small" x="12" y="45" text-anchor="end"
				>h<tspan class="sub" dy="2">knik</tspan></text
			>
			<text class="sym small" x="12" y="65" text-anchor="end"
				>h<tspan class="sub" dy="2">voet</tspan></text
			>
		{/if}
		{@render vdim(234, 40, 66, 'g')}
		{@render hdim(25, 215, 'l')}
	{:else if shape === 'arch'}
		<path class="member" d="M20 60Q120 0 220 60L213 62Q120 10 27 62Z" />
		<circle class="hinge" cx="120" cy="31" r="2.5" />
		{@render pin(23, 62)}{@render pin(217, 62)}
		{#if labels}<path class="guide" d="M20 62H236M120 31H236" />{/if}
		{@render vdim(236, 31, 62, 'f')}
		{@render hdim(23, 217, 'l')}
	{:else if shape === 'slab-hollow'}
		<rect class="member" x="20" y="36" width="200" height="22" rx="1" />
		{#each [35, 60, 85, 110, 135, 160, 185, 205] as x (x)}
			<circle class="void" cx={x} cy="47" r="7" />
		{/each}
		{@render vdim(232, 36, 58, 'h')}
	{:else if shape === 'slab-ribbed'}
		<path
			class="member"
			d="M20 36H220V44H206L202 62H184L180 44H130L126 62H108L104 44H56L52 62H34L30 44H20Z"
		/>
		{@render vdim(232, 36, 62, 'h')}
	{:else if shape === 'slab-wide'}
		<rect class="member" x="20" y="36" width="200" height="22" />
		<rect class="member dark" x="20" y="52" width="200" height="6" />
		<path class="bar" d="M30 52L40 40L50 52L60 40L70 52M150 52L160 40L170 52L180 40L190 52" />
		{@render vdim(232, 36, 58, 'h')}
	{:else if shape === 'slab-deck'}
		<path
			class="member"
			d="M20 34H220V60H210L204 50H186L180 60H150L144 50H126L120 60H90L84 50H66L60 60H30L24 50H20Z"
		/>
		<path
			class="bar"
			d="M20 50H24L30 60H60L66 50H84L90 60H120L126 50H144L150 60H180L186 50H204L210 60H220"
		/>
		{@render vdim(232, 34, 60, 'h')}
	{/if}
</svg>

<style>
	svg {
		display: block;
		width: 100%;
		height: auto;
		/* Ink and background come from the tile it sits on; holes and hinges take the background. */
		color: inherit;
		overflow: visible;
	}
	.icon {
		width: 88px;
	}
	/* Small icon: keep lines readable instead of scaling them down with the drawing. */
	.icon :is(.member, .bar, .support, .hinge, .void, .thin) {
		vector-effect: non-scaling-stroke;
		stroke-width: 1.5;
	}
	.icon .member {
		fill-opacity: 0.25;
	}
	.member {
		fill: currentColor;
		fill-opacity: 0.12;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.member.dark {
		fill-opacity: 0.35;
	}
	.void {
		fill: var(--diagram-bg, var(--paper));
		stroke: currentColor;
		stroke-width: 1.2;
	}
	.bar {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.support {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.3;
		stroke-linejoin: round;
	}
	.hinge {
		fill: var(--diagram-bg, var(--paper));
		stroke: currentColor;
		stroke-width: 1.3;
	}
	.thin,
	.dim {
		fill: none;
		stroke: currentColor;
		stroke-width: 0.8;
	}
	.guide {
		fill: none;
		stroke: currentColor;
		stroke-width: 0.6;
		stroke-opacity: 0.5;
	}
	.dashed {
		stroke-dasharray: 4 3;
	}
	.sym {
		fill: currentColor;
		font-size: 12px;
		font-style: italic;
	}
	.small {
		font-size: 10px;
	}
	.sub {
		font-size: 8px;
	}
</style>
