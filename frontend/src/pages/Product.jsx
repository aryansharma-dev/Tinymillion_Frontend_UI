import {useContext, useEffect, useMemo, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShopContext from '../context/ShopContextInstance';
import { getProductImageArray, getPrimaryProductImage } from "../utils/productImages";
import usePageMetadata from "../hooks/usePageMetadata";
import { Heart, RotateCcw, RotateCw } from 'lucide-react';
import ProductItem from '../components/ProductItem';

const Product = () => {
  const { productId } = useParams();
  const { productMap, ensureProductLoaded, currency, addToCart, products } = useContext(ShopContext);
  const navigate = useNavigate();

  const [productData, setProductData] = useState(() =>
    (productId && productMap?.get(String(productId))) || null
  );
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("Cotton");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(!productData);
  const [error, setError] = useState(null);
  const pendingRequestRef = useRef(null);

  useEffect(() => {
    setSize("");
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      setProductData(null);
      setImage("");
      setLoading(false);
      setError("Invalid product");
      return;
    }

    const id = String(productId);
    const cached = productMap?.get(id);
    if (cached) {
      setProductData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const loadProduct = async () => {
      try {
        if (pendingRequestRef.current) {
          await pendingRequestRef.current;
          return;
        }
        const promise = ensureProductLoaded(id);
        pendingRequestRef.current = promise;
        const result = await promise;
        if (!result) {
          setError("Product not found.");
          setProductData(null);
          return;
        }
        setProductData(result);
        setError(null);
      } catch (err) {
        console.error("Failed to load product", err);
        setError(err?.message || "Failed to load product.");
        setProductData(null);
      } finally {
        pendingRequestRef.current = null;
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId, productMap, ensureProductLoaded]);

  useEffect(() => {
    if (!productData) {
      setImage("");
      return;
    }
    const imgs = getProductImageArray(productData);
    setImage((prev) => {
      if (prev && imgs.includes(prev)) {
        return prev;
      }
      return imgs[0] || "";
    });
    
    // Set initial color if available
    if (productData.colors && productData.colors.length > 0) {
      setSelectedColor(productData.colors[0]);
    }
  }, [productData]);

  const categoryName = useMemo(
    () => String(productData?.category || "").trim().toLowerCase(),
    [productData?.category]
  );
  const isJewellery = useMemo(
    () => ["jewellery", "jewelry", "jewelery"].includes(categoryName),
    [categoryName]
  );

  const images = useMemo(() => getProductImageArray(productData), [productData]);
  const selectedImage = image || getPrimaryProductImage(productData);
  const availableSizes = useMemo(() => {
    if (!Array.isArray(productData?.sizes)) return [];
    return productData.sizes.filter((s) => typeof s === "string" && s.trim().length > 0);
  }, [productData?.sizes]);

  // Get available colors
  const availableColors = useMemo(() => {
    if (!Array.isArray(productData?.colors)) return [];
    return productData.colors.filter((c) => c && typeof c === "string");
  }, [productData?.colors]);

  // Mock materials for UI (matching reference)
  const materials = useMemo(() => {
    const defaultMaterials = ["Suede", "Leather", "Cotton", "Corduroy", "Jeans"];
    return defaultMaterials;
  }, []);

  // Related products - same category, exclude current product
  const relatedProducts = useMemo(() => {
    if (!productData || !Array.isArray(products)) return [];
    return products
      .filter(p => p && p._id && p._id !== productData._id && p.category === productData.category)
      .slice(0, 12);
  }, [products, productData]);

  const metaDescription = useMemo(() => {
    if (productData?.description) {
      return productData.description;
    }
    if (productData?.name) {
      return `Shop ${productData.name} online from TinyMillion.`;
    }
    return "Explore product details from TinyMillion.";
  }, [productData]);

  const productStructuredData = useMemo(() => {
    if (!productData) return undefined;
    const price = Number(productData.price);
    const offer = Number.isFinite(price)
      ? {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price,
          availability: 'https://schema.org/InStock',
        }
      : undefined;

    return ({ absoluteCanonical, pageDescription, absoluteImage }) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${absoluteCanonical}#product`,
        url: absoluteCanonical,
        name: productData.name || 'TinyMillion Product',
        description: pageDescription,
        image: absoluteImage,
        category: productData.category,
        brand: 'TinyMillion',
        offers: offer,
      },
    ];
  }, [productData]);

  usePageMetadata({
    title: productData?.name || "Product Details",
    description: metaDescription,
    keywords: `${productData?.name || "TinyMillion product"}, TinyMillion product details, buy online`,
    canonical: `/product/${productId}`,
    image: selectedImage,
    structuredData: productStructuredData,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          type="button"
          onClick={() => navigate("/collection")}
          className="underline text-sm text-gray-600 hover:text-gray-900"
        >
          Browse other products
        </button>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Product unavailable.</div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isJewellery && !size) {
      alert("Please select a size before adding to cart");
      return;
    }
    const sizeToSend = isJewellery ? undefined : size;
    try {
      await addToCart(productData?._id, sizeToSend, productData?.category);
      navigate("/cart");
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  // Customization options (matching reference structure)
  const customizationOptions = [
    { id: 'material', label: 'Material', active: true },
    { id: 'colors', label: 'Colors', active: false },
    { id: 'logo', label: 'Logo', active: false, price: '+5€' },
    { id: 'text', label: 'Text', active: false, price: '+5€' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Section Heading */}
        <h2 className="text-2xl lg:text-3xl font-bold uppercase tracking-wider text-gray-900 mb-12 text-center lg:text-left">
          CHOOSE YOUR MATERIAL
        </h2>

        {/* 3-Column Layout: Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: Product Image Thumbnails */}
          <aside className="lg:col-span-2">
            <div className="flex flex-col gap-3">
              {images.slice(0, 7).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`relative w-full aspect-square overflow-hidden rounded-sm border-2 transition-all ${
                    img === selectedImage
                      ? 'border-gray-900'
                      : 'border-gray-200 hover:border-gray-400 hover:opacity-80'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productData?.name || "Product"} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* CENTER: Product Image */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Main Product Image */}
            {selectedImage && (
              <div className="relative w-full max-w-[500px] mb-6">
                <img
                  src={selectedImage}
                  alt={productData?.name || "Product"}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-auto object-contain"
                />
              </div>
            )}


            {/* Rotate Controls (Visual only) */}
            <div className="flex gap-4 mb-8">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Undo">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Redo">
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {currency}{productData?.price?.toLocaleString() || ''}
            </div>

            {/* BUY Button */}
            <button
              onClick={handleAddToCart}
              className="w-full max-w-[400px] bg-black text-white py-4 px-8 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors mb-8"
            >
              BUY
            </button>

            {/* Size Selection (if applicable) */}
            {!isJewellery && availableSizes.length > 0 && (
              <div className="w-full max-w-[400px] mb-6">
                <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide">Select Size</p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 text-sm border transition-all ${
                        s === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Material/Color Swatches */}
          <aside className="lg:col-span-4 relative">
            <div className="relative">
              {/* Decorative vertical line */}
              <div className="absolute right-4 top-0 bottom-0 w-px bg-gray-200" style={{ transform: 'translateX(50%)' }} />
              
              <div className="space-y-6 relative z-10">
                {/* Material Swatches */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Materials</h3>
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div key={material} className="flex items-center gap-4 cursor-pointer group">
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all ${
                            selectedMaterial === material
                              ? 'border-gray-900 ring-2 ring-gray-300'
                              : 'border-gray-200 group-hover:border-gray-400'
                          }`}
                          style={{
                            backgroundColor: 
                              material === 'Suede' ? '#4a5568' :
                              material === 'Leather' ? '#d4a574' :
                              material === 'Cotton' ? '#f5f5dc' :
                              material === 'Corduroy' ? '#2d5016' :
                              '#3b82f6'
                          }}
                          onClick={() => setSelectedMaterial(material)}
                        />
                        <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                          {material}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Swatches (if available) */}
                {availableColors.length > 0 && (
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Colors</h3>
                    <div className="space-y-4">
                      {availableColors.map((color, idx) => (
                        <div key={idx} className="flex items-center gap-4 cursor-pointer group">
                          <div
                            className={`w-12 h-12 rounded-full border-2 transition-all ${
                              selectedColor === color
                                ? 'border-gray-900 ring-2 ring-gray-300'
                                : 'border-gray-200 group-hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                          />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile/Tablet Layout: Stacked */}
        <div className="lg:hidden space-y-8">
          {/* Product Image First */}
          {selectedImage && (
            <div className="w-full">
              <img
                src={selectedImage}
                alt={productData?.name || "Product"}
                loading="eager"
                className="w-full h-auto object-contain"
              />
            </div>
          )}

          {/* Thumbnails - Horizontal row for tablet/mobile */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.slice(0, 7).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImage(img)}
                  className={`flex-none w-20 h-20 rounded-sm border-2 transition-all ${
                    img === selectedImage
                      ? 'border-gray-900 ring-1 ring-gray-200'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Price & BUY Button */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {currency}{productData?.price?.toLocaleString() || ''}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full max-w-md mx-auto bg-black text-white py-4 px-8 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors mb-6"
            >
              BUY
            </button>
          </div>

          {/* Size Selection */}
          {!isJewellery && availableSizes.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3 uppercase tracking-wide text-center">Select Size</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 text-sm border transition-all ${
                      s === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white text-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options - Mobile */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Materials</h3>
              <div className="flex gap-4 flex-wrap">
                {materials.map((material) => (
                  <div key={material} className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedMaterial === material ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{
                        backgroundColor: 
                          material === 'Suede' ? '#4a5568' :
                          material === 'Leather' ? '#d4a574' :
                          material === 'Cotton' ? '#f5f5dc' :
                          material === 'Corduroy' ? '#2d5016' :
                          '#3b82f6'
                      }}
                      onClick={() => setSelectedMaterial(material)}
                    />
                    <span className="text-xs text-gray-700">{material}</span>
                  </div>
                ))}
              </div>
            </div>

            {availableColors.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">Colors</h3>
                <div className="flex gap-4 flex-wrap">
                  {availableColors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color ? 'border-gray-900' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                      <span className="text-xs text-gray-700 capitalize">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-medium text-gray-900">{productData?.name || 'Product'}</h1>
            {productData?.description && (
              <p className="text-gray-600 leading-relaxed">{productData.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <RelatedProductsCarousel products={relatedProducts} currentProductId={productData._id} />
      )}
    </div>
  );
};

// Related Products Carousel Component
const RelatedProductsCarousel = ({ products, currentProductId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const cardsPerView = {
    desktop: 4,
    tablet: 3,
    mobile: 1,
  };

  const [cardsVisible, setCardsVisible] = useState(cardsPerView.desktop);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const updateCardsVisible = () => {
      if (window.innerWidth >= 1024) {
        setCardsVisible(cardsPerView.desktop);
      } else if (window.innerWidth >= 640) {
        setCardsVisible(cardsPerView.tablet);
      } else {
        setCardsVisible(cardsPerView.mobile);
      }
    };

    updateCardsVisible();
    window.addEventListener('resize', updateCardsVisible);
    return () => window.removeEventListener('resize', updateCardsVisible);
  }, []);

  // Filter out current product
  const filteredProducts = products.filter(p => p._id !== currentProductId);
  
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 24; // gap-6 = 24px
      const calculatedWidth = (containerWidth - (gap * (cardsVisible - 1))) / cardsVisible;
      setCardWidth(calculatedWidth);
    }
  }, [cardsVisible, filteredProducts.length]);

  useEffect(() => {
    if (isPaused || filteredProducts.length <= cardsVisible) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, filteredProducts.length - cardsVisible);
        if (prev >= maxIndex) {
          return 0; // Loop back to start for infinite loop
        }
        return prev + 1;
      });
    }, 3000); // Auto-slide every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, filteredProducts.length, cardsVisible]);

  if (filteredProducts.length === 0) return null;

  return (
    <div className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-gray-900 mb-12 text-center">
          RELATED PRODUCTS
        </h2>
        
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="flex gap-6 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (cardWidth + 24)}px)`,
            }}
          >
            {filteredProducts.map((product, idx) => (
              <div
                key={`${product._id}-${idx}`}
                className="flex-none"
                style={{
                  width: `${cardWidth}px`,
                  minWidth: `${cardWidth}px`,
                }}
              >
                <ProductItem
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={getProductImageArray(product)}
                  originalPrice={product.originalPrice || null}
                  discount={product.discount || null}
                  isNew={product.isNew || false}
                  rating={product.rating || 4.5}
                  reviews={product.reviews || 100}
                  colors={product.colors || []}
                  sizes={product.sizes || []}
                  category={product.category || ''}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
