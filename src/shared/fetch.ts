import fetch from 'node-fetch'
import type { Response } from 'node-fetch'

export const safeFetch = async (url: string): Promise<Response | undefined> => {
  try {
    const response = await fetch(url)
    if (response.redirected && response.url) {
      return safeFetch(response.url)
    }
    return response
  } catch (err: any) {
    if (err.code === 'ENOTFOUND') {
      console.warn('Domain not found:', url)
    }

    console.warn('Network error:', url, err.message)
  }
}
