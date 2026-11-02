import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { routes } from './routes'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

// onlineManager deliberately isn't seeded from navigator.onLine. Chromium can wrongly report offline,
// which would pause every query with no error shown. If the app starts truly offline, the first
// request fails as a network error with a Retry button, and OfflineBanner explains why.
const queryClient = new QueryClient()

// A data router, because errorElement only works with one.
const router = createBrowserRouter(routes)

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
