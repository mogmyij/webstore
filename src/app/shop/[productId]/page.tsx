"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products, Product } from '@/data/Products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/shop/ProductCard';
import AccordionItem from '@/components/common/AccordionItem';
import QuantitySelector from '@/components/shop/QuantitySelector';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

// Helper function to find product by ID
const getProductById = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

// Helper function to get related products
const getRelatedProducts = (currentProduct: Product): Product[] => {
  if (!currentProduct) return [];
  return products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 4); // Get up to 4 related products
};


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // For image gallery

  useEffect(() => {
    if (params?.productId) {
      const productIdNum = parseInt(params.productId as string, 10);
      if (!isNaN(productIdNum)) {
        const foundProduct = getProductById(productIdNum);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.image); // Set main image
          setRelatedProducts(getRelatedProducts(foundProduct));
        } else {
          // Handle product not found, e.g., redirect to a 404 page or shop page
          router.push('/shop?error=product_not_found');
        }
      }
    }
  }, [params, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Optionally, show a notification
      // alert(`${product.name} (x${quantity}) added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/bag');
    }
  };

  if (!product) {
    // You can render a loading skeleton here
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex items-center justify-center">
            <p className="text-2xl text-gray-500">Loading product details...</p>
        </div>
    );
  }

  // For image zoom on hover (CSS only)
  // Add a wrapper div around the Image component and apply group-hover for zoom
  // Parent div: relative overflow-hidden group
  // Image: transition-transform duration-300 ease-in-out group-hover:scale-110

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
          <li className="flex items-center">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          </li>
          <li className="flex items-center">
            <Link href="/shop" className="hover:text-blue-600">Shop</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          </li>
          <li className="flex items-center">
            <span className="font-medium text-gray-700">{product.name}</span>
          </li>
        </ol>
      </nav>

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
                className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-105" // CSS Zoom
                priority // Prioritize loading for LCP
              />
            )}
          </div>
          {/* Thumbnails (if product.images exists and has more than one image) */}
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <QuantitySelector quantity={quantity} onQuantityChange={setQuantity} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-green-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-green-600 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Buy Now
              </button>
            </div>
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
            {/* Add more AccordionItems if needed e.g. for Shipping, Payment Options based on actual content */}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
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
