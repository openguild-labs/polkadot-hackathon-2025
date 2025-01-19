import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";

export const Solution = () => {
  return (
    <div className="flex flex-row p-5" id="route">
      <div className="max-w-5xl mx-auto flex flex-row gap-5">
        {/* Left Section */}
        <div className="flex-1 pr-5">
          <Card className="p-5 w-full">
            <h3 className="text-xl font-bold mb-4">Input Shipping Code</h3>
            <div className="flex gap-3 mb-6">
              <input placeholder="SHIP-097642" className="flex-grow bg-[#F9F9F9] px-2 rounded-xl" />
              <Button className="bg-[#BD3531] text-white">Search</Button>
            </div>
            <Card className="p-4 bg-gray-100">
              <h4 className="text-lg font-semibold mb-1">
                Transit In San Mateo
              </h4>
              <p className="text-sm text-gray-600 mb-3">3 days estimation</p>
              <img
                src="./images/transit.png"
                alt="Map Example"
                className="w-full rounded-xl border-[1px] border-violet-400 shadow-inner shadow-amber-500"
              />
            </Card>
          </Card>
        </div>

        {/* Right Section */}
        <div className="flex-1 pl-5">
          <Card className="p-5 bg-gray-50 w-full">
            <h2 className="text-2xl font-bold mb-4">
              Leading digital solutions for company
            </h2>
            <p className="text-gray-700 mb-4">
              DegisticData provides an application to help you track your logistics,
              making every service more transparent and reliable.
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li>Easily track your shipment process</li>
              <li>Save your shipment documents in one place</li>
              <li>Fast and easy booking your shipment</li>
            </ul>
            <Button className="bg-[#BD3531] text-white">Learn More</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
