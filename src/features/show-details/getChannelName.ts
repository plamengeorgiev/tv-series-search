import type { ShowDetails } from '../../api/schemas'

// Broadcast shows have a network, streaming shows a web channel instead.
export function getChannelName(show: Pick<ShowDetails, 'network' | 'webChannel'>): string | null {
  return (show.network ?? show.webChannel)?.name ?? null
}
