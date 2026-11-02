import type { RouteObject } from 'react-router'
import { Layout } from './components/Layout'
import { NotFoundPage } from './components/NotFoundPage'
import { RouteErrorBoundary } from './components/RouteErrorBoundary'
import { SearchPage } from './features/search/SearchPage'
import { ShowDetailsPage } from './features/show-details/ShowDetailsPage'

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
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]
