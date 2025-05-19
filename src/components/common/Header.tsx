"use client"

import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation
import { COMPANY_NAME } from '@/config/constants';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const { getItemCount } = useCart();
  return (
    //<header className="bg-black/30 backdrop-blur-md text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
    <header className="w-full top-0 z-50 bg-black/30 backdrop-blur-md text-white py-4 px-6 flex items-center justify-between">
      <div className="font-bold text-xl">
        <Link href="/">{COMPANY_NAME}</Link> {/* Make the logo a link to the homepage */}
      </div>
      <nav>
        <ul className="flex space-x-10">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/bag">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {getItemCount() > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
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
