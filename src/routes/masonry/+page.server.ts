import { rulesOf } from '$lib/server/rules';
import type { PageServerLoad } from './$types';

// Server-only load: at build time the rules end up in this page's prerendered data, not in a JS bundle.
export const load: PageServerLoad = () => rulesOf('masonry');
