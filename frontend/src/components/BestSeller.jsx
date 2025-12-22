import { useContext, useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import ShopContext from '../context/ShopContextInstance';
import { getPrimaryProductImage } from '../utils/productImages';
import { Star, TrendingUp, Eye, ShoppingCart, Heart, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

const BestSeller = () => {
  const { products, productPagination, loadNextProductsPage, currency } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const carouselRef = useRef(null);
  const constraintsRef = useRef(null);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10));
  }, [products]);

  useEffect(() => {
    if (!productPagination?.hasMore) return;
    if (bestSeller.length >= 10) return;
    loadNextProductsPage();
  }, [bestSeller.length, productPagination?.hasMore, loadNextProductsPage]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || bestSeller.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const scrollAmount = carouselRef.current.scrollLeft + 350;
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

        if (scrollAmount >= maxScroll) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, bestSeller.length]);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-yellow-300/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6 shadow-xl"
          >
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-white font-black text-sm uppercase tracking-wider">
              Best Sellers
            </span>
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Customer{' '}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Favorites
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Discover the newest styles and trends curated by TinyMillion - where fashion meets individuality
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 pointer-events-none">
            <div className="container mx-auto px-4 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollCarousel('left')}
                className="pointer-events-auto p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all border-2 border-purple-200"
              >
                <ChevronLeft className="w-6 h-6 text-purple-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollCarousel('right')}
                className="pointer-events-auto p-4 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all border-2 border-purple-200"
              >
                <ChevronRight className="w-6 h-6 text-purple-600" />
              </motion.button>
            </div>
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
            {bestSeller.map((item, index) => {
              const firstImg = getPrimaryProductImage(item);
              
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] group"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-white font-black text-lg">#{index + 1}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuickViewProduct(item)}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-white rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-all"
                      >
                        <Heart className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={firstImg}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Sale Badge */}
                      {item.sale && (
                        <div className="absolute bottom-4 left-4">
                          <div className="px-4 py-2 bg-red-600 rounded-full shadow-lg">
                            <span className="text-white font-black text-sm flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              SALE
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {item.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-black text-purple-600">
                          {currency}{item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            {currency}{item.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <motion.a
                        href={`/product/${item._id}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-center rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </motion.a>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}

            {/* Duplicate cards for infinite scroll effect */}
            {bestSeller.slice(0, 3).map((item, index) => {
              const firstImg = getPrimaryProductImage(item);
              
              return (
                <motion.div
                  key={`duplicate-${item._id}`}
                  whileHover={{ y: -10 }}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] group"
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-4 left-4 z-10">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <span className="text-white font-black text-lg">#{index + 1}</span>
                      </div>
                    </div>

                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={firstImg}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl font-black text-purple-600">
                          {currency}{item.price}
                        </span>
                      </div>

                      <motion.a
                        href={`/product/${item._id}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-center rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {bestSeller.slice(0, 5).map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex % 5 ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
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
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/collection?bestseller=true"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-2xl group"
          >
            View All Best Sellers
            <TrendingUp className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.a>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
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

export default BestSeller;