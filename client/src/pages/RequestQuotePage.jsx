import React, { useEffect } from 'react'; // ⭐ Added useEffect for scroll logic
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import { ClipboardList, ShieldCheck, Zap, Globe, BarChart3 } from 'lucide-react';

const RequestQuotePage = () => {
  // ⭐ NEW: Force page to move to top when initialized
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>Request Quote | Farmliv Industries Hub</title>
        <meta name="description" content="Request a detailed quote for bulk agricultural products. Competitive pricing, fast turnaround, and custom solutions available." />
      </Helmet>

      <div className="min-h-screen bg-white font-sans">
        <Header />

        <main className="pt-32 sm:pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* --- Elite Hero Section --- */}
            <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
              <div className="inline-flex items-center justify-center p-4 bg-green-50 rounded-[2rem] mb-4 border border-green-100 shadow-sm">
                <ClipboardList className="w-10 h-10 text-[#2E7D32]" />
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-black text-[#2E7D32] uppercase tracking-[0.5em]">Global Inquiry Protocol</p>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                  Request <span className="text-[#2E7D32]">Quote</span>
                </h1>
              </div>

              <p className="text-sm sm:text-lg text-gray-500 leading-relaxed font-medium max-w-2xl mx-auto italic">
                Initialize a custom procurement node. Our trade specialists will analyze your requirements and provide a strategic valuation within 24 hours.
              </p>
            </div>

            {/* --- Form Deployment Zone --- */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-50 p-2 sm:p-4 relative overflow-hidden">
                  {/* Subtle Background Node Decor */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
                  
                  {/* ⭐ QuoteForm is responsible for handling 500 error & backend sync */}
                  <QuoteForm />
                </div>
            </div>

            {/* --- Farmliv Trust Network --- */}
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                  <ShieldCheck className="w-6 h-6 text-[#2E7D32] mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-gray-900 uppercase text-xs tracking-widest">ISO 9001:2026</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Certified Farmliv Unit</p>
                </div>
                
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                  <Zap className="w-6 h-6 text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-gray-900 uppercase text-xs tracking-widest">24h Response</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">High Speed Sync</p>
                </div>
                
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                  <BarChart3 className="w-6 h-6 text-[#2E7D32] mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Bulk Pricing</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Strategic Valuation</p>
                </div>
                
                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 transition-all hover:bg-white hover:shadow-xl group">
                  <Globe className="w-6 h-6 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Global Logistics</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Worldwide Deployment</p>
                </div>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RequestQuotePage;