import React, { useEffect } from 'react'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://minkaluxury.com'

function upsertMeta (selector, tagName, attrs = {}) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement(tagName)
    if (selector.startsWith('link[rel="canonical"]')) {
      document.head.appendChild(el)
    } else {
      document.head.appendChild(el)
    }
  }
  Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]))
  return el
}

const normalizeImage = (img) => {
  if (!img) return null
  if (img.startsWith('http')) return img
  if (img.startsWith('/')) return `${SITE_URL}${img}`
  return `${SITE_URL}/${img}`
}

const SEO = ({ title, description, image, url, canonical, structuredData, twitterHandle = '@minkaluxuryhair' }) => {
  useEffect(() => {
    if (title) document.title = title
    if (description) upsertMeta('meta[name="description"]', 'meta', { name: 'description', content: description })
    if (canonical) upsertMeta('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical })

    // Open Graph
    if (title) upsertMeta('meta[property="og:title"]', 'meta', { property: 'og:title', content: title })
    if (description) upsertMeta('meta[property="og:description"]', 'meta', { property: 'og:description', content: description })
    if (url) upsertMeta('meta[property="og:url"]', 'meta', { property: 'og:url', content: url })
    upsertMeta('meta[property="og:type"]', 'meta', { property: 'og:type', content: 'website' })

    // Twitter
    upsertMeta('meta[name="twitter:card"]', 'meta', { name: 'twitter:card', content: 'summary_large_image' })
    if (twitterHandle) upsertMeta('meta[name="twitter:site"]', 'meta', { name: 'twitter:site', content: twitterHandle })
    if (twitterHandle) upsertMeta('meta[name="twitter:creator"]', 'meta', { name: 'twitter:creator', content: twitterHandle })

    // Image
    if (image) {
      const img = normalizeImage(image)
      upsertMeta('meta[property="og:image"]', 'meta', { property: 'og:image', content: img })
      upsertMeta('meta[name="twitter:image"]', 'meta', { name: 'twitter:image', content: img })
    }

    // Structured data
    if (structuredData) {
      let el = document.getElementById('seo-jsonld')
      if (!el) {
        el = document.createElement('script')
        el.type = 'application/ld+json'
        el.id = 'seo-jsonld'
        document.head.appendChild(el)
      }
      el.text = JSON.stringify(structuredData)
    }
  }, [title, description, image, url, canonical, structuredData, twitterHandle])

  return null
}

export default SEO
