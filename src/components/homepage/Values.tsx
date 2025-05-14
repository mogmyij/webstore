import React from 'react';

const Values = () => {
  return (
    <div className="bg-white py-12 px-6">
      <h2 className="text-2xl font-bold text-custom-gray mb-8">Our values</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <p className="text-gray-600">
            Our company is founded on the values of quality, reliability, responsibility and customer service. We strive to be your trusted partner in all your adventures and help you create unforgettable memories.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <img src="/value1.jpg" alt="Value 1" className="w-full h-48 object-cover rounded-md" />
          <img src="/value2.jpg" alt="Value 2" className="w-full h-48 object-cover rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default Values;
