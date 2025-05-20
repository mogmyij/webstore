"use client"

import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation
import { COMPANY_NAME } from '@/config/constants';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

import { useCart } from '@/context/CartContext';

const Header = () => {
  const { getItemCount } = useCart();
  return (
    //<header className="bg-black/30 backdrop-blur-md text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
    <header className="sticky w-full top-0 z-50 bg-black/30 backdrop-blur-md text-white py-4 px-6 flex items-center justify-between">
      <div className="font-bold text-xl">
        <Link href="/">{COMPANY_NAME}</Link> {/* Make the logo a link to the homepage */}
      </div>
      <nav>
        <ul className="flex space-x-10">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/bag">
            <ShoppingCartIcon className='size-6 text-white'/>
            {getItemCount() > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                {getItemCount()}
              </span>
            )}
          </Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
