import { useContext, useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShopContext from '../context/ShopContextInstance';
import ProductItem from './ProductItem';
import { getProductImageArray } from '../utils/productImages';
import { ArrowRight, Sparkles, TrendingUp, Star } from 'lucide-react';

const LatestCollection = () => {
  const { products, productPagination, loadNextProductsPage } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for the image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.1]);

  useEffect(() => {
    const latest = products.slice(0, 10);
    setLatestProducts(latest);
    setFeaturedProducts(latest.slice(0, 3)); // First 3 products as featured
  }, [products]);

  useEffect(() => {
    if (!productPagination?.hasMore) return;
    if (products.length >= 10) return;
    loadNextProductsPage();
  }, [products.length, productPagination?.hasMore, loadNextProductsPage]);

  const storyContent = {
    badge: "New Arrivals 2025",
    title: "Latest Collections",
    subtitle: "Where Fashion Meets Individuality",
    description: "Discover the newest styles and trends curated by TinyMillion. Each piece tells a story of creativity, comfort, and confidence. From street-style essentials to premium classics, our latest collection brings you the best of contemporary fashion.",
    features: [
      { icon: <Sparkles className="w-5 h-5" />, text: "Hand-picked by Style Experts" },
      { icon: <TrendingUp className="w-5 h-5" />, text: "Trending This Season" },
      { icon: <Star className="w-5 h-5" />, text: "Premium Quality Fabrics" }
    ],
    lifestyleImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=1600&fit=crop"
  };

  return (
    <div className="relative overflow-hidden">
      {/* Storytelling Section - Full Width Split */}
      <section ref={containerRef} className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="grid lg:grid-cols-2 gap-0">
          
          {/* Left Side - Parallax Lifestyle Image */}
          <motion.div 
            className="relative overflow-hidden bg-gray-900 h-[50vh] lg:h-screen lg:sticky lg:top-0"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Parallax Container */}
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={storyContent.lifestyleImage}
                alt="Latest Collection Lifestyle"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            </motion.div>

            {/* Floating Stats on Image */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div>
                    <p className="text-3xl font-black">50+</p>
                    <p className="text-xs opacity-80">New Styles</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">100%</p>
                    <p className="text-xs opacity-80">Premium</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black">⭐4.9</p>
                    <p className="text-xs opacity-80">Rated</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Collection Story + Products */}
          <div className="relative flex items-center py-12 lg:py-16 min-h-screen lg:min-h-0">
            <div className="w-full px-6 sm:px-12 lg:px-16 xl:px-20 space-y-8">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-full text-sm font-semibold text-orange-900">
                  <Sparkles className="w-4 h-4" />
                  {storyContent.badge}
                </span>
              </motion.div>

              {/* Title with Text Reveal */}
              <div className="space-y-3">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900"
                >
                  {storyContent.title.split(' ').map((word, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="inline-block mr-3"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h2>

                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                >
                  {storyContent.subtitle}
                </motion.h3>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 text-base sm:text-lg leading-relaxed"
              >
                {storyContent.description}
              </motion.p>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-3"
              >
                {storyContent.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* 3 Key Featured Products */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pt-6"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-4">Featured This Week</h4>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {featuredProducts.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="group"
                    >
                      <a href={`/product/${item._id}`} className="block">
                        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-square mb-2">
                          <img
                            src={getProductImageArray(item)[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                        <h5 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
                          {item.name}
                        </h5>
                        <p className="text-sm sm:text-base font-bold text-orange-600">
                          ₹{item.price}
                        </p>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <a
                  href="/collection"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
                >
                  Explore Full Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Shop All New Arrivals
          </h3>
          <p className="text-gray-600 text-lg">
            Browse our complete collection of latest products
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {latestProducts.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ProductItem
                id={item._id}
                image={getProductImageArray(item)}
                name={item.name}
                price={item.price}
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LatestCollection;