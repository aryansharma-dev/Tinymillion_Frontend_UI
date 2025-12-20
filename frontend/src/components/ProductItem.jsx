// frontend/src/components/ProductItem.jsx
import PropTypes from "prop-types";
import { useContext, useMemo, useState } from "react";
import ShopContext from '../context/ShopContextInstance';
import { Link } from "react-router-dom";
import { getProductImageArray } from "../utils/productImages";
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductItem = ({ id, image, name, price, originalPrice, discount, isNew, rating = 4.5, reviews = 120, colors = [], sizes = [] }) => {
  const { currency } = useContext(ShopContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showQuickView, setShowQuickView] = useState(false);

  const normalizedImages = useMemo(() => {
    if (Array.isArray(image) || typeof image === "string") {
      return getProductImageArray({ images: image, image });
    }
    if (image && typeof image === "object") {
      return getProductImageArray(image);
    }
    return [];
  }, [image]);

  const imgSrc = useMemo(() => 
    (normalizedImages.length > 0 ? normalizedImages[currentImageIndex] : ""), 
    [normalizedImages, currentImageIndex]
  );

  // Calculate discount percentage if not provided
  const calculatedDiscount = useMemo(() => {
    if (discount) return discount;
    if (originalPrice && price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return null;
  }, [discount, originalPrice, price]);

  // Render star rating
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={14}
        className={
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }
      />
    ));
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
    // Add your quick view modal logic here
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', id);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link
        onClick={() => window.scrollTo(0, 0)}
        className="block"
        to={`/product/${id}`}
      >
        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              NEW
            </span>
          )}
          {calculatedDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              -{calculatedDiscount}%
            </span>
          )}
        </div>

        {/* Wishlist Button - Top Right */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-200 shadow-md"
        >
          <Heart
            size={20}
            className={`transition-all duration-200 ${
              isWishlisted
                ? 'fill-red-500 text-red-500 scale-110'
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>

        {/* Image Section */}
        <div
          className="relative aspect-[3/4] overflow-hidden bg-gray-100"
          onMouseEnter={() => {
            if (normalizedImages.length > 1) {
              setCurrentImageIndex(1);
            }
          }}
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={name || "Product"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}

          {/* Quick View Button - Shows on Hover */}
          <button
            onClick={handleQuickView}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white px-6 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-50 transform group-hover:translate-y-0 translate-y-2"
          >
            <Eye size={18} />
            <span className="text-sm font-medium">Quick View</span>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Color Variants - If Available */}
          {colors && colors.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              {colors.slice(0, 5).map((color, index) => (
                <div
                  key={index}
                  className="w-5 h-5 rounded-full border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {colors.length > 5 && (
                <span className="text-xs text-gray-500 flex items-center">
                  +{colors.length - 5}
                </span>
              )}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 min-h-[2.5rem]">
            {name || "Product Name"}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {renderStars()}
            </div>
            <span className="text-xs text-gray-500">
              ({reviews || 0})
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-gray-900">
              {currency}{price ?? "0"}
            </span>
            {originalPrice && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {currency}{originalPrice}
                </span>
                {calculatedDiscount && (
                  <span className="text-sm text-green-600 font-semibold">
                    ({calculatedDiscount}% OFF)
                  </span>
                )}
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 hover:shadow-md active:scale-95"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>

          {/* Size Chips - Show on Hover */}
          {sizes && sizes.length > 0 && (
            <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {sizes.slice(0, 6).map((size, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:border-primary hover:text-primary cursor-pointer transition-colors"
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

ProductItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.shape({ images: PropTypes.oneOfType([PropTypes.array, PropTypes.string]) }),
    PropTypes.object,
  ]),
  name: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  originalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  discount: PropTypes.number,
  isNew: PropTypes.bool,
  rating: PropTypes.number,
  reviews: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  sizes: PropTypes.arrayOf(PropTypes.string),
};

export default ProductItem;