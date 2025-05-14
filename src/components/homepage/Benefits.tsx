import React from 'react';

const Benefits = () => {
  return (
    <div className="bg-custom-gray text-white py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Benefits designed for you</h2>
        <a href="#" className="text-gray-400 hover:text-white">More →</a>
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div>
          <div className="text-5xl font-bold">5+</div>
          <p className="text-sm mt-2">
            We take pride in our 5 years of industry experience providing customers with reliable gear for safe adventures.
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">7k</div>
          <p className="text-sm mt-2">
            We offer over 10,000 products including tents, sleeping bags, backpacks, shoes and more to suit our customers' every need.
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">20k</div>
          <p className="text-sm mt-2">
            More than 20,000 travelers have chosen us as their primary partner for purchasing quality equipment for their travels.
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">95%</div>
          <p className="text-sm mt-2">
            95% of our customers leave positive reviews of our service and products, demonstrating our dedication to quality and reliability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
