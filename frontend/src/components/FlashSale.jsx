import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, ArrowRight, Eye, ShoppingCart, Zap } from 'lucide-react';
import ShopContext from '../context/ShopContextInstance';
import { getProductImageArray } from '../utils/productImages';

const FlashSale = () => {
  const { products, currency } = useContext(ShopContext);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Featured flash sale products (first 4 products)
  const flashProducts = products.slice(0, 4);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset to 24 hours when countdown ends
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Flip animation component
  const FlipNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    return (
      <div className="relative w-16 h-20 md:w-20 md:h-24 lg:w-24 lg:h-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={displayValue}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-2xl border-2 border-red-400"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">
              {String(displayValue).padStart(2, '0')}
            </span>
          </motion.div>
        </AnimatePresence>
        
        {/* Shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent rounded-xl" />
      </div>
    );
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          >
            <Flame className="w-6 h-6 text-orange-300 opacity-20" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
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
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-6 shadow-xl"
          >
            <Zap className="w-6 h-6 text-yellow-300 animate-pulse" />
            <span className="text-white font-black text-lg uppercase tracking-wider">
              Flash Sale
            </span>
            <Flame className="w-6 h-6 text-yellow-300 animate-bounce" />
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Limited Time{' '}
            <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Mega Deals
            </span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Grab your favorites before time runs out! Unbeatable prices, limited stock!
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-orange-200">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-red-600" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Sale Ends In
              </h3>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <FlipNumber value={timeLeft.hours} />
                <span className="text-sm md:text-base font-bold text-gray-700 mt-3 uppercase tracking-wider">
                  Hours
                </span>
              </div>

              {/* Separator */}
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl md:text-5xl font-black text-red-600 pb-8"
              >
                :
              </motion.div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <FlipNumber value={timeLeft.minutes} />
                <span className="text-sm md:text-base font-bold text-gray-700 mt-3 uppercase tracking-wider">
                  Minutes
                </span>
              </div>

              {/* Separator */}
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl md:text-5xl font-black text-red-600 pb-8"
              >
                :
              </motion.div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <FlipNumber value={timeLeft.seconds} />
                <span className="text-sm md:text-base font-bold text-gray-700 mt-3 uppercase tracking-wider">
                  Seconds
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-semibold">⚡ Limited Stock!</span>
                <span className="font-semibold">Hurry Up!</span>
              </div>
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full"
                />
                <motion.div
                  animate={{
                    left: ["0%", "100%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </div>
              <p className="text-center text-sm text-gray-600 mt-2 font-medium">
                65% Already Sold! 🔥
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full shadow-lg">
                      <span className="text-white font-black text-sm">
                        50% OFF
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={getProductImageArray(product)[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl font-black text-red-600">
                        {currency}{product.price}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {currency}{product.price * 2}
                      </span>
                    </div>

                    {/* Stock Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Available: 12/50</span>
                        <span className="font-bold text-orange-600">24% left</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          whileInView={{ width: "24%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-orange-600 to-red-600 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.a
                      href={`/product/${product._id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-center rounded-xl hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Shop Now
                    </motion.a>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-300/50 to-red-300/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="/collection?sale=true"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-bold text-lg hover:from-gray-800 hover:to-gray-600 transition-all shadow-2xl hover:shadow-3xl group"
          >
            View All Flash Deals
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSale;