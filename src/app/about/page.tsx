import React from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Image from 'next/image'; 

// Contact information constants for easy maintenance
const CONTACT_INFO = {
  whatsapp: {
    number: '+65 8788 3459',
    url: 'https://wa.me/6587883459',
    hours: 'Daily, 10:30 AM - 6:30 PM'
  },
  email: {
    address: 'saleskarvana@outlook.com',
    purpose: 'Non-urgent inquiries, business proposals, partnerships, collaborations, and dealerships'
  },
  address: {
    full: 'North Link Building, 10 Admiralty St, Singapore 757695'
  },
  collectionHours: {
    schedule: 'Monday – Sunday, 10:00 AM - 6:00 PM',
    note: 'Call before heading down for repair'
  }
};

export default function AboutPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us & Contact', current: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          About Us & Contact
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about our mission to empower mobility and how to get in touch with us
        </p>
      </header>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Empowering Mobility, Enriching Lives
          </h2>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              At KARVANA, we believe mobility is freedom—and everyone deserves to move through life with confidence, 
              comfort, and independence. As the only manufacturer in Singapore and a retailer of premium motorised 
              wheelchairs and mobility scooters, our mission is to help individuals reclaim their independence by 
              providing reliable, innovative, and affordable mobility solutions.
            </p>
            
            <p>
              Our journey began when our founder, Jimmy Tan, met with a car accident in 2016 that made him paralysed 
              from the neck down. He could not move independently and he and his family could not afford a motorised wheelchair 
              due to the huge debt accumulated from his medical treatments. Years later, a kind donor gave him a 
              motorised wheelchair that enabled him to move around independently to public places. He found new lease 
              of life from that day onwards.
            </p>
            
            <p>
              He saw firsthand how difficult it was for somebody like him to find a reliable and comfortable motorised 
              wheelchair that truly fit their needs. The experience was frustrating—limited options, poor service, 
              and little support. That moment inspired him to build something better.
            </p>
            
            <div className="mb-8 w-full max-w-sm mx-auto">
              <figure>
                <Image
                  src="/jimmy.jpg" // IMPORTANT: Replace with your image path
                  alt="photo of Jimmy" // IMPORTANT: Add a descriptive alt text
                  width={720} // Original width of your image or desired display width
                  height={1280} // Original height of your image or desired display height (maintaining aspect ratio)
                  layout="responsive" // Makes the image scale with its container
                  className="rounded-lg object-cover" // Tailwind classes for styling
                />
                <figcaption className="mt-3 text-sm text-center text-gray-600 dark:text-gray-400">
                  {/* Your Caption Text Here */}
                  Jimmy Tan, founder of KARVANA, finding renewed independence with mobility solutions.
                  {/* You can make this dynamic if needed */}
                </figcaption>
              </figure>
            </div>

            <p>
              KARVANA, is founded in Singapore and proudly serves the local communities across our island country. We've 
              built our reputation on compassionate service, quality products, and unwavering customer care. Whether 
              you're looking for your first powered wheelchair or upgrading to a more advanced model, our knowledgeable 
              team is here to guide you every step of the way.
            </p>
            
            <p>
              We offer a curated range of high-quality motorised wheelchairs and mobility scooters designed to suit 
              diverse lifestyles, needs, and budgets. From compact ultra-lightweight air travel compliant models to 
              high-performance sturdy models, every product we offer is chosen with one goal in mind: to improve 
              quality of life through greater mobility.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Us?
          </h2>
          
          <ul className="space-y-4 max-w-4xl mx-auto">
            {[
              'Expert advice with a personal touch',
              'Quality and safety you can count on',
              'Competitive pricing and flexible financing',
              'Reliable after-sales support and servicing',
              'A genuine passion for helping our customers live more freely'
            ].map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-lg text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Get In Touch
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* WhatsApp Contact */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className="w-6 h-6 text-green-600" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Quick response for urgent inquiries</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a 
                  href={CONTACT_INFO.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label={`Contact us on WhatsApp at ${CONTACT_INFO.whatsapp.number}`}
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Chat with us: {CONTACT_INFO.whatsapp.number}
                </a>
                <p className="text-sm text-gray-600">
                  <strong>Operating Hours:</strong> {CONTACT_INFO.whatsapp.hours}
                </p>
                <p className="text-sm text-gray-500">
                  We will be in touch shortly!
                </p>
              </div>
            </div>

            {/* Email Contact */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className="w-6 h-6 text-blue-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-600">For detailed inquiries and partnerships</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <a 
                  href={`mailto:${CONTACT_INFO.email.address}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label={`Send email to ${CONTACT_INFO.email.address}`}
                >
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                    />
                  </svg>
                  Email us: {CONTACT_INFO.email.address}
                </a>
                <p className="text-sm text-gray-600">
                  <strong>Best for:</strong> {CONTACT_INFO.email.purpose}
                </p>
                <p className="text-sm text-gray-500">
                  We will contact you shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Us Section */}
      <section id="visit-us" className="mb-16 scroll-mt-20"> {/* Added id for potential deep linking */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Visit Us
          </h2>

          {/* Grid for Address and Collection Hours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"> {/* Added margin-bottom for spacing */}
            {/* Physical Address */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className="w-6 h-6 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Our Location</h3>
                  <p className="text-sm text-gray-600">Come visit our showroom</p>
                </div>
              </div>

              <address className="not-italic space-y-2">
                <p className="text-gray-700 font-medium">
                  {CONTACT_INFO.address.full}
                </p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address.full)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  aria-label={`Get directions to ${CONTACT_INFO.address.full}`}
                >
                  Get Directions
                </a>
              </address>
            </div>

            {/* Collection Hours */}
            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className="w-6 h-6 text-orange-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Self-Collection Hours</h3>
                  <p className="text-sm text-gray-600">Pick up your orders</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Schedule:</strong> {CONTACT_INFO.collectionHours.schedule}
                </p>
                <p className="text-sm text-orange-700 bg-orange-100 rounded-md p-3">
                  <strong>Important:</strong> {CONTACT_INFO.collectionHours.note}
                </p>
                <p className="text-sm text-gray-500">
                  Collection date & time will be notified to you in advance.
                </p>
              </div>
            </div>
          </div>

          {/* Map Embed Section */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center"> 
              Find Us On The Map
            </h3>
            {/* Responsive container for the iframe */}
            <div className="aspect-[16/9] w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5187014551548!2d103.80995657616671!3d1.4624494612010914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da135c618fd6ab%3A0x7a380b20e96c230!2sNorth%20Link%20Building!5e0!3m2!1sen!2ssg!4v1749742711410!5m2!1sen!2ssg"
                className="w-full h-full border-0" // border-0 removes default iframe border
                allowFullScreen // In JSX, boolean attributes can be written like this for true
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Location of KARVANA at ${CONTACT_INFO.address.full} on Google Maps`}
              ></iframe>
            </div>
            <p className="mt-4 text-sm text-center text-gray-600">
              Our showroom is located at {CONTACT_INFO.address.full}.
            </p>
          </div>
        </div>
      </section>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href={CONTACT_INFO.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Contact us on WhatsApp"
          title="Chat with us on WhatsApp"
        >
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
