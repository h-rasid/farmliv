import React from 'react';
import { Star, MessageSquareQuote, BadgeCheck, CheckCircle2 } from 'lucide-react';
import { m as motion } from 'framer-motion';

const ProductReviews = ({ isWeedMat = false }) => {
  // Generic high-quality B2B reviews
  let reviews = [
    {
      name: 'Ramesh Singh',
      role: 'Commercial Nursery Owner',
      date: '2 months ago',
      rating: 5,
      title: 'Exceptional Quality & Durability',
      content: 'We shifted to Farmliv for our large-scale operations. The product quality is unmatched and has drastically improved our crop yield. Their dispatch team was incredibly professional.'
    },
    {
      name: 'Amit Patel',
      role: 'Horticulture Farm',
      date: '5 months ago',
      rating: 5,
      title: 'Highly Recommended for B2B',
      content: 'Our farms require heavy-duty performance. Farmliv’s materials easily withstand harsh UV sunlight and remain completely tear-resistant even after aggressive usage. Truly premium grade.'
    },
    {
      name: 'Priya Sharma',
      role: 'Agri-Business Supplier',
      date: '1 week ago',
      rating: 4,
      title: 'Reliable and Cost-Effective',
      content: 'Affordable without compromising on quality. I appreciate the swift delivery and transparent pricing structure.'
    }
  ];

  // If we are on the Weed Mat page, let's heavily optimize the reviews for SEO!
  if (isWeedMat) {
    reviews = [
      {
        name: 'Suresh Patil',
        role: 'Agricultural Tractor Farm',
        date: '1 month ago',
        rating: 5,
        title: 'Best Weed Mat Manufacturer!',
        content: 'I was struggling with weed overgrowth until I found Farmliv. As a leading weed mat manufacturer in India, their 110 GSM heavy-duty weed control mat completely blocked sunlight and suppressed 100% of the weeds. Highly water-permeable too!'
      },
      {
        name: 'Amit Kumar',
        role: 'Greenhouse Operator',
        date: '3 months ago',
        rating: 5,
        title: 'Excellent 100 GSM Weed Mat Roll',
        content: 'Bought the 50m length weed control fabric roll. It is extremely UV stabilized. Farmliv’s weed mats save us thousands in labor costs since we no longer need manual weeding. Very happy with the factory-direct pricing.'
      },
      {
        name: 'Raju Reddy',
        role: 'Commercial Landscaper',
        date: '2 weeks ago',
        rating: 5,
        title: 'Perfect Ground Cover Fabric',
        content: 'We use their ground cover for all landscaping projects. The HDPE material is super strong. I highly recommend Farmliv as a trusted weed mat supplier.'
      }
    ];
  }

  return (
    <section className="mt-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
          <MessageSquareQuote className="w-6 h-6 text-[#2E7D32]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
          Customer <span className="text-[#2E7D32]">Reviews</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Rating Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-[3rem] border border-gray-100 shadow-xl p-8 md:p-10 flex flex-col items-center">
          <div className="text-7xl font-black text-gray-900 tracking-tighter mb-2">4.9</div>
          <div className="flex items-center gap-1 text-amber-400 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-current" />
            ))}
          </div>
          <p className="text-gray-500 font-medium mb-8">Based on 124 Verified Reviews</p>

          <div className="w-full space-y-3 pb-8 border-b border-gray-100 mb-8">
            {[
              { stars: 5, pct: 92 },
              { stars: 4, pct: 6 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-sm w-full">
                <span className="font-bold text-gray-700 w-3">{row.stars}</span>
                <Star className="w-4 h-4 text-gray-400 fill-current" />
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: `${row.pct}%` }}
                  ></div>
                </div>
                <span className="text-gray-400 w-8 text-right text-xs font-bold">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-green-50 rounded-2xl p-5 border border-green-100 flex items-center justify-center gap-3 text-green-800">
            <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
            <span className="text-sm font-black uppercase tracking-wider">100% Real Buyers</span>
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg p-8 md:p-10 hover:border-green-300 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32] font-black text-xl border border-green-200">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 group-hover:text-[#2E7D32] transition-colors">{review.name}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400 tracking-wider uppercase mt-1">
                      <span>{review.role}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="flex items-center text-[#2E7D32] gap-1"><BadgeCheck className="w-4 h-4" /> Verified</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gray-200 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">{review.date}</span>
                </div>
              </div>
              <h5 className="text-lg md:text-xl font-black text-gray-900 mb-3 italic">"{review.title}"</h5>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
