/**
 * Returns the path to the latest resume PDF.
 *
 * The filename is auto-detected at build time by vite.config.js — it scans
 * public/assets/resumes/ and picks the file with the newest (M_D_YY) date.
 * No manual list to maintain: just drop a new PDF into that folder and rebuild.
 *
 * Uses import.meta.env.BASE_URL so the path resolves correctly on GitHub Pages.
 */
export const getLatestResumePath = () => {
  return `${import.meta.env.BASE_URL}assets/resumes/${__LATEST_RESUME__}`
}

