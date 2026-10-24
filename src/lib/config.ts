/**
 * Build-time settings. VITE_REPO_URL is set by the deploy workflow (https://github.com/<owner>/<repo>);
 * without it, links to GitHub issues are hidden.
 */
export const REPO_URL: string | undefined = import.meta.env.VITE_REPO_URL || undefined;

/** "Ik zocht iets" issue form, or undefined when the repository is unknown. */
export const MISSING_URL = REPO_URL ? `${REPO_URL}/issues/new?template=gemist.yml` : undefined;

/** "Fout gevonden" issue form, or undefined when the repository is unknown. */
export const CORRECTION_URL = REPO_URL
	? `${REPO_URL}/issues/new?template=correctie.yml`
	: undefined;

/**
 * Web3Forms access key for the feedback form. Public by design: it only lets the form mail the maker.
 * Without it, the form is replaced by a link to GitHub issues.
 */
export const WEB3FORMS_KEY: string | undefined = import.meta.env.VITE_WEB3FORMS_KEY || undefined;
