import {useContext, useState, useEffect, useMemo, useRef, useCallback} from "react";
import { assets } from "../assets/assets";
import ShopContext from '../context/ShopContextInstance';
import { useLocation } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";
import usePageMetadata from "../hooks/usePageMetadata";
import { getPrimaryProductImage } from "../utils/productImages";
import { Clock } from "lucide-react";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    productMap,
    ensureProductLoaded,
    currency,
    getCartSummary,
  } = useContext(ShopContext);

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [deliverySubmitted, setDeliverySubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const razorpayLoaderRef = useRef(null);
  const paymentsConfigured = Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID?.trim());

  useEffect(() => {
    if (deliverySubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [deliverySubmitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true, state: { from: location?.pathname || "/" } });
    }
  }, [token, navigate, location]);

  const placeOrderStructuredData = useMemo(
    () =>
      ({ absoluteCanonical, baseTitle, pageDescription }) => [
        {
          '@context': 'https://schema.org',
          '@type': 'CheckoutPage',
          '@id': `${absoluteCanonical}#place-order`,
          url: absoluteCanonical,
          name: baseTitle,
          description: pageDescription,
          paymentAccepted: method === 'cod' ? ['Cash'] : ['Card', 'OnlinePayment'],
          potentialAction: {
            '@type': 'PayAction',
            target: absoluteCanonical,
          },
        },
      ],
    [method]
  );

  usePageMetadata({
    title: 'Secure Checkout Details',
    description:
      'Provide delivery information and choose a payment method to place your TinyMillion order securely.',
    keywords: 'TinyMillion place order, delivery form, payment method, secure checkout',
    canonical: '/place-order',
    robots: 'noindex, nofollow',
    structuredData: placeOrderStructuredData,
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const ensureRazorpay = useCallback(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return Promise.resolve(true);
    }

    if (razorpayLoaderRef.current) {
      return razorpayLoaderRef.current;
    }

    razorpayLoaderRef.current = new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Document is unavailable to load Razorpay"));
        return;
      }

      const attach = (script) => {
        script.addEventListener(
          "load",
          () => {
            resolve(true);
          },
          { once: true }
        );
        script.addEventListener(
          "error",
          () => {
            reject(new Error("Failed to load Razorpay checkout"));
          },
          { once: true }
        );
      };

      const existing = document.getElementById("razorpay-sdk");
      if (existing) {
        attach(existing);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      attach(script);
      document.body.appendChild(script);
    }).catch((error) => {
      razorpayLoaderRef.current = null;
      throw error;
    });

    return razorpayLoaderRef.current;
  }, []);

  useEffect(() => {
    if (method === "razorpay" && paymentsConfigured) {
      ensureRazorpay().catch((error) => {
        console.warn(error);
      });
    }
  }, [method, ensureRazorpay, paymentsConfigured]);

  const initPay = async (order) => {
    try {
      await ensureRazorpay();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to load Razorpay");
      return;
    }

    const options = {
      key: order?.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await api.post("/api/order/verifyRazorpay", response);
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          } else {
            toast.error(data.message || "Verification failed");
          }
        } catch (error) {
          console.error(error);
          toast.error(error?.response?.data?.message || error.message);
        }
      },
    };

    if (!window?.Razorpay) {
      toast.warn("Razorpay SDK is unavailable. Simulating success.");
      navigate("/orders");
      setCartItems({});
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const buildOrderPayload = useCallback(
    async (selectedMethod = method) => {
      const cart = cartItems || {};
      const uniqueIds = new Set();
      for (const pid in cart) {
        if (Object.prototype.hasOwnProperty.call(cart, pid)) {
          uniqueIds.add(String(pid));
        }
      }

      const productCache = new Map();
      await Promise.all(
        Array.from(uniqueIds)
          .filter(Boolean)
          .map(async (pid) => {
            const existing = productMap.get(pid);
            if (existing) {
              productCache.set(pid, existing);
              return;
            }
            const fetched = await ensureProductLoaded(pid);
            if (fetched) {
              productCache.set(pid, fetched);
            }
          })
      );

      const orderItems = [];
      for (const pid in cart) {
        if (!Object.prototype.hasOwnProperty.call(cart, pid)) continue;
        const sizes = cart[pid] || {};
        const product = productCache.get(String(pid)) || productMap.get(String(pid));
        if (!product) continue;

        for (const size in sizes) {
          if (!Object.prototype.hasOwnProperty.call(sizes, size)) continue;
          const qty = Number(sizes[size]) || 0;
          if (qty <= 0) continue;
          const imageUrl = getPrimaryProductImage(product) || null;
          orderItems.push({
            product: product._id,
            name: product.name,
            price: Number(product.price) || 0,
            size,
            quantity: qty,
            image: imageUrl,
          });
        }
      }

      const subtotal = Number(getCartAmount ? getCartAmount() : 0) || 0;
      const deliveryFee = Number(delivery_fee || 0) || 0;
      const total = subtotal + deliveryFee;

      return {
        address: formData,
        cartItems: orderItems,
        items: orderItems,
        totalAmount: total,
        amount: total,
        subtotal,
        deliveryFee,
        paymentMethod: selectedMethod,
      };
    },
    [cartItems, ensureProductLoaded, getCartAmount, delivery_fee, formData, method, productMap]
  );

  const isCartEmpty = () => {
    const cart = cartItems || {};
    return Object.keys(cart).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (isCartEmpty()) {
      toast.info("Cart is empty. Add items before placing order.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone || "")) {
      toast.info("Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const orderData = await buildOrderPayload();
      if (!orderData?.cartItems?.length) {
        toast.error("Unable to prepare your order. Please refresh and try again.");
        setLoading(false);
        return;
      }

      if (!paymentsConfigured && method !== "cod") {
        toast.info("Online payments disabled in this environment. Using Cash on Delivery instead.");
        const fallbackData = await buildOrderPayload("cod");
        const { data } = await api.post("/api/order/place", fallbackData);
        if (data.success) {
          toast.success(data.message || "Order placed");
          setMethod("cod");
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(data.message || "Unable to place order");
        }
        setLoading(false);
        return;
      }

      switch (method) {
        case "cod": {
          const { data } = await api.post("/api/order/place", orderData);
          if (data.success) {
            toast.success(data.message || "Order placed");
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(data.message || "Unable to place order");
          }
          break;
        }
        case "stripe": {
          const { data } = await api.post("/api/order/stripe", orderData);
          if (data.success) {
            const sessionUrl = data?.data?.session_url || data.session_url;
            if (sessionUrl) {
              window.location.replace(sessionUrl);
            } else {
              toast.info("Stripe session created (no redirect URL returned)");
            }
          } else {
            toast.error(data.message || "Stripe checkout failed");
          }
          break;
        }
        case "razorpay": {
          const { data } = await api.post("/api/order/razorpay", orderData);
          if (data.success) {
            const order = data?.data?.order || data.order;
            if (order?.id) {
              await initPay({ ...order, key: data?.data?.key || data.key });
            } else {
              toast.success(data.message || "Payment completed");
              navigate("/orders");
              setCartItems({});
            }
          } else {
            toast.error(data.message || "Razorpay payment failed");
          }
          break;
        }
        default:
          toast.error("Unknown payment method");
          break;
      }
    } catch (error) {
      console.error(error);
      const status = error?.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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

  const summary = getCartSummary ? getCartSummary() : { subtotal: getCartAmount(), total: getCartAmount() + delivery_fee };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
                ✓
              </div>
              <span className="text-sm font-medium text-gray-600">SHOPPING CART</span>
            </div>
            <div className="w-16 h-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <span className="text-sm font-semibold text-gray-900">CHECKOUT</span>
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

      {/* Timer Banner */}
      {deliverySubmitted && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                You are out of time! Checkout now to avoid losing your order! {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Banner */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Have a coupon? Click here to enter
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Billing Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">BILLING DETAILS</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="firstName"
                    value={formData.firstName}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    type="text"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="lastName"
                    value={formData.lastName}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    type="text"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="country"
                  value={formData.country}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="text"
                  placeholder="United States (US)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="street"
                  value={formData.street}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="text"
                  placeholder="House number and street name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="city"
                  value={formData.city}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="text"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  onChange={onChangeHandler}
                  name="state"
                  value={formData.state}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="text"
                  placeholder="California"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="phone"
                    value={formData.phone}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    type="tel"
                    placeholder="Phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    onChange={onChangeHandler}
                    name="zipcode"
                    value={formData.zipcode}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    type="text"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  onChange={onChangeHandler}
                  name="email"
                  value={formData.email}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  type="email"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (optional)
                </label>
                <textarea
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  rows="4"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                />
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">YOUR ORDER</h3>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartData.map((item, index) => {
                  const productData = productMap.get(String(item._id));
                  const imgSrc = getPrimaryProductImage(productData);
                  const subtotal = (productData?.price || 0) * item.quantity;

                  return (
                    <div key={`${item._id}-${item.size}-${index}`} className="flex gap-3 pb-4 border-b">
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={productData?.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">
                          {productData?.name || 'Product'}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.quantity} × {currency}{productData?.price}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {item.size}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Subtotal: {currency}{subtotal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 pb-4 border-b mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{currency}{summary.subtotal}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL</span>
                  <span>{currency}{summary.total}</span>
                </div>
              </div>

              {/* Payment Methods */}
              {!paymentsConfigured && (
                <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-xs text-yellow-800">
                  Payments run in mock mode locally. Cash on Delivery works as usual.
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div
                  onClick={() => setMethod("cod")}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${method === "cod" ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                  <span className="text-sm font-medium">Cash on delivery</span>
                </div>

                <div
                  onClick={() => setMethod("stripe")}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${method === "stripe" ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                  <img src={assets.stripe_logo} alt="Stripe" className="h-4" />
                </div>

                <div
                  onClick={() => setMethod("razorpay")}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${method === "razorpay" ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                  <img src={assets.razorpay_logo} alt="Razorpay" className="h-4" />
                </div>
              </div>

              <button
                onClick={onSubmitHandler}
                disabled={loading || isCartEmpty()}
                className={`w-full py-4 rounded-lg font-semibold text-white transition ${
                  loading || isCartEmpty()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-black hover:bg-gray-800'
                }`}
              >
                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;