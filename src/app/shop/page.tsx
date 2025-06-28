"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/shop/ProductCard';
import FilterSidebar from '@/components/shop/FilterSidebar';
import SortDropdown from '@/components/shop/SortDropdown';
import Breadcrumb from '@/components/common/Breadcrumb';
import type { Product } from '@/types/product';
import { ensureProductsDates } from '@/types/product';

// Removed redundant parseFloat transformations since API now guarantees price is a number

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedWeightRanges, setSelectedWeightRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch active products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      
      // Convert dateAdded strings back to Date objects using utility function
      const productsWithDates = ensureProductsDates(data);
      
      setProducts(productsWithDates);
      
      // Set initial price range based on fetched products
      if (productsWithDates.length > 0) {
        const minPrice = Math.min(...productsWithDates.map((p: Product) => p.price));
        const maxPrice = Math.max(...productsWithDates.map((p: Product) => p.price));
        setPriceRange([minPrice, maxPrice]);
      }
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Apply price range filter
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Apply feature filter
    if (selectedFeatures.length > 0) {
      result = result.filter(product =>
        product.features.some(feature => selectedFeatures.includes(feature))
      );
    }

    // Apply weight range filter
    if (selectedWeightRanges.length > 0) {
      result = result.filter(product => {
        const weight = product.specifications.weightCapacity;
        return selectedWeightRanges.some(range => {
          if (range === "Under 100kg") return weight < 100;
          if (range === "100-150kg") return weight >= 100 && weight <= 150;
          if (range === "150-200kg") return weight > 150 && weight <= 200;
          if (range === "Over 200kg") return weight > 200;
          return false;
        });
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, priceRange, selectedBrands, selectedCategories, selectedFeatures, selectedWeightRanges, sortOption]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', current: true }
  ];

  // Calculate min/max prices for filter sidebar
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.price)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000;

  // Calculate dynamic filter options from available products
  const availableBrands = [...new Set(products.map(product => product.brand))];
  const availableCategories = [...new Set(products.map(product => product.category))];
  const availableFeatures = [...new Set(products.flatMap(product => product.features))];

  return (
    <div>
      {/* Page Title */}
      <div className='relative bg-black mt-[-10px] md:mt-[-90px] lg:mt-[-60px]'>
        <img
          src="/shop_banner.jpg"
          alt="Banner"
          className="opacity-70 w-full h-100 object-cover object-[center_0%]"
        />
        <h1 className="absolute text-6xl bottom-0 left-1/9 text-white mb-8">Mobility <br/> Solutions</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        <hr className='opacity-15 py-4'/>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg text-gray-600">Loading products...</div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Filter Sidebar */}
            <div className="w-full md:w-1/4 md:pr-6 mb-6 md:mb-0">
              <FilterSidebar
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedFeatures={selectedFeatures}
                setSelectedFeatures={setSelectedFeatures}
                selectedWeightRanges={selectedWeightRanges}
                setSelectedWeightRanges={setSelectedWeightRanges}
                minPrice={minPrice}
                maxPrice={maxPrice}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                availableBrands={availableBrands}
                availableCategories={availableCategories}
                availableFeatures={availableFeatures}
              />
            </div>

            {/* Main Content */}
            <div className="w-full md:w-3/4">
              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Sort Dropdown */}
                <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-500 mb-4">{filteredProducts.length} results found</p>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-lg text-gray-600">No products match your criteria. Try adjusting your filters.</p>
                </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <Link key={product.id} href={`/shop/${product.id}`} passHref>
                          <ProductCard product={product}/>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
