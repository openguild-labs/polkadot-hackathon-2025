import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Spacer } from "@nextui-org/spacer";
import { useState } from "react";
import StepperUI from "../stepper";

const steps = [
  { title: "First", description: "Done" },
  { title: "Second", description: "Progress" },
  { title: "Third", description: "Pending" },
];

function RightSide() {
  const [selectedTag, setSelectedTag] = useState<string>("Information");

  const tags = ["Information", "Vehicle Info", "Company", "Billing"];
  return (
    <ScrollShadow hideScrollBar className="h-screen w-[35%] bg-white">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">UA-145009BS</h1>
            <p className="text-blue-500 font-semibold">On way</p>
          </div>
          <div className="flex space-x-4">
            <Button className="border-[1px] bg-transparent">Phone</Button>
            <Button className="border-[1px] bg-transparent">Email</Button>
          </div>
        </div>

        {/* Navigation divs */}
        <div className="flex justify-between pb-3 border-b">
          {tags.map((tag, index) => (
            <Button
              key={index}
              title={tag}
              className={`bg-transparent ${selectedTag == tag ? "text-green-400" : "text-gray-500"}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>

        <Spacer y={2} />

        {/* Load Capacity Section */}
        <Card shadow={"none"} className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Load capacity</h2>
          <div className="flex items-center space-x-6">
            <img
              src="./images/truck.png"
              alt="Truck"
              className="w-full"
            />
          </div>

          <Spacer y={5} />

          <div className="flex justify-between">
            <div>
              <Card shadow="none" className="bg-[#F3F4F6]">
                <CardBody className="text-sm">
                  <p className="text-gray-500 text-sm">Truck</p>
                  <p className="font-semibold">Iveco 80E190</p>
                </CardBody>
              </Card>
            </div>
            <div>
              <Card shadow="none" className="bg-[#F3F4F6]">
                <CardBody className="text-sm">
                  <p className="text-gray-500 text-sm">Weight</p>
                  <p className="font-semibold">7,340 kg</p>
                </CardBody>
              </Card>
            </div>
            <div>
              <Card shadow="none" className="bg-[#F3F4F6]">
                <CardBody className="text-sm">
                  <p className="text-gray-500 text-sm">Pallets</p>
                  <p className="font-semibold">13/20</p>
                </CardBody>
              </Card>
            </div>
            <div>
              <Card shadow="none" className="bg-[#F3F4F6]">
                <CardBody className="text-sm">
                  <p className="text-gray-500 text-sm">Volume</p>
                  <p className="font-semibold">18 m³</p>
                </CardBody>
              </Card>
            </div>
          </div>
        </Card>
        {/* Route Map Section */}
        <Card shadow={"none"} className="px-6">
          <h2 className="text-xl font-bold mb-4">Route map</h2>
          <StepperUI />
        </Card>
      </div>
    </ScrollShadow>
  );
}

export default RightSide;
