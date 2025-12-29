import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Mock context for demo
const ShopContext = {
  products: [],
  productPagination: { hasMore: false },
  loadNextProductsPage: () => {},
};

const FLOAT_VARIANT = {
  animate: {
    y: [0, -16, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const LatestCollection = () => {
  const { products, productPagination, loadNextProductsPage } = ShopContext;
  const [latestProducts, setLatestProducts] = useState([]);

  const storyContent = {
    badge: "New Arrivals 2025",
    title: "Latest Collection",
    description:
      "Discover the season's must-have pieces and individual style. The newest arrivals blend minimalism and comfort in every detail.",
    lifestyleImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=1600&fit=crop",
    accentImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=700&h=900&fit=crop",
  };

  useEffect(() => {
    const latest = products.slice(0, 10);
    setLatestProducts(latest);
  }, [products]);

  useEffect(() => {
    if (!productPagination?.hasMore) return;
    if (products.length >= 10) return;
    loadNextProductsPage();
  }, [products.length, productPagination?.hasMore, loadNextProductsPage]);

  return (
    <section
      className="relative bg-white overflow-hidden"
      aria-labelledby="latest-collection-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Content */}
          <div className="relative order-2 lg:order-1 z-10">
            <div className="max-w-xl lg:pr-8">
              {/* Badge */}
              <span className="inline-block mb-3 text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                {storyContent.badge}
              </span>

              {/* Title */}
              <h2
                id="latest-collection-heading"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-none tracking-tight"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {storyContent.title}
              </h2>

              {/* Decorative Line */}
              <div className="w-16 h-0.5 bg-gray-900 mb-6" />

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-md">
                {storyContent.description}
              </p>

              {/* CTA Button */}
              <a
                href="/collection"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-medium text-sm uppercase tracking-wider rounded-none transition-all duration-300 hover:bg-gray-800 hover:gap-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Images (Large + Small Overlapping) */}
          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Large Image */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  width: "420px",
                  height: "580px",
                }}
              >
                <img
                  src={storyContent.lifestyleImage}
                  alt="Model in latest editorial collection"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 ring-1 ring-black/5 rounded-3xl pointer-events-none" />
              </div>

              {/* Small Floating Image - Overlapping from Left-Top */}
              <motion.div
                variants={FLOAT_VARIANT}
                animate="animate"
                className="absolute -left-40 top-16 z-20 shadow-2xl rounded-2xl overflow-hidden"
                style={{
                  width: "300px",
                  height: "400px",
                }}
              >
                <img
                  src={storyContent.accentImage}
                  alt="Editorial fashion highlight"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 ring-2 ring-white rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-black/10 rounded-2xl pointer-events-none" />
              </motion.div>

              {/* Decorative Element Behind */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-gray-100 rounded-3xl -z-10" />
            </div>
          </div>

        </div>

        {/* Bottom Decorative Divider */}
        <div className="mt-20 flex justify-center">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default LatestCollection;