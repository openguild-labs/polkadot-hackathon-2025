"use client";
import { MarketABI, MockERC20MintOnInitABI, MockVDotABI, PreMarketFactoryABI } from "@/app/abi";
import { chainConfig } from "@/app/config";
import { convertNumToOnChainFormat } from "@/app/utils/decimals";
import { useCombinedStore } from "@/app/zustand/store";
import { OfferType } from "@prisma/client";
// import { OfferType } from "@/prisma/enum";
import { useAddress, useChain } from "@thirdweb-dev/react";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const PreviewOfferPage = () => {
  const {
    role,
    pricePerToken,
    tokenAddress,
    amount,
    selectedNetwork,
    selectedToken,
    collateral,
    selectedCollateralToken,
  } = useCombinedStore();


  const [preMarketFactory, setPreMarketFactory] = useState<ethers.Contract | null>(null);
  const [marketAddress, setMarketAddress] = useState<string | null>(null);
  const [marketContract, setMarketContract] = useState<ethers.Contract | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [collateralContract, setCollateralContract] = useState<ethers.Contract | null>(null);
  const [collateralDecimal, setCollateralDecimal] = useState<number>(18);
  const creatorAddress = useAddress();


  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleDeposit = async () => {
    //Condition to check every field is filled
    if (
      !pricePerToken ||
      !amount ||
      !selectedNetwork ||
      !selectedToken ||
      !collateral ||
      !selectedCollateralToken
    ) {
      alert("Please fill all the fields");
      return;
    }

    // if(!preMarketFactory) {
    //   console.log("PreMarketFactory not found"); 
    //   return;
    // }


    if (!marketContract) {
      console.log("MarketContract not found");
      return;
    }

    if (!collateralContract) {
      console.log("Collateral Contract not found");
      return;
    }

    if (!collateralDecimal) {
      console.log("Collateral Decimal not found");
      setCollateralDecimal(18);
    }
    const floatCollateral = parseFloat(collateral.toString());

    const onChainCollateral = convertNumToOnChainFormat(floatCollateral, collateralDecimal);

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    console.log("Signer: " + await signer.getAddress());

    console.trace(
      `metamask provided a signer with address: ${await signer.getAddress()}`
    );

    console.log("Collateral Contract: " + collateralContract);

    const marketContractWithSigner = marketContract.connect(signer);
    console.log("Market Contract with Signer: " + marketContractWithSigner);

    try {
      // const currentAllowance = await collateralContract.allowance(creatorAddress, marketContract.address);
      // console.log("Current allowance: ", currentAllowance.toString());
      // if (currentAllowance.gte(onChainCollateral)) {
      //   console.log("Already approved");
      // } else {

      //   const approvalTx = await collateralContract.approve(marketContract.address, onChainCollateral);
      //   console.log("Approval tx: ", approvalTx.hash);
      //   await approvalTx.wait();
      // }
      // console.log("Approved");

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Prompt user to connect MetaMask
        const signer = provider.getSigner();
      
        const collateralContractWithSigner = collateralContract.connect(signer);
      
        const currentAllowance = await collateralContractWithSigner.allowance(
          await signer.getAddress(), // Owner address
          marketContract.address      // Spender address
        );
        console.log("Current allowance: ", currentAllowance.toString());
      
        if (currentAllowance.gte(onChainCollateral)) {
          console.log("Allowance is sufficient, no need to approve.");
        } else {
          const approvalTx = await collateralContractWithSigner.approve(
            marketContract.address,
            onChainCollateral // Increase allowance to this value
          );
          console.log("Approval transaction hash: ", approvalTx.hash);
          await approvalTx.wait();
          console.log("Approval successful.");
        }
      } catch (approvalError) {
        console.error("Error during approval: ", approvalError);
        throw approvalError;
      }

      const offerType = role === OfferType.Buy ? 0 : 1;
      const collateralAddress = tokenAddress[1];

      const depositTx = await marketContractWithSigner.createOrder(
        offerType,
        convertNumToOnChainFormat(amount, 18),
        onChainCollateral,
        collateralAddress
      )

      console.log("Deposit tx hash: " + depositTx.hash);

      await depositTx.wait();

      if(!depositTx) {
        console.error("Deposit failed");
        return
      }

      console.log("Deposited");



    } catch (error) {
      console.error(`error depositing collateral:\n ${error}`);
      return;
    }







    try {
      const response = await axios.post("/api/preMarket/preview", {
        role,
        tokenAddress,
        pricePerToken,
        amount,
        selectedNetwork,
        selectedToken,
        collateral,
        selectedCollateralToken,
        creatorAddress,
      });
      console.log("response: " + response.data);

      if (response.data.success) {
        console.log("---------.------- " + response.data);
      }

      const projectId = response.data.project;
      console.log("prjid: " + projectId);


      router.push(`/preMarket/tokenOffer/${projectId}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!tokenAddress) {
      console.log("Token address not found");
      return;
    }

    console.log("Token address: " + tokenAddress[0]);
    const getProjetId = async () => {
      try {
        const response = await axios.post("/api/preMarket/project", { tokenAddress });
        console.log("response: " + response.data);

        if (response.data.success) {
          console.log("---------.------- " + response.data);
        }

        const projectId = response.data.projectId;

        setProjectId(projectId);

      } catch (error) {
        console.log(error);
      }
    }

    getProjetId();
  }, [tokenAddress]);



  const currentChain = useChain();

  //Get PreMarketFactory address
  useEffect(() => {
    // if (currentChain?.name !== selectedNetwork) {
    //   router.push("/preMarket/createOffer");
    // }
    if (!currentChain) {
      return;
    }

    if (!projectId) {
      return;
    }
    console.log("Project Id: " + projectId);

    const fetchPreMarketFactory = async () => {
      const address: string =
        chainConfig[currentChain.chainId.toString() as keyof typeof chainConfig].contracts.PreMarketFactory.address;
      console.log("PreMarketFactory address: " + address);

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const factoryContract = new ethers.Contract(
        address,
        PreMarketFactoryABI,
        provider
      );

      const marketAddress = await factoryContract.getMarket(projectId);
      console.log("Market Address: " + marketAddress);

      const marketContract = new ethers.Contract(
        marketAddress,
        MarketABI,
        provider
      );

      setMarketAddress(marketAddress);
      setMarketContract(marketContract);



    }

    fetchPreMarketFactory();

  }, [currentChain, projectId]);

  // fetch VAsset Collateral Token Decimal
  useEffect(() => {
    // if(!currentChain) {
    //   return;
    // }

    // if(!marketContract){
    //   return;
    // }

    const fetchVAssetCollateralTokenDecimal = async () => {
      const collateralTokenAddress = tokenAddress[1];
      console.log("Collateral Token Address: " + collateralTokenAddress);

      if (!currentChain) {
        console.log("Current chain not found");
        return;
      }

      if (!marketContract) {
        console.log("MarketContract not found");
        return;
      }

      if (!selectedCollateralToken) {
        console.log("Selected Collateral Token not found");
        return;
      }
      let collateralTokenContract;
      if (selectedCollateralToken === "vDOT") {
        collateralTokenContract = new ethers.Contract(
          collateralTokenAddress,
          MockVDotABI,
          marketContract.provider
        )
      } else {
        collateralTokenContract = new ethers.Contract(
          collateralTokenAddress,
          MockERC20MintOnInitABI,
          marketContract.provider
        )
      }
      const collateralTokenDecimal = await collateralTokenContract.decimals();

      console.log("Collateral Token Decimal: " + collateralTokenDecimal);
      console.log("Collateral Token Contract Address: " + collateralTokenContract.address);

      setCollateralContract(collateralTokenContract);
      setCollateralDecimal(collateralTokenDecimal);
    }

    fetchVAssetCollateralTokenDecimal();
  }, [currentChain, marketContract, selectedCollateralToken]);







  return (
    <div>
      <div className="mt-10 text-4xl text-center font-bold text-[#ffffff]">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row space-x-2">
            <div className="">
              <span>Your offer was to</span>
            </div>

            <div>
              {role === OfferType.Buy ? (
                <div className="text-[#2ab84e]">
                  <span>
                    buy {amount} {selectedToken}
                  </span>
                </div>
              ) : (
                <div className="text-[#b10202]">
                  <span>
                    sell {amount} {selectedToken}
                  </span>
                </div>
              )}
            </div>

            <div className="">for</div>

            <div>
              {role === OfferType.Buy ? (
                <div className="text-[#2ab84e]">
                  <span>
                    {collateral} {selectedCollateralToken}
                  </span>
                </div>
              ) : (
                <div className="text-[#b10202]">
                  <span>
                    {collateral} {selectedCollateralToken}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row space-x-2">
            <div>in</div>
            <div className="font-bold bg-gradient-to-r from-[#82B2FA] to-[#FFFFFF] bg-clip-text text-transparent">
              Pre-market
            </div>
          </div>
        </div>
      </div>

      {/* Preview order */}
      <div className="mt-10 flex justify-center">
        <div className="border box-border w-5/12 bg-[#3966a9] text-white rounded-2xl text-2xl mb-10">
          <div className="grid grid-cols-2 ml-10 mt-14 mb-20">
            <div className="">
              <div className="space-y-16">
                <div className="">Offer Type</div>

                <div className="">Price</div>

                <div className="">Amount</div>

                <div className="">For</div>

                <div className="">Fill type</div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end mr-10 font-bold ">
              <div className="space-y-16">
                <div className="flex justify-end">
                  {role === OfferType.Buy ? (
                    <div className="text-[#2ab84e] ">WANT TO BUY</div>
                  ) : (
                    <div className="text-[#b10202] ">WANT TO SELL</div>
                  )}
                </div>

                <div className="flex justify-end">${pricePerToken}</div>

                <div className="flex justify-end">
                  {amount} {selectedToken}
                </div>

                <div className="flex justify-end">
                  {collateral} {selectedCollateralToken}
                </div>

                <div className="flex justify-end">Single Fill</div>
              </div>
            </div>
          </div>

          <div className="flex flex-row space-x-3 justify-center items-center mb-8">
            <button
              className="btn w-5/12 bg-[#ffffff] hover:bg-[#2d4466] rounded-2xl text-[24px] text-[#7BA9EF]"
              onClick={handleBack}
            >
              Back
            </button>

            <button
              className="btn w-5/12 bg-[#ffffff] hover:bg-[#2d4466] rounded-2xl text-[24px] text-[#7BA9EF] "
              onClick={handleDeposit}
            >
              Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewOfferPage;
