import React, { useState, useEffect } from 'react';
import API from '@/utils/axios';
import { API_BASE } from '@/utils/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, Tag, ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LazyImage from '@/components/ui/LazyImage';

const ProductsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(`Fetching products from: ${API_BASE}/api/products`);
        const response = await API.get('/products');
        
        // Backend se aane wale data ko handle karna (Array ensure karna)
        const allProducts = Array.isArray(response.data) ? response.data : [];
        console.log(`[ProductsPage] Success: Loaded ${allProducts.length} products.`);
        setProducts(allProducts);

        // ⭐ SEO Legacy Redirect: Handle URLs like /products/mulching-film indexed by Google
        if (categoryId && typeof categoryId === 'string' && categoryId.length > 0) {
            console.log(`[ProductsPage] Check SEO Redirect for slug: "${categoryId}"`);
            const decodedParam = decodeURIComponent(categoryId).toLowerCase().replace(/-/g, ' ');
            const knownCategories = ['seeds', 'fertilizers', 'pesticides', 'equipment', 'organic'];
            
            // Checking if the URL param resembles an exact product name rather than a category
            const matchedProduct = allProducts.find(p => p.name.toLowerCase() === decodedParam || p.name.toLowerCase().includes(decodedParam));
            
            if (!knownCategories.includes(decodedParam) && matchedProduct) {
                console.log(`[ProductsPage] Smart Redirect: Routing legacy slug '${categoryId}' to product ID ${matchedProduct.id}`);
                navigate(`/product/${matchedProduct.id}`, { replace: true });
                return;
            } else {
                // Otherwise, treat it as a search/category filter
                console.log(`[ProductsPage] Setting search filter: "${decodedParam}"`);
                setSearchTerm(decodedParam);
            }
        }
      } catch (error) {
        console.error("[ProductsPage] Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_BASE, categoryId, navigate]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Agricultural Products Catalog | Farmliv Industries</title>
        <meta name="description" content="Explore Farmliv's premium range of agricultural solutions." />
      </Helmet>

      <Header />

      <main className="pt-24 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="mb-10 sm:mb-12">
            <nav className="text-[11px] sm:text-xs text-gray-400 mb-3 sm:mb-4 uppercase tracking-wider">
              <Link to="/" className="hover:text-[#2E7D32] transition-colors">Home</Link> / <span className="text-[#2E7D32] font-semibold">Products</span>
            </nav>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1A1A] mb-3 sm:mb-4 font-['Playfair_Display'] leading-tight">
              Our Products
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed">
              Premium agricultural solutions engineered for modern farming efficiency and sustainable growth.
            </p>
          </header>

          {/* ⭐ Search Section */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                value={searchTerm}
                placeholder="Find a product..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border-none focus:ring-1 focus:ring-[#2E7D32] text-sm bg-white shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[11px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide">
                Showing <span className="text-[#2E7D32] font-bold">{filteredProducts.length}</span> results
              </span>
            </div>
          </section>

          {loading ? (
            <div className="flex justify-center py-20 text-[#2E7D32] font-bold text-xs animate-pulse tracking-widest uppercase">
              Loading Catalog...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredProducts.map((p, index) => {
                  // ⭐ Image Path Handling: Backend se array milta hai ya string JSON
                  let imagesData = p.images;
                  if (typeof p.images === 'string') {
                    try { imagesData = JSON.parse(p.images); } catch (e) { imagesData = []; }
                  }

                  const hasImages = imagesData && Array.isArray(imagesData) && imagesData.length > 0;
                  const firstImage = hasImages ? imagesData[0] : null;

                  const imageUrl = firstImage 
                    ? (firstImage.startsWith('http') ? firstImage : `${API_BASE}${firstImage}`)
                    : '/placeholder.jpg';

                  return (
                    <motion.article 
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                    >
                      {/* ⭐ Optimized Image Container with LazyImage */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-[#F9BC15] text-black text-[9px] font-black rounded-md uppercase tracking-wider shadow-sm">
                            {p.category || 'Agricultural'}
                          </span>
                        </div>
                        
                        <Link to={`/product/${p.id}`} className="block w-full h-full">
                          <LazyImage 
                            src={imageUrl} 
                            alt={p.name}
                            className="w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                            priority={index < 3} // Pehle 3 images ko turant load karega
                          />
                        </Link>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 sm:p-6 flex flex-col flex-grow">
                        <h2 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#2E7D32] transition-colors line-clamp-1 leading-snug uppercase tracking-tight">
                          {p.name}
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-[13px] mb-5 line-clamp-2 leading-relaxed flex-grow">
                          {p.description || 'Premium agricultural solution engineered by Farmliv Industries.'}
                        </p>

                        <div className="space-y-2 mb-6 mt-auto">
                            {p.gsm && (
                              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-[#2E7D32]">
                                {p.gsm} GSM
                              </span>
                            )}
                          
                          <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                            <Tag className="w-3.5 h-3.5 text-[#2E7D32]" />
                            <span className="font-bold text-gray-900">
                              {p.retail_price > 0 ? `₹${parseFloat(p.retail_price).toLocaleString()}` : 'Price on Request'}
                            </span>
                          </div>
                        </div>

                        <Link 
                          to={`/product/${p.id}`}
                          className="flex items-center justify-between pt-4 border-t border-gray-100 group/btn"
                        >
                          <span className="text-[#2E7D32] font-black text-[10px] uppercase tracking-widest">Explore Details</span>
                          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center group-hover/btn:bg-[#2E7D32] transition-all duration-300">
                            <ArrowRight className="w-4 h-4 text-[#2E7D32] group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          
          {/* No Results Fallback */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 font-bold mb-1">No products found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your search term.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
