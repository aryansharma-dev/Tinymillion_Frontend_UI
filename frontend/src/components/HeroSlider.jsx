import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, Sparkles, Zap, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const slides = [
    {
      id: 1,
      title: "Winter Collection 2025",
      subtitle: "Stay Cozy, Look Cool",
      description: "Explore our latest winter essentials with up to 50% off",
      cta: "Shop Winter",
      link: "/collection?category=winter",
      // Placeholder - Replace with actual image
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
      gradient: "from-blue-900/70 via-blue-800/50 to-transparent",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "New Arrivals"
    },
    {
      id: 2,
      title: "Mega Sale Alert!",
      subtitle: "Flat 50% OFF",
      description: "On all trending styles - Limited time offer",
      cta: "Grab Deal Now",
      link: "/collection?sale=true",
      // Placeholder - Replace with actual image
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&h=1080&fit=crop",
      gradient: "from-red-900/70 via-red-800/50 to-transparent",
      icon: <Zap className="w-6 h-6" />,
      badge: "50% OFF"
    },
    {
      id: 3,
      title: "Trending Streetwear",
      subtitle: "Fashion Meets Comfort",
      description: "Discover the latest urban fashion trends",
      cta: "Explore Collection",
      link: "/collection?category=streetwear",
      // Placeholder - Replace with actual image
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=1080&fit=crop",
      gradient: "from-purple-900/70 via-purple-800/50 to-transparent",
      icon: <TrendingUp className="w-6 h-6" />,
      badge: "Trending"
    },
    {
      id: 4,
      title: "Premium Essentials",
      subtitle: "Elevate Your Style",
      description: "Curated collection of must-have fashion pieces",
      cta: "Shop Essentials",
      link: "/collection?category=essentials",
      // Placeholder - Replace with actual image
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
      gradient: "from-gray-900/70 via-gray-800/50 to-transparent",
      icon: <Star className="w-6 h-6" />,
      badge: "Premium"
    },
    {
      id: 5,
      title: "Oversized Revolution",
      subtitle: "Comfort Redefined",
      description: "The perfect fit for maximum style & comfort",
      cta: "Shop Oversized",
      link: "/collection?fit=oversized",
      // Placeholder - Replace with actual image
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1920&h=1080&fit=crop",
      gradient: "from-orange-900/70 via-orange-800/50 to-transparent",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "Hot Pick"
    }
  ];

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        speed={800}
        className="hero-slider h-[60vh] md:h-[75vh] lg:h-[85vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              </div>

              {/* Content */}
              <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-full">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl text-white"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 border border-white/30"
                    >
                      {slide.icon}
                      <span className="text-sm font-semibold">{slide.badge}</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 leading-tight"
                    >
                      {slide.title}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-white/90"
                    >
                      {slide.subtitle}
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="text-base sm:text-lg md:text-xl mb-8 text-white/80 max-w-xl"
                    >
                      {slide.description}
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <a
                        href={slide.link}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300 shadow-2xl group"
                      >
                        {slide.cta}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all group">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all group">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>

      {/* Custom Pagination Styles */}
      <style jsx>{`
        .hero-slider .swiper-pagination {
          bottom: 30px !important;
        }
        
        .hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.3s ease;
        }
        
        .hero-slider .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 6px;
          background: white;
        }

        @media (max-width: 768px) {
          .hero-slider .swiper-pagination {
            bottom: 20px !important;
          }
          
          .hero-slider .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
          }
          
          .hero-slider .swiper-pagination-bullet-active {
            width: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;