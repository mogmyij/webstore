import React from 'react';

const Benefits = () => {
  return (
    <div className="bg-stone-900 text-white py-8 sm:py-10 md:py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Benefits designed for you</h2>
        <a href="/about" className="text-gray-400 hover:text-white text-sm sm:text-base">More →</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
        <div className="space-y-3">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">1 Year Warranty</div>
          <p className="text-sm sm:text-base leading-relaxed">
            We provide up to 1 year of Warranty for selected products. Warranty includes batteries so you can rest assured your mobility device is built to last.
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">Island-wide Delivery</div>
          <p className="text-sm sm:text-base leading-relaxed">
            Free Island-wide delivery for all our mobility devices! We process deliveries daily and strive to deliver your mobility device within 3 days. Our customers depend on their devices and we care about their welfare
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">Singapore Based</div>
          <p className="text-sm sm:text-base leading-relaxed">
            We are a local business! Visit our show-room at North Link building for repairs or to view our mobility devices.
          </p>
        </div>
        <div className="space-y-3">
          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">Original Manufacturer</div>
          <p className="text-sm sm:text-base leading-relaxed">
            We manufacture our own devices rest assured knowing that your mobility devices are created with our unique expertiese. We are also open to partnerships and colaborations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
