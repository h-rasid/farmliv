import { 
  Sprout, Sun, Scroll, Home, Droplets, 
  Package, ShoppingBag, Shield, Box, CloudRain, Layers  
} from 'lucide-react';
import { API_URL } from '../utils/config';

// --- EXISTING CATEGORIES DATA ---
export const productCategories = [
  {
    id: 'weed-control',
    name: 'Weed Control',
    icon: Sprout,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773240650/weedmat1_meffjq.webp',
    description: 'High-quality weed mats for effective suppression and soil health.'
  },
  /* 
  {
    id: 'shade-protection',
    name: 'Shade & Protection',
    icon: Sun,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1772299621/ShadeandProtection_htkgxy.png',
    description: 'Durable shade nets for crop protection and climate control.'
  },
  */
  {
    id: 'mulch-films',
    name: 'Mulch & Films',
    icon: Scroll,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237863/mulchandFilm_kqnw5o.webp',
    description: 'Agricultural films for moisture retention and weed prevention.'
  },
  {
    id: 'greenhouse-materials',
    name: 'Greenhouse Materials',
    icon: Home,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237866/Greenhouse_vslztl.webp',
    description: 'Poly films and covers for greenhouse construction.'
  },
  {
    id: 'water-management',
    name: 'Water Management',
    icon: CloudRain,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237864/watermanagement_vug6eb.webp',
    description: 'Pond liners and waterproofing solutions for agriculture.'
  },
  {
    id: 'harvesting-storage',
    name: 'Harvesting & Storage',
    icon: Box,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237871/harvesting_c7ptuh.webp',
    description: 'Plastic crates and containers for produce handling.'
  },
  {
    id: 'packaging',
    name: 'Packaging Solutions',
    icon: ShoppingBag,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237864/packaging_qehuu0.webp',
    description: 'Leno bags, Jumbo bags, and Membrane bags for transport.'
  },
  {
    id: 'protective-covers',
    name: 'Protective Covers',
    icon: Layers,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237864/Protectivecovers_nim7h7.webp',
    description: 'Heavy-duty tarpaulins for all-weather protection.'
  },
  {
    id: 'irrigation-systems',
    name: 'Irrigation Systems',
    icon: Droplets,
    image: 'https://res.cloudinary.com/dik8mlsie/image/upload/v1773237863/irrigation_z934rg.webp',
    description: 'Efficient drip irrigation pipes and fittings.'
  }
];

// --- EXISTING PRODUCTS STATIC DATA ---
export const products = [
  {
    id: 'prod-weed-mat',
    name: 'Weed Mat',
    category: 'weed-control',
    description: 'Premium ground cover for weed suppression in nurseries and landscaping.',
    fullDescription: 'Our Weed Mat is a heavy-duty woven polypropylene fabric designed to suppress weed growth while allowing air and water to pass through. It creates a healthy environment for plants by maintaining soil moisture and preventing weeds from taking root.',
    priceRange: '₹15 - ₹25 / sqm',
    moq: '1000 sqm',
    specifications: {
      material: 'UV Stabilized PP',
      gsm: '90 - 150 GSM',
      width: '1m - 5m',
      color: 'Black',
      lifespan: '3-5 Years'
    },
    features: ['UV Resistant', 'Water Permeable', 'High Strength', 'Easy to Cut'],
    images: [
      'https://images.unsplash.com/photo-1632073522563-9cb406619137',
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8',
      'https://images.unsplash.com/photo-1601951855253-8e371af823d8',
      'https://images.unsplash.com/photo-1435914337925-bf9ef7a51c17',
      'https://images.unsplash.com/photo-1612132444144-ab11ca2f05cc'
    ],
    certifications: ['ISO 9001'],
    variants: ['90 GSM', '100 GSM', '120 GSM']
  },
  {
    id: 'prod-shade-net',
    name: 'Shade Net',
    category: 'shade-protection',
    description: 'High-density shade netting for agricultural and commercial use.',
    fullDescription: 'Our Shade Nets provide excellent protection against harsh sunlight, UV rays, and wind. Ideal for nurseries, greenhouses, and shade houses, they help regulate temperature and protect crops from sun scorch.',
    priceRange: '₹8 - ₹15 / sqm',
    moq: '2000 sqm',
    specifications: {
      material: 'HDPE Monofilament',
      shadePercentage: '35% - 90%',
      color: 'Green, Black, White',
      width: '3m - 6m',
      lifespan: '3-5 Years'
    },
    features: ['UV Stabilized', 'Tear Resistant', 'Lightweight', 'Durable'],
    images: [
      'https://images.unsplash.com/photo-1689979030586-a801e23870b7',
      'https://images.unsplash.com/photo-1684796531214-a69bf5b6c8d2',
      'https://images.unsplash.com/photo-1610829238936-bbba1805e09c',
      'https://images.unsplash.com/photo-1702912054079-8c010813a76b',
      'https://images.unsplash.com/photo-1600701362635-d03b79812f9c'
    ],
    certifications: ['UV Certified'],
    variants: ['50%', '75%', '90%']
  },
  {
    id: 'prod-mulch-film',
    name: 'Mulching Film',
    category: 'mulch-films',
    description: 'Agricultural mulching film for moisture conservation and weed control.',
    fullDescription: 'Mulching Film is essential for modern farming to conserve soil moisture, regulate soil temperature, and prevent weed growth. Available in various thicknesses and colors to suit different crop requirements.',
    priceRange: '₹180 - ₹220 / kg',
    moq: '500 kg',
    specifications: {
      material: 'LLDPE',
      thickness: '20 - 30 Micron',
      width: '1m - 1.2m',
      color: 'Silver/Black, Black',
      uvRating: '1 Season'
    },
    features: ['Moisture Retention', 'Weed Control', 'Early Harvest', 'Pest Repellent (Silver)'],
    images: [
      'https://images.unsplash.com/photo-1684796531214-a69bf5b6c8d2',
      'https://images.unsplash.com/photo-1688866513687-1344c3ccab04',
      'https://images.unsplash.com/photo-1601951855253-8e371af823d8',
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8',
      'https://images.unsplash.com/photo-1583564992049-a786281d6add'
    ],
    certifications: ['ISO 9001'],
    variants: ['20 Micron', '25 Micron', '30 Micron']
  },
  {
    id: 'prod-poly-film',
    name: 'Poly Film',
    category: 'greenhouse-materials',
    description: 'Clear UV-stabilized poly film for greenhouse cladding.',
    fullDescription: 'High-quality Poly Film for greenhouses, offering excellent light transmission and durability. It protects crops from weather elements while creating an optimal microclimate for growth.',
    priceRange: '₹200 - ₹250 / kg',
    moq: '500 kg',
    specifications: {
      material: 'LDPE',
      thickness: '200 Micron',
      width: '4.5m - 9m',
      transparency: 'High Clarity',
      uvRating: '3-5 Years'
    },
    features: ['Anti-Fog', 'Anti-Drip', 'Thermal Insulation', 'High Light Transmission'],
    images: [
      'https://images.unsplash.com/photo-1684796531214-a69bf5b6c8d2',
      'https://images.unsplash.com/photo-1583564992049-a786281d6add',
      'https://images.unsplash.com/photo-1689979030586-a801e23870b7',
      'https://images.unsplash.com/photo-1688866513687-1344c3ccab04',
      'https://images.unsplash.com/photo-1586427246273-ef2b51db3f44'
    ],
    certifications: ['UV Certified'],
    variants: ['Clear', 'Diffused']
  },
  {
    id: 'prod-pond-liner',
    name: 'Pond Liner',
    category: 'water-management',
    description: 'Heavy-duty geomembrane for water retention and aquaculture.',
    fullDescription: 'Our Pond Liners are made from high-density polyethylene (HDPE) to prevent water seepage. Ideal for farm ponds, aquaculture, and water reservoirs, ensuring efficient water storage.',
    priceRange: '₹40 - ₹80 / sqm',
    moq: '500 sqm',
    specifications: {
      material: 'HDPE / LDPE',
      thickness: '300 - 500 Micron',
      width: '3m - 7m',
      color: 'Black, Blue',
      lifespan: '5-10 Years'
    },
    features: ['Leak Proof', 'UV Resistant', 'Chemical Resistant', 'Easy Installation'],
    images: [
      'https://images.unsplash.com/photo-1691092090665-36a1175a5337',
      'https://images.unsplash.com/photo-1683092694736-0f6ab0df4fa5',
      'https://images.unsplash.com/photo-1586427246273-ef2b51db3f44',
      'https://images.unsplash.com/photo-1591760374517-719dff995e90',
      'https://images.unsplash.com/photo-1547059503-d1705f0bbdb2'
    ],
    certifications: ['ISO 9001'],
    variants: ['300 Micron', '500 Micron']
  },
  {
    id: 'prod-plastic-crate',
    name: 'Plastic Crate',
    category: 'harvesting-storage',
    description: 'Durable plastic crates for harvesting, storage, and transport.',
    fullDescription: 'Robust plastic crates designed for handling fruits and vegetables. Ventilated design allows air circulation to keep produce fresh during transport and storage.',
    priceRange: '₹250 - ₹450 / unit',
    moq: '100 Units',
    specifications: {
      material: 'HDPE Food Grade',
      capacity: '20kg - 25kg',
      dimensions: '540x360x290 mm',
      color: 'Red, Blue, Green, Orange',
      type: 'Perforated'
    },
    features: ['Stackable', 'Ventilated', 'Impact Resistant', 'Food Safe'],
    images: [
      'https://images.unsplash.com/photo-1699175752675-0d4d1396d3c8',
      'https://images.unsplash.com/photo-1561643553-389c47b52f5b',
      'https://images.unsplash.com/photo-1529331047688-d12d5104a4c7',
      'https://images.unsplash.com/photo-1686970203209-e0e2be1c81f6',
      'https://images.unsplash.com/photo-1537557215309-01b4a0e078b9'
    ],
    certifications: ['Food Grade'],
    variants: ['Solid', 'Perforated']
  },
  {
    id: 'prod-leno-bag',
    name: 'Leno Bag',
    category: 'packaging',
    description: 'Mesh bags for packaging onions, potatoes, and vegetables.',
    fullDescription: 'Leno Bags are excellent for packing fresh produce like potatoes, onions, and citrus. The mesh fabric allows products to breathe, preventing rot and extending shelf life.',
    priceRange: '₹5 - ₹15 / bag',
    moq: '5000 Bags',
    specifications: {
      material: 'PP/PE',
      capacity: '5kg - 50kg',
      color: 'Red, Orange, Yellow',
      closure: 'Drawstring',
      mesh: 'Open Weave'
    },
    features: ['Breathable', 'Strong', 'Reusable', 'Cost Effective'],
    images: [
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8',
      'https://images.unsplash.com/photo-1703646615729-7af1f6f0e7b7',
      'https://images.unsplash.com/photo-1703646615474-ac8364db3288',
      'https://images.unsplash.com/photo-1701943523432-9c64c6291836',
      'https://images.unsplash.com/photo-1696151781255-e8f75fa21338'
    ],
    certifications: ['ISO 9001'],
    variants: ['10kg', '25kg', '50kg']
  },
  {
    id: 'prod-jumbo-bag',
    name: 'Jumbo Bag',
    category: 'packaging',
    description: 'FIBC bulk bags for handling large quantities of materials.',
    fullDescription: 'Flexible Intermediate Bulk Containers (FIBC), or Jumbo Bags, are designed for storing and transporting bulk products like fertilizer, seeds, grains, and construction materials.',
    priceRange: '₹250 - ₹500 / bag',
    moq: '100 Bags',
    specifications: {
      material: 'Woven PP',
      capacity: '500kg - 1000kg',
      safetyFactor: '5:1',
      loops: '4 Lifting Loops',
      type: 'U-Panel or Circular'
    },
    features: ['High Load Capacity', 'UV Stabilized', 'Recyclable', 'Safe Handling'],
    images: [
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8',
      'https://images.unsplash.com/photo-1703646615474-ac8364db3288',
      'https://images.unsplash.com/photo-1703646615729-7af1f6f0e7b7',
      'https://images.unsplash.com/photo-1504807985152-1cbb654071ff',
      'https://images.unsplash.com/photo-1560839334-79924d965a51'
    ],
    certifications: ['ISO 21898'],
    variants: ['500kg', '1 Ton']
  },
  {
    id: 'prod-tarpaulin',
    name: 'Tarpaulin',
    category: 'protective-covers',
    description: 'Waterproof tarps for agricultural and general purpose covering.',
    fullDescription: 'Heavy-duty Tarpaulins provide reliable protection against rain, sun, and dust. Used for covering harvested crops, machinery, haystacks, and temporary shelters.',
    priceRange: '₹80 - ₹120 / sqm',
    moq: '500 sqm',
    specifications: {
      material: 'HDPE / PVC',
      gsm: '120 - 250 GSM',
      color: 'Blue, Yellow, Black',
      waterproof: '100%',
      eyelets: 'Every 1 meter'
    },
    features: ['Waterproof', 'UV Resistant', 'Tear Proof', 'Reinforced Edges'],
    images: [
      'https://images.unsplash.com/photo-1700152963635-0d0568cfc5d0',
      'https://images.unsplash.com/photo-1653519581673-61293d5dbb57',
      'https://images.unsplash.com/photo-1689979030586-a801e23870b7',
      'https://images.unsplash.com/photo-1586427246273-ef2b51db3f44',
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8'
    ],
    certifications: ['ISO 9001'],
    variants: ['HDPE', 'PVC']
  },
  {
    id: 'prod-drip-pipe',
    name: 'Drip Irrigation Pipe',
    category: 'irrigation-systems',
    description: 'Inline and online drip pipes for efficient water delivery.',
    fullDescription: 'Our Drip Irrigation Pipes are manufactured from high-grade virgin polyethylene. They ensure precise water delivery to plant roots, saving water and improving crop yield.',
    priceRange: '₹8 - ₹12 / meter',
    moq: '5000 meters',
    specifications: {
      diameter: '12mm, 16mm, 20mm',
      wallThickness: '0.6mm - 1.2mm',
      spacing: '20cm - 60cm',
      material: 'Virgin LLDPE',
      pressure: 'Class 2'
    },
    features: ['Clog Resistant', 'Uniform Flow', 'Durable', 'UV Stabilized'],
    images: [
      'https://images.unsplash.com/photo-1699862887138-825ade790e2e',
      'https://images.unsplash.com/photo-1573492017393-aeeaa8cba78f',
      'https://images.unsplash.com/photo-1697165927010-a966c1456ea7',
      'https://images.unsplash.com/photo-1632627254970-07f261b1f82e',
      'https://images.unsplash.com/photo-1539220365312-14510316c644'
    ],
    certifications: ['ISI Marked'],
    variants: ['Inline (Flat)', 'Online (Round)']
  },
  {
    id: 'prod-jio-bag',
    name: 'Jio Membrane Bag',
    category: 'packaging',
    description: 'Specialized bags for soil stabilization and river bank protection.',
    fullDescription: 'Jio Membrane Bags (Geobags) are used for erosion control, river bank protection, and coastal defense. Made from high-strength geotextile fabric.',
    priceRange: '₹150 - ₹300 / bag',
    moq: '200 Bags',
    specifications: {
      material: 'Non-woven Geotextile',
      gsm: '300 - 600 GSM',
      size: 'Custom',
      permeability: 'High',
      durability: 'High'
    },
    features: ['Erosion Control', 'High Tensile Strength', 'UV Resistant', 'Permeable'],
    images: [
      'https://images.unsplash.com/photo-1551520494-fac2cd3b0637',
      'https://images.unsplash.com/photo-1697250273200-df893313eb72',
      'https://images.unsplash.com/photo-1654578513266-728fbe673710',
      'https://images.unsplash.com/photo-1657310216929-7893c76d9287',
      'https://images.unsplash.com/photo-1601815732079-3e3d85717dd8'
    ],
    certifications: ['ISO 9001'],
    variants: ['Sand Bag', 'Large Container']
  }
];

// --- HELPER FUNCTIONS ---
export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.category === categoryId);
};

export const getCategoryById = (id) => {
  return productCategories.find(category => category.id === id);
};

// --- API INTEGRATION FOR DATABASE ---

const API_BASE_URL = API_URL;

/**
 * Ye function database se live products fetch karta hai.
 */
export const fetchProductsFromDB = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Network response was not ok');
    const dbProducts = await response.json();
    
    return dbProducts.map(p => {
        // Handle images that might be stored as JSON strings in DB
        let imgList = [];
        try {
            imgList = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []);
        } catch (e) {
            console.error("Image parsing failed for product:", p.id);
        }

        return {
            ...p,
            id: p.id ? String(p.id) : p._id, // Ensure ID is a string
            name: p.name,
            category: p.category,
            description: p.description || '',
            fullDescription: p.description || '', // Mapping DB description to fullDescription if needed
            priceRange: p.retail_price ? `₹${p.retail_price}` : (p.priceRange || 'Contact for Price'),
            moq: p.stock ? `${p.stock} units available` : 'N/A',
            images: imgList.length > 0 ? imgList : ['https://via.placeholder.com/400'], // Fallback image
            specifications: {
                gsm: p.gsm || 'N/A',
                durability: p.durability || 'N/A',
                hsn: p.hsn || 'N/A'
            },
            features: [], // DB doesn't have features yet
            isFromDB: true // Flag to identify DB products
        };
    });
  } catch (error) {
    console.error("Error fetching products from database:", error);
    return []; 
  }
};

/**
 * UPDATED: Combine Static and DB Products (with De-duplication)
 * Ye function use karein apne Shop page par.
 */
export const getAllUnifiedProducts = async () => {
  const dbProducts = await fetchProductsFromDB();
  
  // Static products + DB products
  return [...dbProducts, ...products];
};

/**
 * NEW: Dynamic Filter by Category (Both Static & DB)
 */
export const getUnifiedProductsByCategory = async (categoryId) => {
  const all = await getAllUnifiedProducts();
  return all.filter(p => p.category === categoryId);
};

/**
 * NEW: Unified Get Product By ID (Checks both sources)
 */
export const getUnifiedProductById = async (id) => {
    const all = await getAllUnifiedProducts();
    return all.find(p => String(p.id) === String(id));
};
