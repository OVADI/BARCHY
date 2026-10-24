import { z } from 'zod';
import { Bilingual, checkReview, InfoType, Review, SourceRef } from './source';

const Value = z.union([z.number(), z.tuple([z.number(), z.number()])]);

const Bound = z.enum(['min', 'max', 'range', 'exact']);

/** A symbol as the source writes it, e.g. 'h', 'h_knik' or '(l+g)'. */
const SymbolName = z.string().regex(/^[^\s]+$/, 'symbol without spaces');

/** Toelichting (note) or Let op (warning) from the source, kept with the rule it belongs to. */
export const Note = z.object({
	kind: z.enum(['note', 'warning']),
	text: Bilingual
});
export type Note = z.infer<typeof Note>;

/**
 * Machine-readable part of where a rule applies, e.g. l from 6 to 30 m: { symbol: 'l',
 * value: [6, 30], unit: 'm', bound: 'range' }. The source text stays in scope.
 */
export const Condition = z
	.object({ symbol: SymbolName, value: Value, unit: z.string(), bound: Bound })
	.refine((c) => (c.bound === 'range') === Array.isArray(c.value), {
		message: "a condition has a [low, high] value exactly when bound is 'range'"
	});
export type Condition = z.infer<typeof Condition>;

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
		divisorOf: SymbolName.optional(),
		/** The value is a factor in "value · symbol", e.g. a = 0,25 · l: factorOf 'l', value 0.25. */
		factorOf: SymbolName.optional(),
		/** The quantity the value gives, e.g. 'h' or 'a'; written before the value as 'h = l/17'. */
		symbol: SymbolName.optional(),
		/** Where the value applies, as written in the source (may contain numbers from that source). */
		scope: Bilingual.optional(),
		/** The same limits as scope, for tools: a calculator warns outside them. */
		when: z.array(Condition).optional(),
		/** Notes and warnings from the source that belong to this rule. */
		notes: z.array(Note).optional(),
		/** Sort order and grouping within a topic, e.g. 'beams-floor'. */
		group: z.string().optional(),
		/** 'max' = value is an upper limit, 'min' = lower limit, 'range' = allowed band. */
		bound: Bound.optional(),
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
		if (fact.by !== undefined && (Array.isArray(fact.value) || fact.divisorOf || fact.factorOf)) {
			ctx.addIssue({
				code: 'custom',
				message: "'by' needs a single value without divisorOf or factorOf",
				path: ['by']
			});
		}
		if (fact.divisorOf && fact.factorOf) {
			ctx.addIssue({
				code: 'custom',
				message: 'divisorOf and factorOf exclude each other',
				path: ['factorOf']
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

/** A heading for facts with the same group, e.g. one beam shape, with the notes for all of them. */
export const FactGroup = z.object({
	id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case id'),
	label: Bilingual,
	notes: z.array(Note).optional()
});
export type FactGroup = z.infer<typeof FactGroup>;

/**
 * A design chart in the source, referenced but not copied: the app shows what it is for and
 * where to find it. Values read from it would become facts of their own, flagged.
 */
export const Chart = z
	.object({
		id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case id'),
		topic: z.string().min(1),
		group: z.string().optional(),
		label: Bilingual,
		/** What the chart gives, e.g. 'beam height h against span l'. */
		explain: Bilingual,
		/** The conditions the chart holds for, one per item as in the source. */
		assumptions: z.array(Bilingual),
		/** The lines in the chart, e.g. 'grey line: q = 5 kN/m² (assembly)'. */
		lines: z.array(Bilingual),
		notes: z.array(Note).optional(),
		source: SourceRef
	})
	.extend(Review.shape)
	.superRefine((chart, ctx) => checkReview(chart, ctx, [], chart.id));
export type Chart = z.infer<typeof Chart>;

export const FactFile = z
	.object({
		facts: z.array(Fact),
		groups: z.array(FactGroup).optional(),
		charts: z.array(Chart).optional()
	})
	.superRefine((file, ctx) => {
		if (!file.groups) return;
		const ids = new Set(file.groups.map((g) => g.id));
		if (ids.size !== file.groups.length) {
			ctx.addIssue({ code: 'custom', message: 'group ids must be unique', path: ['groups'] });
		}
		// With groups listed, every fact and chart must sit in one of them.
		for (const [key, items] of [
			['facts', file.facts],
			['charts', file.charts ?? []]
		] as const) {
			items.forEach((item, i) => {
				if (!item.group || !ids.has(item.group)) {
					ctx.addIssue({
						code: 'custom',
						message: `${item.id}: group ${item.group ?? '(none)'} is not in groups`,
						path: [key, i, 'group']
					});
				}
			});
		}
	});
