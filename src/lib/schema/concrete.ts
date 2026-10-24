import { z } from 'zod';
import { checkReview, ImportOrigin, Issue, Review, SourceRef } from './source';

const positive = z.number().positive();

/** Reinforcement bars: total area As for 1–10 bars of one diameter. */
export const RebarRow = z
	.object({
		d: positive,
		/** As [mm²] for 1, 2, … 10 bars, as published (rounded). */
		As: z.array(positive).length(10),
		issues: z.array(Issue),
		source: SourceRef.optional()
	})
	.extend(Review.shape);

export const RebarFile = z
	.object({
		source: SourceRef,
		origin: ImportOrigin,
		rows: z.array(RebarRow).min(1)
	})
	.superRefine((file, ctx) =>
		file.rows.forEach((r, i) => checkReview(r, ctx, ['rows', i], `Ø${r.d}`))
	);
export type RebarFile = z.infer<typeof RebarFile>;
