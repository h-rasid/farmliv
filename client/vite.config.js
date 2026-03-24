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
      // Replace synchronous stylesheet link injected by Vite with preload
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

      // 2. Preload Main Script & Assets (Move ALL to TOP of head for maximum priority)
      const scriptMatch = modifiedHtml.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
      const modulePreloads = [];
      
      // Collect all existing modulepreloads and remove them from their original positions
      modifiedHtml = modifiedHtml.replace(/<link rel="modulepreload"[^>]+>\s*/g, (match) => {
        modulePreloads.push(match.trim());
        return '';
      });

      // Add the main entry script to preloads if not already there
      if (scriptMatch) {
        const scriptUrl = scriptMatch[1];
        const mainPreload = `<link rel="modulepreload" crossorigin href="${scriptUrl}">`;
        if (!modulePreloads.some(p => p.includes(scriptUrl))) {
           modulePreloads.unshift(mainPreload);
        }
      }

      // Re-insert ALL modulepreloads at the very top of <head>
      if (modulePreloads.length > 0) {
        modifiedHtml = modifiedHtml.replace('<head>', `<head>\n  ${modulePreloads.join('\n  ')}`);
      }

      // 3. Move Preconnects to top too (Before preloads)
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
  // Hostinger par refresh problem se bachne ke liye base path './' rakhein taaki assets relative load hon
  base: './', 
  resolve: {
    alias: {
      // Ab "@" sahi se "src" folder ko point karega
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Yeh local development ke liye hai
      '/api': {
        // Jab aap Hostinger par Node.js setup karenge, 
        // toh localhost:5000 hi backend ka default port rahega
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Build folder ka naam 'dist' hi rehne dein kyunki Hostinger ise asani se pehchanta hai
    outDir: 'dist',
    /* ⭐ Performance Optimization: Large libraries ko separate chunks mein divide kiya gaya hai taaki initial load fast ho */
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['framer-motion', 'lucide-react'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})