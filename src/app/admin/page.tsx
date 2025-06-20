import Link from 'next/link';
import { CubeIcon, DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const actions = [
    {
      title: 'Manage Products',
      description: 'Create, edit, and delete products in your catalog',
      href: '/admin/products',
      icon: CubeIcon,
    },
    {
      title: 'View Orders',
      description: 'View customer orders and order details',
      href: '/admin/orders',
      icon: DocumentTextIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome to the Karvana administration panel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <action.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium mb-1">
                Important: Changes made to the product catalog require a Git push to be deployed to the live site.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}