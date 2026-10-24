/**
 * Build-time settings. VITE_REPO_URL is set by the deploy workflow (https://github.com/<owner>/<repo>);
 * without it, links to GitHub issues are hidden.
 */
export const REPO_URL: string | undefined = import.meta.env.VITE_REPO_URL || undefined;

/** "Ik zocht iets" issue form, or undefined when the repository is unknown. */
export const MISSING_URL = REPO_URL ? `${REPO_URL}/issues/new?template=gemist.yml` : undefined;
