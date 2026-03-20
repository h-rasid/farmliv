import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ArrowLeft, Mail, Phone, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ThankYouPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Thank You | Farmliv Industries</title>
        <meta name="description" content="Thank you for your enquiry. Our team will get back to you shortly." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
          <div className="max-w-3xl w-full text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-900/10"
            >
              <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                Thank <span className="text-[#2E7D32]">You!</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto italic leading-relaxed uppercase">
                THANK YOU FOR CONTACTING US! WE WILL GET IN TOUCH WITH YOU SHORTLY
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 py-8 border-y border-gray-200">
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <Mail className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Hub</p>
                    <p className="font-bold text-sm">sales@farmliv.com</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <Phone className="w-5 h-5 text-[#2E7D32]" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Direct Support</p>
                    <p className="font-bold text-sm">+91 91813 95595</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Link
                  to="/"
                  className="w-full sm:w-auto px-10 py-5 bg-[#2E7D32] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-900/20 hover:bg-gray-900 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <Home size={16} /> Back to Home
                </Link>
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border border-gray-200 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  View More Products <ArrowLeft size={16} className="rotate-180" />
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ThankYouPage;
