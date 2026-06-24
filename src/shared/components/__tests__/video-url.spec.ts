import { describe, it, expect } from 'vitest'
import { buildEmbedUrl, extractVimeoId, extractYouTubeId } from '../video-url'

describe('extractYouTubeId', () => {
  it.each([
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/shorts/abc12345xyz', 'abc12345xyz'],
  ])('extracts %s -> %s', (url, expected) => {
    expect(extractYouTubeId(url)).toBe(expected)
  })

  it('returns null for non-youtube URLs', () => {
    expect(extractYouTubeId('https://example.com/video/abc')).toBeNull()
    expect(extractYouTubeId('not a url at all')).toBeNull()
  })
})

describe('extractVimeoId', () => {
  it.each([
    ['https://vimeo.com/123456789', '123456789'],
    ['https://player.vimeo.com/video/123456789', '123456789'],
  ])('extracts %s -> %s', (url, expected) => {
    expect(extractVimeoId(url)).toBe(expected)
  })

  it('returns null for non-vimeo URLs', () => {
    expect(extractVimeoId('https://youtu.be/abc')).toBeNull()
  })
})

describe('buildEmbedUrl', () => {
  it('builds youtube-nocookie embed URL', () => {
    expect(buildEmbedUrl('https://youtu.be/dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    )
  })

  it('builds vimeo player embed URL', () => {
    expect(buildEmbedUrl('https://vimeo.com/123456789', 'vimeo')).toBe(
      'https://player.vimeo.com/video/123456789',
    )
  })

  it('returns null for an empty URL', () => {
    expect(buildEmbedUrl('', 'youtube')).toBeNull()
  })

  it('returns null when the URL does not match the provider', () => {
    expect(buildEmbedUrl('https://youtu.be/abc123', 'vimeo')).toBeNull()
  })
})
