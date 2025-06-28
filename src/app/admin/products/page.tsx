"use client";

import React, { useState, useEffect } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import type { Product } from '@/types/product';
import { ensureProductsDates } from '@/types/product';

interface DeleteConfirmationProps {
  product: Product;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmation({ product, onConfirm, onCancel }: DeleteConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Confirm Deactivation
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate product '{product.name}'? This will hide it from the public shop but preserve all order history.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Convert dateAdded strings back to Date objects using utility function
      const productsWithDates = ensureProductsDates(data);
      
      setProducts(productsWithDates);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle create product
  const handleCreateProduct = async (productData: any) => {
    try {
      setSubmitting(true);
      setError('');

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      // Close form and refresh products list
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err; // Re-throw to let form handle it
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update product
  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      // Close form and refresh products list
      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err; // Re-throw to let form handle it
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Close confirmation and refresh products list
      setShowDeleteConfirm(false);
      setDeletingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reactivate product
  const handleReactivateProduct = async (product: Product) => {
    try {
      setSubmitting(true);
      setError('');

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reactivate product');
      }

      // Refresh products list
      await fetchProducts();
    } catch (err) {
      console.error('Error reactivating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to reactivate product');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDeleteClick = (product: Product) => {
    setDeletingProduct(product);
    setShowDeleteConfirm(true);
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Handle create button click
  const handleCreateClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your product catalog - create, edit, and delete products
          </p>
        </div>
        <button
          onClick={handleCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        >
          Create New Product
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm">
          <p className="text-blue-800 font-medium mb-2">
            Image Management Instructions:
          </p>
          <ul className="text-blue-700 space-y-1 list-disc list-inside">
            <li>To add an image, place the file in the `/public` folder and enter its path (e.g. `/new-image.jpg`) in the Image Path field.</li>
            <li>Changes are persistent and will appear live after deployment.</li>
          </ul>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      ) : (
        <>
          {/* Products Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No products found. Create your first product to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          SGD {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.brand}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.isActive ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                            disabled={submitting}
                          >
                            Edit
                          </button>
                          {product.isActive ? (
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                              disabled={submitting}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivateProduct(product)}
                              className="text-green-600 hover:text-green-900 focus:outline-none focus:underline"
                              disabled={submitting}
                            >
                              Reactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Count */}
          {products.length > 0 && (
            <div className="text-sm text-gray-500 text-center">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct || undefined}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={handleFormCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingProduct && (
        <DeleteConfirmation
          product={deletingProduct}
          onConfirm={handleDeleteProduct}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeletingProduct(null);
          }}
        />
      )}
    </div>
  );
}
