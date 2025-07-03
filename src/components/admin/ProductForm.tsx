"use client";

import React, { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { Prisma } from '@prisma/client';
import DynamicFieldArray from './DynamicFieldArray';
import TagInput from './TagInput';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductFormProps {
  product?: Product;
  onSubmit: (productData: Prisma.ProductCreateInput | Prisma.ProductUpdateInput) => Promise<void>;
  onCancel?: () => void;
}

// Type for specification key-value pairs in the form
interface SpecificationPair {
  key: string;
  value: string;
}

// Form state interface that closely mirrors the Product type
interface ProductFormState {
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  description: string;
  longDescription: string;
  specifications: SpecificationPair[];
  features: string[];
  images: string[];
  isActive: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  // Initialize form state to mirror Product structure
  const [formState, setFormState] = useState<ProductFormState>(() => {
    if (product) {
      // Convert existing product specifications JSON to key-value pairs
      const specsArray: SpecificationPair[] = product.specifications
        ? Object.entries(product.specifications).map(([key, value]) => ({
            key,
            value: String(value)
          }))
        : [];

      return {
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        category: product.category,
        description: product.description,
        longDescription: product.longDescription,
        specifications: specsArray,
        features: [...product.features],
        images: [...(product.images || [])],
        isActive: product.isActive ?? true,
      };
    }

    // Default state for new product
    return {
      name: '',
      price: 0,
      image: '',
      brand: '',
      category: '',
      description: '',
      longDescription: '',
      specifications: [{key:"dimensions",value:""},{key:"batteryLife",value:""},{key:"weightCapacity",value:""}],
      features: [],
      images: [],
      isActive: true,
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formState.price || formState.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formState.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formState.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formState.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formState.longDescription.trim()) {
      newErrors.longDescription = 'Long description is required';
    }

    if (!formState.image.trim()) {
      newErrors.image = 'Primary image is required';
    }

    // Validate specifications - check for empty keys or values
    formState.specifications.forEach((spec, index) => {
      if (!spec.key.trim()) {
        newErrors[`spec_key_${index}`] = 'Specification name cannot be empty';
      }
      if (!spec.value.trim()) {
        newErrors[`spec_value_${index}`] = 'Specification value cannot be empty';
      }
    });

    // Check for duplicate specification keys
    const specKeys = formState.specifications.map(spec => spec.key.trim().toLowerCase());
    const duplicateKeys = specKeys.filter((key, index) => specKeys.indexOf(key) !== index);
    if (duplicateKeys.length > 0) {
      newErrors.specifications = 'Duplicate specification names are not allowed';
    }

    return newErrors;
  };

  // Handle basic field changes
  const handleFieldChange = (field: keyof Omit<ProductFormState, 'specifications' | 'features' | 'images'>, value: string | number | boolean) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form state to match Prisma input types
      const specificationsJson: Record<string, any> = {};
      formState.specifications.forEach(spec => {
        if (spec.key.trim() && spec.value.trim()) {
          specificationsJson[spec.key.trim()] = spec.value.trim();
        }
      });

      // Prepare payload for Prisma
      const payload: Prisma.ProductCreateInput | Prisma.ProductUpdateInput = {
        name: formState.name.trim(),
        price: formState.price,
        image: formState.image.trim(),
        brand: formState.brand.trim(),
        category: formState.category.trim(),
        description: formState.description.trim(),
        longDescription: formState.longDescription.trim(),
        specifications: specificationsJson,
        features: formState.features.filter(feature => feature.trim().length > 0),
        images: formState.images.filter(image => image.trim().length > 0),
        isActive: formState.isActive,
        // Include dateAdded for new products
        ...(product ? {} : { dateAdded: new Date() })
      };

      await onSubmit(payload);
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render function for specification pairs
  const renderSpecificationItem = (
    item: SpecificationPair,
    index: number,
    onItemChange: (index: number, item: SpecificationPair) => void,
    onRemove: (index: number) => void
  ) => (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Specification name (e.g., Weight Capacity)"
          value={item.key}
          onChange={(e) => onItemChange(index, { ...item, key: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[`spec_key_${index}`] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors[`spec_key_${index}`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`spec_key_${index}`]}</p>
        )}
      </div>
      <div className="flex-1">
        <input
          type="text"
          placeholder="Value (e.g., 120kg)"
          value={item.value}
          onChange={(e) => onItemChange(index, { ...item, value: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors[`spec_value_${index}`] ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors[`spec_value_${index}`] && (
          <p className="text-red-500 text-xs mt-1">{errors[`spec_value_${index}`]}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Remove specification"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );

  // Render function for image URLs
  const renderImageItem = (
    item: string,
    index: number,
    onItemChange: (index: number, item: string) => void,
    onRemove: (index: number) => void
  ) => (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Image URL (e.g., /product-image-2.jpg)"
        value={item}
        onChange={(e) => onItemChange(index, e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Remove image"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Create New Product'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product ID (readonly for editing) */}
              {product && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product ID
                  </label>
                  <input
                    type="text"
                    value={product.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
              )}

              {/* Name */}
              <div className={product ? "" : "md:col-span-2"}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (SGD) *
                </label>
                <input
                  type="number"
                  value={formState.price}
                  onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  value={formState.brand}
                  onChange={(e) => handleFieldChange('brand', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.brand ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formState.category}
                  onChange={(e) => handleFieldChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Power Wheelchair">Power Wheelchair</option>
                  <option value="Manual Wheelchair">Manual Wheelchair</option>
                  <option value="Mobility Scooter">Mobility Scooter</option>
                  <option value="Walking Aids">Walking Aids</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            {/* Primary Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Image *
              </label>
              <input
                type="text"
                value={formState.image}
                onChange={(e) => handleFieldChange('image', e.target.value)}
                placeholder="/product-image.jpg"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              <p className="text-sm text-gray-500 mt-1">
                Place the image file in the /public folder and enter its path (e.g., /new-image.jpg)
              </p>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description *
                </label>
                <textarea
                  value={formState.longDescription}
                  onChange={(e) => handleFieldChange('longDescription', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.longDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription}</p>}
              </div>
            </div>

            {/* Dynamic Specifications */}
            <DynamicFieldArray
              label="Product Specifications"
              items={formState.specifications}
              onUpdate={(specifications) => setFormState(prev => ({ ...prev, specifications }))}
              renderItem={renderSpecificationItem}
              createNewItem={() => ({ key: '', value: '' })}
              addButtonText="Add Specification"
              emptyStateText="No specifications added yet. Click 'Add Specification' to add product details like weight capacity, dimensions, etc."
            />
            {errors.specifications && <p className="text-red-500 text-sm">{errors.specifications}</p>}

            {/* Dynamic Features */}
            <TagInput
              label="Product Features"
              tags={formState.features}
              onUpdate={(features) => setFormState(prev => ({ ...prev, features }))}
              placeholder="Enter features like 'Lightweight', 'Foldable', 'Long Battery Life'"
            />

            {/* Additional Images */}
            <DynamicFieldArray
              label="Additional Images"
              items={formState.images}
              onUpdate={(images) => setFormState(prev => ({ ...prev, images }))}
              renderItem={renderImageItem}
              createNewItem={() => ''}
              addButtonText="Add Image"
              emptyStateText="No additional images added. The primary image above will be used as the main product image."
            />

            {/* Product Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formState.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Product is active (visible in shop)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
