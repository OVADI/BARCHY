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
