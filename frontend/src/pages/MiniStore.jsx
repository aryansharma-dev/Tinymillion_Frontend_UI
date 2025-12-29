import { useEffect, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { useParams, Link, useLocation } from "react-router-dom";
import ShopContext from '../context/ShopContextInstance';
import { getPrimaryProductImage } from "../utils/productImages";
import usePageMetadata from "../hooks/usePageMetadata";
import MiniStoreDetailSkeleton from "../components/skeletons/MiniStoreDetailSkeleton";
import MiniStoreListSkeleton from "../components/skeletons/MiniStoreListSkeleton";
import { ArrowLeft, ShoppingBag, Users, TrendingUp, Star, Heart, Share2, ChevronRight } from 'lucide-react';

const RESERVED = new Set([
  "", "home", "about", "contact", "collection", "collections", "cart", "checkout",
  "privacy-policy", "terms", "return-refund", "faqs", "login", "signup",
  "admin", "api", "sitemap.xml", "robots.txt", "search", "account", "orders", "product", "store"
]);

export default function MiniStore({ limit = 8 }) {
  const { api } = useContext(ShopContext);
  const { slug } = useParams();
  const location = useLocation();
  const preloadedStore = location.state?.store;
  const [store, setStore] = useState(() => preloadedStore ?? null);
  const [loading, setLoading] = useState(() => (slug ? !preloadedStore : false));
  const [err, setErr] = useState("");
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(true);

  const meta = useMemo(() => {
    const baseSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";
    const isDetail = Boolean(baseSlug);

    const storeName = String(store?.displayName || "").trim();
    const title = isDetail
      ? storeName
        ? `${storeName} Mini Store`
        : "Creator Mini Store"
      : "Creator Mini Stores";
    const description = isDetail
      ? store?.bio?.trim?.() ||
        (storeName
          ? `Shop curated looks and creator edits from ${storeName} on TinyMillion.`
          : "Explore curated products from TinyMillion creators.")
      : "Discover TinyMillion creator mini stores and shop limited edition outfits hand-picked by our community.";
    const keywords = isDetail
      ? `${storeName || "TinyMillion"} mini store, TinyMillion creator shops, curated looks`
      : "TinyMillion mini stores, creator shops, curated boutiques";
    const image = isDetail ? store?.bannerUrl || store?.avatarUrl : undefined;
    const canonical = isDetail ? `/${baseSlug}` : "/store";
    const structuredData = ({ absoluteCanonical, pageDescription, absoluteImage, baseTitle, origin }) => {
      if (isDetail) {
        const listItems = Array.isArray(store?.products)
          ? store.products
              .slice(0, 12)
              .map((product, index) => {
                const productId = product?._id || product?.id;
                if (!productId) return null;
                const productUrl = `${origin}/product/${productId}`;
                return {
                  "@type": "ListItem",
                  position: index + 1,
                  url: productUrl,
                  name: product?.name,
                };
              })
              .filter(Boolean)
          : [];

        const schemas = [
          {
            "@context": "https://schema.org",
            "@type": "Store",
            "@id": `${absoluteCanonical}#creator-store`,
            url: absoluteCanonical,
            name: storeName || baseTitle,
            description: store?.bio?.trim?.() || pageDescription,
            image: store?.bannerUrl || store?.avatarUrl || absoluteImage,
          },
        ];

        if (listItems.length > 0) {
          schemas.push({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "@id": `${absoluteCanonical}#store-products`,
            itemListElement: listItems,
          });
        }

        return schemas;
      }

      const storeItems = Array.isArray(stores)
        ? stores
            .slice(0, limit)
            .map((item, index) => {
              const slugValue = item?.slug || item?.customUrl;
              if (!slugValue) return null;
              return {
                "@type": "ListItem",
                position: index + 1,
                url: `${origin}/${slugValue}`,
                name: item?.displayName,
              };
            })
            .filter(Boolean)
        : [];

      return [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${absoluteCanonical}#mini-stores`,
          name: baseTitle,
          description: pageDescription,
          url: absoluteCanonical,
        },
        storeItems.length
          ? {
              "@context": "https://schema.org",
              "@type": "ItemList",
              "@id": `${absoluteCanonical}#mini-store-list`,
              itemListOrder: "http://schema.org/ItemListOrderDescending",
              itemListElement: storeItems,
            }
          : null,
      ].filter(Boolean);
    };

    return { title, description, keywords, canonical, image, structuredData };
  }, [slug, store, stores, limit]);

  usePageMetadata(meta);

  useEffect(() => {
    const normalisedSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";

    if (!normalisedSlug) {
      setErr("");
      setStore(null);
      setLoading(false);
      return;
    }

    if (RESERVED.has(normalisedSlug)) {
      setErr("notfound");
      setStore(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const prefetchedMatches =
      preloadedStore?.slug?.toLowerCase?.() === normalisedSlug ||
      preloadedStore?.customUrl?.toLowerCase?.() === normalisedSlug;

    setErr("");
    if (prefetchedMatches) {
      setStore(preloadedStore);
      setLoading(false);
    } else {
      setStore(null);
      setLoading(true);
    }

    (async () => {
      try {
        const { data } = await api.get(`/api/ministores/store/${normalisedSlug}`, {
          params: { productLimit: 24 },
        })
        if (!cancelled) {
          setStore(data);
          setErr("");
        }
      } catch (error) {
        if (cancelled) return;
        console.error(error);
        const code = error?.response?.status;
        setErr(code === 404 ? "notfound" : "network");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, api, preloadedStore]);

  useEffect(() => {
    if (slug) return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/ministores", { params: { limit } });
        if (!cancelled) {
          setStores(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Mini stores load failed:", e);
        }
      } finally {
        if (!cancelled) {
          setStoresLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [limit, api, slug]);

  // Individual Store Detail View
  if (slug) {
    if (loading && !store) {
      return <MiniStoreDetailSkeleton />;
    }

    if (err === "notfound") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <ShoppingBag className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Store Not Found</h2>
            <p className="text-gray-600 mb-6">The store you're looking for doesn't exist or has been removed.</p>
            <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to Mini Stores
            </Link>
          </div>
        </div>
      );
    }

    if (err) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-red-600 mb-2">Error Loading Store</h2>
            <p className="text-gray-600 mb-6">Something went wrong. Please try again later.</p>
            <Link to="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition">
              <ArrowLeft className="w-4 h-4" />
              Back to Mini Stores
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Store Cover Banner */}
        <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 overflow-hidden">
          {store?.bannerUrl ? (
            <img
              src={store.bannerUrl}
              alt={store.displayName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Store Banner</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Back Button */}
          <Link 
            to="/store" 
            className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 font-medium rounded-lg hover:bg-white transition shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Share & Like Buttons */}
          <div className="absolute top-6 right-6 flex gap-2">
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-lg">
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition shadow-lg">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Store Info Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 md:-mt-20">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={store?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
                    alt={store?.displayName}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                </div>

                {/* Store Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {store?.displayName}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>2.5K followers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>4.8 Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>Trending</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition whitespace-nowrap">
                      Follow Store
                    </button>
                  </div>
                  
                  {store?.bio && (
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {store.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {store?.products?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">1.2K</div>
                      <div className="text-sm text-gray-500">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">4.9</div>
                      <div className="text-sm text-gray-500">Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Featured Products
                </h2>
                <p className="text-gray-600">Curated collection from this creator</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  All
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  New
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Popular
                </button>
              </div>
            </div>

            {(!store?.products || store.products.length === 0) ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No products available yet</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {store.products.map((p) => {
                  const image = getPrimaryProductImage(p) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                  return (
                    <Link 
                      key={p?._id || p?.id} 
                      to={`/product/${p?._id || p?.id || ''}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={image}
                          alt={p?.name || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                            <Heart className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                          {p?.name || 'Product'}
                        </h3>
                        <div className="flex items-center justify-between">
                          {typeof p?.price === 'number' && !Number.isNaN(p.price) && (
                            <span className="text-lg font-bold text-gray-900">
                              ₹{p.price.toLocaleString()}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span>4.5</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN VIEW: Mini Stores List
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Creator Mini Stores
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Discover exclusive collections curated by top creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-xl">
              Explore Stores
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition">
              Become a Creator
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-y shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stores.length}+</div>
              <div className="text-sm text-gray-600">Active Stores</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">100K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="hidden md:block">
              <div className="text-3xl font-bold text-gray-900">4.8★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Creators</h2>
            <p className="text-gray-600">Shop from verified creator stores</p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {storesLoading ? (
          <MiniStoreListSkeleton count={limit} />
        ) : stores.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No stores available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {stores.map((s) => (
              <Link
                key={s.slug}
                to={`/${s.slug}`}
                state={{ store: s }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {/* Banner */}
                  <div className="relative h-32 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                    {s.bannerUrl ? (
                      <img
                        src={s.bannerUrl}
                        alt={s.displayName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  {/* Profile & Info */}
                  <div className="p-4 -mt-8 relative">
                    <img
                      src={s.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"}
                      alt={s.displayName}
                      className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-lg mb-3"
                      loading="lazy"
                    />
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition truncate">
                      {s.displayName}
                    </h3>
                    {s.bio && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{s.bio}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" />
                        <span>24 Products</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Store?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators earning through their curated collections
          </p>
          <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition shadow-xl">
            Create Your Store Now
          </button>
        </div>
      </div>
    </div>
  );
}

MiniStore.propTypes = {
  limit: PropTypes.number,
};