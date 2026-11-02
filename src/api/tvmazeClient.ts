import type { z } from 'zod'
import {
  searchResultsSchema,
  showDetailsSchema,
  type SearchResult,
  type ShowDetails,
} from './schemas'

export const TVMAZE_BASE_URL = 'https://api.tvmaze.com'

export type ApiErrorType = 'network' | 'not-found' | 'rate-limited' | 'server' | 'invalid-response'

export class ApiError extends Error {
  readonly type: ApiErrorType
  readonly status: number | undefined

  constructor(type: ApiErrorType, message: string, options?: { status?: number; cause?: unknown }) {
    super(message, { cause: options?.cause })
    this.name = 'ApiError'
    this.type = type
    this.status = options?.status
  }
}

function typeForStatus(status: number): ApiErrorType {
  if (status === 404) return 'not-found'
  if (status === 429) return 'rate-limited'
  if (status >= 500) return 'server'
  // Any other 4xx means we sent something the API doesn't accept, so retrying won't help.
  return 'invalid-response'
}

async function request<T>(url: URL, schema: z.ZodType<T>, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    // Rethrow aborts as-is so React Query treats them as cancellations, not failures.
    if (signal?.aborted) throw error
    throw new ApiError('network', 'Could not reach TVmaze', { cause: error })
  }

  if (!response.ok) {
    throw new ApiError(
      typeForStatus(response.status),
      `TVmaze responded with ${String(response.status)}`,
      {
        status: response.status,
      },
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('invalid-response', 'TVmaze returned malformed JSON', { cause: error })
  }

  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ApiError('invalid-response', 'TVmaze returned unexpected data', {
      cause: result.error,
    })
  }
  return result.data
}

export function searchShows(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
  const url = new URL('/search/shows', TVMAZE_BASE_URL)
  url.searchParams.set('q', query)
  return request(url, searchResultsSchema, signal)
}

export function getShow(id: number, signal?: AbortSignal): Promise<ShowDetails> {
  const url = new URL(`/shows/${String(id)}`, TVMAZE_BASE_URL)
  // Embedding saves two extra requests against the rate limit.
  url.searchParams.append('embed[]', 'cast')
  url.searchParams.append('embed[]', 'seasons')
  return request(url, showDetailsSchema, signal)
}
