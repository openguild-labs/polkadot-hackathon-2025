export const Insurance = () => {
  return (
    <div className="flex items-center justify-center p-6" id="insurance">
      <div className="max-w-5xl flex justify-between">
        {/* Left Content */}
        <div className="flex-1">
          <p className="text-[#BD3531] font-bold">Testimonials</p>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-snug mb-6">
            Sound from our happy partners
          </h2>
          <blockquote className="text-gray-600 italic mb-6">
            “Thank you very much DegisticData for saving my time. With DegisticData, the
            delivery of goods is faster even though it is very far away. I also
            don&apos;t need to be afraid and doubtful because DegisticData provides a
            place to store my shipping documents and makes it easier with
            excellent real-time tracking.”
          </blockquote>
          <p className="font-bold text-gray-900">Christina Martha Tiahahu</p>
          <p className="text-gray-500 text-sm">
            CEO of Marthapura Gold & Diamond
          </p>
        </div>
        {/* Right Content */}
        <div className="flex-1 items-center space-y-6">
          <div className="grid grid-cols-2 items-center space-x-10">
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-gray-900">
                25<span className="text-[#BD3531]">+</span>
              </h3>
              <p className="text-gray-600">
                Winning award best shipping company
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-extrabold text-gray-900">
                100K<span className="text-[#BD3531]">+</span>
              </h3>
              <p className="text-gray-600">Happy customers around the world</p>
            </div>
          </div>
          {/* Right Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src="./images/partner.png"
              alt="Customer Testimonial"
              className="rounded-xl shadow-md w-[50%]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
