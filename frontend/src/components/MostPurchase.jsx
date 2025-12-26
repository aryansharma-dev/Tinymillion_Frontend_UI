import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye } from 'lucide-react';
import ShopContext from '../context/ShopContextInstance';
import { getPrimaryProductImage } from '../utils/productImages';
import { motion } from 'framer-motion';

// Responsive settings
const CARDS_VISIBLE = {
  desktop: 4,
  tablet: 2,
  mobile: 1,
};

// Card width matches previous card (with px, not %, for no min-w-full)
const CARD_WIDTHS = {
  desktop: 272, // px, matches 'max-w-xs' -> 20rem (320px), but padding etc used before, so 272 (17rem) closely matches UI card
  // You can tweak this a bit according to the visual result
  tablet: 272,
  mobile: 320,  // for mobile allow a bit wider
};

const BADGE_ANIMATION = {
  pulse: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const AUTOPLAY_INTERVAL = 4000; // 4 seconds

// Get how many cards to show based on width
function getCardsPerView(width) {
  if (width >= 1024) return CARDS_VISIBLE.desktop;
  if (width >= 640) return CARDS_VISIBLE.tablet;
  return CARDS_VISIBLE.mobile;
}

const MostPurchased = () => {
  const { products, currency } = useContext(ShopContext);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Responsive: update on resize
  useEffect(() => {
    function updateWidth() {
      setViewportWidth(window.innerWidth);
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Get bestseller products (or first 8 if no bestseller flag)
  const featuredProducts = products.filter(item => item.bestseller).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);
  const productCount = displayProducts.length;

  // Determine visible cards and card width for current window width
  const cardsPerView = getCardsPerView(viewportWidth || 1024);
  let cardWidth = CARD_WIDTHS.desktop;
  if ((viewportWidth || 1024) < 1024 && (viewportWidth || 1024) >= 640) {
    cardWidth = CARD_WIDTHS.tablet;
  }
  if ((viewportWidth || 1024) < 640) {
    cardWidth = CARD_WIDTHS.mobile;
  }

  // For infinite loop, duplicate front/back
  // If less than visible, do not duplicate
  const extendedProducts = productCount > cardsPerView
    ? [
        ...displayProducts.slice(-cardsPerView), // before
        ...displayProducts,
        ...displayProducts.slice(0, cardsPerView), // after
      ]
    : displayProducts;

  // Initial index (we show after the prepended duplicate cards)
  const [carouselIndex, setCarouselIndex] = useState(productCount > cardsPerView ? cardsPerView : 0);
  // For smooth animation
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef();
  const trackRef = useRef();

  // Slide to next
  const slideNext = useCallback(() => {
    if (productCount <= cardsPerView) return;
    setCarouselIndex(prev =>
      prev + 1
    );
    setIsTransitioning(true);
  }, [productCount, cardsPerView]);

  // Slide to prev
  const slidePrev = useCallback(() => {
    if (productCount <= cardsPerView) return;
    setCarouselIndex(prev =>
      prev - 1
    );
    setIsTransitioning(true);
  }, [productCount, cardsPerView]);

  // Autoplay Effect
  useEffect(() => {
    if (
      isPaused ||
      productCount <= cardsPerView
    )
      return;
    autoplayRef.current = setInterval(() => {
      slideNext();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(autoplayRef.current);
  }, [slideNext, isPaused, productCount, cardsPerView]);

  // Handle transition end for infinite loop
  useEffect(() => {
    if (productCount <= cardsPerView) return;

    if (!isTransitioning) return;
    const handle = setTimeout(() => {
      let reset = false;
      let nextIndex = carouselIndex;
      // Jump without animation if at duplicated slides
      if (carouselIndex >= productCount + cardsPerView) {
        nextIndex = cardsPerView;
        reset = true;
      } else if (carouselIndex < cardsPerView) {
        nextIndex = productCount + cardsPerView - 1;
        reset = true;
      }
      if (reset) {
        setIsTransitioning(false); // turn off animation for the jump
        setCarouselIndex(nextIndex);
      } else {
        setIsTransitioning(false);
      }
    }, 450); // match duration
    return () => clearTimeout(handle);
    // eslint-disable-next-line
  }, [carouselIndex, productCount, cardsPerView]);

  // Handle manual jump (dot clicks)
  function gotoSlide(idx) {
    if (productCount <= cardsPerView) return;
    setIsTransitioning(true);
    setCarouselIndex(idx + cardsPerView);
  }

  // Handle pause on hover/focus
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  const handleFocus = () => setIsPaused(true);
  const handleBlur = () => setIsPaused(false);

  // Keyboard support (left/right arrow keys)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') {
        slidePrev();
        setIsPaused(true);
      }
      if (e.key === 'ArrowRight') {
        slideNext();
        setIsPaused(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [slidePrev, slideNext]);

  // Calculate track style
  const totalCards = extendedProducts.length;
  const gapPx = 24; // Tailwind gap-6
  const totalWidth = totalCards * cardWidth + (totalCards - 1) * gapPx;
  const trackTranslateX = -(carouselIndex * (cardWidth + gapPx));
  const transition = isTransitioning ? 'transform 0.45s cubic-bezier(.46,.03,.52,.96)' : 'none';

  return (
    <section
      className="py-20 bg-gradient-to-br from-white to-neutral-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      aria-label="Most Purchased Products"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs md:text-sm text-neutral-400 mb-2 uppercase tracking-wider font-semibold">
              Top Trending
            </p>
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3rem] font-bold text-gray-900 leading-tight">
              <span className="inline-block pr-2">Most</span>
              <span className="inline-block text-orange-500 font-extrabold drop-shadow-sm">Purchased</span>
            </h2>
            <p className="text-neutral-500 mt-3 text-sm md:text-base max-w-lg">
              We know how hard it is to get the size, color and even the garment right
            </p>
          </div>
          {/* Arrows Desktop */}
          <div className="hidden lg:flex gap-3">
            <button
              onClick={slidePrev}
              aria-label="Previous products"
              className="flex items-center justify-center w-12 h-12 bg-white border rounded-full shadow-sm transition-all duration-300 group border-neutral-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 transition" />
            </button>
            <button
              onClick={slideNext}
              aria-label="Next products"
              className="flex items-center justify-center w-12 h-12 bg-white border rounded-full shadow-sm transition-all duration-300 group border-neutral-200 text-gray-900 hover:bg-gray-900 hover:text-white hover:shadow-lg"
            >
              <ChevronRight className="w-6 h-6 transition" />
            </button>
          </div>
        </div>
        {/* Product Carousel */}
        <div className="relative w-full flex items-center justify-center select-none">
          {/* Slide Controls on mobile */}
          <button
            type="button"
            aria-label="Previous products"
            onClick={slidePrev}
            className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-10 flex lg:hidden items-center justify-center w-10 h-10 bg-white/80 border border-neutral-200 rounded-full shadow transition-colors focus:outline-none hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            className="w-full overflow-x-hidden relative"
            style={{
              maxWidth:
                cardsPerView === 4 ? `${(cardWidth + gapPx) * 4 - gapPx}px`
                : cardsPerView === 2 ? `${(cardWidth + gapPx) * 2 - gapPx}px`
                : `${cardWidth}px`
            }}
          >
            <div
              ref={trackRef}
              className="flex gap-6"
              style={{
                width: totalWidth,
                transform: `translateX(${trackTranslateX}px)`,
                transition,
                willChange: 'transform',
                userSelect: 'none',
              }}
              onTransitionEnd={() => {
                // Infinite loop jump: turn off animation, reset index
                if (productCount <= cardsPerView) return;
                let reset = false;
                let nextIndex = carouselIndex;
                if (carouselIndex >= productCount + cardsPerView) {
                  nextIndex = cardsPerView;
                  reset = true;
                } else if (carouselIndex < cardsPerView) {
                  nextIndex = productCount + cardsPerView - 1;
                  reset = true;
                }
                if (reset) {
                  setIsTransitioning(false);
                  setCarouselIndex(nextIndex);
                }
              }}
            >
              {extendedProducts.map((product, idx) => {
                const productImage = getPrimaryProductImage(product);
                const isHovered = hoveredProduct === product._id;
                return (
                  <motion.div
                    key={`${product._id}_${idx}`}
                    style={{
                      width: cardWidth,
                      flex: `0 0 ${cardWidth}px`,
                      minWidth: cardWidth,
                      maxWidth: cardWidth,
                      pointerEvents: 'auto',
                    }}
                    className="cursor-pointer select-none"
                    whileHover={{
                      y: -10,
                      boxShadow: '0 8px 32px 0 rgba(34,34,54,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div
                      className="relative flex flex-col bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 group border border-neutral-100"
                    >
                      {/* Top Badge and Wishlist */}
                      <div className="absolute top-5 left-5 z-20 flex flex-col items-start gap-2">
                        <div className="relative flex items-center">
                          {/* Pulsing circle */}
                          <motion.span
                            className="absolute -left-2 -top-2 block w-8 h-8 rounded-full bg-orange-300 opacity-30"
                            animate="pulse"
                            variants={BADGE_ANIMATION}
                          />
                          <span className="relative bg-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-orange-500 border border-orange-300 shadow-sm z-10"
                            style={{ letterSpacing: '.04em' }}>
                            Most
                          </span>
                        </div>
                        {product.discount && (
                          <span className="bg-rose-500/90 backdrop-blur px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-md tracking-wider">
                            Up to {product.discount}%
                          </span>
                        )}
                      </div>
                      {/* Wishlist top-right */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-5 right-5 z-20 bg-white/70 rounded-full p-2 hover:bg-orange-50 transition-all shadow-sm group"
                        style={{ lineHeight: 0 }}
                        type="button"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-[20px] h-[20px] text-neutral-400 group-hover:text-rose-500 transition-colors" />
                      </motion.button>

                      {/* Product image */}
                      <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden flex items-center justify-center">
                        <motion.img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500"
                          initial={{ scale: 1 }}
                          animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                          loading="lazy"
                        />

                        {/* Quick Shop Overlay */}
                        <motion.a
                          href={`/product/${product._id}`}
                          className={`absolute left-0 bottom-0 w-full bg-black/70 text-white py-3 flex flex-row items-center justify-center gap-2 tracking-wider uppercase text-xs font-semibold cursor-pointer opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}
                          tabIndex={-1}
                          aria-label={`Quick Shop: ${product.name}`}
                          initial={false}
                          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>Quick Shop</span>
                        </motion.a>
                      </div>
                      {/* Product Details */}
                      <div className="flex flex-col justify-between flex-1 px-5 pb-5 pt-4">
                        {/* Category */}
                        <div className="mb-1 h-5">
                          <span className="inline-block text-xs text-neutral-400 uppercase tracking-wider font-medium">{product.category || 'Accessories'}</span>
                        </div>
                        {/* Product name */}
                        <a
                          href={`/product/${product._id}`}
                          className="block mb-2 text-base md:text-[1.09rem] font-semibold text-gray-900 hover:text-orange-600 transition-colors leading-tight min-h-[2.2em] line-clamp-2"
                          title={product.name}
                        >
                          {product.name}
                        </a>
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-3">
                          {product.originalPrice && (
                            <span className="text-sm text-neutral-400 line-through select-none">
                              {currency}{product.originalPrice}
                            </span>
                          )}
                          <span
                            className={`text-lg font-bold ${product.originalPrice ? 'text-rose-600' : 'text-gray-900'}`}
                          >
                            {currency}{product.price}
                          </span>
                        </div>
                        {/* Color Swatches */}
                        {product.colors && product.colors.length > 0 && (
                          <div className="flex items-center gap-1.5 mb-3 min-h-[24px]">
                            {product.colors.slice(0, 4).map((color, idx) => (
                              <span
                                key={idx}
                                className="w-5 h-5 rounded-full border border-white shadow ring-1 ring-neutral-100 hover:ring-gray-400 transition-transform duration-150 inline-block"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                            {product.colors.length > 4 && (
                              <span className="text-xs text-neutral-500 ml-1 font-medium">
                                +{product.colors.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Size Options */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {product.sizes.map(size => (
                              <button
                                key={size}
                                type="button"
                                className="min-w-[2.1rem] h-8 px-0.5 border border-neutral-200 text-xs font-semibold rounded bg-white text-neutral-500 hover:border-orange-400 hover:text-orange-600 transition-all shadow focus:outline-none"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            aria-label="Next products"
            onClick={slideNext}
            className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-10 flex lg:hidden items-center justify-center w-10 h-10 bg-white/80 border border-neutral-200 rounded-full shadow transition-colors focus:outline-none hover:bg-gray-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {productCount > cardsPerView &&
            Array.from({ length: productCount - cardsPerView + 1 }).map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full border border-gray-200 ${
                  i === ((carouselIndex - cardsPerView + productCount) % (productCount - cardsPerView + 1))
                    ? 'bg-orange-500 border-orange-500'
                    : 'bg-gray-200 hover:bg-orange-300 transition'
                }`}
                onClick={() => gotoSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                tabIndex={0}
              />
            ))}
          {productCount <= cardsPerView &&
            <button
              className="w-3 h-3 rounded-full border border-orange-500 bg-orange-500"
              tabIndex={0}
              aria-label="Go to slide 1"
              disabled
            />}
        </div>
        {/* Go to Shop */}
        <div className="text-center mt-14">
          <a
            href="/collection"
            className="inline-block px-10 py-3 bg-gray-900 text-white text-base font-semibold uppercase tracking-wider rounded shadow hover:bg-gray-800 transition-colors duration-300"
          >
            Go To Shop &rarr;
          </a>
        </div>
      </div>
    </section>
  );
};

export default MostPurchased;