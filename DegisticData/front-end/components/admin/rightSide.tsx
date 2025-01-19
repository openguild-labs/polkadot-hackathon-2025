import React from "react";
import RadarChartAdmin from "./component/radarChart";
import PieChartAdmin from "./component/pieChart";
import LineChartAdmin from "./component/lineChart";

function RightSideAdmin() {
  return (
    <div className="h-screen w-[35%] bg-white p-5 flex flex-col gap-5 border-l-1 shadow-xl overflow-hidden">
      <h1 className="text-2xl font-bold">Statistics</h1>
      <div className="w-full h-1/2 justify-center items-center">
        <h3 className="text-gray-400">• Delivery Performance</h3>
        <RadarChartAdmin />
      </div>
      <div className="w-full h-1/2 justify-center items-center">
        <h3 className="text-gray-400">• Outcome per month</h3>
        <LineChartAdmin />
      </div>
    </div>
  );
}

export default RightSideAdmin;
