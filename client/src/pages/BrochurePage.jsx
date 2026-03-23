import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Download, Eye, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ✅ Replace this URL with your actual Cloudinary PDF URL
const CATALOG_PDF_URL = 'https://res.cloudinary.com/dik8mlsie/image/upload/v1/Farmliv_Brochure_cg40zq.pdf';

const BrochurePage = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  return (
    <>
      <Helmet>
        <title>Product Catalog & Brochure - Farmliv Industries</title>
        <meta name="description" content="Download or view Farmliv Industries' product catalog. Explore our complete range of premium B2B agricultural solutions including shade nets, polyfilms, weed mats and more." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Banner */}
        <section className="pt-28 pb-12 bg-gradient-to-br from-[#0F2510] via-[#1B5E20] to-[#2E7D32] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          </div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center text-white"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Product Catalog 2025
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display'] leading-tight mb-4">
                Our Product Brochure
              </h1>
              <p className="text-lg sm:text-xl text-green-100/80 max-w-2xl mx-auto font-['Poppins'] font-light">
                Explore our complete range of premium B2B agricultural solutions. View online or download for offline access.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <a
                  href={CATALOG_PDF_URL}
                  download="Farmliv-Industries-Catalog.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-[#1B5E20] hover:bg-green-50 px-8 py-4 rounded-sm font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-1 group"
                >
                  <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                  Download PDF
                </a>
                <button
                  onClick={() => { setIsFullscreen(true); document.documentElement.requestFullscreen?.(); }}
                  className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-sm font-bold text-sm tracking-widest uppercase backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group"
                >
                  <Eye className="w-5 h-5" />
                  View Fullscreen
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PDF Viewer */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold tracking-wide">Farmliv Industries — Product Catalog 2025.pdf</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={CATALOG_PDF_URL}
                  download="Farmliv-Industries-Catalog.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </div>
            </div>

            {/* Iframe PDF Viewer */}
            <div className="relative w-full bg-gray-100" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
              {!pdfError ? (
                <>
                  {!pdfLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                      <div className="w-14 h-14 border-4 border-[#2E7D32]/20 border-t-[#2E7D32] rounded-full animate-spin mb-4" />
                      <p className="text-gray-500 text-sm font-medium">Loading catalog...</p>
                    </div>
                  )}
                  <iframe
                    src={`${CATALOG_PDF_URL}#toolbar=0&navpanes=0&scrollbar=1`}
                    title="Farmliv Product Catalog"
                    className="w-full h-full border-0"
                    onLoad={() => setPdfLoaded(true)}
                    onError={() => setPdfError(true)}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Cannot Display PDF Inline</h3>
                  <p className="text-gray-500 mb-6 max-w-md">
                    Your browser doesn't support inline PDF viewing. Please download the file to view it.
                  </p>
                  <a
                    href={CATALOG_PDF_URL}
                    download="Farmliv-Industries-Catalog.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#1B5E20] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Instead
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm mb-4">Need a custom quote or have questions about any product?</p>
            <a
              href="/request-quote"
              className="inline-flex items-center gap-2 bg-[#2E7D32] text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-[#1B5E20] transition-colors"
            >
              Request a Quote
            </a>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BrochurePage;
