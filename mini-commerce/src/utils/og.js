const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://minkaluxury.com'

function toAbsolute (url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `${SITE_URL}${url}`
  return `${SITE_URL}/${url}`
}

function buildCloudinaryBase (url) {
  const idx = url.indexOf('/upload/')
  if (idx === -1) return null
  return { prefix: url.slice(0, idx + 8), rest: url.slice(idx + 8) }
}

/**
 * getOgImage(image, title?)
 * - If image is on Cloudinary, returns a resized 1200x630 variant.
 * - If `title` is provided and image is Cloudinary, overlays the title text.
 */
export function getOgImage (image, title = '') {
  if (!image) return null
  const abs = toAbsolute(image)
  const base = buildCloudinaryBase(abs)
  if (!base) return abs

  const transformations = []
  // Size + crop
  transformations.push('w_1200,h_630,c_fill')
  // Auto quality and format
  transformations.push('q_auto,f_auto')

  if (title && title.length) {
    // simple text overlay; URL-encode the text
    const txt = encodeURIComponent(title.replace(/\s+/g, ' '))
    // default font fallback; adjust size if long
    const size = Math.min(60, Math.max(36, Math.floor(1200 / Math.max(10, Math.ceil(title.length / 10)))))
    transformations.push(`l_text:Arial_${size}_bold:${txt},g_south,y_30`) // place near bottom
    // add background to make text readable
    // Note: complex overlays may require custom Cloudinary setup
  }

  const t = transformations.join(',')
  return `${base.prefix}${t}/${base.rest}`
}

export default getOgImage
