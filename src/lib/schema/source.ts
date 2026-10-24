import { z } from 'zod';

/** Where a value comes from. Shown in the InfoSheet; never as loose text on a screen. */
export const SourceRef = z.object({
	title: z.string().min(1),
	ref: z.string().min(1),
	url: z.url().optional(),
	license: z.string().optional()
});
export type SourceRef = z.infer<typeof SourceRef>;

export const InfoType = z.enum(['requirement', 'rule_of_thumb', 'data']);
export type InfoType = z.infer<typeof InfoType>;

export const Bilingual = z.object({ nl: z.string().min(1), en: z.string().min(1) });
export type Bilingual = z.infer<typeof Bilingual>;

/** Exact upstream file a record was imported from, so every value can be traced. */
export const ImportOrigin = z.object({
	repo: z.url(),
	commit: z.string().regex(/^[0-9a-f]{40}$/),
	path: z.string().min(1),
	section: z.string().min(1)
});
export type ImportOrigin = z.infer<typeof ImportOrigin>;

/**
 * Review state of a record.
 * - flagged: a check failed or nobody has looked yet; the UI shows a warning on the value
 * - auto_checked: passes all automatic consistency checks
 * - human_verified: checked by a person against the source (verifiedBy, verifiedOn)
 */
export const Status = z.enum(['flagged', 'auto_checked', 'human_verified']);
export type Status = z.infer<typeof Status>;

export const Review = z.object({
	status: Status,
	verifiedBy: z.string().min(1).optional(),
	verifiedOn: z.iso.date().optional()
});
export type Review = z.infer<typeof Review>;

/** A failed consistency check, kept with the record so the UI can show why it is flagged. */
export const Issue = z.object({
	check: z.string().min(1),
	severity: z.enum(['error', 'warning']),
	field: z.string().optional(),
	expected: z.number().optional(),
	found: z.number().optional(),
	message: z.string().min(1)
});
export type Issue = z.infer<typeof Issue>;

/** A value changed relative to the upstream source, with the reason. */
export const Correction = z.object({
	field: z.string().min(1),
	from: z.union([z.number(), z.string(), z.null()]),
	to: z.union([z.number(), z.string()]),
	reason: z.string().min(1),
	source: SourceRef
});
export type Correction = z.infer<typeof Correction>;

/**
 * Cross-field rules for a reviewed record: a person and a date exactly when human_verified,
 * and never anything but flagged while an error-level issue is open.
 */
export function checkReview(
	record: Review & { issues?: Issue[] },
	ctx: z.RefinementCtx,
	path: (string | number)[],
	label: string
): void {
	const human = record.status === 'human_verified';
	if (human && !(record.verifiedBy && record.verifiedOn)) {
		ctx.addIssue({
			code: 'custom',
			message: `${label}: human_verified needs verifiedBy and verifiedOn`,
			path: [...path, 'status']
		});
	}
	if (!human && (record.verifiedBy || record.verifiedOn)) {
		ctx.addIssue({
			code: 'custom',
			message: `${label}: verifiedBy/verifiedOn only with human_verified`,
			path: [...path, 'status']
		});
	}
	if (record.issues?.some((i) => i.severity === 'error') && record.status !== 'flagged') {
		ctx.addIssue({
			code: 'custom',
			message: `${label} has errors but status is ${record.status}`,
			path: [...path, 'status']
		});
	}
}
