import type { MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { getSearchReturnState } from '../../lib/searchReturnState'

const className = 'btn-secondary inline-flex items-center gap-1.5 self-start py-1.5 pr-3 pl-2'

/** Returns to the search results the user came from, or to an empty search on a deep link. */
export function BackToResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const returnState = getSearchReturnState(location.state)

  // Deep links and refreshes have no search to return to.
  if (!returnState) {
    return (
      <Link to="/" className={className}>
        <BackArrow />
        Back to search
      </Link>
    )
  }

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks open the results in a new tab through the href.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    // Going back, rather than pushing a new entry, keeps the search page's history and scroll position.
    event.preventDefault()
    void navigate(-1)
  }

  return (
    <Link
      to={{ pathname: '/', search: returnState.fromSearch }}
      onClick={handleClick}
      className={className}
    >
      <BackArrow />
      Back to results
    </Link>
  )
}

function BackArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="size-4 text-ink-muted"
    >
      <path
        fillRule="evenodd"
        d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
