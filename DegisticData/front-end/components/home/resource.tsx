export const Resource = () => {
  return (
    <div id="resource">
      {/* Contact Us Section */}
      <div className="bg-[#BD3531] text-white py-20 px-10 text-center">
        <h2 className="text-4xl font-extrabold mb-6">
          Looking for leading shipping company for your business?
        </h2>
        <div className="flex justify-center gap-4">
          <button className="bg-red-600 hover:bg-red-700 px-6 py-3 font-semibold rounded-md">
            FAQ
          </button>
          <button className="bg-white text-[#CF3834] hover:text-red-600 px-6 py-3 font-semibold rounded-md border border-white">
            Book a Call
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-50 py-10 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-gray-900 text-lg">DEGISTICDATA</h3>
            <p className="text-gray-600 mt-3">
              DegisticData is a shipping company that helps you transport your
              logistics without worry anymore.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              © 2022 Cicero. All Rights Reserved
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Services</h4>
            <ul className="text-gray-600 mt-3 space-y-2">
              <li>Inland Shipment</li>
              <li>Overseas Shipment</li>
              <li>Intercontinental Shipment</li>
              <li>Continental Shipment</li>
            </ul>
          </div>

          {/* Routes Section */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Route</h4>
            <ul className="text-gray-600 mt-3 space-y-2">
              <li>European Route</li>
              <li>American Route</li>
              <li>Asian Route</li>
              <li>African Route</li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h4 className="font-bold text-gray-900 text-lg">About</h4>
            <ul className="text-gray-600 mt-3 space-y-2">
              <li>Insurance</li>
              <li>Resource</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
