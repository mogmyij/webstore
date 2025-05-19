"use client";
import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value)) value = min;
    if (value < min) value = min;
    if (value > max) value = max;
    onQuantityChange(value);
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <MinusIcon className="h-5 w-5 text-gray-700" />
      </button>
      <input
        type="number" // Changed to number for better semantics and mobile keyboard
        value={quantity}
        onChange={handleChange}
        onBlur={(e) => { // Ensure value is within bounds on blur
            if (parseInt(e.target.value) < min) onQuantityChange(min);
            if (parseInt(e.target.value) > max) onQuantityChange(max);
        }}
        min={min}
        max={max}
        className="w-12 text-center border-t border-b border-gray-300 p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        aria-label="Current quantity"
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <PlusIcon className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};

export default QuantitySelector;
