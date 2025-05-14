import React from 'react';

const Bestsellers = () => {
  // Mock product data
  const products = [
    { id: 1, name: 'CHAIR 1', price: 120, image: '/product1.jpg' },
    { id: 2, name: 'CHAIR 2', price: 130, image: '/product2.jpg' },
    { id: 3, name: 'CHAIR 3', price: 100, image: '/product3.jpg' },
    { id: 4, name: 'CHAIR 4', price: 110, image: '/product4.jpg' },
  ];

  return (
    <div className="bg-white py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-custom-gray">Our bestsellers</h2>
        <a href="#" className="text-gray-600 hover:text-custom-gray">More →</a>
      </div>
      <hr className='opacity-40' />
      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="text-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-70 object-contain rounded-md mb-2"
            />
            <p className="text-custom-gray font-bold">{product.name}</p>
            <p className="text-gray-600">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestsellers;
