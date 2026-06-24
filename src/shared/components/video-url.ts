/**
 * Provider-agnostic embed-URL builders. Lifted out of VideoPlayer.vue so
 * the regex set is testable in isolation and reusable if we ever need
 * a thumbnail-only render path.
 */

const YT_PATTERNS: RegExp[] = [
  /youtu\.be\/([^?&#/]+)/i,
  /youtube\.com\/watch\?(?:.*&)?v=([^&]+)/i,
  /youtube\.com\/embed\/([^?&#/]+)/i,
  /youtube\.com\/v\/([^?&#/]+)/i,
  /youtube\.com\/shorts\/([^?&#/]+)/i,
]

export function extractYouTubeId(url: string): string | null {
  for (const re of YT_PATTERNS) {
    const m = url.match(re)
    if (m?.[1]) return m[1]
  }
  return null
}

export function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d+)/i)
  return m?.[1] ?? null
}

export function buildEmbedUrl(
  url: string,
  provider: 'youtube' | 'vimeo',
): string | null {
  if (!url) return null
  if (provider === 'youtube') {
    const id = extractYouTubeId(url)
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  const id = extractVimeoId(url)
  return id ? `https://player.vimeo.com/video/${id}` : null
}
