import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Target, Users, TrendingUp, Globe, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
const AboutPage = () => {
  const values = [{
    icon: Award,
    title: 'Quality Excellence',
    description: 'ISO certified manufacturing processes ensuring consistent product quality'
  }, {
    icon: Shield,
    title: 'Reliability',
    description: 'Your trusted partner for business solutions'
  }, {
    icon: Target,
    title: 'Customer Focus',
    description: 'Dedicated support and customized solutions for your unique needs'
  }, {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving clients across continents with efficient logistics'
  }];
  return <>
      <Helmet>
        <title>About Farmliv Industries - ISO Certified Manufacturer</title>
        <meta name="description" content="Learn about Farmliv Industries' commitment to quality agricultural products. ISO certified manufacturer with 5 years experience, serving 5000 clients worldwide." />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        <main className="pt-32 pb-16">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-[#2E7D32] to-[#1b5e20] text-white">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="text-5xl font-bold mb-6">About Farmliv Industries</motion.h1>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2,
              duration: 0.6
            }} className="text-xl max-w-3xl mx-auto">
                Your Trusted Partner in Premium Agricultural Solutions.
              </motion.p>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{
                opacity: 0,
                x: -30
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.6
              }}>
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">Welcome to Farmliv Industries, where we are redefining the landscape of modern farming through high-performance agricultural solutions. Our journey began with a singular focus: to bridge the gap between traditional farming practices and the demands of modern global agriculture.</p>
                  <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                    The Seed of Innovation
                    <br />Rooted in Darrang, Assam, Farmliv Industries was founded on the principles of sustainability, durability, and efficiency. We recognized that for farmers to thrive in today’s competitive market, they need tools that protect their crops, manage resources like water effectively, and optimize yields. This realization led us to develop our premium range of products, from Weed Control Mats to Greenhouse Materials and Mulch & Films.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Engineered for Excellence
                    <br />Our story is one of relentless engineering. Every product in the Farmliv catalog is a Certified Asset Node, meaning it has undergone rigorous quality checks to meet global standards like ISO 14001:2015, ISO 22000:2018, ISO 45001:2018, ISO 50001:2018. We don’t just sell products; we provide engineered solutions. Whether it's high GSM weed mats for effective soil suppression or durable shade nets for climate control, our technology is built to last.
                  </p>
                </motion.div>

                <motion.div initial={{
                opacity: 0,
                x: 30
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.6
              }} className="grid grid-cols-2 gap-4">
                  <img src="https://res.cloudinary.com/dik8mlsie/image/upload/v1771483748/Polyfilm3_w5seiz.webp" alt="Modern agricultural manufacturing facility" className="rounded-xl shadow-lg" />
                  <img src="https://res.cloudinary.com/dik8mlsie/image/upload/v1771483748/Polyfilm4_sc2eyg.webp" alt="Quality control in agricultural production" className="rounded-xl shadow-lg mt-8" />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }} className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 30
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1,
                duration: 0.5
              }} className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2E7D32] rounded-full mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>)}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5
              }}>
                  <div className="text-5xl font-bold text-[#2E7D32] mb-2">5+</div>
                  <div className="text-xl text-gray-600">Years Experience</div>
                </motion.div>
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.1,
                duration: 0.5
              }}>
                  <div className="text-5xl font-bold text-[#2E7D32] mb-2">5000+</div>
                  <div className="text-xl text-gray-600">Trusted Clients</div>
                </motion.div>
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.2,
                duration: 0.5
              }}>
                  <div className="text-5xl font-bold text-[#2E7D32] mb-2">ISO</div>
                  <div className="text-xl text-gray-600">Certified Quality</div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>;
};
export default AboutPage;
