// app/bag/page.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { XMarkIcon } from '@heroicons/react/24/solid';
import QuantitySelector from '@/components/shop/QuantitySelector';
import Breadcrumb from '@/components/common/Breadcrumb';

const CartItemRow = ({ item, onUpdateQuantity, onRemoveItem }: { item: CartItem, onUpdateQuantity: (productId: number, newQuantity: number) => void, onRemoveItem: (productId: number) => void }) => {
  return (
    <div className="grid grid-cols-5 gap-4 py-4 border-b items-center">
      <Link href={`/shop/${item.id}`} className="col-span-1">
        <Image src={item.image} alt={item.name} width={96} height={96} className="w-24 h-24 object-cover" />
      </Link>
      <div className="col-span-1">
        <Link href={`/shop/${item.id}`} className="font-semibold hover:text-blue-600">{item.name}</Link>
        <div className="text-gray-600 text-sm">SGD {item.price.toFixed(2)}</div>
      </div>
      <div className="col-span-1 flex justify-center">
        <QuantitySelector quantity={item.quantity} onQuantityChange={(newQuantity) => onUpdateQuantity(item.id, newQuantity)} />
      </div>
      <div className="col-span-1 font-semibold text-center">SGD {(item.price * item.quantity).toFixed(2)}</div>
      <button onClick={() => onRemoveItem(item.id)} className="col-span-1 text-gray-500 hover:text-red-600 flex justify-center">
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

const OrderSummary = () => {
  const { getCartTotal, cartItems } = useCart();
  const router = useRouter();
  const total = getCartTotal();

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between py-2 border-b">
        <span>Subtotal:</span>
        <span>SGD {total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Total:</span>
        <span className="font-semibold">SGD {total.toFixed(2)}</span>
      </div>
      <button
        onClick={() => router.push('/checkout')}
        className={`w-full py-3 mt-4 text-white font-semibold rounded-md ${cartItems.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        disabled={cartItems.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

const ShoppingCartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, } = useCart();
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Shopping Cart', current: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold mb-4">Shopping Cart</h1>
      
      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="md:grid md:grid-cols-3 md:gap-10">
        <div className="md:col-span-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-600">Your cart is currently empty.</p>
              <Link href="/shop" className="inline-block mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Continue Shopping</Link>
            </div>
          ) : (
            <div>
              <div className="hidden md:grid grid-cols-5 gap-4 py-2 border-b">
                <div className="col-span-1 font-semibold">Product</div>
                <div className="col-span-1 font-semibold"></div>
                <div className="col-span-1 font-semibold flex justify-center">Quantity</div>
                <div className="col-span-1 font-semibold text-center">Total</div>
                <div className="col-span-1 font-semibold flex justify-center"></div>
              </div>
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                />
              ))}
              <Link href="/shop" className="inline-block mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">Continue Shopping</Link>
            </div>
          )}
        </div>
        <div className="md:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
