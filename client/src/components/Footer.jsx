import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Lock, FileText } from 'lucide-react';
import { API_URL } from '@/utils/config';

const FALLBACK_BROCHURE = 'https://res.cloudinary.com/dik8mlsie/image/upload/v1/Farmliv_Brochure_cg40zq.pdf';

const Footer = () => {
  const [brochureUrl, setBrochureUrl] = useState(FALLBACK_BROCHURE);

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(r => r.json())
      .then(data => { if (data?.brochure) setBrochureUrl(data.brochure); })
      .catch(() => {}); // silently fall back
  }, []);

  return <footer className="bg-[#2E7D32] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                <span className="text-[#2E7D32] font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold">Farmliv Industries</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Premium B2B agricultural solutions provider, committed to delivering quality products for modern farming.
            </p>
            <div className="flex gap-4 pt-2">
              {/* ⭐ UPDATED: SEO Friendly Facebook Link */}
              <a 
                href="https://www.facebook.com/share/1B3uGhgYQQ/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" 
                title="Follow Farmliv Industries on Facebook"
                aria-label="Follow Farmliv Industries on Facebook"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>

              <a 
                href="#" 
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" 
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
              </a>
              {/* ⭐ UPDATED: SEO Friendly LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/company/farmliv/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" 
                title="Follow Farmliv Industries on LinkedIn"
                aria-label="Follow Farmliv Industries on LinkedIn"
              >
                <Linkedin className="w-5 h-5" aria-hidden="true" />
              </a>

              {/* ⭐ UPDATED: SEO Friendly Instagram Link */}
              <a 
                href="https://www.instagram.com/farmliv.industries?igsh=MXhwanhqdDh5Nm4000000" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" 
                title="Follow Farmliv Industries on Instagram"
                aria-label="Follow Farmliv Industries on Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 sm:mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/certification" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Certification
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 sm:mb-4">Our Product Category</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/products/weed-control" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Weed Control Mat
                </Link>
              </li>
              <li>
                <Link to="/products/shade-nets" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Shade Net
                </Link>
              </li>
              <li>
                <Link to="/products/irrigation-systems" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Drip Irrigation
                </Link>
              </li>
              <li>
                <Link to="/products/crop-protection" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">
                  Mulch Film
                </Link>
              </li>
              <li className="pt-4">
                <a 
                  href={brochureUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-green-50 text-[#2E7D32] px-8 py-3.5 rounded shadow-md transition-all duration-300 w-fit"
                >
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  <span className="font-semibold text-sm sm:text-base tracking-wide">E-Catalogue</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2 sm:mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 opacity-80" aria-hidden="true" />
                <span className="text-green-100 text-sm sm:text-base">
                  Farmliv Industries <br/>
                  1st Floor Farmliv Industries, Queens Arcade, Tangni Chariali, Darrang. Pin - 784146
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 opacity-80" aria-hidden="true" />
                <a href="tel:+919181127883" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">+91 91811 27883</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 opacity-80" aria-hidden="true" />
                <a href="mailto:sales@farmliv.com" className="text-green-100 hover:text-white transition-colors py-2 block text-sm sm:text-base">sales@farmliv.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center text-green-100 text-sm">
          <p>&copy; {new Date().getFullYear()} Farmliv Industries. All rights reserved. | ISO 9001:2015 Certified</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>;
};

export default Footer;

