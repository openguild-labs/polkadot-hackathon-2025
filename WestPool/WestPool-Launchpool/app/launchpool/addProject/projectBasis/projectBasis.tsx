"use client";
import CustomDropdown from "@/app/components/Dropdown";
import { availableNetworks } from "@/app/constants";
import useAvailableChain, { useCombinedStore, useProjectBasisStore } from "@/app/zustand/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ProjectBasisPage = () => {
  const {
    // chain,
    setChain,
    isTrading,
    setIsTrading,
    poolBudget,
    setPoolBudget,
    targetStake,
    setTargetStake,
    targetAudience,
    setTargetAudience,
  } = useProjectBasisStore();
  const { chain } = useCombinedStore()
  const router = useRouter();

  const handleSubmit = () => {
    //fake fill data
    // setChain("Moonbeam");
    // setIsTrading("Yes");
    // setPoolBudget(5000000);
    // setTargetStake(500000);
    // setTargetAudience("Crypto Enthusiasts");

    console.log(chain);
    console.log(chain, isTrading, poolBudget, targetStake, targetAudience);
    if (
      chain === "" ||
      isTrading === "" ||
      poolBudget === undefined ||
      targetStake === undefined ||
      targetAudience === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    try {
      router.push("/launchpool/addProject/projectDetail");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      <div className="w-[90%] max-w-4xl p-8 bg-white rounded-3xl shadow-[0px_10px_20px_rgba(109,147,205,0.5),0px_-10px_20px_rgba(109,147,205,0.5),10px_0px_20px_rgba(109,147,205,0.5),-10px_0px_20px_rgba(109,147,205,0.5)]">
        <div className="flex flex-col text-[#404040] font-bold gap-y-10">
          <div className="grid grid-cols-2 gap-16">
            <div className="">
              Which chain are you building on?
              <div className="mt-5">
                {/* <select
                                    className="w-full px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                                    onChange={(e) => setSelectedChain(e.target.value)}
                                >
                                    <option value="0" disabled selected>Select a chain</option>
                                    <option value="Ethereum">Ethereum</option>
                                    <option value="Moonbeam">Moonbeam</option>
                                    <option value="Astar">Astar</option>
                                    <option value="Polkadot">Polkadot</option>
                                    <option value="Bifrost">Bifrost</option>

                                </select> */}
                <CustomDropdown
                  className=""
                  options={availableNetworks}
                  placeholder="Select a chain"
                  state="chain"
                />
                {/* <div className="dropdown">
                                    <div tabIndex={0} role="button" className="btn w-full px-4 py-4 bg-white hover:bg-red-500">Select a Chain</div>
                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-3xl z-[1] w-52 p-2 shadow">
                                        <li><a>Item 1</a></li>
                                        <li><a>Item 2</a></li>
                                    </ul>
                                </div> */}
              </div>
            </div>
            <div className="grid grid-rows-2">
              Is your token already trading or circulating?
              <div className="flex flex-row">
                <label className="flex items-center mr-12">
                  <input
                    type="radio"
                    name="radio-1"
                    className="radio checked:bg-[#7ba9ef]"
                    defaultChecked
                    onClick={() => setIsTrading("Yes")}
                  />
                  <span className="ml-2">Yes</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="radio-1"
                    className="radio checked:bg-[#7ba9ef]"
                    onClick={() => setIsTrading("No")}
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
          </div>

          {/* 2nd row */}
          <div className="">
            What is your pool budget? (e.g 5,000,000 instead of 5 million)
            <input
              type="number"
              className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
              placeholder="Enter your pool budget"
              onChange={(e) => setPoolBudget(Number(e.target.value))}
            />
          </div>

          {/* 3rd row */}
          <div className="">
            Target Stake
            <input
              type="number"
              className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
              placeholder="Enter your target stake"
              onChange={(e) => setTargetStake(Number(e.target.value))}
            />
          </div>

          {/* 4th row */}
          <div className="">
            Target Audience
            <input
              type="text"
              className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
              placeholder="Enter your target audience"
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-10">
            <button
              className="w-8/12 px-10 py-3 text-white bg-[#6d93cd] hover:bg-[#2a5697] rounded-3xl"
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBasisPage;
