import { CACHE_DIR } from '$env/static/private'
import { fetchFromGithub } from '$lib/utils/github'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import type { PageServerLoad } from './$types'

const cacheFile = () => `${CACHE_DIR}/contributions-${new Date().getFullYear()}.json`
const MAX_AGE_MS = 6 * 60 * 60 * 1000 // Refetch at most 4x/day

const readCache = async (allowStale = false): Promise<Record<string, number> | undefined> => {
  try {
    if (!allowStale) {
      const cache = await stat(cacheFile())
      if (Date.now() - cache.mtimeMs > MAX_AGE_MS) {
        return
      }
    }
    return JSON.parse(await readFile(cacheFile(), 'utf8'))
  } catch {
    return
  }
}

export const load: PageServerLoad = async () => {
  let data = await readCache()

  if (!data) {
    try {
      data = await fetchFromGithub()
      await mkdir(CACHE_DIR, { recursive: true })
      await writeFile(cacheFile(), JSON.stringify(data))
    } catch (error) {
      console.error('contributions fetch failed:', error)
      data = await readCache(true) // Serve stale cache if we have any
    }
  }

  return { contributions: data ?? {} }
}
