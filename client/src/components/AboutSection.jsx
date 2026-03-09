import React, { memo } from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import LazyImage from '@/components/ui/LazyImage';

const AboutSection = () => {
  const metrics = [
    { icon: Award, value: '5+', label: 'Years Experience' },
    { icon: Users, value: '5000+', label: 'Trusted Clients' },
    { icon: TrendingUp, value: 'ISO', label: 'Certified Quality' }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white contain-content">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Trusted Partner in Agricultural Excellence
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
             At Farmliv Industries, we specialize in providing premium agricultural solutions to businesses and industrial partners worldwide. With a legacy of manufacturing excellence, we deliver high-performance products tailored to meet the evolving demands of modern, sustainable agriculture.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
             Our Commitment to Quality
             Our state-of-the-art manufacturing facilities and ISO-certified processes ensure that every solution—from Leno bags to mulching films—meets stringent international quality standards. We are dedicated to empowering your business success through reliable product consistency, innovative engineering, and exceptional customer support.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#2E7D32] rounded-full mb-3">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#2E7D32] mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl card-optimize">
              <LazyImage
                src="https://res.cloudinary.com/dik8mlsie/image/upload/v1771483789/Shadenet5_fyfyqx.webp"
                alt="Modern agricultural facility showcasing quality manufacturing"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#2E7D32]/10 rounded-2xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#2E7D32]/10 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(AboutSection);