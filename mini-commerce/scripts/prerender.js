import fs from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'
import { chromium } from 'playwright-chromium'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DIST_DIR = path.join(__dirname, '..', 'dist')
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml')
const PREVIEW_PORT = process.env.PREVIEW_PORT || '4173'
const BASE_URL = `http://127.0.0.1:${PREVIEW_PORT}`

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function readSitemapUrls () {
  const xml = await fs.readFile(SITEMAP_PATH, 'utf8')
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(match => match[1].trim())
}

async function startPreviewServer () {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx'
    const preview = spawn(command, ['vite', 'preview', '--host', '127.0.0.1', '--port', PREVIEW_PORT], {
      cwd: path.join(path.dirname(new URL(import.meta.url).pathname), '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    preview.stdout.on('data', (data) => {
      const line = data.toString()
      if (line.includes('Local:')) {
        resolve(preview)
      }
    })

    preview.stderr.on('data', (data) => {
      console.error(data.toString())
    })

    preview.on('error', (err) => reject(err))
    preview.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Preview server exited with code ${code}`))
      }
    })
  })
}

async function waitForServer () {
  const start = Date.now()
  while (Date.now() - start < 20000) {
    try {
      const res = await fetch(`${BASE_URL}/`)
      if (res.ok) return
    } catch {
      await wait(400)
    }
  }
  throw new Error('Preview server did not start within 20 seconds')
}

async function writeSnapshot (route, html) {
  const pathname = new URL(route).pathname
  const targetDir = pathname === '/' ? DIST_DIR : path.join(DIST_DIR, pathname)
  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(path.join(targetDir, 'index.html'), html, 'utf8')
}

async function prerender () {
  const urls = await readSitemapUrls()
  if (!urls.length) {
    console.warn('No URLs found in sitemap; skipping prerender')
    return
  }

  console.log('Starting Vite preview server for prerender...')
  const preview = await startPreviewServer()
  await waitForServer()
  console.log('Preview server running at', BASE_URL)

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    for (const url of urls) {
      const route = new URL(url).pathname
      const snapshotUrl = `${BASE_URL}${route}`
      console.log('Prerendering', snapshotUrl)
      await page.goto(snapshotUrl, { waitUntil: 'networkidle' })
      const html = await page.content()
      await writeSnapshot(url, html)
    }
  } finally {
    await browser.close()
    preview.kill('SIGINT')
  }

  console.log('Prerender complete. Static snapshots written to dist/')
}

prerender().catch((error) => {
  console.error('Prerender failed:', error)
  process.exit(1)
})
