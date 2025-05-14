import React from 'react';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative bg-black">
      <img
        src="/banner-image.jpg" // Replace with your actual image
        alt="Banner"
        className="opacity-80 w-full h-auto object-cover"
      />
      <div className="absolute top-1/2 left-1/8 transform -translate-y-1/2 text-left">
        <h1 className="text-8xl text-white mb-4">
          EXPAND
          <br />
          OUR
          <br />
          HORIZONS
        </h1>
        <p className="text-white text-lg mb-6">
          Discover a world without borders
          <br />
          with our reliable equipment
        </p>
        <Link
          href="/shop"
          className="bg-black/30 backdrop-blur-md text-white font-bold py-2 px-4 rounded-md border"
        >
          SHOP NOW →
        </Link>
      </div>
    </div>
  );
};

export default Banner;
