import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createTestQueryClient } from './createTestQueryClient'

interface Options {
  /** The URL the router starts at. */
  route?: string
  /** A route pattern such as `/shows/:id`, so a page rendered on its own can read its params. */
  path?: string
}

export function renderWithProviders(ui: ReactElement, { route = '/', path }: Options = {}) {
  const queryClient = createTestQueryClient()

  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        {path ? (
          <Routes>
            <Route path={path} element={ui} />
          </Routes>
        ) : (
          ui
        )}
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { ...result, queryClient }
}
