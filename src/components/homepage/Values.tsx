import React from 'react';

const Values = () => {
  return (
    <div className="bg-white py-12 px-6">
      <h2 className="text-3xl text-custom-gray mb-8">Our values</h2>
      <div className="grid grid-cols-[3fr_7fr] gap-20">
        <div className='flex items-end'>
          <p className="text-xl text-gray-600">
            Our company is founded on the values of quality, reliability, responsibility and customer service. We strive to be your trusted partner in all your adventures and help you create unforgettable memories.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <img src="/value1.jpg" alt="Value 1" className="w-full h-full object-cover" />
          </div>
          <div>
            <img src="/value2.jpg" alt="Value 2" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
