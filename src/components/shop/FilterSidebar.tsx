import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface FilterSidebarProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  selectedWeightRanges: string[];
  setSelectedWeightRanges: (ranges: string[]) => void;
  minPrice: number;
  maxPrice: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  // New props for dynamic filter options
  availableBrands: string[];
  availableCategories: string[];
  availableFeatures: string[];
}

const weightRanges = [
  "Under 100kg",
  "100-150kg", 
  "150-200kg",
  "Over 200kg"
];

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  selectedCategories,
  setSelectedCategories,
  selectedFeatures,
  setSelectedFeatures,
  selectedWeightRanges,
  setSelectedWeightRanges,
  minPrice,
  maxPrice,
  isOpen,
  setIsOpen,
  availableBrands,
  availableCategories,
  availableFeatures
}: FilterSidebarProps) {
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleFeatureChange = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleWeightRangeChange = (range: string) => {
    if (selectedWeightRanges.includes(range)) {
      setSelectedWeightRanges(selectedWeightRanges.filter(r => r !== range));
    } else {
      setSelectedWeightRanges([...selectedWeightRanges, range]);
    }
  };

  const handleClearAllFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedFeatures([]);
    setSelectedWeightRanges([]);
    // Optionally, you might want to close the sidebar on mobile after clearing
    // if (isOpen) setIsOpen(false); 
  };

  return (
    <>
      {/* Mobile filter button */}
      <div className="md:hidden w-full py-2 px-4 bg-white shadow-md mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-2 px-4 bg-blue-600 text-white rounded-md"
        >
          <span>Filters</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white shadow-md rounded-lg p-6 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Filter</h2>
        
        {/* Price Range Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Price</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between text-xm text-gray-600">
              <span>From: SGD {priceRange[0].toFixed(2)}</span>
              <span>To: SGD {priceRange[1].toFixed(2)}</span>
            </div>
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              value={priceRange as [number,number]}
              onChange={(value: number | number[]) => {
                if (Array.isArray(value) && value.length === 2) {
                  setPriceRange(value as [number, number]);
                }
              }}
              className="my-4"
              trackStyle={{ backgroundColor: '#4B5563' }}
              handleStyle={[
                { borderColor: '#4B5563' },
                { borderColor: '#4B5563' }
              ]}
              railStyle={{ backgroundColor: '#E5E7EB' }}
              aria-label="Price range slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min: SGD {minPrice.toFixed(2)}</span>
              <span>Max: SGD {maxPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Brand</h3>
          <div className="space-y-2">
            {availableBrands.map(brand => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">{brand}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Category</h3>
          <div className="space-y-2">
            {availableCategories.map(category => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">{category}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Capacity Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Weight Capacity</h3>
          <div className="space-y-2">
            {weightRanges.map(range => (
              <div key={range} className="flex items-center">
                <input
                  type="checkbox"
                  id={`weight-${range}`}
                  checked={selectedWeightRanges.includes(range)}
                  onChange={() => handleWeightRangeChange(range)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`weight-${range}`} className="ml-2 text-sm text-gray-700">{range}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Features Filter */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Features</h3>
          <div className="space-y-2">
            {availableFeatures.map(feature => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`feature-${feature}`} className="ml-2 text-sm text-gray-700">{feature}</label>
              </div>
            ))}
          </div>
        </div>
        
        {/*reset filters*/}
        <button
          onClick={handleClearAllFilters}
          className='flex-1 border text-black font-semibold py-3 px-6 rounded-md 
          hover:bg-blue-200 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          '>
          Clear Filters
        </button>
      </aside>
    </>
  );
}
