import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configure your API endpoint that returns product slugs or products
const API_URL = process.env.API_URL || 'http://localhost:5000'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml')

async function fetchProductSlugs () {
  try {
    // Try common endpoints
    const endpoints = ['/products', '/products/slugs', '/api/products', '/api/products/slugs']
    for (const ep of endpoints) {
      try {
        const res = await axios.get(`${API_URL}${ep}`)
        if (res && res.data) {
          // Attempt to extract an array of products or slugs
          const data = res.data
          if (Array.isArray(data)) return data
          if (Array.isArray(data.products)) return data.products
        }
      } catch (err) {
        // ignore and try next
      }
    }
  } catch (err) {
    return []
  }
  return []
}

function buildUrlset (baseUrl, routes) {
  const urls = []
  urls.push({ loc: baseUrl, changefreq: 'daily', priority: '1.0' })
  urls.push({ loc: `${baseUrl}/shop`, changefreq: 'daily', priority: '0.9' })
  for (const r of routes) {
    const slug = r.slug || r._id || r
    urls.push({ loc: `${baseUrl}/product/${slug}`, changefreq: 'weekly', priority: '0.8' })
  }
  return urls
}

function toXml (urls) {
  const parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ]
  for (const u of urls) {
    parts.push('  <url>')
    parts.push(`    <loc>${u.loc}</loc>`)
    if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`)
    if (u.priority) parts.push(`    <priority>${u.priority}</priority>`)
    parts.push('  </url>')
  }
  parts.push('</urlset>')
  return parts.join('\n')
}

;(async () => {
  console.log('Generating sitemap...')
  const baseUrl = process.env.SITE_URL || 'https://minkaluxury.com'
  const products = await fetchProductSlugs()
  const urls = buildUrlset(baseUrl, products || [])
  const xml = toXml(urls)
  fs.writeFileSync(OUTPUT, xml, 'utf8')
  console.log('Sitemap written to', OUTPUT)
})()
