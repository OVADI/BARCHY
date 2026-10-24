import { describe, expect, it } from 'vitest';
import { Fact } from './fact';

const base = {
	id: 'trap-optrede-test',
	topic: 'stairs',
	type: 'rule_of_thumb',
	label: { nl: 'Test', en: 'Test' },
	value: 1,
	unit: 'mm',
	source: { title: 'Test', ref: 'Test' },
	status: 'flagged'
} as const;

const messages = (data: unknown) => Fact.safeParse(data).error?.issues.map((i) => i.message) ?? [];

describe('Fact', () => {
	it('accepts a sourced, unverified rule of thumb', () => {
		expect(Fact.safeParse(base).success).toBe(true);
	});

	it('requires validFrom for a legal requirement', () => {
		expect(messages({ ...base, type: 'requirement' })).toContain(
			'requirements need validFrom (law version)'
		);
		expect(Fact.safeParse({ ...base, type: 'requirement', validFrom: '2024-01-01' }).success).toBe(
			true
		);
	});

	it('needs a reviewer and a date for human_verified, and only then', () => {
		expect(messages({ ...base, status: 'human_verified' })).toContain(
			'trap-optrede-test: human_verified needs verifiedBy and verifiedOn'
		);
		expect(
			Fact.safeParse({
				...base,
				status: 'human_verified',
				verifiedBy: 'OV',
				verifiedOn: '2026-10-24'
			}).success
		).toBe(true);
		expect(messages({ ...base, verifiedBy: 'OV' })).toContain(
			'trap-optrede-test: verifiedBy/verifiedOn only with human_verified'
		);
	});

	it('is never auto_checked: no automatic check can vouch for a hand-written fact', () => {
		expect(messages({ ...base, status: 'auto_checked' })).toContain(
			'facts are flagged or human_verified'
		);
	});

	it('checks ranges', () => {
		expect(messages({ ...base, value: [630, 600] })).toContain('range must be [low, high]');
		expect(messages({ ...base, bound: 'range', value: 600 })).toContain(
			"bound 'range' needs a [low, high] value"
		);
	});

	it('rejects an unknown type and a non-kebab id', () => {
		expect(Fact.safeParse({ ...base, type: 'advice' }).success).toBe(false);
		expect(Fact.safeParse({ ...base, id: 'Trap Optrede' }).success).toBe(false);
	});
});
