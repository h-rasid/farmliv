import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// ES Modules ke liye __dirname ko define karna padta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to defer CSS loading
function deferCssPlugin() {
  return {
    name: 'defer-css',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      
      // Replace synchronous stylesheet link injected by Vite with preload
      return html.replace(
        /<link\s([^>]*?)rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*?)>/gi,
        (match, prefix1, prefix2, href, suffix) => {
          // Construct the attributes string, excluding rel and href which we handle explicitly
          const attrs = (prefix1 + prefix2 + suffix).trim().replace(/\s+/g, ' ');
          
          return [
            `<link rel="preload" as="style" href="${href}" ${attrs}>`,
            `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" ${attrs}>`,
            `<noscript><link rel="stylesheet" href="${href}" ${attrs}></noscript>`
          ].join('\n    ');
        }
      );
    }
  };
}

export default defineConfig({
  plugins: [react(), deferCssPlugin()],
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