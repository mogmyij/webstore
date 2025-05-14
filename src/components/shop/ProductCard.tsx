import Image from 'next/image';
import { Product } from '@/data/Products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>
        <p className="text-xl font-bold text-blue-600 mb-2">SGD {product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
      </div>
    </div>
  );
}
