import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, AlertTriangle, FileText, Scale, UserPlus, Info } from 'lucide-react';
import { m as motion } from 'framer-motion';

const DisclaimerPage = () => {
  const sections = [
    {
      icon: Scale,
      title: 'General Limitation of Liability',
      content: 'Farmliv Industries provides agricultural products and information on an "as-is" basis. We are not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our products or website.'
    },
    {
      icon: AlertTriangle,
      title: 'Agricultural Results Variance',
      content: 'Agricultural yields and results depend on a wide range of factors including climate, soil quality, and implementation methods. We provide estimated results for our products, but these are not guaranteed for every individual case.'
    },
    {
      icon: UserPlus,
      title: 'Professional Advice Disclaimer',
      content: 'The information provided on this website is for general informational purposes only and does not constitute professional agricultural or financial advice. We recommend consulting with local agricultural experts before making significant investments.'
    },
    {
      icon: Info,
      title: 'Product Availability',
      content: 'While we strive to keep our product information up to date, Farmliv Industries reserves the right to modify, replace, or discontinue products at any time without prior notice based on manufacturing and logistics availability.'
    },
    {
      icon: Shield,
      title: 'Third Party Links',
      content: 'Our website may contain links to external sites not operated by us. We have no control over the content or practices of these sites and cannot accept responsibility or liability for their respective privacy policies.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Disclaimer | Farmliv Industries</title>
        <meta name="description" content="Disclaimer for Farmliv Industries. Understand the terms, limitations of liability, and professional advice disclaimers." />
        <link rel="canonical" href="https://farmliv.com/disclaimer" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-32 pb-20">
          {/* Header Section */}
          <section className="py-16 bg-[#2E7D32] text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }} 
                className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter"
              >
                Disclaimer
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.6 }} 
                className="text-lg text-green-100 max-w-2xl mx-auto"
              >
                Important terms and conditions regarding our agricultural solutions and information.
              </motion.p>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-20">
            <div className="max-w-5xl mx-auto px-4">
              <div className="grid grid-cols-1 gap-12">
                {sections.map((section, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start"
                  >
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
                      <section.icon className="w-8 h-8 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                        {section.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-green-50 p-8 rounded-3xl border border-green-100 mt-8"
                >
                  <h2 className="text-2xl font-bold text-[#2E7D32] mb-4 tracking-tight flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    By using this website, you signify your acceptance of this disclaimer. If you do not agree with any part of this disclaimer, you must not use our website.
                    <br /><br />
                    <strong>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</strong>
                  </p>
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

export default DisclaimerPage;
