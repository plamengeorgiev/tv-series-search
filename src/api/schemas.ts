import { z } from 'zod'

// TVmaze publishes no response schema; nullability below is based on sampling real responses.
// Unknown fields are stripped, so only what the UI renders is declared.

const imageSchema = z.object({
  medium: z.string(),
  original: z.string(),
})

const channelSchema = z.object({
  name: z.string(),
})

// A malformed value becomes null, which the UI already shows as "not available", rather than
// failing the whole response over one field.
const dateSchema = z.iso.date().nullable().catch(null)
// Rendered as a link, so only http(s) gets through: no javascript:, data: or other schemes.
const webUrlSchema = z
  .url({ protocol: /^https?$/ })
  .nullable()
  .catch(null)

export const showSchema = z.object({
  id: z.number(),
  name: z.string(),
  genres: z.array(z.string()),
  premiered: dateSchema,
  rating: z.object({ average: z.number().nullable() }),
  image: imageSchema.nullable(),
})

export const castMemberSchema = z.object({
  person: z.object({
    id: z.number(),
    name: z.string(),
    image: imageSchema.nullable(),
  }),
  character: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export const seasonSchema = z.object({
  id: z.number(),
  number: z.number(),
  name: z.string(),
  episodeOrder: z.number().nullable(),
  premiereDate: dateSchema,
  endDate: dateSchema,
})

export const showDetailsSchema = showSchema.extend({
  summary: z.string().nullable(),
  status: z.string(),
  language: z.string().nullable(),
  ended: dateSchema,
  officialSite: webUrlSchema,
  network: channelSchema.nullable(),
  webChannel: channelSchema.nullable(),
  // Only present because getShow requests it with embed[]=cast&embed[]=seasons.
  _embedded: z.object({
    cast: z.array(castMemberSchema),
    seasons: z.array(seasonSchema),
  }),
})

export const searchResultsSchema = z.array(
  z.object({
    score: z.number(),
    show: showSchema,
  }),
)

export type Show = z.infer<typeof showSchema>
export type ShowDetails = z.infer<typeof showDetailsSchema>
export type CastMember = z.infer<typeof castMemberSchema>
export type Season = z.infer<typeof seasonSchema>
export type SearchResult = z.infer<typeof searchResultsSchema>[number]
