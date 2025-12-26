import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';

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
  sizes = []
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Get images array
  const images = Array.isArray(image) ? image : [image];
  const displayImage = images[currentImage] || images[0] || 'https://via.placeholder.com/400x500?text=Product';

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl">
      {/* Product Image Container */}
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-black text-white text-xs font-semibold px-2.5 py-1 rounded">
              NEW
            </span>
          )}
          {discount && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Product Image */}
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Quick Add to Cart - Shows on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full py-3 text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors">
            <ShoppingCart className="w-4 h-4" />
            Quick Add to Cart
          </button>
        </div>

        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentImage(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentImage === idx
                    ? 'bg-white w-4'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-900">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
          )}
        </div>

        {/* Color Variants */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {colors.slice(0, 5).map((color, idx) => (
              <button
                key={idx}
                className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {colors.length > 5 && (
              <span className="text-xs text-gray-500">+{colors.length - 5}</span>
            )}
          </div>
        )}

        {/* Available Sizes */}
        {sizes.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {sizes.slice(0, 4).map((size, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs border border-gray-300 rounded text-gray-700"
              >
                {size}
              </span>
            ))}
            {sizes.length > 4 && (
              <span className="text-xs text-gray-500">+{sizes.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;