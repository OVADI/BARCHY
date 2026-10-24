/**
 * Schematic drawing per beam shape, drawn by BARCHY after the figures in the Vademecum
 * (chapter 7 and 8); the source figures themselves are not copied.
 */
export type BeamShape =
	| 'straight'
	| 'cantilever'
	| 'continuous'
	| 'pitched'
	| 'curved'
	| 'trussed'
	| 'truss'
	| 'truss-triangle'
	| 'portal'
	| 'three-hinged'
	| 'three-hinged-bent'
	| 'arch'
	| 'slab-hollow'
	| 'slab-ribbed'
	| 'slab-wide'
	| 'slab-deck';

/** Shape of a rule group; groups without one (columns, walls, stability) get no drawing. */
const BY_GROUP: Record<string, BeamShape> = {
	'beams-straight': 'straight',
	'beams-cantilever': 'cantilever',
	'beams-continuous': 'continuous',
	'beams-pitched': 'pitched',
	'beams-curved': 'curved',
	'beams-trussed': 'trussed',
	'trusses-straight': 'truss',
	'trusses-triangular': 'truss-triangle',
	'frames-portal': 'portal',
	'frames-three-hinged': 'three-hinged',
	'frames-three-hinged-bent': 'three-hinged-bent',
	arches: 'arch',
	'beams-glulam-chart': 'straight',
	// Concrete: beams and floor sections.
	beams: 'straight',
	'floors-hollow-core': 'slab-hollow',
	'floors-hollow-core-dycore': 'slab-hollow',
	'floors-ribbed': 'slab-ribbed',
	'floors-wide-slab': 'slab-wide',
	'floors-composite-deck': 'slab-deck',
	// Steel groups hold several section types; the variant decides (see BY_VARIANT).
	'beams-floor': 'straight',
	'beams-roof': 'straight',
	purlins: 'straight'
};

/** Variants whose shape differs from their group, e.g. the truss among the steel floor beams. */
const BY_VARIANT: Record<string, BeamShape> = {
	'staal-hoofdligger-vloer-vakwerk': 'truss',
	'staal-dak-vakwerkligger-1': 'truss',
	'staal-dak-vakwerkligger-2': 'truss',
	'staal-driehoekdakligger': 'truss-triangle',
	'hout-meerdere-steunpunten-vakwerk': 'truss',
	'hout-driescharnierenspant-vakwerk': 'three-hinged'
};

/** Floor shapes are cross-sections: they show h but no span. */
export const isSection = (s: BeamShape) => s.startsWith('slab-');

export function shapeOf(group: string, variantKey?: string): BeamShape | undefined {
	return (variantKey && BY_VARIANT[variantKey]) || BY_GROUP[group];
}
