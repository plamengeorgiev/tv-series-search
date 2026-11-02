import { Link, Outlet } from 'react-router'

export function Layout() {
  return (
    <>
      <header>
        <Link to="/">TV series search</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
