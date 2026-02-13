import { HTTP_STATUS } from '@app/config/constants'
import {
  ATSProvider,
  JobDescriptionData,
  JobDescriptionMetadata,
  LDJsonStructuredJson,
} from '@app/shared/types'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import type { CheerioAPI } from 'cheerio'

const REGEX_TYPE_URL = /avature.net\/([a-z]*)/
const REGEX_MATCH_TITLE = /JobDetail\/([a-zA-Z-0-9]*)/

const extractLinks = ($: CheerioAPI, source: string): string[] => {
  const matches = REGEX_TYPE_URL.exec(source)
  if (!matches) return []

  const type = matches[1]
  const linksCleaned = new Set<string>()
  const elements = $(`a[href*="${type}/JobDetail"]`)

  for (const el of elements) {
    const href = el.attribs['href']
    if (href && !linksCleaned.has(href)) {
      linksCleaned.add(href)
    }
  }

  return Array.from(linksCleaned)
}

const extractTitle = (
  $: CheerioAPI,
  url: string,
  structuredJson?: LDJsonStructuredJson
): string => {
  // lets check ld+json first, then we can add the fallback or
  // we can add this as second parameter since it's gonna be used in the other functions
  if (structuredJson && structuredJson.title) {
    return structuredJson.title
  }

  // we've the title in the url
  const matches = REGEX_MATCH_TITLE.exec(url)
  if (matches && matches[1]) {
    return matches[1].replaceAll('-', ' ')
  }

  // the last fallback grabs the first h2 value; it worked for most of the websites,
  // and probably it has more acurracy than parsing URL
  const headings = $('h2')
    .map((i, e) => $(e).text())
    .get()

  if (headings[0]) {
    return headings[0].replaceAll('\n', '').trim()
  }

  return ''
}

const extractDescription = (
  $: CheerioAPI,
  structuredJson?: LDJsonStructuredJson
): string => {
  if (structuredJson && structuredJson.description) {
    return structuredJson.description
  }

  // maybe length > 400
  // document.querySelectorAll('p').forEach(el => console.log(el.textContent.length))

  return ''
}

const extractDatePosted = (
  $: CheerioAPI,
  structuredJson?: LDJsonStructuredJson
): Date | undefined => {
  if (structuredJson?.datePosted) {
    return new Date(structuredJson?.datePosted)
  }

  return undefined
}

const extractLocation = (
  $: CheerioAPI,
  structuredJson?: LDJsonStructuredJson
): string | undefined => {
  return undefined
}

const extractSalary = (
  $: CheerioAPI,
  structuredJson?: LDJsonStructuredJson
): string | undefined => {
  return undefined
}

const extractMetadata = (
  $: CheerioAPI,
  structuredJson?: LDJsonStructuredJson
): JobDescriptionMetadata => {
  return {
    datePosted: extractDatePosted($, structuredJson),
    location: extractLocation($),
    salary: extractSalary($),
  }
}

const getAvatureURLs = (company: string): string[] => {
  return [
    `https://${company}.avature.net/careers`,
    `https://${company}.avature.net/jobs`,
    `https://${company}.avature.net/careers2`,
    `https://${company}.avature.net/careers/SearchJobs`,
  ]
}

const extractJobDetails = async (
  link: string
): Promise<JobDescriptionData | null> => {
  console.log(`Extracting link ${link}`)
  const response = await fetch(link)
  if (response.status === HTTP_STATUS.NOT_FOUND) {
    return null
  }

  const html = await response.json()
  const $ = cheerio.load(html)

  const element = $(`script[type="application/ld+json"]`)
  if (element.length > 0 && element[0].children[0]) {
    const structuredJson = element.data() as unknown as LDJsonStructuredJson
    // const jobDetailsParsed = JSON.parse()
    // I'll need to debug;
    /*
    {
      "@context": "https:\/\/schema.org\/",
      "@type": "JobPosting",
      "title": "Sr Analyst - Quantitative Modeling",
      "description": "Reporting to the Director of Quantitative Modeling, this position's primary responsibilities will include the development of loss forecasting, credit scoring, remarketing models, and collection related models that support the originations strategy for Ally\u2019s Auto business line. The ideal candidate will have prior model development experience, strong data management, quantitative, and programming skills. Experience in the financial services industry is desired. This position is based in Charlotte, NC. Will consider other locations for internal candidates.",
      "hiringOrganization": { "@type": "Organization", "name": "Ally Financial" },
      "datePosted": "2026-02-11"
    }
    */
    return {
      title: extractTitle($, link, structuredJson),
      description: extractDescription($, structuredJson),
      applicationURL: link,
      metadata: extractMetadata($, structuredJson),
    }
  }

  return {
    title: extractTitle($, link),
    description: extractDescription($),
    applicationURL: link,
    metadata: extractMetadata($),
  }
}

const extractJobs = async (company: string): Promise<JobDescriptionData[]> => {
  const urls = getAvatureURLs(company)

  const jobDescriptions: JobDescriptionData[] = []
  for (const url of urls) {
    // check if the url doesn't return 404
    const response = await fetch(url)
    if (response.status === HTTP_STATUS.NOT_FOUND) {
      continue
    }
    const html = await response.json()
    const $ = cheerio.load(html)

    // to extract more jobs I would need to paginate to the others pages, but for now let's keep the first page
    const links = extractLinks($, url)

    const results = await Promise.all(
      links.map((link) => extractJobDetails(link))
    ) // we might see some exaustive checks on the links;

    jobDescriptions.push(...results.filter((result) => result !== null))
  }

  return jobDescriptions
}

export default {
  extractJobs: extractJobs,
} as ATSProvider
