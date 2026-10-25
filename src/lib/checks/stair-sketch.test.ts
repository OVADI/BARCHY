import { describe, expect, it } from 'vitest';
import { SKETCH_H, SKETCH_W, sketchGeometry } from './stair-sketch';

describe('sketchGeometry', () => {
	it('spans the floor-to-floor height and the run at one scale', () => {
		const geo = sketchGeometry({ rise: 2800, risers: 15, going: 250 });
		expect(geo.y0 - geo.yTop).toBeCloseTo(2800 * geo.scale);
		expect(geo.riserX(15) - geo.riserX(1)).toBeCloseTo(14 * 250 * geo.scale);
		expect(geo.h).toBeCloseTo((2800 / 15) * geo.scale);
	});

	it.each([
		[300, 2, 100],
		[2800, 15, 250],
		[8000, 60, 400],
		[8000, 2, 400],
		[300, 60, 100]
	])('fits the viewBox for rise %i, %i risers, going %i', (rise, risers, going) => {
		const geo = sketchGeometry({ rise, risers, going });
		expect(geo.yTop).toBeGreaterThan(0);
		expect(geo.riserX(risers)).toBeLessThan(SKETCH_W);
		expect(geo.y0).toBeLessThan(SKETCH_H);
	});

	it('draws one riser per step in the outline', () => {
		const geo = sketchGeometry({ rise: 2800, risers: 15, going: 250 });
		expect(geo.path.match(/L/g)?.length).toBe(15 * 2 + 3);
	});
});
