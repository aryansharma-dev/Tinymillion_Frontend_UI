import {useContext, useEffect, useState, useMemo, useCallback} from 'react';
import ShopContext from '../context/ShopContextInstance';
import api from '../lib/api';
import usePageMetadata from '../hooks/usePageMetadata';
import { getPrimaryProductImage } from '../utils/productImages';
import { Package, Clock, CheckCircle, XCircle, Truck, RefreshCw } from 'lucide-react';

const Orders = () => {
  const { token, currency, ensureProductLoaded, productMap } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [resolvedImages, setResolvedImages] = useState({});

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) return;

      const { data } = await api.post('/api/order/userorders');
      if (data.success) {
        const allItems = [];
        (data.orders || []).forEach((order) => {
          (order.items || []).forEach((item) => {
            allItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allItems.reverse());
      }
    } catch (error) {
      console.error('loadOrderData failed', error);
    }
  }, [token]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);
  
  useEffect(() => {
    const missing = new Set();
    const updates = {};
    let hasImmediateUpdates = false;

    orderData.forEach((item) => {
      const pid = String(item.product || item.productId || item._id || "");
      if (!pid) return;

      const storedImage = typeof item.image === 'string' && item.image.trim();
      if (storedImage) {
        if (resolvedImages[pid] !== storedImage) {
          updates[pid] = storedImage;
          hasImmediateUpdates = true;
        }
        return;
      }

      const cachedProduct = productMap.get(pid);
      const cachedImage = getPrimaryProductImage(cachedProduct);
      if (cachedImage) {
        if (resolvedImages[pid] !== cachedImage) {
          updates[pid] = cachedImage;
          hasImmediateUpdates = true;
        }
        return;
      }

      if (!resolvedImages[pid]) {
        missing.add(pid);
      }
    });

    if (hasImmediateUpdates) {
      setResolvedImages((prev) => ({ ...prev, ...updates }));
    }

    if (!missing.size) return;

    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        Array.from(missing).map(async (pid) => {
          try {
            const product = await ensureProductLoaded(pid);
            return [pid, getPrimaryProductImage(product)];
          } catch (error) {
            console.error('Failed to load product for order', pid, error);
            return [pid, null];
          }
        })
      );
      if (cancelled) return;
      setResolvedImages((prev) => {
        let changed = false;
        const next = { ...prev };
        results.forEach(([pid, image]) => {
          if (pid && image && next[pid] !== image) {
            next[pid] = image;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [orderData, ensureProductLoaded, productMap, resolvedImages]);

  const ordersStructuredData = useMemo(
    () =>
      ({ absoluteCanonical, baseTitle, pageDescription }) => [
        {
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          '@id': `${absoluteCanonical}#orders`,
          url: absoluteCanonical,
          name: baseTitle,
          description: pageDescription,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: orderData.length,
          },
        },
      ],
    [orderData.length]
  );

  usePageMetadata({
    title: 'Your TinyMillion Orders',
    description: 'Track TinyMillion purchases, check fulfilment statuses, and revisit past order details in one place.',
    keywords: 'TinyMillion orders, track shipment, order history',
    canonical: '/orders',
    robots: 'noindex, nofollow',
    structuredData: ordersStructuredData,
  });

  const getStatusIcon = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('delivered')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (statusLower.includes('shipped') || statusLower.includes('transit')) return <Truck className="w-5 h-5 text-blue-500" />;
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return <XCircle className="w-5 h-5 text-red-500" />;
    if (statusLower.includes('processing')) return <Clock className="w-5 h-5 text-yellow-500" />;
    return <Package className="w-5 h-5 text-gray-500" />;
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('delivered')) return 'bg-green-100 text-green-700 border-green-200';
    if (statusLower.includes('shipped') || statusLower.includes('transit')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'bg-red-100 text-red-700 border-red-200';
    if (statusLower.includes('processing')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Empty State */}
        {orderData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => window.location.href = '/collection'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orderData.map((item, index) => {
              const pid = String(item.product || item.productId || item._id || index);
              const storedImage = typeof item.image === 'string' && item.image.trim();
              const fallbackImage = resolvedImages[pid] || getPrimaryProductImage(productMap.get(pid));
              const imageSrc = storedImage || fallbackImage || null;

              return (
                <div
                  key={`${item._id || index}-${index}`}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image & Details */}
                    <div className="flex gap-4 flex-1">
                      {imageSrc ? (
                        <img
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          src={imageSrc}
                          alt={item.name || 'Ordered product'}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">
                          {item.name}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Price:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {currency}{item.price}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Quantity:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Size:</span>
                            <span className="ml-2 font-semibold text-gray-900">
                              {item.size}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Payment:</span>
                            <span className="ml-2 font-semibold text-gray-900 uppercase">
                              {item.paymentMethod}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>Ordered on {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col gap-4 lg:w-64">
                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="font-semibold text-sm">
                          {item.status}
                        </span>
                      </div>

                      {/* Track Order Button */}
                      <button
                        onClick={loadOrderData}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Track Order
                      </button>

                      {/* Order Total */}
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Order Total:</span>
                          <span className="text-lg font-bold text-gray-900">
                            {currency}{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;