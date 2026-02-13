export interface JobDescriptionData {
  title: string
  description: string
  applicationURL: string
  metadata: JobDescriptionMetadata
}

export interface JobDescriptionMetadata {
  location?: string
  datePosted?: Date
  salary?: string
  [key: string]: unknown
}

// "@context": "https:\/\/schema.org\/",
// "@type": "JobPosting",
// "title": "Sr Analyst - Quantitative Modeling",
// "description": "Reporting to the Director of Quantitative Modeling, this position's primary responsibilities will include the development of loss forecasting, credit scoring, remarketing models, and collection related models that support the originations strategy for Ally\u2019s Auto business line. The ideal candidate will have prior model development experience, strong data management, quantitative, and programming skills. Experience in the financial services industry is desired. This position is based in Charlotte, NC. Will consider other locations for internal candidates.",
// "hiringOrganization": { "@type": "Organization", "name": "Ally Financial" },
// "datePosted": "2026-02-11"
export interface LDJsonStructuredJson {
  '@context': string
  '@type': string
  title: string
  description: string
  hiringOrganization: Record<string, unknown>
  datePosted: string
}

export interface ATSProvider {
  extractJobs: (company: string) => Promise<JobDescriptionData[]>
}
