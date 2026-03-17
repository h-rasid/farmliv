import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// ES Modules ke liye __dirname ko define karna padta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  // Hostinger par refresh problem se bachne ke liye base path '/' rakhein
  base: '/', 
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