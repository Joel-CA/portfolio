import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Scans public/assets/resumes/ for PDF files with dates in the filename
 * pattern "(M_D_YY).pdf" and returns the filename with the latest date.
 * This runs at build time so the app never needs a manual resume list.
 */
function findLatestResume() {
  const resumeDir = path.resolve(__dirname, 'public/assets/resumes')
  const files = fs.readdirSync(resumeDir).filter(f => f.endsWith('.pdf'))
  const datePattern = /\((\d{1,2})_(\d{1,2})_(\d{2,4})\)\.pdf$/

  let latest = null
  let latestDate = null

  for (const file of files) {
    const match = file.match(datePattern)
    if (match) {
      const [, month, day, year] = match
      const fullYear = year.length === 2 ? 2000 + parseInt(year) : parseInt(year)
      const date = new Date(fullYear, parseInt(month) - 1, parseInt(day))
      if (!latestDate || date > latestDate) {
        latestDate = date
        latest = file
      }
    }
  }

  if (!latest) {
    console.warn('⚠️  No resume PDFs found in public/assets/resumes/')
  }

  return latest
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [react()],
  define: {
    __LATEST_RESUME__: JSON.stringify(findLatestResume()),
  },
  server: {
    port: 5173,
    open: true
  }
})