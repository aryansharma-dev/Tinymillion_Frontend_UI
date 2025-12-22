import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // User's requested import
import { gsap } from 'gsap';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const products = [
  {
    id: 1,
    category: "Accessories",
    title: "Beachwear Vintage",
    price: 820.00,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d?q=80&w=600",
    colors: ["#1a365d", "#718096", "#cbd5e0", "#feb2b2"],
    sizes: ["L", "M", "S", "XL"]
  },
  {
    id: 2,
    category: "Accessories",
    title: "Clemson Sherpa Jacket",
    price: 150.99,
    oldPrice: 200.00,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600",
    colors: ["#fef3c7", "#d97706", "#f87171", "#fbbf24"],
    sizes: ["L", "M", "S", "XL"],
    sale: "25%"
  },
  {
    id: 3,
    category: "Accessories",
    title: "Drawstring Shirt Dress",
    price: 200.00,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1595991209266-5ff5a3a2f008?q=80&w=600",
    colors: ["#2d3748", "#edf2f7", "#fff5f5", "#f6ad55"],
    sizes: ["L", "M", "S", "XL"]
  },
  {
    id: 4,
    category: "Accessories",
    title: "Premium Blue Bag",
    price: 210.00,
    oldPrice: null,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
    colors: ["#a0aec0", "#fbd38d", "#fc8181"],
    sizes: ["OS"]
  },
  {
    id: 5,
    category: "Fashion",
    title: "Urban Cotton Tee",
    price: 45.00,
    oldPrice: 60.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600",
    colors: ["#000", "#fff", "#ccc"],
    sizes: ["M", "L", "XL"]
  }
];

const MostPurchase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Items to show at once
  const visibleItems = 4;
  const maxIndex = products.length - visibleItems;

  const slideNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const slidePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // GSAP Animation for sliding
  useEffect(() => {
    gsap.to(sliderRef.current, {
      xPercent: - (currentIndex * (100 / visibleItems)),
      duration: 0.8,
      ease: "power3.inOut"
    });
  }, [currentIndex]);

  // Auto-slide functionality
  useEffect(() => {
    autoPlayRef.current = setInterval(slideNext, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, [currentIndex]);

  return (
    <div className="w-full max-w-[1400px] mx-auto py-16 px-4 font-sans select-none">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-gray-400 text-sm uppercase tracking-widest mb-2 font-medium">Top Trending</h4>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Most{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Purchased
            </span>
          </h2>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={slidePrev}
            className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={slideNext}
            className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div className="relative overflow-hidden group">
        <div ref={sliderRef} className="flex">
          {products.map((product) => (
            <div key={product.id} className="min-w-[100%] sm:min-w-[50%] lg:min-w-[25%] p-2">
              <div className="bg-white group/card relative">
                
                {/* Image Section */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F5]">
                  {product.sale && (
                    <span className="absolute top-4 left-4 z-10 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-tighter">
                      UP TO {product.sale}
                    </span>
                  )}
                  
                  <button className="absolute top-4 right-4 z-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <Heart size={20} className="text-gray-600 hover:fill-red-500 hover:text-red-500 transition-colors" />
                  </button>

                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />

                  {/* Quick Shop Overlay - GSAP or Framer Motion target */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 w-full bg-black text-white py-3 flex items-center justify-center gap-2 cursor-pointer transition-all active:bg-gray-800"
                  >
                    <Eye size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Quick Shop</span>
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="py-5 text-center flex flex-col items-center">
                  <span className="text-gray-400 text-xs mb-1">{product.category}</span>
                  <h3 className="text-sm font-medium text-gray-800 mb-2 cursor-pointer hover:text-gray-500 transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="flex gap-2 items-center mb-3">
                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">${product.oldPrice.toFixed(2)}</span>
                    )}
                    <span className={`${product.oldPrice ? 'text-red-500' : 'text-gray-600'} font-semibold text-sm`}>
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex gap-1.5 mb-4">
                    {product.colors.map((color, idx) => (
                      <div 
                        key={idx} 
                        style={{ backgroundColor: color }}
                        className="w-3 h-3 rounded-full border border-gray-200 cursor-pointer hover:scale-125 transition-transform"
                      />
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-[10px] text-gray-400 font-medium">+3</span>
                    )}
                  </div>

                  {/* Size Swatches */}
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <div key={size} className="w-7 h-7 border border-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium hover:border-black hover:text-black cursor-pointer transition-all">
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostPurchase;