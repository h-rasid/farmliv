import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '@/utils/axios';
import { API_BASE } from '@/utils/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDescriptionSection from '../components/ProductDescriptionSection';
import LazyImage from '@/components/ui/LazyImage'; 
import { 
  ChevronRight, Maximize2, X, Award, 
  Loader2, BarChart3, ArrowRight, Box, Shield, Clock,
  Truck, Factory, Layers, Eye
} from 'lucide-react';
import { m as motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ProductDetailPage = ({ productIdOverride }) => {
  const { productId: paramId } = useParams();
  const productId = productIdOverride || paramId;

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);


  useEffect(() => {
    const fetchProductData = async () => {
      // ⭐ SEO SLUG MAPPING: Force specific IDs to their SEO-friendly URLs
      const slugMap = {
        '2': '/heavy-duty-weed-control-mat-manufacturer',
        '3': '/uv-stabilized-agriculture-shade-net-manufacturer',
        '4': '/pp-leno-mesh-bag-manufacturer',
        '5': '/ldpe-drip-irrigation-pipe-manufacturer',
        '6': '/hdpe-geomembrane-sheet-manufacturer',
        '9': '/geotextile-geo-bag-manufacturer',
        '10': '/fibc-jumbo-bag-manufacturer',
        '11': '/pp-leno-mesh-bag-manufacturer',
        '12': '/ldpe-agricultural-poly-film-manufacturer',
        '13': '/ldpe-mulching-film-manufacturer',
        '14': '/hdpe-plastic-crate-manufacturer'
      };

      if (slugMap[productId] && !productIdOverride) {
        navigate(slugMap[productId], { replace: true });
        return;
      }

      if (!productId) return;
      
      try {
        setLoading(true);
        const cleanId = productId.split(':')[0].replace(/[^0-9]/g, ''); 

        // Defensive check: prevent literal ':id' or empty ID from triggering a 404
        if (!cleanId || cleanId === '' || productId.includes(':id')) {
          console.warn('ProductDetailPage: Invalid productId detected:', productId);
          
          if (productId && productId.length > 3 && !productId.includes(':id')) {
             // Route text-only legacy slugs to the ProductsPage smart interceptor
             navigate(`/products/${productId}`, { replace: true });
             return;
          }

          setLoading(false);
          return;
        }
        
        const response = await API.get(`/products/${cleanId}`);
        let data = response.data;

        
        if (data.images) {
          try {
            data.images = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
          } catch (e) {
            data.images = data.images.replace(/{|}/g, '').split(',').map(img => img.trim());
          }
        }
        
        if (!Array.isArray(data.images) || data.images.length === 0) {
          data.images = ['/placeholder.jpg'];
        }

        data.images = data.images.map(img => 
          img.startsWith('http') ? img : `${API_BASE}${img.startsWith('/') ? '' : '/'}${img}`
        );

        setProduct(data);
        setActiveImage(0);

        try {
          if (data.category) {
            const relatedRes = await API.get(`/products/related/${data.category}?exclude=${cleanId}`);
            if (relatedRes.data && relatedRes.data.length > 0) {
              setRelatedProducts(relatedRes.data);
            } else {
              const allRes = await API.get('/products');
              const fallback = allRes.data.filter(p => String(p.id) !== String(cleanId)).slice(0, 4);
              setRelatedProducts(fallback);
            }
          } else {
            // Fallback for missing category
            const allRes = await API.get('/products');
            const fallback = allRes.data.filter(p => String(p.id) !== String(cleanId)).slice(0, 4);
            setRelatedProducts(fallback);
          }
        } catch (relErr) {
          const allRes = await API.get('/products');
          const emergencyFallback = allRes.data.filter(p => String(p.id) !== String(cleanId)).slice(0, 4);
          setRelatedProducts(emergencyFallback);
        }

      } catch (error) {
        console.error("Node Fetch Error:", error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    
    window.scrollTo(0, 0);
  }, [productId, productIdOverride, navigate]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="w-10 h-10 text-[#2E7D32] animate-spin mb-4" />
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Loading</span>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 mb-8 max-w-md">
        <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Product Offline</h2>
        <p className="text-sm text-gray-500 mt-4 leading-relaxed font-medium">
          Product Item <span className="text-red-600 font-bold">#{productId}</span> could not be synchronized.
        </p>
      </div>
      <Link to="/products" className="text-[#2E7D32] font-black uppercase text-xs tracking-widest flex items-center gap-2">
        <ArrowRight className="w-4 h-4 rotate-180" /> Reconnect to Catalog
      </Link>
    </div>
  );

  // ── SEO Helper: get canonical URL per product ID ──
  const getCanonical = (id) => {
    const canonicalMap = {
      '2': 'https://farmliv.com/heavy-duty-weed-control-mat-manufacturer',
      '3': 'https://farmliv.com/uv-stabilized-agriculture-shade-net-manufacturer',
      '4': 'https://farmliv.com/pp-leno-mesh-bag-manufacturer',
      '5': 'https://farmliv.com/ldpe-drip-irrigation-pipe-manufacturer',
      '6': 'https://farmliv.com/hdpe-geomembrane-sheet-manufacturer',
      '9': 'https://farmliv.com/geotextile-geo-bag-manufacturer',
      '10': 'https://farmliv.com/fibc-jumbo-bag-manufacturer',
      '11': 'https://farmliv.com/pp-leno-mesh-bag-manufacturer',
      '12': 'https://farmliv.com/ldpe-agricultural-poly-film-manufacturer',
      '13': 'https://farmliv.com/ldpe-mulching-film-manufacturer',
      '14': 'https://farmliv.com/hdpe-plastic-crate-manufacturer',
    };
    return canonicalMap[String(id)] || `https://farmliv.com/product/${id}`;
  };

  // ── SEO Meta per product ──
  const isWeedMat = String(product.id) === '2';
  const seoTitle = isWeedMat
    ? 'Weed Mat Manufacturer in India | Heavy Duty Weed Control Mat | Farmliv'
    : `${product.name} | Farmliv Industries`;
  const seoDescription = isWeedMat
    ? 'We are a leading weed mat manufacturer in India offering heavy duty weed control mats, weed barrier fabric and ground cover for farming, nursery and gardening. Bulk supply available.'
    : (product.description || `Buy ${product.name} from Farmliv Industries — trusted agricultural product manufacturer in India.`);
  const seoOgImage = (product.images && product.images[0]) || 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773817725/weedmat1_rln1ds.jpg';
  const canonicalUrl = getCanonical(product.id);

  // JSON-LD: Product Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isWeedMat ? 'Heavy Duty Weed Control Mat — Weed Mat Manufacturer India' : product.name,
    description: seoDescription,
    image: product.images || [],
    brand: { '@type': 'Brand', name: 'Farmliv Industries' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Farmliv Industries Private Limited',
      url: 'https://farmliv.com'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Farmliv Industries' }
    }
  };

  // JSON-LD: FAQ Schema (for weed mat page only)
  const faqSchema = isWeedMat ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is the best weed mat manufacturer in India?',
        acceptedAnswer: { '@type': 'Answer', text: 'Farmliv Industries Private Limited is one of India\'s leading weed mat manufacturers, supplying heavy duty PP weed control mats across agriculture, horticulture, and landscaping sectors.' }
      },
      {
        '@type': 'Question',
        name: 'What is a weed mat and how does it work?',
        acceptedAnswer: { '@type': 'Answer', text: 'A weed mat (also called weed control mat or ground cover) is a heavy duty polypropylene fabric placed on soil to block sunlight, prevent weed growth, and retain soil moisture. Farmliv\'s weed mats are made from 110 GSM UV-stabilized PP material with a 5-year durability guarantee.' }
      },
      {
        '@type': 'Question',
        name: 'What GSM weed mat does Farmliv manufacture?',
        acceptedAnswer: { '@type': 'Answer', text: 'Farmliv manufactures 110 GSM weed control mats made from heavy duty polypropylene. These weed mats are UV stabilized, BIS certified, and designed for 5+ years of outdoor use.' }
      },
      {
        '@type': 'Question',
        name: 'Can I buy weed mat in bulk from Farmliv?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes, Farmliv Industries offers bulk weed mat supply at factory-direct wholesale prices. We supply to farmers, nurseries, distributors, and exporters across India.' }
      },
      {
        '@type': 'Question',
        name: 'What widths and lengths are available for weed mats?',
        acceptedAnswer: { '@type': 'Answer', text: 'As a weed mat manufacturer, Farmliv offers weed mats in widths of 1 meter (2 feet), 1.5 meter (5 feet), 2 meter (6.5 feet), 4.2 meter, and 5.2 meter, with lengths up to 100 meters per roll.' }
      }
    ]
  } : null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-green-100">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {isWeedMat && <meta name="keywords" content="weed mat manufacturer, weed control mat, PP ground cover, weed barrier fabric, garden mat manufacturer India, heavy duty weed mat, farmliv weed mat" />}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={isWeedMat ? 'Weed Mat Manufacturer in India | Farmliv Industries' : seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={seoOgImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Farmliv Industries" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={isWeedMat ? 'Weed Mat Manufacturer in India | Farmliv Industries' : seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoOgImage} />
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <Header />
      
      <main className="pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <nav className="flex items-center gap-2 text-[10px] text-gray-400 mb-8 uppercase tracking-widest">
            <Link to="/" className="hover:text-[#2E7D32]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products">Inventory</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-bold italic">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-20">
            {/* LEFT: IMAGES */}
            <div className="space-y-6">
              <div 
                className="relative group rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl bg-gray-50 aspect-square" 
              >
                <div 
                  className="absolute top-8 right-8 z-20 bg-white/90 backdrop-blur-md shadow-xl p-3 rounded-2xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer pointer-events-auto"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <Maximize2 className="w-5 h-5 text-[#2E7D32]" />
                </div>

                <div className="w-full h-full relative bg-gray-50 flex items-center justify-center swiper-container-custom">
                  <Swiper
                    onSwiper={setSwiperInstance}
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    grabCursor={true}
                    onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
                    className="w-full h-full product-swiper"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    {product.images.map((img, index) => (
                      <SwiperSlide key={index} className="w-full h-full flex items-center justify-center">
                        <div 
                          className="w-full h-full cursor-grab active:cursor-grabbing relative"
                          onClick={() => setIsLightboxOpen(true)}
                        >
                          <img 
                            src={img} 
                            alt={isWeedMat
                              ? (index === 0 ? 'weed mat manufacturer'
                                : index === 1 ? 'hdpe weed mat roll'
                                : index === 2 ? 'weed control mat for farming'
                                : `${product.name} view ${index + 1}`)
                              : `${product.name} view ${index + 1}`
                            }
                            draggable="false"
                            className="w-full h-full object-cover select-none transition-transform duration-700 md:group-hover:scale-110"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
                {product.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => {
                      setActiveImage(index);
                      swiperInstance?.slideTo(index);
                    }} 
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === index ? 'border-[#2E7D32] scale-90 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`view-${index}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-green-50 text-[#2E7D32] text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                  {product.category || 'Agri-Solution'}
                </span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
                  HSN: {product.hsn || 'TBD'}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-[0.9] italic">
                {isWeedMat ? 'Weed Mat Manufacturer in India – Heavy Duty Weed Control Mats' : product.name}
              </h1>

              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Box size={80} className="text-slate-900" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                  {product.description || "Inquiry pending for technical documentation."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Shield size={10}/> Durability</span>
                  <span className="text-lg font-bold text-gray-900 tracking-tight">{product.durability || 'N/A'}</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Clock size={10}/> GSM</span>
                  <span className="text-lg font-bold text-gray-900 tracking-tight">{product.gsm || 'N/A'}</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm col-span-2 md:col-span-1">
                  <span className="block text-[9px] font-black text-[#2E7D32] uppercase tracking-widest mb-1">Min Order</span>
                  <span className="text-lg font-bold text-[#2E7D32]">{product.moq || 'Contact'}</span>
                </div>
              </div>

              <Link to={`/request-quote?productId=${product.id}`} className="bg-gray-900 text-white py-8 rounded-[3rem] font-black text-xs uppercase tracking-widest hover:bg-[#2E7D32] transition-all flex items-center justify-center gap-4 shadow-2xl group">
                Request Purchase Inquiry 
                <BarChart3 className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </Link>

              <div className="flex gap-8 pt-10 border-t border-gray-100 mt-10">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">Standard</span>
                    <span className="text-xs font-bold text-gray-700 uppercase">ISO 9001:2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. TECHNICAL SPECIFICATIONS (Hidden on Weed Mat page to avoid duplication) */}
          {!isWeedMat && <ProductDescriptionSection product={product} />}

          {/* ⭐ SEO CONTENT BLOCK: Only renders for Weed Mat (Product ID 2) */}
          {isWeedMat && (
            <section aria-label="Weed Mat Manufacturer Information" className="mt-20 space-y-12">

              {/* H2: PRODUCT SPECIFICATIONS */}
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="px-10 md:px-14 pt-12 pb-4">
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">
                    Product <span className="text-[#2E7D32]">Specifications</span>
                  </h2>
                  <p className="text-gray-500 text-sm mb-8">Standard specifications from Farmliv — India's trusted <strong>weed mat manufacturer</strong>.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-green-50 border-b border-green-100">
                      <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2E7D32]">
                        <th className="py-4 px-10">Parameter</th>
                        <th className="py-4 px-10">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        ['Material', 'HDPE / Polypropylene (PP)'],
                        ['GSM', '90, 100, 110, 120 GSM'],
                        ['Width', '1 meter to 5 meters'],
                        ['Length', '25m, 50m, 100m per roll'],
                        ['UV Stabilized', 'Yes — 5+ Year Life Guarantee'],
                        ['Color', 'Black / Green'],
                      ].map(([param, value], i) => (
                        <tr key={i} className="hover:bg-green-50/20 transition-all">
                          <td className="py-4 px-10 font-black text-gray-900 text-[11px] uppercase tracking-wider">{param}</td>
                          <td className="py-4 px-10 text-gray-600 text-sm font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* H2: LEADING WEED MAT MANUFACTURER */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-[3rem] border border-green-100 p-10 md:p-14">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">
                  Leading <span className="text-[#2E7D32]">Weed Mat Manufacturer</span>
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  We are a trusted <strong>weed mat manufacturer</strong> in India, offering premium quality weed control mats for agriculture, gardening, and landscaping. Our weed mats are made from high-quality HDPE material, ensuring durability and long-lasting performance.
                </p>
              </div>

              {/* H2: WHAT IS A WEED MAT */}
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-md p-10 md:p-14">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">
                  What is a <span className="text-[#2E7D32]">Weed Mat</span>?
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  A <strong>weed mat</strong> is a ground cover fabric designed to prevent weed growth by blocking sunlight while allowing water and nutrients to pass through the soil. As a leading <strong>weed mat manufacturer</strong>, Farmliv produces weed control mats that are UV stabilized, tear-resistant, and built for long-term outdoor use.
                </p>
              </div>

              {/* H2: BENEFITS */}
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-8">
                  Benefits of <span className="text-[#2E7D32]">Weed Control Mat</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { icon: '🚫', title: 'Prevents weed growth effectively', body: 'Blocks sunlight to soil surface, stopping weed seeds from germinating without the need for chemical herbicides.' },
                    { icon: '💧', title: 'Saves water by reducing evaporation', body: 'Our weed mat retains soil moisture by up to 60%, reducing irrigation frequency and water costs.' },
                    { icon: '🌾', title: 'Improves crop yield', body: 'Crops grow stronger when weeds are eliminated — full access to nutrients, sunlight, and water.' },
                    { icon: '👨‍🌾', title: 'Reduces labor cost', body: 'Eliminates manual weeding, reducing field labor requirements significantly across the growing season.' },
                    { icon: '♻️', title: 'Eco-friendly and reusable', body: 'Made from recyclable PP/HDPE material. Our weed control mat can be reused for multiple seasons.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-gray-100 shadow-md p-8 flex flex-col gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* H2: APPLICATIONS */}
              <div className="bg-[#020617] text-white rounded-[3rem] p-10 md:p-14">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic mb-6">
                  Applications of Our <span className="text-emerald-400">Weed Mat</span>
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-8">
                  As a leading <strong className="text-white">weed mat manufacturer</strong>, Farmliv supplies heavy duty weed control mats for:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    'Agriculture farming',
                    'Nursery & landscaping',
                    'Greenhouse',
                    'Garden weed control',
                  ].map((use, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white/5 rounded-2xl px-6 py-4">
                      <span className="text-emerald-400 font-black mt-0.5">✓</span>
                      <span className="text-slate-300">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* H2: WHY CHOOSE US */}
              <div className="bg-gradient-to-br from-green-50 to-white rounded-[3rem] border border-green-100 p-10 md:p-14">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic mb-6">
                  Why Choose <span className="text-[#2E7D32]">Us?</span>
                </h2>
                <p className="text-gray-700 text-base leading-relaxed mb-8">
                  As a leading <strong>weed mat manufacturer</strong>, Farmliv ensures:
                </p>
                <ul className="space-y-4">
                  {[
                    'High-quality raw materials (HDPE / UV-stabilized PP)',
                    'Competitive pricing — factory direct, no middlemen',
                    'Bulk supply available across India',
                    'Fast delivery across India — Maharashtra, Gujarat, Karnataka, Tamil Nadu & more',
                    'Trusted by farmers, nurseries and distributors nationwide',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-6 h-6 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-gray-700 text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* H2: BUY WEED MAT ONLINE / CTA */}
              <div className="bg-[#2E7D32] text-white rounded-[3rem] p-10 md:p-14 text-center">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic mb-4">
                  Buy Weed Mat Online
                </h2>
                <p className="text-green-100 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                  Contact us today to get the best price from a reliable <strong>weed mat manufacturer</strong> in India. Bulk supply, custom sizes, and fast nationwide delivery available.
                </p>
                <Link
                  to="/request-quote?productId=2"
                  className="inline-flex items-center gap-3 bg-white text-[#2E7D32] font-black text-xs uppercase tracking-widest px-10 py-5 rounded-full hover:bg-green-50 transition-all shadow-xl"
                >
                  Get Best Price Now <ArrowRight size={16} />
                </Link>
              </div>

            </section>
          )}
          {/* END SEO CONTENT BLOCK */}

          {/* 2. SIMILAR PRODUCTS (MODERN PORTRAIT GRID) */}
          {relatedProducts.length > 0 && (
            <div className="mt-28 mb-16">
              <div className="flex items-center justify-between gap-4 mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-gray-900 rounded-full"></div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900">
                      Similar <span className="text-[#2E7D32]">Products</span>
                    </h3>
                </div>
                <Link to="/products" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2E7D32] transition-colors">
                    Full Inventory <ArrowRight size={14}/>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((item) => {
                  let itemImgs = [];
                  try { itemImgs = typeof item.images === 'string' ? JSON.parse(item.images) : item.images; } catch(e) { itemImgs = []; }
                  const thumb = itemImgs && itemImgs[0] ? (itemImgs[0].startsWith('http') ? itemImgs[0] : `${API_BASE}${itemImgs[0]}`) : '/placeholder.jpg';
                  
                  return (
                    <Link key={item.id} to={`/product/${item.id}`} className="group relative">
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-200 transition-all duration-700 group-hover:shadow-2xl group-hover:border-green-200 group-hover:-translate-y-2">
                        <div className="absolute top-5 left-5 z-10">
                            <span className="bg-white/90 backdrop-blur-sm border border-slate-100 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-slate-900">
                                {item.category || 'Product'}
                            </span>
                        </div>
                        
                        <img src={thumb} alt={item.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                            <div className="flex items-center gap-3 text-white">
                                <Eye size={16} className="text-green-400"/>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Product</span>
                            </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 px-2 text-center md:text-left">
                        <h5 className="text-[11px] font-black uppercase text-slate-900 italic tracking-tight mb-1 group-hover:text-[#2E7D32] transition-colors truncate">
                            {item.name}
                        </h5>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                             <Layers size={10} className="text-slate-300"/>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Farmliv Standard</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. BULK ORDER PRIVILEGES */}
          <div className="mt-24 relative rounded-[4.5rem] bg-[#020617] p-1 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/15 blur-[120px]"></div>
            </div>

            <div className="relative z-10 bg-[#020617]/40 backdrop-blur-3xl rounded-[4.3rem] p-10 md:p-20 border border-white/5">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Farmliv Global Logistics</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.8] mb-8">
                    Bulk Order <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-emerald-500">
                      Privileges.
                    </span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 opacity-80">
                    {isWeedMat
                      ? "Farmliv offers proprietary logistical pipelines and custom weed mat manufacturing configurations for high-volume commercial infrastructure."
                      : "Proprietary logistical pipelines and custom manufacturing configurations for high-volume commercial infrastructure."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-10">
                    <div className="flex gap-5 items-start">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                        <Factory size={24}/>
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-wider">Factory-Direct Source</h4>
                        <p className="text-slate-500 text-[10px] uppercase font-black mt-1">Ex-Factory Tiers</p>
                      </div>
                    </div>
                    <div className="flex gap-5 items-start">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500">
                        <Truck size={24}/>
                      </div>
                      <div>
                        <h4 className="text-white font-black text-xs uppercase tracking-wider">Logistics Pro</h4>
                        <p className="text-slate-500 text-[10px] uppercase font-black mt-1">Global Dispatch</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-auto flex flex-col items-center">
                  <div className="relative group/btn-wrap">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-600 to-teal-400 rounded-[3rem] blur opacity-20 group-hover/btn-wrap:opacity-60 transition duration-1000"></div>
                    <Link to="/request-quote" className="relative bg-white text-slate-950 px-16 py-9 rounded-[2.8rem] flex items-center justify-center gap-4 transition-all duration-500 group/btn shadow-2xl">
                      <span className="font-black text-xs uppercase tracking-[0.25em]">Request Bulk Quote</span>
                      <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

