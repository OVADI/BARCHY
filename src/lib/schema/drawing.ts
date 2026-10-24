import { z } from 'zod';
import { GUIDE_IDS, GUIDE_PARTS, HATCH_GROUPS, LINE_TYPES, SCALES } from '../drawing/constants';
import { Bilingual, checkReview, ImportOrigin, Issue, Review, SourceRef } from './source';

/**
 * Drawing conventions from the Vademecum chapter "Tekeninstructies" (based on NEN 2302).
 * The patterns themselves are redrawn as SVG in $lib/drawing; this file holds names, scales,
 * notes and the step-by-step guides with their line weights.
 */

export const LineType = z.enum(LINE_TYPES);
export type LineType = z.infer<typeof LineType>;

const Scale = z.union(SCALES.map((s) => z.literal(s)));
export type Scale = (typeof SCALES)[number];

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const LineSpec = z
	.object({ id: LineType, name: Bilingual, issues: z.array(Issue) })
	.extend(Review.shape);
export type LineSpec = z.infer<typeof LineSpec>;

export const Hatch = z
	.object({
		id,
		group: z.enum(HATCH_GROUPS),
		name: Bilingual,
		/** 1 or 2 when the source gives two hatches for one material at different scales. */
		variant: z.number().int().min(1).max(2).optional(),
		scales: z.array(Scale).min(1),
		note: Bilingual.optional(),
		issues: z.array(Issue)
	})
	.extend(Review.shape);
export type Hatch = z.infer<typeof Hatch>;

/** One step of a drawing guide. Line type, weight (mm) and colour only where the source gives them. */
export const GuideStep = z.object({
	/** Short name for the step list; BARCHY's own wording, the source only has the sentence. */
	title: Bilingual,
	/** Approach, line work or text and dimensions: how the guide screen groups the steps. */
	part: z.enum(GUIDE_PARTS),
	text: Bilingual,
	line: LineType.optional(),
	weight: z.number().positive().optional(),
	/** How the sample is drawn: a double line for beams, an arrow for spans, a cross for openings. */
	symbol: z.enum(['line', 'double', 'arrow', 'cross', 'diagonal']).optional(),
	/** Colour named in the source: 'accent' for "evt. in een andere kleur". */
	color: z.enum(['black', 'grey', 'accent']).optional()
});
export type GuideStep = z.infer<typeof GuideStep>;

export const Guide = z
	.object({
		id: z.enum(GUIDE_IDS),
		title: Bilingual,
		intro: Bilingual,
		steps: z.array(GuideStep).min(1),
		issues: z.array(Issue)
	})
	.extend(Review.shape);
export type Guide = z.infer<typeof Guide>;

export const DrawingFile = z
	.object({
		source: SourceRef,
		/** The source the Vademecum cites under its hatch tables. */
		hatchSource: SourceRef,
		origin: ImportOrigin,
		guideOrigin: ImportOrigin,
		lines: z.array(LineSpec).length(LINE_TYPES.length),
		hatches: z.array(Hatch).min(1),
		guides: z.array(Guide).min(1)
	})
	.superRefine((file, ctx) => {
		file.lines.forEach((l, i) => checkReview(l, ctx, ['lines', i], l.id));
		file.hatches.forEach((h, i) => checkReview(h, ctx, ['hatches', i], h.id));
		file.guides.forEach((g, i) => checkReview(g, ctx, ['guides', i], g.id));
		const ids = file.hatches.map((h) => h.id);
		ids.forEach((x, i) => {
			if (ids.indexOf(x) !== i)
				ctx.addIssue({ code: 'custom', message: `duplicate hatch id ${x}`, path: ['hatches', i] });
		});
	});
export type DrawingFile = z.infer<typeof DrawingFile>;
