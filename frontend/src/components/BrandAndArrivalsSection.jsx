import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Brand logos data - using placeholder images from Unsplash
// In production, replace with actual brand logo URLs
const BRAND_LOGOS = [
  {
    id: 1,
    name: 'Brand One',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Brand Two',
    logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=100&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Brand Three',
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d9c9c0418?w=200&h=100&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Brand Four',
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=100&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Brand Five',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=100&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Brand Six',
    logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=100&fit=crop&q=80',
  },
];

const LOGO_HEIGHT = 60; // Fixed height for all logos

const BrandAndArrivalsSection = () => {

  return (
    <>
      {/* SECTION 1: BRAND LOGO GRID */}
      <section
        className="py-16 bg-white border-b border-neutral-100"
        aria-label="Brand Partners"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {BRAND_LOGOS.map((brand) => (
              <div
                key={brand.id}
                className="flex flex-col items-center justify-center"
              >
                {/* Logo Image */}
                <div
                  className="flex items-center justify-center mb-4"
                  style={{ height: LOGO_HEIGHT }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-auto object-contain"
                    style={{ maxHeight: `${LOGO_HEIGHT}px`, maxWidth: '100%' }}
                    loading="lazy"
                  />
                </div>
                {/* Brand Name */}
                <p className="text-xs uppercase tracking-wider text-neutral-500 font-light text-center">
                  {brand.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: NEW ARRIVALS BANNER */}
      <section
        className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden"
        aria-label="New Arrivals"
      >
        {/* Fixed Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80)',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-white mb-8 tracking-tight leading-tight"
            style={{
              letterSpacing: '-0.02em',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            NEW ARRIVALS
          </motion.h2>

          <motion.a
            href="/collection?filter=new"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white text-base font-semibold uppercase tracking-wider rounded-md shadow-lg hover:shadow-2xl transition-all duration-300 group"
            style={{ minHeight: '3.5rem' }}
          >
            <span>SEE NEW ARRIVALS</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </motion.a>
        </div>
      </section>
    </>
  );
};

export default BrandAndArrivalsSection;

