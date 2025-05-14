import React from 'react';
import Link from 'next/link'; // Import Link for Next.js navigation

const Header = () => {
  return (
    <header className="bg-black/30 backdrop-blur-md text-white py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="font-bold text-xl">
        <Link href="/">Trail</Link> {/* Make the logo a link to the homepage */}
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/account">Account</Link></li>
          <li><Link href="/bag">Bag</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
