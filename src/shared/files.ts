import fs from 'fs/promises'
import path from 'path'
import { JobDescriptionData } from './types'

export async function writeFileSafe(jobDescriptions: JobDescriptionData[]) {
  const FILE_PATH = path.join(process.cwd(), 'dist/output.json')

  try {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true })
    await fs.access(FILE_PATH)
  } catch {
    // File does NOT exist → create empty file
    await fs.writeFile(FILE_PATH, '', 'utf-8')
  }

  // Write JSON content
  await fs.writeFile(
    FILE_PATH,
    JSON.stringify(jobDescriptions, null, 2),
    'utf-8'
  )
}
