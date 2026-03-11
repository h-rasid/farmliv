import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { API_BASE } from '@/utils/config';
import { ShieldCheck, ArrowRight, Layers, Info, CheckCircle2, Zap, Globe, Award, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProductDescriptionSection = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        const response = await API.get('/products');
        const allProducts = Array.isArray(response.data) ? response.data : [];
        const filtered = allProducts.filter(p => 
          p.category === product.category && 
          Number(p.id) !== Number(product.id)
        );
        setRelatedProducts(filtered.slice(0, 3));
      } catch (error) {
        console.error("Related Sync Error:", error);
      }
    };
    fetchRelated();
  }, [product]);

  if (!product) return null;

  const specRows = [
    { label: 'Standard Material', value: product.category === 'mulch' ? 'High-Density Polymer (UV)' : 'Industrial Grade' },
    { label: 'Technical GSM', value: product.gsm || 'Industrial Specs' },
    { label: 'Operational Life', value: product.durability ? `${product.durability} (UV Protected)` : '5+ Years' },
    { label: 'System Asset ID', value: `FLV-ITEM-00${product.id}`, highlight: true },
    { label: 'Compliance Status', value: 'ISO Certified Multi-Tier' }
  ];

  return (
    <article className="mt-16 sm:mt-24 space-y-16 sm:space-y-24 font-sans border-t border-gray-100 pt-16">
      
      {/* 1. Technical Specs Table */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-green-50 rounded-2xl border border-green-100">
            <Layers className="w-6 h-6 text-[#2E7D32]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
            Product <span className="text-[#2E7D32]">Specification</span>
          </h2>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                  <th className="py-6 px-10">System Parameter</th>
                  <th className="py-6 px-10">Operational Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {specRows.map((row, idx) => (
                  <tr key={idx} className="group hover:bg-green-50/20 transition-all">
                    <td className="py-6 px-10 font-black text-gray-900 text-[11px] uppercase tracking-wider">{row.label}</td>
                    <td className={`py-6 px-10 text-gray-500 text-sm ${row.highlight ? 'font-mono font-black text-[#2E7D32]' : 'font-medium'}`}>
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Compact Performance Assurance - Industrial White Edition */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        {/* Subtle Industrial Grid Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 0)`, backgroundSize: '24px 24px' }}></div>
        
        <div className="relative px-6 py-10 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Farmliv Operational Protocol</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Performance <span className="text-[#2E7D32]">Assurance</span>
              </h3>
              <p className="text-slate-500 text-xs sm:text-base font-medium italic border-l-2 border-[#2E7D32] pl-4 leading-relaxed max-w-2xl">
                "{product.description || "Industrial asset"} engineered for structural integrity, environmental resilience, and safety compliance."
              </p>
            </div>

            {/* Compliance Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { code: "14001:2015", label: "Environmental" },
                { code: "22000:2018", label: "Food Safety" },
                { code: "45001:2018", label: "Health & Safety" },
                { code: "50001:2018", label: "Energy Mgmt" }
              ].map((iso, i) => (
                <div key={i} className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl hover:border-[#2E7D32]/30 transition-colors">
                  <span className="block text-[10px] font-black text-slate-800 tracking-tight">ISO {iso.code}</span>
                  <span className="block text-[7px] font-bold text-[#2E7D32] uppercase tracking-widest mt-0.5">{iso.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Info Box */}
          <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 min-w-fit shadow-sm relative z-10">
            <div className="text-center">
              <span className="block text-2xl font-black text-slate-900 tracking-tighter italic leading-none">ISO</span>
              <span className="block text-[8px] font-black text-[#2E7D32] uppercase tracking-[0.2em] mt-1">9001:2026</span>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-dashed border-[#2E7D32]/30 flex items-center justify-center animate-[spin_12s_linear_infinite]">
                 <Award className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div className="text-left leading-none">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Grade Status</span>
                <span className="text-[10px] font-black text-slate-900 uppercase italic">Industrial Grade</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b-2 border-gray-900/5 pb-8">
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
              Related <span className="text-[#2E7D32]">Products</span>
            </h2>
            <Link to="/products" className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#2E7D32] transition-colors uppercase tracking-[0.2em]">
              Directory <ArrowRight size={14}/>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {relatedProducts.map((p) => {
              let imgs = [];
              try { imgs = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []); } catch (e) { imgs = []; }

              return (
                <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-[3rem] border border-gray-100 overflow-hidden shadow-xl hover:shadow-2xl transition-all flex flex-col hover:-translate-y-2 duration-500">
                  <div className="aspect-[16/11] overflow-hidden bg-gray-50 relative">
                    <img 
                      src={imgs[0] ? `${API_BASE}${imgs[0]}` : '/placeholder.jpg'} 
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                      alt={p.name} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                           View Blueprint <ArrowRight size={12} />
                        </span>
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight group-hover:text-[#2E7D32] transition-colors italic leading-none">{p.name}</h4>
                    <div className="flex justify-between items-center border-t border-gray-50 pt-6">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Product Value</span>
                        <span className="text-lg font-black text-[#2E7D32]">₹{p.retail_price || p.price}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Farmliv Grade</span>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">Industrial</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
};

export default ProductDescriptionSection;