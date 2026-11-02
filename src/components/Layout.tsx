import { Link, Outlet } from 'react-router'
import { OfflineBanner } from './OfflineBanner'

export function Layout() {
  return (
    <>
      <OfflineBanner />
      <header>
        <Link to="/">TV series search</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
