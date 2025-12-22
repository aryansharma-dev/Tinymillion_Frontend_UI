import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryGrid = () => {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    {
      id: 1,
      name: "T-Shirts",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
      link: "/collection?category=tshirts",
      count: "200+ Styles",
      gradient: "from-blue-600/80 to-blue-900/80"
    },
    {
      id: 2,
      name: "Hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop",
      link: "/collection?category=hoodies",
      count: "150+ Styles",
      gradient: "from-purple-600/80 to-purple-900/80"
    },
    {
      id: 3,
      name: "Oversized",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop",
      link: "/collection?category=oversized",
      count: "180+ Styles",
      gradient: "from-orange-600/80 to-orange-900/80"
    },
    {
      id: 4,
      name: "Joggers",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop",
      link: "/collection?category=joggers",
      count: "120+ Styles",
      gradient: "from-green-600/80 to-green-900/80"
    },
    {
      id: 5,
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop",
      link: "/collection?category=accessories",
      count: "90+ Items",
      gradient: "from-pink-600/80 to-pink-900/80"
    },
    {
      id: 6,
      name: "Sneakers",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
      link: "/collection?category=sneakers",
      count: "100+ Styles",
      gradient: "from-red-600/80 to-red-900/80"
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const cardWidth = 300; // Width of one card + gap
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const nextScroll = carouselRef.current.scrollLeft + cardWidth;

        if (nextScroll >= maxScroll) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentIndex(0);
        } else {
          carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
          setCurrentIndex(prev => prev + 1);
        }
      }
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth = 300;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      if (direction === 'left') {
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else {
        setCurrentIndex(prev => Math.min(categories.length - 1, prev + 1));
      }
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4"
          >
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-900">Popular Categories</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Shop by{' '}
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Explore our curated collections for every style and occasion
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none justify-between px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollCarousel('left')}
              className="pointer-events-auto p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all border-2 border-orange-200"
            >
              <ChevronLeft className="w-6 h-6 text-orange-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollCarousel('right')}
              className="pointer-events-auto p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all border-2 border-orange-200"
            >
              <ChevronRight className="w-6 h-6 text-orange-600" />
            </motion.button>
          </div>

          {/* Scrollable Carousel */}
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-8 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {/* Original Categories */}
            {categories.map((category, index) => (
              <motion.a
                key={category.id}
                href={category.link}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -12,
                  rotateX: 5,
                  rotateY: index % 2 === 0 ? -5 : 5,
                  transition: { duration: 0.3 }
                }}
                className="group relative block perspective-1000 flex-shrink-0 w-[280px]"
              >
                {/* Card Container */}
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                    
                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    {/* Floating Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                    >
                      <span className="text-xs font-bold text-gray-900">{category.count}</span>
                    </motion.div>

                    {/* Category Name */}
                    <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">
                        {category.name}
                      </h3>
                      
                      {/* Shop Now Button */}
                      <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-4">
                        <span className="text-sm font-semibold">Shop Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Border Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl border-2 border-transparent group-hover:border-white/50 transition-all duration-500" />
                </div>

                {/* 3D Shadow Effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900/20 to-transparent rounded-2xl lg:rounded-3xl transform translate-y-2 group-hover:translate-y-4 transition-transform duration-300 blur-xl" />
              </motion.a>
            ))}

            {/* Duplicate for infinite effect */}
            {categories.map((category) => (
              <motion.a
                key={`duplicate-${category.id}`}
                href={category.link}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3 }
                }}
                className="group relative block perspective-1000 flex-shrink-0 w-[280px]"
              >
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu">
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                      <span className="text-xs font-bold text-gray-900">{category.count}</span>
                    </div>

                    <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">
                        {category.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-sm font-semibold">Shop Now</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {categories.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex % categories.length ? 'w-8 bg-orange-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="/collection"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            View All Collections
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default CategoryGrid;