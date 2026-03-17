const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'client/dist');
const indexPath = path.join(distPath, 'index.html');
const assetsPath = path.join(distPath, 'assets');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at', indexPath);
  process.exit(1);
}

let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Find the main CSS file in assets
const files = fs.readdirSync(assetsPath);
const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'));

if (cssFile) {
  const cssPath = path.join(assetsPath, cssFile);
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  console.log(`Inlining ${cssFile} (~${(cssContent.length / 1024).toFixed(2)} KB)...`);
  
  // Create a style tag with the content
  const styleTag = `<style data-inlined="true">${cssContent}</style>`;
  
  // Replace the link tag that points to this CSS file
  // Vite usually formats it as <link rel="stylesheet" crossorigin href="/assets/index-HASH.css">
  const linkRegex = new RegExp(`<link[^>]+href="[^"]*${cssFile}"[^>]*>`, 'g');
  
  if (linkRegex.test(indexHtml)) {
    indexHtml = indexHtml.replace(linkRegex, styleTag);
    console.log('✅ Main CSS successfully inlined.');
  } else {
    // Fallback: search for any link rel="stylesheet" that looks like the vite one
    const genericLinkRegex = /<link rel="stylesheet" crossorigin href="\/assets\/index-[^"]+\.css">/;
    if (genericLinkRegex.test(indexHtml)) {
        indexHtml = indexHtml.replace(genericLinkRegex, styleTag);
        console.log('✅ Main CSS successfully inlined (fallback match).');
    } else {
        // Last resort: prepend to head
        indexHtml = indexHtml.replace('</head>', `${styleTag}</head>`);
        console.log('⚠️ Link tag not found, prepended to </head> instead.');
    }
  }

  // Optional: Remove the physical CSS file to save space (since it's inlined)
  // fs.unlinkSync(cssPath); 
} else {
  console.warn('No main index-*.css file found to inline.');
}

fs.writeFileSync(indexPath, indexHtml);
console.log('Build optimization: CSS Inlining complete.');
