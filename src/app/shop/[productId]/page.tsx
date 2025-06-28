"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import AccordionItem from '@/components/common/AccordionItem';
import QuantitySelector from '@/components/shop/QuantitySelector';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCard from '@/components/shop/ProductCard';
import type { Product } from '@/types/product';
import { ensureProductsDates } from '@/types/product';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const products: Product[] = await response.json();
        
        // Convert dateAdded strings back to Date objects using utility function
        const productsWithDates = ensureProductsDates(products);
        
        const foundProduct = productsWithDates.find(p => p.id === parseInt(productId as string));
        
        if (!foundProduct) {
          setError('Product not found');
          return;
        }
        
        setProduct(foundProduct);
        setSelectedImage(foundProduct.image);

        // Get related products (only active ones)
        const activeRelatedProducts = productsWithDates
          .filter((p: Product) => 
            p.category === foundProduct.category && 
            p.id !== foundProduct.id && 
            p.isActive === true
          )
          .slice(0, 4);
        
        setRelatedProducts(activeRelatedProducts);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  const handleAddToCart = () => {
    if (product && product.isActive) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product && product.isActive) {
      addToCart(product, quantity);
      router.push('/bag');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">Error loading product</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-500 mb-4">Product not found</p>
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.name, current: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Inactive Product Warning */}
      {!product.isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">
              ⚠️
            </div>
            <div>
              <p className="text-yellow-800 font-medium">
                This product is no longer available
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                This product has been discontinued and is no longer available for purchase.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group shadow-md">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105"
                priority
              />
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((imgSrc, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgSrc)}
                  className={`relative aspect-square bg-gray-100 rounded overflow-hidden border-2 hover:border-blue-500
                              ${selectedImage === imgSrc ? 'border-blue-500' : 'border-transparent'}`}
                >
                  <Image src={imgSrc} alt={`${product.name} thumbnail ${index + 1}`} fill className="object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information & Actions */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mb-4">SGD {product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Purchase Actions */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-4">
            {product.isActive ? (
              <>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity:</span>
                  <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-md 
                    hover:bg-blue-700 active:bg-blue-800 active:scale-95 
                    transition duration-150 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-md 
                    hover:bg-green-600 transition duration-150 ease-in-out focus:outline-none 
                    focus:ring-2 focus:ring-green-500 focus:ring-offset-2 active:bg-green-800 active:scale-95"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg mb-4">This product is no longer available for purchase.</p>
                <Link 
                  href="/shop"
                  className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-md 
                  hover:bg-blue-700 transition duration-150 ease-in-out 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Browse Other Products
                </Link>
              </div>
            )}
          </div>

          {/* Detailed Information Accordion */}
          <div className="border-t border-gray-200 pt-6">
            <AccordionItem title="Product Description" defaultOpen>
              <p className="text-gray-600 whitespace-pre-line">{product.longDescription}</p>
            </AccordionItem>
            <AccordionItem title="Product Specifications">
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li><strong>Brand:</strong> {product.brand}</li>
                <li><strong>Category:</strong> {product.category}</li>
                <li><strong>Weight Capacity:</strong> {product.specifications.weightCapacity} kg</li>
                {product.specifications.dimensions && <li><strong>Dimensions:</strong> {product.specifications.dimensions}</li>}
                {product.specifications.batteryLife && <li><strong>Battery Life:</strong> {product.specifications.batteryLife}</li>}
                {product.features.length > 0 && (
                    <li><strong>Features:</strong> {product.features.join(', ')}</li>
                )}
              </ul>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Related Products Section - Only show active products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Looking for more?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProd => (
              <Link key={relatedProd.id} href={`/shop/${relatedProd.id}`} passHref >
                  <ProductCard product={relatedProd} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
