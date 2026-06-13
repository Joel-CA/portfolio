/**
 * Utility to find the latest resume based on date in filename
 * Filename format: "Joel Castro - Tech Resume (M_D_YY).pdf"
 */
export const getLatestResumePath = () => {
  // List of available resumes - update this if you add new ones
  const resumes = [
    { name: 'Joel Castro - Tech Resume (1_30_25).pdf', date: new Date(2025, 0, 30) },
    { name: 'Joel Castro - Tech Resume (6_12_26).pdf', date: new Date(2026, 5, 12) },
    { name: 'Joel Castro - Tech Resume (7_9_24).pdf', date: new Date(2024, 6, 9) },
    { name: 'Joel Castro - Tech Resume (8_24_25).pdf', date: new Date(2025, 7, 24) },
    { name: 'Joel Castro - Tech Resume (8_7_24).pdf', date: new Date(2024, 7, 7) },
  ]

  // Find the resume with the latest date
  const latest = resumes.reduce((prev, current) =>
    current.date > prev.date ? current : prev
  )

  return `/assets/resumes/${latest.name}`
}
