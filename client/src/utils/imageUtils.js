/**
 * Cloudinary URLs ko optimize karne ke liye utility function.
 * f_auto: Best format (WebP/AVIF) select karta hai.
 * q_auto: Automatic quality compression deta hai.
 * w: Image ki width set karta hai.
 */
export const getOptimizedCloudinaryUrl = (url, width) => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Agar URL mein pehle se transformations hain, toh unhe handle karein
  if (url.includes('/upload/')) {
    const parts = url.split('/upload/');
    const transformation = `f_auto,q_auto${width ? `,w_${width},c_limit` : ''}`;
    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
  }

  return url;
};
