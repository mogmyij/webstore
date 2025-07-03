import React from 'react';
import Link from 'next/link';

const Banner = () => {
  return (
    <div className="relative bg-black mt-[-10px] md:mt-[-90px] lg:mt-[-60px]">
      <img
        src="/banner-image.jpg"
        alt="Banner"
        className="opacity-80 w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-auto object-cover"
      />
      <div className="absolute top-1/2 left-4 sm:left-8 md:left-12 lg:left-1/8 transform -translate-y-1/2 text-left max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-none">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl text-white mb-2 sm:mb-3 md:mb-4 font-bold leading-tight">
          MOBILITY IS
          <br />
          FREEDOM
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
          Discover a world without borders
          <br />
          with our reliable equipment
        </p>
        <Link
          href="/shop"
          className="bg-black/30 backdrop-blur-md text-white font-bold py-2 px-4 sm:py-3 sm:px-6 md:py-2 md:px-4 rounded-md border hover:bg-black/40 transition-colors duration-200 text-sm sm:text-base"
        >
          SHOP NOW →
        </Link>
      </div>
    </div>
  );
};

export default Banner;
