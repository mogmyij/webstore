import React from 'react';
import Image from 'next/image';
import { OrderItem } from '@/types/order';

interface PurchasedItemsListProps {
  items: OrderItem[];
}

const PurchasedItemCard: React.FC<{ item: OrderItem }> = ({ item }) => {
  return (
    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-md object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">
            Quantity: {item.quantity}
          </span>
          <span className="text-lg font-semibold text-gray-900">
            S${item.price.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

const PurchasedItemsList: React.FC<PurchasedItemsListProps> = ({ items }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Purchased Items
      </h2>
      
      <div className="space-y-3">
        {items.map((item) => (
          <PurchasedItemCard key={item.productId} item={item} />
        ))}
      </div>
    </section>
  );
};

export default PurchasedItemsList;