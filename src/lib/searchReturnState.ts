/** Router state a search result passes to the details page, so it can return to the same results. */
export interface SearchReturnState {
  fromSearch: string
}

// location.state is whatever the previous page passed, or null on a deep link or refresh.
export function getSearchReturnState(state: unknown): SearchReturnState | null {
  if (
    typeof state === 'object' &&
    state !== null &&
    'fromSearch' in state &&
    typeof state.fromSearch === 'string'
  ) {
    return { fromSearch: state.fromSearch }
  }
  return null
}
