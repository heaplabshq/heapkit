import { tools } from '../src/tools/registry'

const baseUrl = 'https://kit.heaplabs.dev'

const urls = tools.map((tool) => ({
  url: baseUrl + '/' + tool.slug,
  changefreq: 'monthly' as const,
  priority: 0.8 as number,
}))

// Add home page
urls.unshift({
  url: baseUrl,
  changefreq: 'monthly' as const,
  priority: 1.0 as number,
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (item) => '  <url>\n    <loc>' + item.url + '</loc>\n    <changefreq>' + item.changefreq + '</changefreq>\n    <priority>' + item.priority + '</priority>\n  </url>'
    )
    .join('\n')}
</urlset>`

import { writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const __filename = import.meta.url
const __dirname = new URL('.', __filename).pathname

await writeFile(import.meta.dirname + '/../dist/sitemap.xml', xml)

console.log('Sitemap generated successfully')