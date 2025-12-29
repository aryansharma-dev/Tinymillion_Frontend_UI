import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';

const ProductItem = ({
  id,
  name,
  price,
  image,
  originalPrice,
  discount,
  isNew,
  rating = 4.5,
  reviews = 100,
  colors = [],
  sizes = [],
  category = ''
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Get images array
  const images = Array.isArray(image) ? image : [image];
  const displayImage = images[currentImage] || images[0] || 'https://via.placeholder.com/400x500?text=Product';

  // Calculate discount percentage for badge
  const discountPercent = discount || (originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : null);

  return (
    <div className="group relative bg-white rounded-none overflow-hidden border-0 hover:shadow-lg transition-all duration-300 ease-in-out">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-50">
        {/* Sale Badge - Top Left */}
        {discountPercent && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-black text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              UP TO {discountPercent}%
            </span>
          </div>
        )}

        {/* New Badge */}
        {isNew && !discountPercent && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-black text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              NEW
            </span>
          </div>
        )}

        {/* Wishlist Button - Visible on hover */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`}
          />
        </button>

        <Link to={`/product/${id}`} className="block relative">
          {/* Product Image */}
          <div className="aspect-[3/4] overflow-hidden bg-gray-100">
            <img
              src={displayImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.05]"
              loading="lazy"
            />
          </div>

          {/* Quick Shop Bar - Slides up on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-black text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
            <Link
              to={`/product/${id}`}
              className="w-full py-3.5 text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-black/90 transition-colors uppercase tracking-wider"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4" />
              <span>Quick Shop</span>
            </Link>
          </div>

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImage(idx);
                  }}
                  className={`h-1 rounded-full transition-all ${
                    currentImage === idx
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75 w-1'
                  }`}
                />
              ))}
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 pb-5">
        {/* Category Text - Small, uppercase, muted */}
        {category && (
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
            {category}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm text-gray-900 mb-2.5 line-clamp-2 group-hover:text-black transition-colors leading-snug min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through font-normal">₹{originalPrice}</span>
          )}
        </div>

        {/* Color Swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {colors.slice(0, 6).map((color, idx) => (
              <button
                key={idx}
                className="w-4 h-4 rounded-full border border-gray-200 hover:border-gray-400 transition-colors shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
                onClick={(e) => e.preventDefault()}
              />
            ))}
            {colors.length > 6 && (
              <span className="text-xs text-gray-400 ml-1">+{colors.length - 6}</span>
            )}
          </div>
        )}

        {/* Size Options - Pill style */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.slice(0, 5).map((size, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] border border-gray-200 rounded-full text-gray-600 font-medium bg-white hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                {size}
              </span>
            ))}
            {sizes.length > 5 && (
              <span className="text-xs text-gray-400">+{sizes.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;