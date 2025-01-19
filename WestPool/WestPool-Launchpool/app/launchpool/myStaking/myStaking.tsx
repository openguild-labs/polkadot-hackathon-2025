"use client";

import Image from "next/image";
import { dataTable } from "../../constants/index";
import { useEffect, useState } from "react";
import { useAddress, useChain } from "@thirdweb-dev/react";
import axios from "axios";
import { debounce } from "@/app/utils/helper";
import { chainConfig } from "@/app/config";
import { ethers } from "ethers";
import { PoolABI, PoolFactoryABI } from "@/app/abi";
import { Project } from "@/app/interface/interface";

const MyStakingPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [endedProjects, setEndedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const investorAddress = useAddress();

  const [factoryAddress, setFactoryAddress] = useState<string | undefined>(
    undefined
  );
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const projectOwnerAddress = useAddress();
  const [isCallingContract, setIsCallingContract] = useState<boolean>(false);


  const currentChain = useChain();

  useEffect(() => {
    if (!currentChain) {
      return;
    }

    const address: string =
      chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.PoolFactory?.address;

    setFactoryAddress(address);
    console.log("address", address);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryContract = new ethers.Contract(
      address,
      PoolFactoryABI,
      provider
    );
    setFactoryContract(factoryContract);
  }, [currentChain]);

  const handleClaimReward = async (project: Project) => {
    console.log("Claiming reward for project:", project);

    // setClaimRewardProject(project);
    setIsCallingContract(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("Provider", provider);
      console.log("Signer", signer);

      console.log("Provider and signer set up successfully.");

      const poolAddr = await factoryContract?.getPoolAddress(
        // claimRewardProject?.id
        project.id
      );
      console.log("Pool address fetched:", poolAddr);

      const poolContract = new ethers.Contract(poolAddr, PoolABI, signer);
      console.log("Pool contract initialized:", poolContract);

      const resp = await poolContract.claimRewards();
      console.log("Transaction response:", resp);

      // Hiển thị thông báo thành công
      console.log("Reward claim successful for project:", project.id);
      alert("Claim rewards successful!");

    } catch (error) {
      console.error("Error claiming reward:", error);

      const errorMessage = (error as any)?.message || "";

      if (errorMessage.includes("No rewards to claim")) {
        alert("You have no rewards to claim.");
      } else if (errorMessage.includes("Insufficient contract balance")) {
        alert("The contract does not have enough tokens.");
      } else {
        alert("An error occurred while claiming rewards.");
      }
    } finally {
      setIsCallingContract(false);
    }
  };


  const fetchMyProjects = async () => {
    try {
      const response = await axios.post("/api/launchpool/myProject", {
        investorAddress,
      });
      console.log(response.data);

      if (response.data.success) {
        console.log(response.data.projects);
      }

      const projects = response.data.projects;
      const pending = [];
      const ended = [];

      for (let i = 0; i < projects.length; i++) {
        if (projects[i].projectStatus !== "Upcoming") {
          console.log("Pending Projects: " + projects[i]);
          console.log("Pending Projects: " + projects[i].projectName);
          pending.push(projects[i]);
        } else {
          ended.push(projects[i]);
        }
      }

      // Set state after loop
      setPendingProjects(pending);
      setEndedProjects(ended);
      console.log("Pending Projects: " + pendingProjects);
      for (let project in pendingProjects) {
        console.log("Pending Projects: " + project);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const fetchProjectWithDebounce = debounce(fetchMyProjects, 1000);
  useEffect(() => {
    fetchProjectWithDebounce();
  }, [investorAddress]);





  return (
    <div>
      <div className="py-10">
        {/* Ended Launchpool */}
        <div className="flex flex-col">
          <div className="ml-32 mb-10 text-3xl font-bold bg-gradient-to-r from-[#82B2FA] to-[#FFFFFF] bg-clip-text text-transparent ">
            Ended Launchpool
          </div>

          {/* Project Collapse component */}
          <div className="flex flex-col justify-center items-center gap-5 ">
            <>
              {endedProjects.map((data) => (
                <div
                  key={data.title}
                  className="bg-base-200 collapse w-10/12 border-2 border-[#A1C6FF] transition duration-500 ease-in-out transform hover:scale-105"
                >
                  <input type="checkbox" className="peer" />

                  <div className="collapse-title bg-gradient-to-r from-[#204275] to-[#4D75B3] text-white peer-checked:bg-[#3D69AC] peer-checked:text-white flex items-center">
                    <Image
                      className="rounded-full bg-gray-500"
                      src={data.projectLogo}
                      alt="logo"
                      width={50}
                      height={50}
                    />
                    <div className="flex flex-col ml-5">
                      <span className=" text-lg">{data.title}</span>
                      <span className="text-sm">
                        {data.short_description}
                      </span>
                    </div>
                  </div>

                  <div
                    className="collapse-content bg-blue-500 text-white peer-checked:bg-[#628FD4] peer-checked:text-secondary-content
                                 border border-b rounded-b-2xl"
                  >
                    <div className="flex items-center">
                      <div className="">
                        <p className="">{data.longDescription}</p>
                      </div>
                      <div className="ml-auto mb-4 mr-5   ">
                        <button
                          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md mt-4 rounded-2xl"
                          onClick={(e) => handleClaimReward(data)}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          </div>
        </div>

        {/* Pending Launchpool */}
        <div className="mt-20">
          <div className="ml-32 mb-10 text-3xl font-bold bg-gradient-to-r from-[#82B2FA] to-[#FFFFFF] bg-clip-text text-transparent">
            Pending Launchpool
          </div>
          <div className="flex flex-col justify-center items-center gap-5 ">
            <>
              {pendingProjects.map((data) => (
                <div
                  key={data.projectName}
                  className="bg-base-200 collapse w-10/12 border-2 border-[#A1C6FF] transition duration-500 ease-in-out transform hover:scale-105"
                >
                  <input type="checkbox" className="peer" />

                  <div className="collapse-title bg-gradient-to-r from-[#204275] to-[#4D75B3] text-white peer-checked:bg-[#3D69AC] peer-checked:text-white flex items-center">
                    <Image
                      className="rounded-full bg-gray-500"
                      src={data.projectLogo}
                      alt="logo"
                      width={50}
                      height={50}
                    />
                    <div className="flex flex-col ml-5">
                      <span className=" text-lg">{data.shortDescription}</span>
                      <span className="text-sm">
                        {data.short_description}
                      </span>
                    </div>
                  </div>

                  <div
                    className="collapse-content bg-blue-500 text-white peer-checked:bg-[#628FD4] peer-checked:text-secondary-content
                                 border border-b rounded-b-2xl"
                  >
                    <div className="flex items-center">
                      <div className="">
                        <p className="">{data.longDescription}</p>
                      </div>
                      <div className="ml-auto mb-4 mr-5   ">
                        <button
                          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md mt-4 rounded-2xl"
                          onClick={(e) => handleClaimReward(data)}
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyStakingPage;
