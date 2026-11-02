import type { RouteObject } from 'react-router'
import { Layout } from './Layout'
import { NotFound } from '../components/NotFound'
import { RouteErrorBoundary } from './RouteErrorBoundary'
import { SearchPage } from '../features/search/SearchPage'
import { ShowDetailsPage } from '../features/show-details/ShowDetailsPage'

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    // Only reached if Layout itself crashes, since the pages have their own boundary below.
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        // A pathless boundary inside Layout, so a crashing page keeps the header and offline banner.
        errorElement: <RouteErrorBoundary />,
        children: [
          { index: true, element: <SearchPage /> },
          { path: 'shows/:id', element: <ShowDetailsPage /> },
          {
            path: '*',
            element: <NotFound title="Page not found" message="There’s nothing at this address." />,
          },
        ],
      },
    ],
  },
]
