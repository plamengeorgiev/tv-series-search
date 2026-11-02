import { http, HttpResponse } from 'msw'
import { TVMAZE_BASE_URL } from '../api/tvmazeClient'
import { searchResultsFixture, showFixture, sparseShowFixture } from './fixtures'

const showsById = new Map([showFixture, sparseShowFixture].map((show) => [String(show.id), show]))

export const handlers = [
  http.get(`${TVMAZE_BASE_URL}/search/shows`, () => HttpResponse.json(searchResultsFixture)),

  http.get(`${TVMAZE_BASE_URL}/shows/:id`, ({ params }) => {
    const show = showsById.get(String(params.id))
    return show ? HttpResponse.json(show) : new HttpResponse(null, { status: 404 })
  }),
]
