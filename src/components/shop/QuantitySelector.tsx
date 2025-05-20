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
      <span 
        className="w-12 text-center border-t border-b border-gray-300 py-2 px-1 font-medium"
        data-testid="quantity-display"
      >
        {quantity}
      </span>
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
