"use client";

import React, { useState, KeyboardEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagInputProps {
  label: string;
  tags: string[];
  onUpdate: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({
  label,
  tags,
  onUpdate,
  placeholder = "Type and press Enter or comma to add",
  className = ""
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onUpdate([...tags, trimmedValue]);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove: number) => {
    onUpdate(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      removeTag(tags.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Auto-add tag if comma is typed
    if (value.includes(',')) {
      const newTags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      newTags.forEach(tag => {
        if (!tags.includes(tag)) {
          addTag(tag);
        }
      });
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    // Add tag on blur if there's a value
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="min-h-[42px] w-full px-3 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Render existing tags */}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                aria-label={`Remove ${tag}`}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          
          {/* Input for new tags */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            placeholder={tags.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">
        Press Enter, comma, or tab to add a feature. Click × to remove.
      </p>
    </div>
  );
}