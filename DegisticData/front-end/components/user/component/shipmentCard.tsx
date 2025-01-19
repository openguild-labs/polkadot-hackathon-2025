import { Card } from "@/types";

export const ShipmentCard = ({ shipment }: { shipment: Card}) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-bold">Shipment number</p>
          <img
            src="./images/DegisticData_logo_1.png" // Placeholder for truck image
            alt="Truck"
            className="w-10 h-10"
          />
        </div>
        <p className="text-lg font-semibold mb-4">{shipment.number}</p>
        <div className="mb-4">
          <p className="text-sm font-bold">From</p>
          <p className="text-sm text-gray-700">{shipment.from}</p>
          <p className="text-sm text-gray-500">{shipment.fromDetail}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-bold">To</p>
          <p className="text-sm text-gray-700">{shipment.to}</p>
          <p className="text-sm text-gray-500">{shipment.toDetail}</p>
        </div>
        <p className="text-sm font-bold">Buyer</p>
        <p className="text-sm text-gray-700">{shipment.buyer}</p>
      </div>
    );
  };