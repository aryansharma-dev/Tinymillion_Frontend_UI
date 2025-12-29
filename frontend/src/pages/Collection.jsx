import {useContext, useEffect, useMemo, useState} from 'react';
import ShopContext from '../context/ShopContextInstance';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { getProductImageArray } from '../utils/productImages';
import usePageMetadata from '../hooks/usePageMetadata';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

const Collection = () => {
  const { products, search, showSearch, productPagination, loadNextProductsPage } = useContext(ShopContext);

  // UI state
  const [showFilter, setShowFilter] = useState(false); // mobile toggle
  // filters
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // sorting
  const [sortType, setSortType] = useState('relavent');

  // toggle helper for checkbox groups
  const toggleValue = (value, setter) => {
    setter(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]));
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    let list = products.filter(item => item && typeof item === 'object' && item._id);

    if (showSearch && search) {
      const q = search.toLowerCase();
      list = list.filter(item => {
        if (!item) return false;
        const name = typeof item.name === 'string' ? item.name.toLowerCase() : '';
        return name.includes(q);
      });
    }

    if (category.length > 0) {
      list = list.filter(item => category.includes(item?.category));
    }

    if (subCategory.length > 0) {
      list = list.filter(item => subCategory.includes(item?.subCategory));
    }

    // Price filter
    list = list.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

    switch (sortType) {
      case 'low-high':
        return list.slice().sort((a, b) => a.price - b.price);
      case 'high-low':
        return list.slice().sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [products, showSearch, search, category, subCategory, priceRange, sortType]);

  const collectionStructuredData = useMemo(
    () =>
      ({ absoluteCanonical, pageDescription, baseTitle, origin }) => {
        const listItems = filteredProducts
          .slice(0, 12)
          .map((item, index) => {
            if (!item?._id) return null;
            return {
              '@type': 'ListItem',
              position: index + 1,
              url: `${origin}/product/${item._id}`,
              name: item?.name,
            };
          })
          .filter(Boolean);

        return [
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            '@id': `${absoluteCanonical}#all-products`,
            url: absoluteCanonical,
            name: baseTitle,
            description: pageDescription,
          },
          listItems.length
            ? {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                '@id': `${absoluteCanonical}#catalogue`,
                itemListElement: listItems,
              }
            : null,
        ].filter(Boolean);
      },
    [filteredProducts]
  );

  useEffect(() => {
    if (!productPagination?.hasMore) return;
    if (!products.length) return;
    if (filteredProducts.length >= 12) return;
    loadNextProductsPage();
  }, [filteredProducts.length, products.length, productPagination?.hasMore, loadNextProductsPage]);
  
  usePageMetadata({
    title: 'Shop All Collections',
    description:
      'Filter TinyMillion apparel, jewellery, and creator exclusives by category and price to find your next signature outfit.',
    keywords:
      'TinyMillion all products, TinyMillion catalogue, shop outfits online, fashion filters, creator merch',
    canonical: '/collection',
    structuredData: collectionStructuredData,
  });

  const clearAllFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setPriceRange([0, 10000]);
    setSortType('relavent');
  };

  const activeFiltersCount = category.length + subCategory.length + (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-none hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-700" />
            <span className="font-medium text-sm text-gray-700">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-6">
          {/* LEFT: Fixed Sidebar Filters */}
          <aside
            className={`
              fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-2rem)] 
              w-[280px] bg-white border-r border-gray-100 
              overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
              z-50 lg:z-0 transition-transform duration-300 ease-in-out
              ${showFilter ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
              <h3 className="font-semibold text-base tracking-wide">Filters</h3>
              <button
                onClick={() => setShowFilter(false)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 lg:p-7 space-y-8">
              {/* Clear All Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full text-xs text-gray-600 hover:text-gray-900 font-medium text-left uppercase tracking-wider transition-colors pb-2 border-b border-gray-100"
                >
                  Clear all filters ({activeFiltersCount})
                </button>
              )}

              {/* Categories */}
              <div className="border-b border-gray-100 pb-7">
                <h3 className="font-semibold text-xs uppercase tracking-wider mb-5 text-gray-900">
                  Categories
                </h3>
                <div className="space-y-3.5">
                  {['Men', 'Women', 'Kids', 'Jewellery'].map(c => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        value={c}
                        checked={category.includes(c)}
                        onChange={e => toggleValue(e.target.value, setCategory)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-1 focus:ring-black focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                        {c}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types */}
              <div className="border-b border-gray-100 pb-7">
                <h3 className="font-semibold text-xs uppercase tracking-wider mb-5 text-gray-900">
                  Type
                </h3>
                <div className="space-y-3.5">
                  {['Topwear', 'Bottomwear', 'Winterwear', 'Girlish'].map(sc => (
                    <label key={sc} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        value={sc}
                        checked={subCategory.includes(sc)}
                        onChange={e => toggleValue(e.target.value, setSubCategory)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-1 focus:ring-black focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors font-medium">
                        {sc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pb-2">
                <h3 className="font-semibold text-xs uppercase tracking-wider mb-5 text-gray-900">
                  Price Range
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black transition-all bg-white"
                      placeholder="Min"
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-black focus:border-black transition-all bg-white"
                      placeholder="Max"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer price-slider"
                      style={{
                        background: `linear-gradient(to right, #000 0%, #000 ${(priceRange[1] / 10000) * 100}%, #e5e7eb ${(priceRange[1] / 10000) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {showFilter && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilter(false)}
            />
          )}

          {/* RIGHT: Products Section */}
          <main className="flex-1 overflow-y-auto">
            {/* Header with Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-transparent">
              <div>
                <Title text1={'ALL'} text2={'COLLECTIONS'} />
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-medium">
                  Showing {filteredProducts.length} products
                </p>
              </div>
              <select
                onChange={e => setSortType(e.target.value)}
                value={sortType}
                className="px-4 py-2.5 border border-gray-200 rounded-none text-sm font-medium focus:ring-1 focus:ring-black focus:border-black bg-white text-gray-700 cursor-pointer transition-all"
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {filteredProducts.map((item) => {
                  if (!item || !item?._id) {
                    return null;
                  }

                  return (
                    <ProductItem
                      key={item._id}
                      id={item._id}
                      name={item.name}
                      price={item.price}
                      image={getProductImageArray(item)}
                      originalPrice={item.originalPrice || null}
                      discount={item.discount || null}
                      isNew={item.isNew || false}
                      rating={item.rating || 4.5}
                      reviews={item.reviews || Math.floor(Math.random() * 500) + 50}
                      colors={item.colors || []}
                      sizes={item.sizes || ['S', 'M', 'L', 'XL']}
                      category={item.category || ''}
                    />
                  );
                })}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 mb-6 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-wide">
                  No Products Found
                </h3>
                <p className="text-sm text-gray-500 mb-8 max-w-sm">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-black hover:bg-gray-800 text-white px-8 py-3 text-sm font-medium transition-colors uppercase tracking-wider rounded-none"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Load More / Pagination Info */}
            {filteredProducts.length > 0 && productPagination?.hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadNextProductsPage}
                  className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Load More Products
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Collection;