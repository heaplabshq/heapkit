import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined

/**
 * Renders nothing until VITE_ADSENSE_CLIENT_ID is set (which also requires adding the
 * AdSense loader script to index.html). Kept as a no-op placeholder so turning ads on
 * later is a config change, not a code change.
 */
export function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT_ID) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    } catch {
      // AdSense loader script not present yet — no-op until it's wired in.
    }
  }, [])

  if (!ADSENSE_CLIENT_ID) return null

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block' }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
