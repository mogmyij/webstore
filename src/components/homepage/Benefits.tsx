import React from 'react';

const Benefits = () => {
  return (
<div className="bg-stone-900 text-white py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Benefits designed for you</h2>
        <a href="/about" className="text-gray-400 hover:text-white">More →</a>
      </div>
      <div className="grid grid-cols-4 gap-8">
        <div>
          <div className="text-5xl font-bold">1 Year Warranty</div>
          <p className="text-xm mt-2">
            We provide up to 1 year of Warranty for selected products. Warranty includes batteries so you can rest assured your mobility device is built to last.
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">Island-wide Delivery</div>
          <p className="text-xm mt-2">
            Free Island-wide delivery for all our mobility devices! We process deliveries daily and strive to deliver your mobility device within 3 days. Our customers depend on their devices and we care about their welfare
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">Singapore Based</div>
          <p className="text-xm mt-2">
            We are a local business! Visit our show-room at North Link building for repairs or to view our mobility devices.
          </p>
        </div>
        <div>
          <div className="text-5xl font-bold">Original Manufacturer</div>
          <p className="text-xm mt-2">
            We manufacture our own devices rest assured knowing that your mobility devices are created with our unique expertiese. We are also open to partnerships and colaborations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
