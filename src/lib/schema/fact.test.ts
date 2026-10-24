import { describe, expect, it } from 'vitest';
import { Fact, FactFile } from './fact';

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

	it('takes a factor or a divisor, not both', () => {
		expect(Fact.safeParse({ ...base, value: 0.25, factorOf: 'l', symbol: 'a' }).success).toBe(true);
		expect(messages({ ...base, factorOf: 'l', divisorOf: 'l' })).toContain(
			'divisorOf and factorOf exclude each other'
		);
	});

	it('checks conditions: a range value exactly with bound range', () => {
		const when = (c: object) => Fact.safeParse({ ...base, when: [c] }).success;
		expect(when({ symbol: 'l', value: [6, 30], unit: 'm', bound: 'range' })).toBe(true);
		expect(when({ symbol: 'h.o.h', value: 5, unit: 'm', bound: 'max' })).toBe(true);
		expect(when({ symbol: 'l', value: 6, unit: 'm', bound: 'range' })).toBe(false);
		expect(when({ symbol: 'l', value: [6, 30], unit: 'm', bound: 'max' })).toBe(false);
	});

	it('rejects an unknown type and a non-kebab id', () => {
		expect(Fact.safeParse({ ...base, type: 'advice' }).success).toBe(false);
		expect(Fact.safeParse({ ...base, id: 'Trap Optrede' }).success).toBe(false);
	});
});

describe('FactFile', () => {
	const group = { id: 'beams', label: { nl: 'Liggers', en: 'Beams' } };

	it('needs every fact in a listed group once groups are given', () => {
		expect(FactFile.safeParse({ facts: [base] }).success).toBe(true);
		expect(
			FactFile.safeParse({ facts: [{ ...base, group: 'beams' }], groups: [group] }).success
		).toBe(true);
		const issues = FactFile.safeParse({ facts: [{ ...base, group: 'roofs' }], groups: [group] })
			.error?.issues;
		expect(issues?.map((i) => i.message)).toContain(
			'trap-optrede-test: group roofs is not in groups'
		);
	});
});
