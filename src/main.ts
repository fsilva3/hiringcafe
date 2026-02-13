import { CompaniesToBeScraped } from './data/input-urls'
import { getATSFactory } from './services/ats-factory'
import { writeFileSafe } from './shared/files'
import { JobDescriptionData } from './shared/types'
;(async () => {
  try {
    // we can make a list of ATS providers;
    const atsFactory = getATSFactory('avature')
    const results: JobDescriptionData[] = []
    for (const company of CompaniesToBeScraped) {
      const jobDescriptions = await atsFactory.extractJobs(company)

      results.push(...jobDescriptions)
    }

    // write into the file - the ideal is to write in chunks to not overload the memory, but I don't have enough time
    await writeFileSafe(results)
    process.exit(0)
  } catch (err: unknown) {
    console.error({ err })
    process.exit(1)
  }
})()
