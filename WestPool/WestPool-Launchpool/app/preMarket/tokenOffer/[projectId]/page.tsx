"use client";
import { availableTokens } from "@/app/constants";
import { Offer, OfferType } from "@/app/interface/interface";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAddress, useChain } from "@thirdweb-dev/react";
import { chainConfig } from "@/app/config";
import { PoolFactoryABI, PoolABI, MarketABI, PreMarketFactoryABI, MockVDotABI } from "@/app/abi";
import { ethers } from "ethers";
import { convertNumToOnChainFormat } from "@/app/utils/decimals";


const TokenOffer = () => {
  const [projectDetails, setProjectDetails] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [factoryAddress, setFactoryAddress] = useState<string | undefined>(
    undefined
  );
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [collateralTokens, setCollateralTokens] = useState<any[]>([]);
  const pageParam = useParams();
  const userAddress = useAddress();


  const currentChain = useChain();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { projectId } = pageParam;
        console.log("Project id: " + projectId);

        const res = await axios.post("/api/preMarket/tokenOffer", { projectId });
        console.log("Respnse data: " + res.data);
        const data = res.data;

        if (data.success) {
          setProjectDetails(data.data);
          console.log("Project details: ", projectDetails);

        } else {
          console.error("Failed to fetch projects:", data.error);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [pageParam]);

  //------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (!currentChain) {
      return;
    }
    let collateralTokens = [];
    const vGLMRCCollateral = chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig].contracts.MockERC20MintOnInit;
    collateralTokens.push(
      {
        id: "1",
        name: "vGLMR",
        symbol: "vGLMR",
        image: "https://altcoinsbox.com/wp-content/uploads/2023/04/moonbeam-logo.png",
        address: vGLMRCCollateral.address,
      }
    );
    const vDOTCollateral = chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig].contracts.MockVDot;
    collateralTokens.push(
      {
        id: "2",
        name: "vDOT",
        symbol: "vDOT",
        image: "data:image/png;base64,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",
        address: vDOTCollateral.address,
      }
    );

    setCollateralTokens(collateralTokens);
    console.log("Collateral tokens:", collateralTokens);


  }, [currentChain]);

  useEffect(() => {
    if (!currentChain) {
      console.error("Current chain is not defined.");
      return;
    }

    if (!chainConfig || !chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig]) {
      console.error("Configuration for the current chain is missing.");
      return;
    }

    const address: string =
      chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig]
        ?.contracts?.PreMarketFactory?.address;

    if (!address) {
      console.error("Invalid contract address.");
      return;
    }

    const provider = window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;

    if (!provider) {
      console.error("Ethereum provider not available.");
      return;
    }

    const factoryContract = new ethers.Contract(
      address,
      PreMarketFactoryABI,
      provider
    );

    setFactoryAddress(address);
    setFactoryContract(factoryContract);
    console.log("Factory contract address:", address);
  }, [currentChain]);

  const handleOffer = async (projectId: string, offerId: string, dialogId: string) => {
    if (!factoryContract) {
      console.error("Factory contract is not available.");
      return;
    }

    if (!projectId || !offerId) {
      console.error("Invalid project ID or offer ID.");
      return;
    }

    if (!userAddress) {
      console.error("User address is not set.");
      return;
    }

    const provider = window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;

    if (!provider) {
      console.error("Ethereum provider is not available.");
      return;
    }

    const signer = provider.getSigner();

    try {
      const marketAddr = await factoryContract.getMarket(offerId);
      console.log("Market address:", marketAddr);

      // const poolAddr = await factoryContract.getPoolAddress(projectId);
      // console.log("Pool address:", poolAddr);

      if (!marketAddr) {
        console.error("Market or Pool address not found.");
        return;
      }

      const marketContract = new ethers.Contract(marketAddr, MarketABI, signer);
      // const poolContract = new ethers.Contract(poolAddr, PoolABI, signer);

      console.log("Market contract:", marketContract);
      // console.log("Pool contract:", poolContract);

      const resp = await marketContract.joinOrder(offerId);
      console.log("JoinOrder transaction:", resp);

      const acceptedVTokenAddress = await marketContract.getAcceptedVAsset();

      if (!acceptedVTokenAddress) {
        console.error("Accepted VToken address not found.");
        return;
      }

      const vAssetContract = new ethers.Contract(
        acceptedVTokenAddress,
        MockVDotABI,
        signer
      );

      console.log("VAsset contract:", vAssetContract);

      // const poolContractWithSigner = poolContract.connect(signer);
      // console.log("Pool contract with signer:", poolContractWithSigner);

      const amount = parseFloat(tradeAmount);
      if (isNaN(amount)) {
        console.error("Invalid trade amount.");
        return;
      }

      const onChainAmount = convertNumToOnChainFormat(amount, 18);
      const currentAllowance = await vAssetContract.allowance(userAddress, marketContract.address);

      console.log("Current allowance:", currentAllowance.toString());

      if (currentAllowance.gte(onChainAmount)) {
        console.log("Already approved.");
      } else {
        const approvalTx = await vAssetContract.approve(marketContract.address, onChainAmount);
        console.log("Approval transaction:", approvalTx.hash);
        await approvalTx.wait();
      }

      console.log("Approved successfully.");

      // Call API to update trade status
      const response = await axios.post("/api/preMarket/trade", {
        userAddress,
        projectId,
        offerId,
      });

      const data = response.data;

      if (data.success) {
        console.log("Offer updated successfully!");
        const dialog = document.getElementById(dialogId) as HTMLDialogElement;
        if (dialog) {
          dialog.close(); // Close the popup
        }
      } else {
        console.error("Failed to update offer:", data.error);
        alert("Could not update the offer. Please try again.");
      }
    } catch (error) {
      console.error("Error while executing:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  //------------------------------------------------------------------------------------------------------------

  if (loading) return <div className="flex justify-center items-center h-[80vh]">
    <span className="loading loading-dots loading-lg "></span>
  </div>;


  return (
    <div className="flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12 mt-10 ">
      <div className="w-full space-y-4 flex justify-center flex-col items-center gap-4">
        <h1 className="text-[67px] leading-[60px] font-bold bg-gradient-to-r from-[#7BA9EF] to-[#FFFFFF] to-50% text-transparent bg-clip-text">
          Pre-market
        </h1>
        <p className="text-[#A7B7DB]">Your Early Update on Financial Markets</p>
      </div>

      {/* -------------------------Title----------------------------- */}
      <div
        className="flex w-full items-center justify-between bg-[#3A66A9] rounded-xl h-auto gap-10 px-10 py-5 
      sm:grid sm:grid-rows-2 sm:grid-flow-col sm:gap-4 md:grid md:grid-rows-2 md:grid-flow-col md:gap-4 lg:flex lg:flex-row xl:flex xl:flex-row"
      >
        {/* {projectDetails.map((project) => ()} */}
        <div className="flex items-center gap-4 justify-center">
          <Image
            src={projectDetails[0]?.project.projectLogo}
            width={50}
            height={50}
            alt="icon"
            className="rounded-full"
          />
          <div className="flex flex-col text-left gap-1">
            <span className="text-[17px] font-bold">{projectDetails[0]?.project.projectName}</span>
            <span className="text-[12px] font-light text-[#DDDDDD]">
              {projectDetails[0]?.project.shortDescription}</span>
          </div>
        </div>

        {/* <div className="flex flex-col text-left gap-1">
          <span className="text-[15px] ">24h vol</span>
          <span className="text-[17px] font-bold text-[#DDDDDD]">
            $10000 + 3%
          </span>
        </div>

        <div className="flex flex-col text-left gap-1">
          <span className="text-[15px] ">total Voll</span>
          <span className="text-[17px] font-bold text-[#DDDDDD]">$10000</span>
        </div>

        <div className="flex flex-col text-left gap-1">
          <span className="text-[15px] ">Settle start</span>
          <span className="text-[17px] font-bold text-[#DDDDDD]">TBA</span>
        </div>

        <div className="flex flex-col text-left gap-1">
          <span className="text-[15px] ">Settle endl</span>
          <span className="text-[17px] font-bold text-[#DDDDDD]">TBA</span>
        </div> */}
      </div>

      <div className="w-full flex flex-row gap-4">
        {/* ----------------------------Table 1--------------------------------- */}
        <div className="w-full rounded-xl bg-[#3A66A9] ">
          <table className="table">
            <thead>
              <tr className="text-[#DDDDDD] text-left text-[13px] border-b-[#E0E0E0]">
                <th className="py-7 pl-7 font-light">Price</th>
                <th className="font-light">Amount</th>
                <th className="font-light">Collateral</th>
                <th className="font-light">Fill type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projectDetails.filter((data) => data.offerType === OfferType.Sell).map((project) => (
                <>
                  <tr className="text-white border-none">
                    <td className="pl-6 text-[#07F907]">{project.pricePerToken.toString()}</td>
                    <td>{project.amount.toString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{project.collateral.toString()}</span>
                        <Image
                          src={
                            collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.image || '/path/to/default-icon.png'
                          }
                          alt="logo"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                    </td>
                    <td>
                      <div className="border border-[#B8B8B8] text-[#00D4FF] rounded-2xl px-2  text-[11px] flex justify-center w-2/3 font-bold">
                        FULL
                      </div>
                    </td>
                    <td>
                      <button
                        className=" border border-[#B8B8B8] bg-none text-[#B8B8B8] rounded-md px-2 py-2 text-[13px] flex justify-center w-2/3 hover:scale-105 duration-300"
                        onClick={() =>
                          (
                            document.getElementById(`buy-${project.id}`) as HTMLDialogElement
                          ).showModal()
                        }
                      >
                        Buy
                      </button>
                      <dialog id={`buy-${project.id}`} className="modal">
                        <div className="modal-box bg-[#2D468D]">
                          <h3 className="font-bold text-lg mb-4 text-white">
                            {project.project.projectName}/{collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.name || ''}
                          </h3>

                          <div className="bg-[#5A78B8] rounded-lg p-4 mb-4 relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-green-400 font-bold text-sm">
                                BUYING
                              </span>
                              <span className="text-white text-xs">
                                MAX {project.amount.toString()} {project.project.projectName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <input
                                className="text-3xl font-bold text-white bg-transparent w-2/3 outline-none"
                                placeholder="enter"
                                value={project.amount.toString()}
                                readOnly
                              />
                              <Image
                                src={project.project.projectLogo}
                                alt="logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                            </div>
                          </div>

                          <div className="bg-[#5A78B8] rounded-lg p-4 relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-200 font-bold text-sm">
                                COLLATERAL
                              </span>
                              <span className="text-white text-xs">
                                Balance: 0.001 {collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.name || ''}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <input
                                className="text-3xl font-bold text-white bg-transparent w-2/3 outline-none
                                [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                                placeholder="enter"
                                type="number"
                                onChange={(e) => setTradeAmount(e.target.value)}
                              />
                              <Image
                                src={collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.image || ''}
                                alt="logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleOffer(project.project.id, project.id, `buy-${project.id}`)}
                            className="btn bg-white text-[#7BA9EF] w-full py-2 mt-6 rounded-full font-bold text-lg hover:bg-[#2C3E6F]">
                            Buy
                          </button>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </td>
                  </tr>
                </>
              ))}


            </tbody>
          </table>
        </div>

        {/* ----------------------------Table w--------------------------------- */}
        <div className="w-full rounded-xl bg-[#3A66A9] ">
          <table className="table">
            <thead>
              <tr className="text-[#DDDDDD] text-left text-[13px] border-b-[#E0E0E0]">
                <th className="py-7 pl-7 font-light">Price</th>
                <th className="font-light">Amount</th>
                <th className="font-light">Collateral</th>
                <th className="font-light">Fill type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projectDetails.filter((data) => data.offerType === OfferType.Buy).map((project) => (
                <>
                  <tr className="text-white border-none">
                    <td className="pl-6 text-[#07F907]">{project.pricePerToken.toString()}</td>
                    <td>{project.amount.toString()}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span>{project.collateral.toString()}</span>
                        <Image
                          src={
                            collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.image || '/path/to/default-icon.png'
                          }
                          alt="logo"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                    </td>
                    <td>
                      {/* <div className="border border-[#B8B8B8] text-[#B8B8B8] rounded-2xl px-2  text-[10px] flex justify-center w-2/3">
                    PARTIAL
                  </div> */}
                      <div className="border border-[#B8B8B8] text-[#00D4FF] rounded-2xl px-2  text-[11px] flex justify-center w-2/3 font-bold">
                        FULL
                      </div>
                    </td>
                    <td>
                      <button
                        className=" border border-[#B8B8B8] bg-none text-[#B8B8B8] rounded-md px-2 py-2 text-[13px] flex justify-center w-2/3 hover:scale-105 duration-300"
                        onClick={() =>
                          (
                            document.getElementById(`sell-${project.id}`) as HTMLDialogElement
                          ).showModal()
                        }
                      >
                        SELL
                      </button>
                      <dialog id={`sell-${project.id}`} className="modal">
                        <div className="modal-box bg-[#2D468D]">
                          <h3 className="font-bold text-lg mb-4 text-white">
                            {project.project.projectName}/{collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.name || ''}
                          </h3>

                          <div className="bg-[#5A78B8] rounded-lg p-4 mb-4 relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#ff2323] font-bold text-sm">
                                SELLING
                              </span>
                              <span className="text-white text-xs">
                                MAX {project.amount.toString()} {project.project.projectName}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <input
                                className="text-3xl font-bold text-white bg-transparent w-2/3 outline-none"
                                placeholder="enter"
                                value={project.amount.toString()}
                                readOnly
                              />
                              <Image
                                src={project.project.projectLogo}
                                alt="logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                            </div>
                          </div>

                          <div className="bg-[#5A78B8] rounded-lg p-4 relative">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-200 font-bold text-sm">
                                COLLATERAL
                              </span>
                              <span className="text-white text-xs">
                                Balance: 0.001 {collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.name || ''}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <input
                                className="text-3xl font-bold text-white bg-transparent w-2/3 outline-none
                                [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                                placeholder="enter"
                                type="number"
                                onChange={(e) => setTradeAmount(e.target.value)}
                              />
                              <Image
                                src={collateralTokens.find(token => token.address === project.tokenCollateralAddress)?.image || ''}
                                alt="logo"
                                width={30}
                                height={30}
                                className="rounded-full"
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleOffer(project.project.id, project.id, `sell-${project.id}`)}
                            className="btn bg-white text-[#e86c6c] w-full py-2 mt-6 rounded-full font-bold text-lg hover:bg-[#2a1919]">
                            Sell
                          </button>
                        </div>
                        <form method="dialog" className="modal-backdrop">
                          <button>close</button>
                        </form>
                      </dialog>
                    </td>
                  </tr>
                </>
              ))}



            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TokenOffer;
