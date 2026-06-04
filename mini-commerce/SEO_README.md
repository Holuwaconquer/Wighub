SEO & Production Checklist

1. Automated sitemap
- `npm run generate-sitemap` fetches product slugs and writes `public/sitemap.xml`.
- Add this script to your CI (run before deploy). Use `npm run build:seo` to generate sitemap then build.

2. Robots
- `public/robots.txt` points to `sitemap.xml` and allows crawling.

3. Dynamic meta
- `src/components/SEO.jsx` centralizes meta tags and JSON-LD using a lightweight imperative implementation (no external head library required). App no longer needs `HelmetProvider`.
- Pages use `SEO` (homepage, shop, product details, category).

4. OG images
- `src/utils/og.js` will convert Cloudinary URLs to resized 1200x630 variants automatically. If images are stored on Cloudinary, OG images will be generated on the fly via Cloudinary transformation URLs.
- If you host images elsewhere, consider using Cloudinary or an image-processing service for consistent OG images.

5. Prerendering / SSR (recommended)
- For best SEO on SPAs, implement SSR or prerendering for key pages (home, shop, product pages). Recommended approaches:
  - Vite SSR (`vite-plugin-ssr`) — full SSR solution.
  - Prerender plugin (`vite-plugin-prerender-spa`) — prerender static routes at build-time.
- This project now supports build-time prerendering via `npm run prerender` after `npm run build`.
- In CI: run `npm run build:seo`, which executes `generate-sitemap`, `build`, and `prerender`.

6. Environment variables
- Add these to Vercel Dashboard under Project Settings > Environment Variables:
  - `VITE_SITE_URL` = `https://minkaluxury.com`
  - `API_URL` = your backend API base URL (used by `generate-sitemap`)
- Keep Cloudinary secrets out of source control. Use `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` only in backend environment configuration, not in the frontend repo.

7. Submit sitemap
- Submit `https://your-site/sitemap.xml` to Google Search Console & Bing Webmaster.

7. Monitoring
- Use Google Search Console to monitor crawl errors, indexing status, and performance.

8. Additional improvements
- Generate per-product OpenGraph images with product name overlay (Cloudinary or a worker). Helpful for improved CTR.
- Add `hreflang` if targeting multiple languages.
- Implement structured data for Reviews, BreadcrumbList, and Organization contact points where applicable.

