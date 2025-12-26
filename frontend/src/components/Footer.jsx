import { assets } from '../assets/assets';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import NewsletterBox from './NewsletterBox';
import { useState } from 'react';

const Footer = () => {
  const [openSection, setOpenSection] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? '' : section);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Desktop Layout - 4 Columns */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: About TinyMillion */}
          <div>
            <img src={assets.logo} className="mb-4 w-36" alt="TinyMillion logo" />
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Your go-to fashion destination, delivering unique style essentials with quality and confidence. Discover more, shop smart.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/_axyan1?igsh=MTQ4dTIzemtvYXZuNg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
              >
                <Instagram size={18} className="text-gray-600 group-hover:text-white" />
              </a>
              <a 
                href="https://www.facebook.com/share/1AkLc942gd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
              >
                <Facebook size={18} className="text-gray-600 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
              >
                <Twitter size={18} className="text-gray-600 group-hover:text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
              >
                <Youtube size={18} className="text-gray-600 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Care</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/faqs" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/shipping" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Shipping & Delivery
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/size-guide" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="/track-order" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/collection" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Shop All
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund" className="text-gray-600 text-sm hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">
                  Return & Refund
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          
        </div>

        {/* Mobile Layout - Accordion Style */}
        <div className="md:hidden space-y-4 mb-8">
          
          {/* About Section - Always Visible */}
          <div className="pb-4 border-b border-gray-200">
            <img src={assets.logo} className="mb-3 w-32" alt="TinyMillion logo" />
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Your go-to fashion destination, delivering unique style essentials with quality and confidence.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-2.5">
              <a 
                href="https://www.instagram.com/_axyan1?igsh=MTQ4dTIzemtvYXZuNg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://www.facebook.com/share/1AkLc942gd/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Customer Care Accordion */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('customer')}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
            >
              <span>Customer Care</span>
              <span className="text-xl">{openSection === 'customer' ? '−' : '+'}</span>
            </button>
            {openSection === 'customer' && (
              <ul className="mt-3 space-y-2 pl-2">
                <li><a href="/faqs" className="text-gray-600 text-sm">FAQs</a></li>
                <li><a href="/shipping" className="text-gray-600 text-sm">Shipping & Delivery</a></li>
                <li><a href="/returns" className="text-gray-600 text-sm">Returns & Exchanges</a></li>
                <li><a href="/contact" className="text-gray-600 text-sm">Contact Us</a></li>
                <li><a href="/size-guide" className="text-gray-600 text-sm">Size Guide</a></li>
                <li><a href="/track-order" className="text-gray-600 text-sm">Track Order</a></li>
              </ul>
            )}
          </div>

          {/* Quick Links Accordion */}
          <div className="border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection('links')}
              className="flex items-center justify-between w-full text-left font-semibold text-gray-900"
            >
              <span>Quick Links</span>
              <span className="text-xl">{openSection === 'links' ? '−' : '+'}</span>
            </button>
            {openSection === 'links' && (
              <ul className="mt-3 space-y-2 pl-2">
                <li><a href="/" className="text-gray-600 text-sm">Home</a></li>
                <li><a href="/collection" className="text-gray-600 text-sm">Shop All</a></li>
                <li><a href="/about" className="text-gray-600 text-sm">About Us</a></li>
                <li><a href="/terms" className="text-gray-600 text-sm">Terms & Conditions</a></li>
                <li><a href="/privacy" className="text-gray-600 text-sm">Privacy Policy</a></li>
                <li><a href="/refund" className="text-gray-600 text-sm">Return & Refund</a></li>
              </ul>
            )}
          </div>

          {/* Newsletter - Always Visible */}
          <div className="pt-2">
            <h3 className="font-semibold text-gray-900 mb-3">Stay Updated!</h3>
            <NewsletterBox />
            
            {/* Contact Info */}
            <div className="mt-4 space-y-2.5">
              <a 
                href="https://wa.me/919258808835" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 text-sm"
              >
                <Phone size={16} />
                <span>+91-925-8808-835</span>
              </a>
              <a 
                href="mailto:help.tinymillion@gmail.com"
                className="flex items-center gap-2 text-gray-600 text-sm"
              >
                <Mail size={16} />
                <span>help.tinymillion@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods & Copyright */}
        <div className="border-t border-gray-200 pt-8">
          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <div className="text-sm text-gray-500 font-medium">We Accept:</div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">VISA</div>
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">Mastercard</div>
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">PayPal</div>
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">UPI</div>
              <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-semibold text-gray-700">Paytm</div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500">
            © {currentYear} Tinymillion. All rights reserved. | Designed with <span className="text-red-500">❤️</span> for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;