import { z } from 'zod';
import { Bilingual, checkReview, InfoType, Review, SourceRef } from './source';

const Value = z.union([z.number(), z.tuple([z.number(), z.number()])]);

/**
 * One sourced value: a legal requirement (Bbl), a rule of thumb or a table value.
 * The type decides the colour in the UI: cobalt, orange, white.
 */
export const Fact = z
	.object({
		id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case id'),
		topic: z.string().min(1),
		type: InfoType,
		label: Bilingual,
		/** Optional explanation for the lavender card. */
		explain: Bilingual.optional(),
		value: Value,
		unit: z.string(),
		/** Second side of a rectangle, as the source writes it: 0,9 m x 1,2 m is value 0.9, by 1.2. */
		by: z.number().optional(),
		/** The value is n in "symbol / n", e.g. h = l/20: divisorOf 'l', value 20 (or [15, 20]). */
		divisorOf: z.string().min(1).optional(),
		/** Where the value applies, as written in the source (may contain numbers from that source). */
		scope: Bilingual.optional(),
		/** Sort order and grouping within a topic, e.g. 'beams-floor'. */
		group: z.string().optional(),
		/** 'max' = value is an upper limit, 'min' = lower limit, 'range' = allowed band. */
		bound: z.enum(['min', 'max', 'range', 'exact']).optional(),
		conditions: z
			.object({
				use: z.string().optional(),
				build: z.enum(['new', 'existing']).optional()
			})
			.optional(),
		source: SourceRef,
		validFrom: z.iso.date().optional()
	})
	.extend(Review.shape)
	.superRefine((fact, ctx) => {
		if (Array.isArray(fact.value) && fact.value[0] > fact.value[1]) {
			ctx.addIssue({ code: 'custom', message: 'range must be [low, high]', path: ['value'] });
		}
		if (fact.bound === 'range' && !Array.isArray(fact.value)) {
			ctx.addIssue({
				code: 'custom',
				message: "bound 'range' needs a [low, high] value",
				path: ['value']
			});
		}
		if (fact.by !== undefined && (Array.isArray(fact.value) || fact.divisorOf)) {
			ctx.addIssue({
				code: 'custom',
				message: "'by' needs a single value without divisorOf",
				path: ['by']
			});
		}
		if (fact.type === 'requirement' && !fact.validFrom) {
			ctx.addIssue({
				code: 'custom',
				message: 'requirements need validFrom (law version)',
				path: ['validFrom']
			});
		}
		checkReview(fact, ctx, [], fact.id);
		// Facts are written by hand; there is no automatic check that could vouch for them.
		if (fact.status === 'auto_checked') {
			ctx.addIssue({
				code: 'custom',
				message: 'facts are flagged or human_verified',
				path: ['status']
			});
		}
	});
export type Fact = z.infer<typeof Fact>;

export const FactFile = z.object({ facts: z.array(Fact) });
