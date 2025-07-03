import React from 'react';

const Values = () => {
  return (
    <div className="bg-white py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-8 sm:gap-12 md:gap-16 lg:gap-20">
        <div className="flex flex-col justify-between h-full space-y-6 lg:space-y-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-custom-gray font-bold">Our values</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed lg:mt-auto">
            Our company is founded on the values of quality, reliability, responsibility and customer service.
            We strive to be your trusted partner in all your adventures and help you create unforgettable memories.
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-fit'>
          <div className="aspect-square sm:aspect-auto">
            <img src="/jimmy.jpg" alt="Value 1" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="aspect-square sm:aspect-auto">
            <img src="/value2.jpg" alt="Value 2" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Values;
