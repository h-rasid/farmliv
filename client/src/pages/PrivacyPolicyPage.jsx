import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, FileText, UserCheck, Bell } from 'lucide-react';
import { m as motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as when you request a quote, contact us for support, or subscribe to our newsletter. This includes your name, email address, phone number, and company details.'
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: 'We implement robust security measures including encryption and secure servers to protect your personal information from unauthorized access, alteration, or disclosure.'
    },
    {
      icon: UserCheck,
      title: 'Usage of Information',
      content: 'Your information is used strictly to provide our agricultural solutions, process transactions, and communicate important updates regarding our services and products.'
    },
    {
      icon: Shield,
      title: 'Data Sharing',
      content: 'Farmliv Industries does not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website and conducting our business.'
    },
    {
      icon: Bell,
      title: 'Cookies Policy',
      content: 'We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Farmliv Industries</title>
        <meta name="description" content="Privacy Policy of Farmliv Industries. Learn how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://farmliv.com/privacy-policy" />
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
                Privacy Policy
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.6 }} 
                className="text-lg text-green-100 max-w-2xl mx-auto"
              >
                Your privacy is our priority. Learn how Farmliv Industries handles your data with transparency and care.
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
                    Consent and Updates
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    By using our website, you consent to our privacy policy. We reserve the right to update this policy at any time. Any changes will be posted on this page with an updated modification date.
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

export default PrivacyPolicyPage;
