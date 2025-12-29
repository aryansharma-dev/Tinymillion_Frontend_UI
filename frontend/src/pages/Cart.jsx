import { useContext, useEffect, useMemo, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock, Star } from 'lucide-react';
import ShopContext from '../context/ShopContextInstance';
import { getPrimaryProductImage } from '../utils/productImages';
import usePageMetadata from '../hooks/usePageMetadata';

const Cart = () => {
  const {
    currency,
    cartItems,
    updateQuantity,
    navigate,
    token,
    getCartCount,
    getCartSummary,
    productMap,
    ensureProductLoaded,
  } = useContext(ShopContext);

  const [couponCode, setCouponCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(246); // 4:06 in seconds

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cartData = useMemo(() => {
    const rows = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        const qty = cartItems[pid][size];
        if (qty > 0) {
          rows.push({ _id: pid, size, quantity: qty });
        }
      }
    }
    return rows;
  }, [cartItems]);

  useEffect(() => {
    const missingIds = cartData
      .map((item) => String(item._id))
      .filter((id) => id && !productMap.has(id));

    if (!missingIds.length) return;

    Promise.all(missingIds.map((id) => ensureProductLoaded(id))).catch((error) => {
      console.error('Failed to load cart product', error);
    });
  }, [cartData, productMap, ensureProductLoaded]);

  const summary = getCartSummary();
  const awaitingProducts = useMemo(
    () => cartData.some((item) => !productMap.has(String(item._id))),
    [cartData, productMap]
  );
  const hasItems = getCartCount() > 0 && summary.subtotal > 0 && !awaitingProducts;

  const cartStructuredData = useMemo(
    () =>
      ({ absoluteCanonical, baseTitle, pageDescription }) => [
        {
          '@context': 'https://schema.org',
          '@type': 'ShoppingCart',
          '@id': `${absoluteCanonical}#cart`,
          url: absoluteCanonical,
          name: baseTitle,
          description: pageDescription,
          numberOfItems: cartData.length,
          potentialAction: {
            '@type': 'CheckoutAction',
            target: `${absoluteCanonical.replace('/cart', '')}/checkout`,
          },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: Number(summary.subtotal || 0),
            highPrice: Number(summary.total || summary.subtotal || 0),
            offerCount: cartData.length,
          },
        },
      ],
    [cartData.length, summary.subtotal, summary.total]
  );

  usePageMetadata({
    title: 'Your Shopping Cart',
    description:
      'Review the items saved in your TinyMillion cart and update sizes or quantities before placing your order.',
    keywords: 'TinyMillion cart, review order, checkout preparation, saved items',
    canonical: '/cart',
    robots: 'noindex, nofollow',
    structuredData: cartStructuredData,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <span className="text-sm font-semibold text-gray-900">SHOPPING CART</span>
            </div>
            <div className="w-16 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-sm font-medium text-gray-400">CHECKOUT</span>
            </div>
            <div className="w-16 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <span className="text-sm font-medium text-gray-400">ORDER STATUS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Banner */}
      {hasItems && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                🔥 Hurry up, these products are limited, checkout within{' '}
                <span className="font-bold">{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Free Shipping Progress */}
      {hasItems && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Congratulations! You've got free shipping.
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!cartData.length ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
            <button
              onClick={() => navigate('/collection')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Table Header */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">SKU</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-1 text-center">Subtotal</div>
                </div>

                {/* Cart Items */}
                {cartData.map((item, index) => {
                  const productData = productMap.get(String(item._id));
                  const imgSrc = getPrimaryProductImage(productData);
                  const isLoadingProduct = !productData;
                  const subtotal = (productData?.price || 0) * item.quantity;

                  return (
                    <div
                      key={`${item._id}-${item.size}-${index}`}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      {/* Product Info */}
                      <div className="col-span-1 sm:col-span-5 flex items-center gap-4">
                        {imgSrc ? (
                          <img
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            src={imgSrc}
                            alt={productData?.name || 'Product'}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No image
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {productData?.name || (isLoadingProduct ? 'Loading...' : 'Product')}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Size: <span className="text-gray-700">{item.size}</span>
                          </p>
                          <button
                            onClick={() => updateQuantity(item._id, item.size, 0)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center">
                        <span className="font-semibold text-gray-900">
                          {currency}{productData?.price ?? (isLoadingProduct ? '--' : 0)}
                        </span>
                      </div>

                      {/* SKU */}
                      <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center">
                        <span className="text-sm text-gray-600">E{productData?._id || '---'}</span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 sm:col-span-2 flex sm:justify-center items-center">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item._id, item.size, item.quantity - 1);
                              }
                            }}
                            className="px-3 py-2 hover:bg-gray-100 transition"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val > 0) {
                                updateQuantity(item._id, item.size, val);
                              }
                            }}
                            className="w-12 text-center border-x border-gray-300 py-2 focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-100 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 sm:col-span-1 flex sm:justify-center items-center">
                        <span className="font-bold text-gray-900">
                          {currency}{subtotal}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {awaitingProducts && cartData.length > 0 && (
                  <div className="px-6 py-4 text-sm text-gray-500">Refreshing product details…</div>
                )}
              </div>

              {/* Coupon Code */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition">
                    OK
                  </button>
                </div>
                <button className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  CLEAR SHOPPING CART
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b">CART TOTALS</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{currency}{summary.subtotal}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">TOTAL</span>
                      <span className="text-gray-900">{currency}{summary.total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => token ? navigate('/place-order') : navigate('/login', { state: { from: '/place-order' } })}
                  disabled={!hasItems}
                  className={`w-full py-4 rounded-lg font-semibold text-white transition mb-3 ${
                    hasItems
                      ? 'bg-black hover:bg-gray-800'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  title={!hasItems ? 'Add items to your cart first' : 'Proceed to Checkout'}
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  onClick={() => navigate('/collection')}
                  className="w-full py-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  CONTINUE SHOPPING
                </button>

                {/* Payment Security */}
                <div className="mt-8 pt-6 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment security</h4>
                  <p className="text-xs text-gray-600 mb-4">
                    Encryption ensures increased transaction security. SSL technology protects data linked to personal and payment info.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded">VISA</div>
                    <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded">MASTER</div>
                    <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded">PAYPAL</div>
                    <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded">AMEX</div>
                    <div className="px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded">DISCOVER</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;