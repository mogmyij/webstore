import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full h-64"> {/* Consistent image height */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-custom-gray mb-1 truncate group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-gray-700 font-bold text-md">
            ${product.price.toFixed(2)} {/* Displaying with $ as per image, requirements mention SGD */}
          </p>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
