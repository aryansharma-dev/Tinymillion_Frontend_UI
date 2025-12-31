import {useContext, useEffect, useMemo, useRef, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShopContext from '../context/ShopContextInstance';
import { getProductImageArray, getPrimaryProductImage } from "../utils/productImages";
import usePageMetadata from "../hooks/usePageMetadata";
import { Star, Heart, Truck, RotateCcw, ShieldCheck, MessageCircle } from 'lucide-react';
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
  const [quantity, setQuantity] = useState(1);
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

  const availableColors = useMemo(() => {
    if (!Array.isArray(productData?.colors)) return [];
    return productData.colors.filter((c) => c && typeof c === "string");
  }, [productData?.colors]);

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

  return (
    <div className="bg-white">
      {/* Main Product Section - 2 Column Fixed Layout */}
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Fixed Product Images */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden p-4 lg:p-8">
            <div className="flex gap-4">
              {/* Thumbnail Column */}
              <div className="flex flex-col gap-2 w-20">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImage(img)}
                    className={`w-full aspect-square overflow-hidden border-2 transition ${
                      img === selectedImage
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={productData?.name || "Product"}
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Scrollable Product Details */}
          <div className="lg:h-screen lg:overflow-y-auto p-4 lg:p-8">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500 mb-4">
                <a href="/" className="hover:text-gray-900">Home</a>
                <span className="mx-2">/</span>
                <a href="/collection" className="hover:text-gray-900">Products</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{productData?.category}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productData?.name || 'Product'}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(489 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {currency}{productData?.price?.toLocaleString() || ''}
                  </span>
                  {productData?.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      {currency}{productData.originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600 mt-2">
                  ✓ In Stock | Ships within 24 hours
                </p>
              </div>

              {/* Description */}
              {productData?.description && (
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {productData.description}
                  </p>
                </div>
              )}

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Color: <span className="font-normal capitalize">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2">
                    {availableColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition ${
                          selectedColor === color
                            ? 'border-black ring-2 ring-gray-300'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {!isJewellery && availableSizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">
                      Size: <span className="font-normal">{size || 'Select'}</span>
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-6 py-3 border text-sm font-medium transition ${
                          s === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-16 h-10 border border-gray-300 text-center"
                  />
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 px-8 font-semibold transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 font-semibold transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6 space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span>Free delivery on orders over ₹500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span>100% authentic products</span>
                </div>
              </div>

              {/* Product Details Accordion */}
              <div className="border-t border-gray-200">
                <details className="border-b border-gray-200 py-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                    Product Description
                  </summary>
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                    {productData?.description || 'High-quality product crafted with precision and care. Perfect for everyday wear.'}
                  </div>
                </details>

                <details className="border-b border-gray-200 py-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                    Soft and Lightweight
                  </summary>
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                    Made with premium materials for maximum comfort and durability.
                  </div>
                </details>

                <details className="border-b border-gray-200 py-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                    Shipping & Returns
                  </summary>
                  <div className="mt-4 text-gray-600 text-sm leading-relaxed">
                    Free shipping on orders over ₹500. Easy 30-day returns.
                  </div>
                </details>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ratings & Reviews
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">4.8</span>
                    <div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">489 ratings</p>
                    </div>
                  </div>
                </div>

                {/* Sample Review */}
                <div className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">Great product!</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Excellent quality and fast delivery. Highly recommended!
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>John Doe</span>
                    <span>•</span>
                    <span>2 days ago</span>
                  </div>
                </div>

                <button className="text-blue-600 hover:underline text-sm font-medium">
                  See all reviews
                </button>
              </div>

              {/* Questions Section */}
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Questions & Answers
                </h3>
                <div className="border border-gray-200 rounded-lg p-6 mb-4">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        Does this item fit true to size?
                      </p>
                      <p className="text-sm text-gray-600">
                        Yes, this item fits true to size. We recommend ordering your regular size.
                      </p>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 hover:underline text-sm font-medium">
                  Ask a question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Section */}
      <div className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Bought Together
          </h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex items-center gap-4">
                <img
                  src={selectedImage}
                  alt="Current product"
                  className="w-24 h-24 object-cover border border-gray-200"
                />
                <span className="text-2xl text-gray-400">+</span>
                <img
                  src={relatedProducts[0] ? getPrimaryProductImage(relatedProducts[0]) : selectedImage}
                  alt="Related product"
                  className="w-24 h-24 object-cover border border-gray-200"
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Total: {currency}{((productData?.price || 0) * 2).toLocaleString()}
                </p>
                <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold">
                  Add Both to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {relatedProducts.slice(0, 6).map((product) => (
                <ProductItem
                  key={product._id}
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;