// Plain constants shared by the schema and the screens; no Zod here, so it stays out of the client bundle.

export const LINE_TYPES = ['solid', 'dashed', 'dashdot', 'dotted'] as const;

/** Drawing scales as the denominator: 100 is 1:100. */
export const SCALES = [100, 50, 20, 10, 5, 1] as const;

export const HATCH_GROUPS = ['stone', 'timber', 'steel', 'other'] as const;

export const GUIDE_IDS = ['plan', 'axo', 'detail'] as const;

export const GUIDE_PARTS = ['general', 'lines', 'labels'] as const;
