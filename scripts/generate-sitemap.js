import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to normalize any input URL
function normalizeBaseUrl(inputUrl) {
  let url = (inputUrl || '').trim();
  if (!url) return 'https://ai-guardian-angel.app';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, '');
}

const rawEnvUrl = process.env.SITE_URL || 
                  process.env.VITE_SITE_URL || 
                  process.env.VERCEL_PROJECT_PRODUCTION_URL || 
                  process.env.VERCEL_URL || 
                  'https://ai-guardian-angel.app';

const SITE_URL = normalizeBaseUrl(rawEnvUrl);

// List of all site routes to index
const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '#blogs', priority: '0.8', changefreq: 'weekly' }
];

const today = new Date().toISOString().split('T')[0];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const robotsContent = `# Robots.txt for AI Guardian Angel
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);

console.log(`✅ Successfully generated robust sitemap.xml and robots.txt for domain: ${SITE_URL}`);
