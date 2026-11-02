import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createMemoryRouter, Outlet, RouterProvider, type RouteObject } from 'react-router'
import { routes } from '../routes'
import { createTestQueryClient } from './createTestQueryClient'

interface Options {
  /** The URL the router starts at. */
  route?: string
  /** A route pattern such as `/shows/:id`, so a page rendered on its own can read its params. */
  path?: string
}

function renderRoutes(routeObjects: RouteObject[], route: string) {
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter(routeObjects, { initialEntries: [route] })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return { ...result, queryClient, router }
}

export function renderWithProviders(ui: ReactElement, { route = '/', path = '*' }: Options = {}) {
  return renderRoutes([{ path, element: ui }], route)
}

/** Renders the app's real route tree, with `extra` (such as a location probe) beside it. */
export function renderApp(route = '/', extra?: ReactNode) {
  return renderRoutes(
    [
      {
        element: (
          <>
            <Outlet />
            {extra}
          </>
        ),
        children: routes,
      },
    ],
    route,
  )
}
