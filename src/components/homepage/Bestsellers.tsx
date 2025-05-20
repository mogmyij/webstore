import React from 'react';
import ProductCard from '../shop/ProductCard';
import { products } from '@/data/Products';

const Bestsellers = () => {
  return (
    <div className="bg-white py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-custom-gray">Our bestsellers</h2>
        <a href="shop" className="text-gray-600 hover:text-custom-gray">More →</a>
      </div>
      <hr className='opacity-40 py-7' />
      <div className="grid grid-cols-4 gap-8">
        {products.slice(0,4).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;
