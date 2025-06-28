"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '../shop/ProductCard';
import type { Product } from '@/types/product';
import { ensureProductsDates } from '@/types/product';

const Bestsellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await response.json();
        
        // Convert dateAdded strings back to Date objects using utility function
        const productsWithDates = ensureProductsDates(data);
        
        setProducts(productsWithDates);
      } catch (error) {
        console.error('Error fetching products for bestsellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-12 px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-custom-gray">Our bestsellers</h2>
          <a href="shop" className="text-gray-600 hover:text-custom-gray">More →</a>
        </div>
        <hr className='opacity-40 py-7' />
        <div className="flex justify-center py-8">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-custom-gray">Our bestsellers</h2>
        <a href="shop" className="text-gray-600 hover:text-custom-gray">More →</a>
      </div>
      <hr className='opacity-40 py-7' />
      <div className="grid grid-cols-4 gap-8">
        {products.slice(0,4).map(product => (
          <Link key={product.id} href={`/shop/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;
