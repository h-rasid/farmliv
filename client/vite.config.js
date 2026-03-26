import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// ES Modules ke liye __dirname ko define karna padta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to defer CSS and preload critical scripts
function optimizationPlugin() {
  return {
    name: 'optimization-plugin',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      
      let modifiedHtml = html;

      // 1. Defer CSS
      modifiedHtml = modifiedHtml.replace(
        /<link\s([^>]*?)rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*?)>/gi,
        (match, prefix1, prefix2, href, suffix) => {
          const attrs = (prefix1 + prefix2 + suffix).trim().replace(/\s+/g, ' ');
          return [
            `<link rel="preload" as="style" href="${href}" ${attrs}>`,
            `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" ${attrs}>`,
            `<noscript><link rel="stylesheet" href="${href}" ${attrs}></noscript>`
          ].join('\n    ');
        }
      );

      // 2. Preload Main Script & Assets
      const scriptMatch = modifiedHtml.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
      const modulePreloads = [];
      
      modifiedHtml = modifiedHtml.replace(/<link rel="modulepreload"[^>]+>\s*/g, (match) => {
        modulePreloads.push(match.trim());
        return '';
      });

      if (scriptMatch) {
        const scriptUrl = scriptMatch[1];
        const mainPreload = `<link rel="modulepreload" crossorigin href="${scriptUrl}">`;
        if (!modulePreloads.some(p => p.includes(scriptUrl))) {
           modulePreloads.unshift(mainPreload);
        }
      }

      if (modulePreloads.length > 0) {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>\n  ${modulePreloads.join('\n  ')}`);
      }

      // 3. Move Preconnects to top
      const preconnects = [];
      modifiedHtml = modifiedHtml.replace(/<link rel="preconnect"[^>]+>\s*/g, (match) => {
        const cleaned = match.trim();
        if (!preconnects.includes(cleaned)) preconnects.push(cleaned);
        return '';
      });
      if (preconnects.length > 0) {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>\n  ${preconnects.join('\n  ')}`);
      }

      return modifiedHtml;
    }
  };
}

export default defineConfig({
  plugins: [react(), optimizationPlugin()],
  base: './', 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-core';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('lucide-react')) return 'vendor-icons';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})