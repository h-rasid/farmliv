import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { m as motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    const newMessage = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    existingMessages.push(newMessage);
    localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
    
    toast({
      title: "Message Sent Successfully",
      description: "Our team will respond to your inquiry within 24 hours.",
      className: "bg-[#2E7D32] text-white border-none"
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: ['+91 XXXXX XXXXX', '+91 91814 09182'],
      link: 'tel:+91XXXXXXXXXX',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['sales@farmliv.com', 'support@farmliv.com'],
      link: 'mailto:sales@farmliv.com',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: MapPin,
      title: 'Our Locations',
      details: [
        { label: 'Unit 1', address: '1st Floor Farmliv Industries, Queens Arcade, Tangni Chariali, Darrang. Pin 784146' },
        { label: 'Unit 2', address: 'A-7, Pushkar Industrial Hub, Opp. Gayatri Exotik, Lambha, Ahmedabad. Pin 382405' }
      ],
      link: null,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Sat: 09:30 AM - 06:30 PM', 'Sun: Closed'],
      link: null,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent focus:bg-white transition-all duration-300 outline-none text-gray-900";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5 font-['Poppins']";

  return (
    <>
      <Helmet>
        <title>Contact Farmliv Industries - Get in Touch | Request Quote & Support</title>
        <meta name="description" content="Contact Farmliv Industries for product inquiries, quotes, and support. Phone: +91 XXXXX XXXXX, Email: sales@farmliv.com. We respond within 24 hours." />
        <link rel="canonical" href="https://farmliv.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        
        <main className="pt-32 pb-24">
          <section className="relative py-20 bg-[#1A1A1A] text-white overflow-hidden rounded-3xl mx-4 mb-20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] opacity-90" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
            
            <div className="relative max-w-7xl mx-auto px-4 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl font-black font-['Playfair_Display'] mb-6 tracking-tight"
              >
                Get in Touch
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-green-100 max-w-2xl mx-auto font-light"
              >
                Have questions about our products or need a custom solution? 
                Our team is here to help you grow.
              </motion.p>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="max-w-7xl mx-auto px-4 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${info.color} rounded-xl flex items-center justify-center mb-6`}>
                    <info.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 font-['Playfair_Display']">{info.title}</h3>
                  <div className="space-y-3">
                    {info.details.map((detail, idx) => (
                      <div key={idx} className="text-gray-600 text-sm leading-relaxed">
                        {/* Logic to handle bold labels for Locations */}
                        {typeof detail === 'object' ? (
                          <p>
                            <span className="font-bold text-gray-900 block mb-0.5">{detail.label}:</span>
                            {detail.address}
                          </p>
                        ) : (
                          /* Standard logic for Phone, Email, and Hours */
                          info.link && idx === 0 ? (
                            <a href={info.link} className="hover:text-[#2E7D32] transition-colors font-medium border-b border-transparent hover:border-[#2E7D32]">
                              {detail}
                            </a>
                          ) : (
                            detail
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          <section className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Send us a Message</h2>
                <p className="text-gray-500 mb-8">Fill out the form below and we'll get back to you shortly.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}>Your Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClasses}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>
                    <div>
                      <label className={labelClasses}>Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`${inputClasses} resize-none`}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2E7D32] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1B5E20] transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"
                    alt="Farmliv Industries Headquarters"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-[#1A1A1A] p-8 rounded-3xl text-white shadow-xl">
                  <h3 className="text-2xl font-bold mb-6 font-['Playfair_Display']">Why Partner with Us?</h3>
                  <ul className="space-y-4">
                    {[
                      'Direct manufacturer pricing',
                      'ISO 9001:2015 Quality Assurance',
                      'Custom specifications available',
                      'Global shipping & logistics',
                      'Dedicated account support'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <div className="w-6 h-6 rounded-full bg-[#2E7D32] flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;

