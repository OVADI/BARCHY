import { z } from 'zod';
import { SourceRef } from './source';
import { SteelFamily } from './steel';

/** A correction on an imported steel row, matched by its name in the source table. */
export const SteelCorrection = z.object({
	family: SteelFamily,
	/** Name or first cell exactly as in the source, e.g. 'HE 1000 A' or '50x30 3.2'. */
	sourceName: z.string().min(1),
	/** 1-based, for names that occur more than once in the source. */
	occurrence: z.number().int().positive().optional(),
	/** A numeric field in base units, or 'variant' to rename (e.g. 'AA'). */
	field: z.string().min(1),
	to: z.union([z.number(), z.string()]),
	reason: z.string().min(1),
	source: SourceRef
});
export type SteelCorrection = z.infer<typeof SteelCorrection>;

/** A person checked an imported record against its source; survives re-imports. */
export const SteelVerification = z.object({
	family: SteelFamily,
	sourceName: z.string().min(1),
	occurrence: z.number().int().positive().optional(),
	verifiedBy: z.string().min(1),
	verifiedOn: z.iso.date(),
	note: z.string().optional()
});
export type SteelVerification = z.infer<typeof SteelVerification>;

export const SteelCorrectionsFile = z.object({
	$comment: z.string().optional(),
	corrections: z.array(SteelCorrection),
	verifications: z.array(SteelVerification).default([])
});
