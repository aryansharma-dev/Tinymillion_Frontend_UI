import {useContext, useEffect, useMemo, useState} from 'react';
import ShopContext from '../context/ShopContextInstance';
import ProductItem from '../components/ProductItem';
import { getProductImageArray } from '../utils/productImages';
import usePageMetadata from '../hooks/usePageMetadata';
import { ChevronDown, Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';

const Collection = () => {
  const { products, search, showSearch, productPagination, loadNextProductsPage } = useContext(ShopContext);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 9;

  // UI state
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // filters
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [stockStatus, setStockStatus] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // sorting
  const [sortType, setSortType] = useState('default');

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, subCategory, priceRange, sortType, search]);

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
    setSortType('default');
  };

  const activeFiltersCount = category.length + subCategory.length + (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

  const colors = [
    { name: 'Black', class: 'bg-black' },
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Brown', class: 'bg-amber-700' },
    { name: 'Green', class: 'bg-green-500' },
    { name: 'Beige', class: 'bg-amber-200' },
    { name: 'Cream', class: 'bg-amber-100' },
    { name: 'Gray', class: 'bg-gray-500' },
    { name: 'Orange', class: 'bg-orange-500' },
    { name: 'Pink', class: 'bg-pink-400' },
    { name: 'Purple', class: 'bg-purple-500' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Yellow', class: 'bg-yellow-400' },
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const brands = ['Bean Shop', 'Brands', 'Learts', 'Restories', 'Vagabond'];
  const tags = ['Bags', 'Beachwear', 'Dress', 'Fashion', 'Hat', 'Size', 'Bracelet', 'Sunglasses', 'T-Shirts'];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner - Hidden on Mobile */}
      <div className="hidden md:block relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-16 mb-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            All Collections
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our complete range of fashion, curated just for you
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        <div className="flex gap-0">
          {/* LEFT SIDEBAR - Fixed on Desktop, Hidden on Mobile */}
          <aside className="hidden lg:block w-[280px] bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto flex-shrink-0">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Filters</h2>

              {/* Categories */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>CATEGORIES</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 space-y-2.5">
                  {['Accessories', 'Best seller', 'Featured', 'HandBag', 'Men'].map(c => (
                    <label key={c} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      <input
                        type="checkbox"
                        checked={category.includes(c)}
                        onChange={() => toggleValue(c, setCategory)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      {c}
                    </label>
                  ))}
                  <button className="text-sm text-gray-500 hover:text-gray-900">+4 more</button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>PRICE</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>Price: ₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>AVERAGE RATING</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 space-y-2">
                  {[5, 4, 3].map(rating => (
                    <label key={rating} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRating.includes(rating)}
                        onChange={() => toggleValue(rating, setSelectedRating)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                        ))}
                      </div>
                      <span className="text-gray-500 text-xs ml-auto">({rating === 5 ? 10 : rating === 4 ? 9 : 7})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter by Color */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>FILTER BY</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => toggleValue(color.name, setSelectedColors)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColors.includes(color.name) ? 'border-black' : 'border-gray-200'
                      } ${color.class}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Filter by Size */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>FILTER BY</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleValue(size, setSelectedSizes)}
                      className={`px-4 py-2 border rounded text-sm ${
                        selectedSizes.includes(size)
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>STATUS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 space-y-2">
                  {['In stock', 'Out of stock', 'On sale'].map(status => (
                    <label key={status} className="flex items-center justify-between text-sm cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={stockStatus.includes(status)}
                          onChange={() => toggleValue(status, setStockStatus)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        {status}
                      </div>
                      <span className="text-gray-400 text-xs">({status === 'In stock' ? 18 : status === 'Out of stock' ? 6 : 3})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>BRANDS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center justify-between text-sm cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleValue(brand, setSelectedBrands)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        {brand}
                      </div>
                      <span className="text-gray-400 text-xs">(2)</span>
                    </label>
                  ))}
                  <button className="text-sm text-gray-500 hover:text-gray-900">+1 more</button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                  <span>TAGS</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleValue(tag, setSelectedTags)}
                      className={`px-3 py-1 rounded-full text-xs ${
                        selectedTags.includes(tag)
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Sidebar */}
          {showFilter && (
            <>
              <div
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                onClick={() => setShowFilter(false)}
              />
              
              <aside className="fixed top-0 left-0 w-[85%] max-w-[320px] h-screen bg-white z-50 overflow-y-auto lg:hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {activeFiltersCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-black text-white rounded-lg mb-6">
                      <span className="text-sm font-semibold">
                        {activeFiltersCount} {activeFiltersCount === 1 ? 'Filter' : 'Filters'} Active
                      </span>
                      <button
                        onClick={clearAllFilters}
                        className="text-xs underline hover:no-underline"
                      >
                        Clear All
                      </button>
                    </div>
                  )}

                  <div className="mb-6">
                    <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                      <span>CATEGORIES</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="mt-3 space-y-2.5">
                      {['Accessories', 'Best seller', 'Featured', 'HandBag', 'Men'].map(c => (
                        <label key={c} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                          <input
                            type="checkbox"
                            checked={category.includes(c)}
                            onChange={() => toggleValue(c, setCategory)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                      <span>PRICE</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="mt-3">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <button className="w-full flex items-center justify-between py-2 font-semibold text-sm">
                      <span>SIZE</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleValue(size, setSelectedSizes)}
                          className={`px-4 py-2 border rounded text-sm ${
                            selectedSizes.includes(size)
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </aside>
            </>
          )}

          {/* RIGHT SIDE - Products */}
          <main className="flex-1 w-full lg:overflow-y-auto">
            <div className="lg:hidden bg-gray-100 px-4 py-8 mb-4">
              <h1 className="text-2xl font-bold mb-2">The Latest Men's Trend</h1>
              <h2 className="text-2xl font-bold mb-2">Season 2021.</h2>
              <p className="text-sm text-gray-600">This is just a Popup swagtyle which you can enable.</p>
            </div>

            <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilter(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm font-medium"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                  </button>

                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="default">Default sorting</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 border border-gray-300 rounded p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show:</span>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>9</option>
                      <option>18</option>
                      <option>27</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-8">
              {currentProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {currentProducts.map((item) => {
                    if (!item || !item?._id) return null;

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
                <div className="text-center py-20">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 lg:mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                  >
                    <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center border rounded text-xs lg:text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                  >
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Collection;