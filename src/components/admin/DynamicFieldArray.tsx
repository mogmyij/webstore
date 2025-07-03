"use client";

import React from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DynamicFieldArrayProps<T> {
  label: string;
  items: T[];
  onUpdate: (items: T[]) => void;
  renderItem: (item: T, index: number, onItemChange: (index: number, item: T) => void, onRemove: (index: number) => void) => React.ReactNode;
  createNewItem: () => T;
  addButtonText?: string;
  emptyStateText?: string;
  className?: string;
}

export default function DynamicFieldArray<T>({
  label,
  items,
  onUpdate,
  renderItem,
  createNewItem,
  addButtonText = "Add Item",
  emptyStateText,
  className = ""
}: DynamicFieldArrayProps<T>) {

  const handleItemChange = (index: number, newItem: T) => {
    const updatedItems = [...items];
    updatedItems[index] = newItem;
    onUpdate(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onUpdate(updatedItems);
  };

  const handleAddItem = () => {
    const newItem = createNewItem();
    onUpdate([...items, newItem]);
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-3">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          {addButtonText}
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && emptyStateText && (
          <div className="text-sm text-gray-500 italic p-3 bg-gray-50 rounded-md text-center">
            {emptyStateText}
          </div>
        )}
        
        {items.map((item, index) => (
          <div key={index} className="relative">
            {renderItem(item, index, handleItemChange, handleRemoveItem)}
          </div>
        ))}
      </div>
    </div>
  );
}