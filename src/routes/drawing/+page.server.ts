import raw from '../../../content/drawing/conventions.json';
import { DrawingFile } from '$lib/schema/drawing';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the conventions end up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => DrawingFile.parse(raw);
