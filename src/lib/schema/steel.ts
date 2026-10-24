import { z } from 'zod';
import { PRIMARY_SERIES, STEEL_SERIES } from './steel-constants';
import { checkReview, Correction, ImportOrigin, Issue, Review, SourceRef } from './source';

/**
 * Steel sections. All quantities in base units: mm, mm², mm⁴, mm³, kg/m.
 * The UI picks the display scale (×10⁴ mm⁴ etc.).
 */

export const SteelFamily = z.enum(['HE', 'IPE', 'UNP', 'SHS', 'RHS', 'CHS']);
export type SteelFamily = z.infer<typeof SteelFamily>;

/** Picker series; the constants live in a Zod-free module for the browser. */
export const SteelSeries = z.enum(STEEL_SERIES);
export type SteelSeries = z.infer<typeof SteelSeries>;
export { PRIMARY_SERIES };

const positive = z.number().positive();

const Base = z
	.object({
		/** Stable slug, e.g. 'he-200-a', 'shs-100x100x5' */
		id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
		family: SteelFamily,
		series: SteelSeries,
		/** HE: AA/A/B/C/M or x-weight; IPE: A/O/R/V or x-weight; undefined for the base series. */
		variant: z.string().optional(),
		/** Size part of the name: '200', '100x100x5', '48.3x3.2' */
		size: z.string().min(1),
		/** Dutch practice name: 'HEA 200', 'IPE O 200', 'SHS 100×100×5' */
		name: z.string().min(1),
		/** Name exactly as in the source table, plus other spellings for search. */
		sourceName: z.string().min(1),
		aliases: z.array(z.string()),
		G: positive,
		A: positive,
		Iy: positive,
		Wy: positive,
		iy: positive,
		issues: z.array(Issue),
		corrections: z.array(Correction),
		/** Fields that are computed here rather than read from the source, e.g. iy for UNP. */
		derived: z.array(z.string()),
		/** Overrides the file's source for this record (corrections carry their own source per field). */
		source: SourceRef.optional()
	})
	.extend(Review.shape);

export const ISection = Base.extend({
	shape: z.literal('I'),
	h: positive,
	b: positive,
	tw: positive,
	tf: positive,
	Iz: positive,
	Wz: positive,
	iz: positive
});

/** UNP: the Vademecum gives one thickness (web) and no flange thickness. */
export const USection = Base.extend({
	shape: z.literal('U'),
	h: positive,
	b: positive,
	tw: positive,
	tf: positive.optional(),
	Iz: positive,
	Wz: positive,
	iz: positive
});

export const BoxSection = Base.extend({
	shape: z.literal('box'),
	h: positive,
	b: positive,
	t: positive,
	Iz: positive,
	Wz: positive,
	iz: positive
});

export const TubeSection = Base.extend({
	shape: z.literal('tube'),
	D: positive,
	t: positive
});

export const SteelSection = z.discriminatedUnion('shape', [
	ISection,
	USection,
	BoxSection,
	TubeSection
]);
export type SteelSection = z.infer<typeof SteelSection>;
export type ISection = z.infer<typeof ISection>;
export type USection = z.infer<typeof USection>;
export type BoxSection = z.infer<typeof BoxSection>;
export type TubeSection = z.infer<typeof TubeSection>;

export const SteelFile = z
	.object({
		family: SteelFamily,
		source: SourceRef,
		origin: ImportOrigin,
		sections: z.array(SteelSection).min(1)
	})
	.superRefine((file, ctx) => {
		const seen = new Set<string>();
		file.sections.forEach((s, i) => {
			if (s.family !== file.family) {
				ctx.addIssue({
					code: 'custom',
					message: `family ${s.family} in ${file.family} file`,
					path: ['sections', i]
				});
			}
			if (seen.has(s.id)) {
				ctx.addIssue({
					code: 'custom',
					message: `duplicate id ${s.id}`,
					path: ['sections', i, 'id']
				});
			}
			seen.add(s.id);
			checkReview(s, ctx, ['sections', i], s.id);
		});
	});
export type SteelFile = z.infer<typeof SteelFile>;

/** Profiled steel deck. Values per metre width, as published. */
export const ProfiledSheet = z
	.object({
		id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
		h: positive,
		t: positive,
		sigma: positive,
		Iy: positive,
		Wy: positive,
		issues: z.array(Issue),
		source: SourceRef.optional()
	})
	.extend(Review.shape);
export type ProfiledSheet = z.infer<typeof ProfiledSheet>;

export const ProfiledSheetFile = z
	.object({
		source: SourceRef,
		origin: ImportOrigin,
		/** Unit of each column as interpreted here; the source header is ambiguous. */
		units: z.record(z.string(), z.string()),
		sheets: z.array(ProfiledSheet).min(1)
	})
	.superRefine((file, ctx) =>
		file.sheets.forEach((s, i) => checkReview(s, ctx, ['sheets', i], s.id))
	);
export type ProfiledSheetFile = z.infer<typeof ProfiledSheetFile>;
