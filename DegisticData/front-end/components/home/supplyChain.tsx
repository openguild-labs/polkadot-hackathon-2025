export const SupplyChain = () => {
  return (
    <div className="bg-gray-50 p-6">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Section - Text */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Supply chain services for easy transport
          </h2>
          <p className="text-gray-500 mb-6">
            We make end-to-end supply chain more easier and smoother for you.
            Turning your complexity shipment process into the smoothest one.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-600">Simplify your logistics shipment</p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-600">
                Supporting your end-to-end shipment
              </p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-600">
                Straightforward and efficient shipment
              </p>
            </li>
          </ul>
          <button className="mt-6 px-6 py-3 bg-[#BD3531] text-white rounded-lg font-semibold hover:bg-red-600">
            Learn More
          </button>
        </div>

        {/* Right Section - Shipment Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="bg-red-100 text-[#BD3531] p-3 rounded-lg">
              <i className="fas fa-ship text-xl"></i>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Departure From San Jose
              </h4>
              <p className="text-gray-500">3 Container, 14 June</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="bg-orange-100 text-orange-500 p-3 rounded-lg">
              <i className="fas fa-check-circle text-xl"></i>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Transit At Mexico City
              </h4>
              <p className="text-gray-500">3 Container, 17 June</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
            <div className="bg-yellow-100 text-yellow-500 p-3 rounded-lg">
              <i className="fas fa-map-marker-alt text-2xl"></i>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">
                Arrived At São Paulo
              </h4>
              <p className="text-gray-500">3 Container, 20 June</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
