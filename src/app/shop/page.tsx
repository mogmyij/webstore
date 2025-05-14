import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/shop/ProductCard';
import ShopSidebar from '@/components/shop/ShopSidebar';
import { mockProducts } from '@/data/MockProducts';

const ShopPage = () => {
  const products = mockProducts; // In a real app, fetch this data

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-custom-gray">Shop Our Products</h1>
          {/* Breadcrumbs (Optional for now, but good for UX) */}
          {/* <nav className="text-sm text-gray-500 mt-1">Home / Shop</nav> */}
        </div>

        {/* Search and Sort Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 p-4 bg-white rounded-lg shadow">
          {/* Search Bar Placeholder */}
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <input
              type="search"
              placeholder="Search products..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Sorting Dropdown Placeholder */}
          <div className="w-full md:w-auto">
            <select className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option value="newest">Sort by Newest</option>
              <option value="price-asc">Sort by Price: Low to High</option>
              <option value="price-desc">Sort by Price: High to Low</option>
              <option value="name-asc">Sort by Name: A-Z</option>
              <option value="name-desc">Sort by Name: Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 lg:w-1/5">
            <ShopSidebar />
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xl">No products found.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPage;
