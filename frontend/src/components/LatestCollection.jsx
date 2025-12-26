import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ShopContext from "../context/ShopContextInstance";
import { ArrowRight } from "lucide-react";

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
  const { products, productPagination, loadNextProductsPage } =
    useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  // Content
  const storyContent = {
    badge: "New Arrivals 2025",
    title: "Latest Collection",
    description:
      "Discover the season’s must-have pieces and individual style. The newest arrivals blend minimalism and comfort in every detail.",
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
    <>
      <section
        className="relative bg-white"
        aria-labelledby="latest-collection-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-20 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 gap-x-16 items-center">
            {/* LEFT: Small Image + Content */}
            <div className="relative flex flex-col items-start max-w-lg w-full mx-auto lg:mx-0">
              {/* Floating small image overlaps large image (on right, via negative margin) */}
              <motion.div
                variants={FLOAT_VARIANT}
                animate="animate"
                className="z-10 absolute left-0 -top-10 sm:-top-12 lg:static lg:mb-10 shadow-xl rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200"
                style={{
                  width: "7.2rem",
                  height: "9.2rem",
                  boxShadow: "0 8px 26px 0 rgb(30 32 42 / 8%)",
                  marginBottom: "2.25rem",
                }}
                tabIndex={-1}
              >
                <img
                  src={storyContent.accentImage}
                  alt="Editorial fashion highlight"
                  className="w-full h-full object-cover rounded-xl"
                  draggable={false}
                  style={{ userSelect: "none" }}
                />
                <div className="absolute inset-0 border border-white/70 rounded-xl pointer-events-none" />
              </motion.div>
              {/* Shift content down to match float and allow room for overlap */}
              <div className="pt-20 lg:pt-6">
                {/* Category Badge */}
                <span className="block mb-4 text-[0.82rem] select-none uppercase tracking-wide text-neutral-400 font-medium">
                  {storyContent.badge}
                </span>
                {/* Heading */}
                <h2
                  id="latest-collection-heading"
                  className="font-serif text-gray-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight"
                  style={{
                    letterSpacing: "-.02em",
                    lineHeight: "1.08",
                  }}
                >
                  {storyContent.title}
                </h2>
                {/* Decorative Divider/Underline */}
                <div className="h-[2px] w-14 bg-gradient-to-r from-transparent via-neutral-400/60 to-transparent rounded-full my-5" />
                {/* Description */}
                <p className="text-base sm:text-lg text-neutral-500 font-normal mb-7 leading-relaxed">
                  {storyContent.description}
                </p>
                {/* CTA Button */}
                <a
                  href="/collection"
                  className="inline-flex items-center gap-3 px-7 py-3 rounded-md bg-gray-900 text-white font-semibold text-base shadow-sm border border-gray-900 group transition
                  hover:shadow-lg hover:-translate-y-0.5 active:shadow active:scale-98 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-800/10"
                  style={{ WebkitTapHighlightColor: "transparent", minHeight: "3.25rem" }}
                >
                  <span>Discover the Collection</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
            {/* RIGHT: Large Static Image (slightly overlapped by small left image using negative margin on lg+) */}
            <div className="relative flex justify-center items-center min-h-[28rem] lg:min-h-[36rem]">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl bg-neutral-100 border border-neutral-200"
                style={{
                  height: "32rem",
                  width: "21rem",
                }}
              >
                <img
                  src={storyContent.lifestyleImage}
                  alt="Model in latest editorial collection"
                  className="w-full h-full object-cover rounded-3xl"
                  draggable={false}
                  style={{ userSelect: "none" }}
                />
                <div className="absolute inset-0 border border-neutral-200/70 rounded-3xl pointer-events-none" />
                {/* Small image overlap for LG screens (empty absolutely positioned block to create overlap/buffer) */}
                <div className="hidden lg:block absolute -left-14 top-10 w-14 h-40 bg-transparent" />
              </div>
            </div>
          </div>
          {/* Section Underline/Accent Divider (like Most Purchased) */}
          <div className="w-full flex justify-start mt-12 select-none">
            <div className="h-[2px] w-[120px] sm:w-[190px] rounded-full bg-gradient-to-r from-transparent via-neutral-300/70 to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
};

export default LatestCollection;