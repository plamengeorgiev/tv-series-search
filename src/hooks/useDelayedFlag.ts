import { useEffect, useState } from 'react'

/** Returns `true` once `flag` has stayed `true` for `delayMs`, and `false` as soon as it turns off. */
export function useDelayedFlag(flag: boolean, delayMs: number): boolean {
  const [hasElapsed, setHasElapsed] = useState(false)

  useEffect(() => {
    if (!flag) return
    const timeout = setTimeout(() => {
      setHasElapsed(true)
    }, delayMs)
    return () => {
      clearTimeout(timeout)
      setHasElapsed(false)
    }
  }, [flag, delayMs])

  // Hides the notice in the same render the flag turns off, before the cleanup's reset lands.
  return flag && hasElapsed
}
