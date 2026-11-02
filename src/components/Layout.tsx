import { Link, Outlet } from 'react-router'
import { OfflineBanner } from './OfflineBanner'

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <OfflineBanner />
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-page items-center px-gutter py-3">
          <Link
            to="/"
            className="rounded text-lg font-bold tracking-tight text-ink hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            TV series search
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-4 px-gutter py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
