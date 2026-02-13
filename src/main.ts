import { CompaniesToBeScraped } from './data/input-urls'
import { getATSFactory } from './services/ats-factory'
;(async () => {
  // we can make a list of ATS providers;
  const atsFactory = getATSFactory('avature')

  for (const company of CompaniesToBeScraped) {
    const jobDescriptions = await atsFactory.extractJobs(company)
    // write into the file
  }
})()
