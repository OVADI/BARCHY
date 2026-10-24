import { describe, expect, it } from 'vitest';
import { barArea, box, gyration, iSection, rectangle, tube } from './section';

describe('rectangle', () => {
	it('gives A, I and W for b × h', () => {
		const p = rectangle(100, 200);
		expect(p.A).toBe(20_000);
		expect(p.Iy).toBeCloseTo((100 * 200 ** 3) / 12, 6);
		expect(p.Wy).toBeCloseTo((100 * 200 ** 2) / 6, 6);
		expect(p.Iz).toBeCloseTo((200 * 100 ** 3) / 12, 6);
		expect(p.Wz).toBeCloseTo((200 * 100 ** 2) / 6, 6);
	});
});

describe('iSection', () => {
	it('equals a rectangle when the web is as wide as the flange', () => {
		const i = iSection(200, 100, 100, 10);
		const r = rectangle(100, 200);
		expect(i.A).toBeCloseTo(r.A, 6);
		expect(i.Iy).toBeCloseTo(r.Iy, 3);
		expect(i.Iz).toBeCloseTo(r.Iz, 3);
	});

	it('matches a hand calculation', () => {
		// h 200, b 100, tw 6, tf 10: A = 2·100·10 + 180·6
		const i = iSection(200, 100, 6, 10);
		expect(i.A).toBe(3080);
		expect(i.Iy).toBeCloseTo((100 * 200 ** 3 - 94 * 180 ** 3) / 12, 3);
	});
});

describe('tube', () => {
	it('gives the exact ring area and second moment', () => {
		const p = tube(100, 10);
		expect(p.A).toBeCloseTo((Math.PI / 4) * (100 ** 2 - 80 ** 2), 9);
		expect(p.Iy).toBeCloseTo((Math.PI / 64) * (100 ** 4 - 80 ** 4), 3);
		expect(p.Wy).toBeCloseTo(p.Iy / 50, 6);
	});
});

describe('box', () => {
	it('with sharp corners is outer minus inner rectangle', () => {
		const p = box(100, 60, 5);
		expect(p.A).toBeCloseTo(100 * 60 - 90 * 50, 9);
		expect(p.Iy).toBeCloseTo((60 * 100 ** 3 - 50 * 90 ** 3) / 12, 3);
	});

	it('loses (4 − π)(ro² − ri²) of area to rounded corners', () => {
		const sharp = box(100, 100, 5);
		const round = box(100, 100, 5, 7.5, 5);
		expect(sharp.A - round.A).toBeCloseTo((4 - Math.PI) * (7.5 ** 2 - 5 ** 2), 9);
		expect(round.Iy).toBeLessThan(sharp.Iy);
	});

	it('is symmetric for a square', () => {
		const p = box(100, 100, 5, 7.5, 5);
		expect(p.Iy).toBeCloseTo(p.Iz, 6);
	});
});

describe('gyration and bars', () => {
	it('i = √(I/A)', () => expect(gyration(400, 4)).toBe(10));
	it('bar area n·π·d²/4', () => {
		expect(barArea(10)).toBeCloseTo(78.54, 2);
		expect(barArea(12, 3)).toBeCloseTo(339.29, 2);
	});
});
