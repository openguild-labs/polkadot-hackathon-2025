export const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6" id="services">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-xl text-[#BD3531] font-semibold">Our Services</h2>
        <h1 className="text-4xl font-bold mt-2">
          Everything is ready to <br /> transport
        </h1>
        <p className="text-lg text-gray-500">
          We make logistic shipping much easier and straightforward. Combining
          good service and technology make everything efficient.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
        {/* Left Section - Shipping Info */}
        <div className="bg-[#FAFAFA]">
          {/* From and Destination */}
          <div className="flex justify-between items-center mb-6 bg-white shadow-lg rounded-lg p-6">
            <div>
              <p className="text-gray-500 text-sm">From</p>
              <h3 className="text-xl font-semibold">San Jose</h3>
            </div>
            <div className="text-orange-500 text-xl">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Destination</p>
              <h3 className="text-xl font-semibold">São Paulo</h3>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h4 className="font-bold">SHIP-097642</h4>
                <span className="text-[#BD3531] text-lg">
                  <i className="fas fa-truck"></i>
                </span>
              </div>
              <p className="text-gray-500 text-sm">Leonard Tupamahu</p>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-[#BD3531] font-bold text-lg">01</div>
                <div>
                  <h5 className="font-semibold">Depart From San Jose</h5>
                  <p className="text-gray-500 text-sm">
                    1915 Beech Street, San Jose <br />
                    California, 95134 <br />
                    925-835-0402
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <div className="text-orange-500 font-bold text-lg">02</div>
                <div>
                  <h5 className="font-semibold">Transit in Mexico City</h5>
                  <p className="text-gray-500 text-sm">
                    115 Sierra de Alicia, Jalisco <br />
                    Mexico City, 37160 <br />
                    477-717-0452
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-green-500 font-bold text-lg">03</div>
                <div>
                  <h5 className="font-semibold">Arrived at São Paulo</h5>
                  <p className="text-gray-500 text-sm">
                    Avenida Doutor, São Vicente <br />
                    São Paulo, 11346-070 <br />
                    (13) 3333-3333
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Shipment Details */}
        </div>

        {/* Right Section - Shipping Solutions */}
        <div className="bg-[#FAFAFA] px-5">
          <h3 className="text-4xl font-semibold mb-4">
            Inland and ocean shipping solutions
          </h3>
          <p className="text-gray-500 mb-6 w-[80%]">
            We provide both inland and ocean express shipping to make your
            company logistic&apos;s delivery much faster and efficient.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-500">Best in class shipping services</p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-500">Wide and safe route of shipment</p>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-[#BD3531] text-lg">
                <i className="fas fa-check-circle"></i>
              </span>
              <p className="text-gray-500">Intercontinental network</p>
            </li>
          </ul>

          <button className="mt-10 px-6 py-3 bg-[#BD3531] text-white rounded-lg font-semibold hover:bg-red-600">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};
