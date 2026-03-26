import React, { useState } from 'react'; // ⭐ Added useState
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, CheckCircle2, FileCheck, Shield, ZoomIn, Star, Landmark, X } from 'lucide-react'; // ⭐ Added X icon
import { m as motion, AnimatePresence } from 'framer-motion';
import LazyImage from '@/components/ui/LazyImage';

const CertificationPage = () => {
  // ⭐ NEW: State to handle zooming
  const [selectedImage, setSelectedImage] = useState(null);

  const certifications = [
    {
      icon: Award,
      title: 'ISO 9001:2015',
      description: 'Formal Quality Management System certification validating consistent quality standards in our agricultural textile manufacturing.',
      year: '2026', 
      image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771568450/IMG_6505.JPG_amorvm.jpg'
    },
    {
      icon: Landmark, 
      title: 'DPIIT Recognition',
      description: 'Official Certificate of Recognition by the Department for Promotion of Industry and Internal Trade as an innovative Agri-startup.',
      year: '2024',
      image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771580990/6_lkskum.png' 
    },
    {
      icon: Star, 
      title: 'ZED Certification',
      description: 'Bronze level certification under MSME Sustainable scheme for high quality production with Zero Defect & Zero Effect.',
      year: '2025',
      image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1771580951/7_azlzsl.png' 
    },
  ];

  const qualityStandards = [
    'Rigorous quality control at every production stage', 
    'Regular third party audits and inspections', 
    'Advanced testing laboratories', 
    'Compliance with international standards', 
    'Continuous improvement programs', 
    'Traceability systems for all products'
  ];

  return (
    <>
      <Helmet>
        <title>Official Certifications | Farmliv Industries | ISO 9001 & ZED Certified</title>
        <meta name="description" content="Certificate of Farmliv Industries including ISO 9001:2015, DPIIT Startup Recognition, and MSME ZED Bronze certification." />
        <link rel="canonical" href="https://farmliv.com/certification" />
      </Helmet>

      {/* ⭐ NEW: Image Zoom Modal (Lightbox) */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button 
              className="absolute top-10 right-10 text-white hover:rotate-90 transition-transform"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage} 
              alt="Certificate Zoom"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white font-sans">
        <Header />
        
        <main className="pt-32 pb-16">
          {/* Hero Section */}
          <section className="py-20 bg-[#2E7D32] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                OUR  <span className="text-green-200">CERTIFICATION</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-xl max-w-2xl mx-auto opacity-90 font-medium">
                Verified and recognized by global standards and the Government of India for excellence in agricultural manufacturing.
              </motion.p>
            </div>
          </section>

          {/* Certifications Grid */}
          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {certifications.map((cert, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1, duration: 0.5 }} 
                    className="flex flex-col"
                  >
                    {/* --- Frame Design with Click to Zoom --- */}
                    <div 
                      onClick={() => setSelectedImage(cert.image)}
                      className="relative aspect-[3/4] bg-gray-50 rounded-lg border-2 border-gray-100 p-4 shadow-sm group hover:shadow-xl hover:border-[#2E7D32]/30 transition-all duration-500 mb-8 cursor-zoom-in"
                    >
                      <div className="w-full h-full bg-white overflow-hidden rounded shadow-inner flex items-center justify-center p-3 relative">
                        <LazyImage 
                          src={cert.image} 
                          alt={cert.title} 
                          className="w-full h-full"
                          imgClassName="certificate-img"
                          aspectRatio="3/4"
                          objectFit="contain"
                          fullHeight={true}
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                      </div>
                      {/* Zoom Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="bg-white/90 p-3 rounded-full shadow-lg text-[#2E7D32]">
                            <ZoomIn size={24} className="animate-pulse" />
                         </div>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#2E7D32] rounded-lg">
                          <cert.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#2E7D32] bg-[#2E7D32]/10 px-3 py-1 rounded-full">
                          Issued {cert.year}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tighter">{cert.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{cert.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Quality Standards */}
          <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter">Manufacturing <span className="text-[#2E7D32]">Excellence</span></h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {qualityStandards.map((standard, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#2E7D32] mt-0.5" />
                        <span className="text-sm text-gray-700 font-bold leading-tight">{standard}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                  <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white">
                    <LazyImage src="https://res.cloudinary.com/dik8mlsie/image/upload/v1771483790/Shadenet7_mt70ge.webp" alt="Farmliv Quality Inspection" className="w-full h-full" aspectRatio="4/3" sizes="(max-width: 1024px) 100vw, 600px" />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-[#2E7D32] text-white p-8 rounded-[2rem] shadow-xl">
                    <FileCheck size={40} />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CertificationPage;

