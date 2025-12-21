import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowRight, Sparkles, Zap, TrendingUp, Star, ShoppingBag, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);

  const slides = [
    {
      id: 1,
      type: 'image', // image type
      title: "Mega Sale Alert",
      subtitle: "at 50% OFF",
      description: "Limited time offer on trending styles - Don't miss out!",
      cta: "Grab Deal Now",
      link: "/collection?sale=true",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop",
      gradient: "from-orange-900/80 via-red-800/60 to-transparent",
      icon: <Zap className="w-6 h-6" />,
      badge: "🔥 Hot Deal",
      stats: { sold: "10Cr+", customers: "2Cr+", rating: "100%" }
    },
    {
      id: 2,
      type: 'video', // video type
      title: "Celebrity Collection",
      subtitle: "As Seen On Stars",
      description: "Exclusive designs worn by your favorite celebrities",
      cta: "Shop Celebrity Style",
      link: "/collection?celebrity=true",
      video: "https://cdn.pixabay.com/video/2024/08/08/224762_large.mp4", // Replace with your video
      gradient: "from-purple-900/70 via-purple-800/50 to-transparent",
      icon: <Star className="w-6 h-6" />,
      badge: "⭐ Celebrity",
      stats: { sold: "10Cr+", customers: "2Cr+", rating: "100%" }
    },
    {
      id: 3,
      type: 'image',
      title: "New Collection Drop",
      subtitle: "Summer Essentials",
      description: "Fresh styles for the season ahead - Be the trendsetter",
      cta: "Shop Now",
      link: "/collection?new=true",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop",
      gradient: "from-blue-900/80 via-blue-800/60 to-transparent",
      icon: <Sparkles className="w-6 h-6" />,
      badge: "✨ New Arrivals",
      stats: { sold: "10Cr+", customers: "2Cr+", rating: "100%" }
    },
    {
      id: 4,
      type: 'video',
      title: "360° Product View",
      subtitle: "Experience Fashion",
      description: "See every detail, every angle - Premium quality guaranteed",
      cta: "Explore Collection",
      link: "/collection?featured=true",
      video: "https://cdn.pixabay.com/video/2024/03/29/206137_large.mp4", // Replace with your video
      gradient: "from-pink-900/70 via-pink-800/50 to-transparent",
      icon: <TrendingUp className="w-6 h-6" />,
      badge: "🎬 Featured",
      stats: { sold: "10Cr+", customers: "2Cr+", rating: "100%" }
    },
    {
      id: 5,
      type: 'image',
      title: "Premium Quality",
      subtitle: "Unbeatable Prices",
      description: "Luxury fashion within your budget - Quality guaranteed",
      cta: "Shop Premium",
      link: "/collection?premium=true",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop",
      gradient: "from-gray-900/80 via-gray-800/60 to-transparent",
      icon: <Star className="w-6 h-6" />,
      badge: "💎 Premium",
      stats: { sold: "10Cr+", customers: "2Cr+", rating: "100%" }
    }
  ];

  // Categories for floating bar
  const categories = [
    { icon: "👔", name: "T-Shirts", link: "/collection?category=tshirts" },
    { icon: "👗", name: "Women", link: "/collection?category=women" },
    { icon: "👟", name: "Sneakers", link: "/collection?category=sneakers" },
    { icon: "💼", name: "Accessories", link: "/collection?category=accessories" },
    { icon: "🏠", name: "Hoodies", link: "/collection?category=hoodies" },
    { icon: "👖", name: "Joggers", link: "/collection?category=joggers" }
  ];

  // Handle video play/pause on slide change
  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.realIndex;
    setActiveIndex(currentIndex);

    // Pause all videos
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Play current video if it's a video slide
    const currentSlide = slides[currentIndex];
    if (currentSlide.type === 'video' && videoRefs.current[currentIndex]) {
      videoRefs.current[currentIndex].play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
  };

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        loop={true}
        speed={1000}
        onSlideChange={handleSlideChange}
        onSwiper={(swiper) => handleSlideChange(swiper)}
        className="hero-slider h-screen"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full bg-black">
              {/* Background - Image or Video */}
              <div className="absolute inset-0">
                {slide.type === 'image' ? (
                  // Image Slide
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ) : (
                  // Video Slide
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="w-full h-full object-cover"
                    muted={isMuted}
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={slide.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* Multi-layered Gradient Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Video Badge (if video slide) */}
              {slide.type === 'video' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-8 right-8 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-red-600/90 backdrop-blur-md rounded-full flex items-center gap-2 border border-red-400/30">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-sm font-bold">LIVE VIDEO</span>
                    </div>
                    <button
                      onClick={toggleMute}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/30"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Content Container */}
              <div className="relative h-full w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
                  <div className="grid lg:grid-cols-2 gap-12 items-center h-full py-20">
                  
                  {/* Left Side - Text Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-white space-y-6"
                  >
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-block"
                    >
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold border border-white/20">
                        {slide.badge}
                      </span>
                    </motion.div>

                    {/* Main Title - Animated Split Text */}
                    <div className="space-y-2">
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight"
                      >
                        {slide.title.split(' ').map((word, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="inline-block mr-4"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </motion.h1>
                      
                      <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                      >
                        {slide.subtitle}
                      </motion.h2>
                    </div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-xl text-gray-300 max-w-xl"
                    >
                      {slide.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex flex-wrap gap-4 pt-4"
                    >
                      <a
                        href={slide.link}
                        className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3"
                      >
                        <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        {slide.cta}
                      </a>
                      
                      {slide.type === 'image' && (
                        <button className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                          <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Watch Video
                        </button>
                      )}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="flex flex-wrap gap-8 pt-8 border-t border-white/20"
                    >
                      <div>
                        <p className="text-3xl font-bold">{slide.stats.sold}</p>
                        <p className="text-sm text-gray-400">Products Sold</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{slide.stats.customers}</p>
                        <p className="text-sm text-gray-400">Happy Customers</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{slide.stats.rating}</p>
                        <p className="text-sm text-gray-400">Secure</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Right Side - Featured Product/Model */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="hidden lg:block relative"
                  >
                    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
                      {slide.type === 'image' ? (
                        <img
                          src={slide.image}
                          alt="Featured Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        >
                          <source src={slide.video} type="video/mp4" />
                        </video>
                      )}
                      
                      {/* Floating Sparkle Effect */}
                      <motion.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [0, 360]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute top-10 right-10"
                      >
                        <Sparkles className="w-12 h-12 text-yellow-400" />
                      </motion.div>
                    </div>
                  </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev-custom absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all group">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all group">
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Swiper>

      {/* Floating Category Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-0 right-0 z-30"
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-between overflow-x-auto gap-2 scrollbar-hide">
              <p className="text-sm font-bold text-gray-900 whitespace-nowrap pr-4 border-r border-gray-300">
                Shop by Category
              </p>
              {categories.map((category, index) => (
                <motion.a
                  key={index}
                  href={category.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer min-w-[80px]"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                    {category.icon}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {category.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Custom Pagination & Styles */}
      <style jsx>{`
        .hero-slider .swiper-pagination {
          bottom: 140px !important;
          z-index: 20;
        }
        
        .hero-slider .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .hero-slider .swiper-pagination-bullet-active {
          width: 40px;
          border-radius: 6px;
          background: white;
          border: 2px solid white;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (max-width: 1024px) {
          .hero-slider .swiper-pagination {
            bottom: 120px !important;
          }
        }

        @media (max-width: 768px) {
          .hero-slider .swiper-pagination {
            bottom: 100px !important;
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