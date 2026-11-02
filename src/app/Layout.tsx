import { Link, Outlet } from 'react-router'
import { OfflineBanner } from './OfflineBanner'

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <OfflineBanner />
      <header className="border-b border-line bg-surface shadow-sm">
        <div className="mx-auto flex max-w-page items-center px-gutter py-4">
          <Link
            to="/"
            className="group flex items-center gap-3 rounded-lg text-xl font-extrabold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-2xl"
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-lg bg-accent text-on-accent shadow-sm transition group-hover:bg-accent-strong sm:size-10"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 sm:size-6"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="m7 2 5 5 5-5" />
              </svg>
            </span>
            TV series search
          </Link>
        </div>
      </header>
      <div className="flex flex-1 flex-col bg-glow">
        <main className="mx-auto flex w-full max-w-page flex-1 flex-col gap-4 px-gutter py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
