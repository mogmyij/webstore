import React from 'react';

const ShopSidebar = () => {
  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-gray-50 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-custom-gray mb-4">Filters</h2>

      {/* Price Filter Placeholder */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-custom-gray mb-2">Price Range</h3>
        {/* Replace with actual draggable bar later */}
        <div className="h-10 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-500">
          Price Slider Placeholder
        </div>
      </div>

      {/* Brand Filter Placeholder */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-custom-gray mb-2">Brand</h3>
        <ul className="space-y-1">
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> TrailGear</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Apex Outdoor</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Summit Stride</label></li>
        </ul>
      </div>

      {/* Category Filter Placeholder */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-custom-gray mb-2">Category</h3>
        <ul className="space-y-1">
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Backpacks</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Tents</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Footwear</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Equipment</label></li>
          <li><label className="flex items-center"><input type="checkbox" className="mr-2" /> Apparel</label></li>
        </ul>
      </div>

      {/* Add other filter placeholders as per requirements (Weight Capacity, Key Features) */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
        Apply Filters
      </button>
    </aside>
  );
};

export default ShopSidebar;
