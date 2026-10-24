import { z } from 'zod';
import { checkReview, ImportOrigin, Issue, Review, SourceRef } from './source';

const positive = z.number().positive();

/**
 * Rectangular timber section. A, Wy, Iy are computed from b × h (exact for a rectangle);
 * the Vademecum table only decides which sizes are listed. Base units mm, mm², mm³, mm⁴.
 */
export const TimberSection = z
	.object({
		id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
		kind: z.enum(['sawn', 'glulam']),
		b: positive,
		h: positive,
		A: positive,
		Wy: positive,
		Iy: positive,
		Wz: positive,
		Iz: positive,
		issues: z.array(Issue),
		source: SourceRef.optional()
	})
	.extend(Review.shape);
export type TimberSection = z.infer<typeof TimberSection>;

export const TimberFile = z
	.object({
		source: SourceRef,
		origin: ImportOrigin,
		method: z.string().min(1),
		sections: z.array(TimberSection).min(1)
	})
	.superRefine((file, ctx) =>
		file.sections.forEach((s, i) => checkReview(s, ctx, ['sections', i], s.id))
	);
export type TimberFile = z.infer<typeof TimberFile>;
