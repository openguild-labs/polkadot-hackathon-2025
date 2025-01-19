"use client";
import { useProjectDetailStore } from "@/app/zustand/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MultiSelect from "@/app/components/MultiSelect";
import { useChain } from "@thirdweb-dev/react";
import { chainConfig } from "@/app/config";
import { availablePool } from "@/app/constants";
// import { availablePool } from "@/app/constants";

const ProjectDetailPage = () => {
  const {
    projectName,
    setProjectName,
    tokenSymbol,
    setTokenSymbol,
    shortDescription,
    setShortDescription,
    longDescription,
    setLongDescription,
    maxStake,
    setMaxStake,
    minStake,
    setMinStake,
    acceptedVToken,
    setAcceptedVToken,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    projectImage,
    setProjectImage,
    projectLogo,
    setProjectLogo,
  } = useProjectDetailStore();

  const [vAssetsPools, setVAssetsPools] = useState<any[]>([])

  const router = useRouter();

  const handleFileImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length + projectImage.length > 4) {
      alert("You must choose 4 images");
      return;
    }

    const base64Promises = files.map((file) => convertToBase64(file));
    const base64Images = await Promise.all(base64Promises);

    console.log("1" + base64Promises);
    console.log("2" + base64Images);

    setProjectImage([...projectImage, ...base64Images]);
  };

  const handleFileLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64Image = await convertToBase64(file);

    setProjectLogo(base64Image);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedToDate = e.target.value;

  //   if (fromDate && new Date(selectedToDate) <= new Date(fromDate)) {
  //     alert("The 'To' date must be after the 'From' date.");
  //     e.target.value = ""; // Reset value
  //     setToDate("");
  //   } else {
  //     setToDate(selectedToDate);
  //   }
  // };
  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFromDate = e.target.value;

    if (new Date(selectedFromDate) < new Date()) {
      alert("The 'From' date cannot be in the past.");
      e.target.value = ""; // Reset value
      setFromDate("");
    } else {
      setFromDate(selectedFromDate);
    }
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedToDate = e.target.value;

    if (new Date(selectedToDate) < new Date()) {
      alert("The 'To' date cannot be in the past.");
      e.target.value = "";
      setToDate("");
    } else if (fromDate && new Date(selectedToDate) <= new Date(fromDate)) {
      alert("The 'To' date must be after the 'From' date.");
      e.target.value = "";
      setToDate("");
    } else {
      setToDate(selectedToDate);
    }
  };


  const handleSubmit = () => {
    //fake data fill
    // setProjectName("Project Name");
    // setShortDescription("Short Description");
    // setLongDescription("Long Description");
    // setMaxStake(5000);
    // setMinStake(100);
    // setAcceptedVToken("VToken");
    // setFromDate("2021-09-01T08:30");
    // setToDate("2021-09-30T08:30");
    // setProjectImage([]);
    // setProjectLogo(null);

    console.log(
      projectName,
      shortDescription,
      longDescription,
      maxStake,
      minStake,
      acceptedVToken,
      fromDate,
      toDate,
      projectImage,
      projectLogo
    );
    // if (
    //   projectName === "" ||
    //   tokenSymbol === "" ||
    //   shortDescription === "" ||
    //   longDescription === "" ||
    //   maxStake === undefined ||
    //   minStake === undefined ||
    //   acceptedVToken === null ||
    //   fromDate === "" ||
    //   toDate === "" ||
    //   projectImage === null ||
    //   projectLogo === null
    // ) {
    //   alert("Please fill all the fields");
    //   return;
    // }
    try {
      const acceptedVTokenAddress = chainConfig[currentChain?.chainId?.toString() as keyof typeof chainConfig].vAssets.find(asset => asset.name === acceptedVToken[0])
      console.log("Project Name: " + projectName);
      console.log("Token Symbols: " + tokenSymbol);
      console.log("Accepted VToken Address: " + acceptedVTokenAddress?.address);
      console.log("Accepted VToken: " + acceptedVToken);

      router.push("/launchpool/addProject/preview");
    } catch (e) {
      console.log("error isss: " + e);
    }
  };

  const currentChain = useChain()
  useEffect(() => {
    if (!currentChain) {
      return
    }
    const chainId = currentChain.chainId
    console.log(chainId);

    const vAssets =
      chainConfig[chainId.toString() as keyof typeof chainConfig]?.vAssets;
    console.log(vAssets);

    setVAssetsPools(vAssets)

  }, [currentChain]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-[90%] max-w-4xl p-8 bg-white rounded-3xl shadow-[0px_10px_20px_rgba(109,147,205,0.5),0px_-10px_20px_rgba(109,147,205,0.5),10px_0px_20px_rgba(109,147,205,0.5),-10px_0px_20px_rgba(109,147,205,0.5)]">
          <div className="flex flex-col font-bold text-[#404040] gap-y-10">
            <div className="">
              Project Name
              <div className="">
                <input
                  type="text"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Project Name"
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </div>

            <div className="">
              Token Symbol
              <div className="">
                <input
                  type="text"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Project Name"
                  onChange={(e) => setTokenSymbol(e.target.value)}
                />
              </div>
            </div>


            <div className="">
              Short Description
              <div className="">
                <input
                  type="text"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Short Description"
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Long Description */}
            <div className="">
              Long Description
              <div className="">
                <textarea
                  className="w-full mt-5 px-4 pt-4 pb-24 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Long Description"
                  onChange={(e) => setLongDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Project Imafe & Project Logo */}
            <div className="grid grid-cols-2 gap-16">
              <div className="">
                Project Image
                <div className="">
                  <input
                    type="file"
                    className="w-full mt-5 px-4 py-24 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                    onChange={(e) => handleFileImage(e)}
                    multiple
                  />
                </div>
              </div>

              <div className="">
                Project Logo
                <div className="">
                  <input
                    type="file"
                    className="w-full mt-5 px-4 py-24 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                    onChange={(e) => handleFileLogo(e)}
                  />
                </div>
              </div>
            </div>

            {/* Accepted VToken */}
            <div className="">
              Accepted VToken
              <div className="mt-5">
                {/* <input
                  type="text"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Accepted VToken"
                  onChange={(e) => setAcceptedVToken(e.target.value)}
                /> */}
                <MultiSelect
                  placeholder="Select Pool"
                  options={vAssetsPools}
                  // options={availablePool}
                  state="acceptedVToken"
                />
              </div>
            </div>

            {/* Max Stake */}
            <div className="">
              Max Stake
              <div className="">
                <input
                  type="number"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Max Stake"
                  onChange={(e) => setMaxStake(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Min Stake */}
            <div className="">
              Min Stake
              <div className="">
                <input
                  type="number"
                  className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                  placeholder="Enter Min Stake"
                  onChange={(e) => setMinStake(Number(e.target.value))}
                />
              </div>
            </div>

            {/* From & To Duration DateTime */}

            <div className="grid grid-cols-2 gap-16">
              <div>
                From
                <div>
                  <input
                    type="datetime-local"
                    className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                    onChange={handleFromDateChange}
                    value={fromDate || ""}
                  />
                </div>
              </div>

              <div>
                To
                <div>
                  <input
                    type="datetime-local"
                    className="w-full mt-5 px-4 py-4 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none bg-[#f3f3f3]"
                    onChange={handleToDateChange}
                    value={toDate || ""}
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center mt-10 mb-4">
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
    </div>
  );
};

export default ProjectDetailPage;
