export const ABout = () => {
  return (
    <div className="bg-gray-50 text-gray-800 flex flex-col items-center p-6">
      {/* Header Section */}
      <div className="max-w-5xl flex justify-between">
        <div className="flex flex-col w-[40%]">
          <h2 className="text-lg text-red-500">About</h2>
          <h1 className="text-4xl font-bold mt-2">
            Solution for your <br /> business need
          </h1>
        </div>
        <div className="w-[40%] flex justify-end items-end">
          <p className="text-lg text-gray-500">
            We make logistic shipping much easier and straightforward. Combining
            good service and technology makes everything efficient.
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl">
        {/* Card 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <h3 className="text-xl font-semibold">
            Your intercontinental shipping solutions
          </h3>
          <p className="text-gray-500 mt-3">
            With enhanced supply chain solutions, we accelerate your business
            while driving efficiency.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-orange-500 text-4xl mb-4">
            <i className="fas fa-cloud"></i>
          </div>
          <h3 className="text-xl font-semibold">
            One place to save all your document
          </h3>
          <p className="text-gray-500 mt-3">
            We provide cloud storage to save all your documents. Don’t worry
            about losing shipment documents.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-yellow-500 text-4xl mb-4">
            <i className="fas fa-lock"></i>
          </div>
          <h3 className="text-xl font-semibold">
            Secure, transparent, and reliable
          </h3>
          <p className="text-gray-500 mt-3">
            Check and track every logistics detail. Your logistics are safe, so
            you can sleep without worry.
          </p>
        </div>
      </div>
    </div>
  );
};
