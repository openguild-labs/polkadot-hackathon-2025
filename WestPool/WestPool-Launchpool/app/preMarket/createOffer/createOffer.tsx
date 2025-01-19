"use client";
import { useRouter } from "next/navigation";
import CustomDropdown from "../../components/Dropdown";
import SidePick from "../../components/SidePick";
import { availableNetworks, availableTokens } from "../../constants";
import { useCombinedStore, useCreateOfferStore } from "../../zustand/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { TokenData } from "@/app/interface/interface";
import { id } from "ethers/lib/utils";
import { chainConfig } from "@/app/config";
import { useChain } from "@thirdweb-dev/react";

const CreateOfferPage = () => {
  const {
    tokenAddress,
    role,
    pricePerToken,
    amount,
    selectedNetwork,
    selectedToken,
    collateral,
    selectedCollateralToken,
    setTokenAddress,
    setRole,
    setPricePerToken,
    setAmount,
    setSelectedNetwork,
    setSelectedToken,
    setCollateral,
    setSelectedCollateralToken,
  } = useCombinedStore();

  const [projectTokens, setProjectTokens] = useState<TokenData[]>([]);
  const [collateralTokens, setCollateralTokens] = useState<TokenData[]>([]);
  const router = useRouter();

  const handleDeposit = () => {
    //Condition to check every field is filled
    console.log(tokenAddress, pricePerToken, amount, selectedNetwork, selectedToken, collateral, selectedCollateralToken);

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

    router.push("/preMarket/createOffer/preview");
  };

  // const handleCollateral = () => {
  //   if (!pricePerToken || !amount) {
  //     // Set collateral to a placeholder value (e.g., 0 or undefined)
  //     setCollateral(0);
  //   } else {
  //     // Calculate and set the collateral
  //     setCollateral(pricePerToken * amount);
  //   }
  // };

  // useEffect(() => {
  //   handleCollateral();
  // }, [amount, pricePerToken]);

  useEffect(() => {
    if (!pricePerToken || !amount) {
      setCollateral(0);
    } else {
      setCollateral(pricePerToken * amount);
    }
  }, [pricePerToken, amount, setCollateral]);


  useEffect(() => {
    const fetchProjectTokens = async () => {
      const response = await axios.post("/api/preMarket/projectToken", {});

      if (!response.data.success) {
        console.log(response.data.message);
        return;
      }

      console.log(response.data);

      const projectTokens = response.data.projects;
      const tokens = projectTokens.map((project: any) => {
        return {
          id: project.id,
          name: project.projectName,
          symbol: project.tokenSymbol,
          image: project.projectLogo,
          address: project.verifiedTokenAddress,
        };
      });
      console.log("Tokens: ", tokens);
      setProjectTokens(tokens);

      // for(let project in projectTokens){

      // }



    }
    fetchProjectTokens();
  }, []);

  const currentChain = useChain();
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
        address: vGLMRCCollateral.address,}
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

  }, [currentChain]);



  return (
    <div>
      <div className="mt-10 text-5xl text-center font-bold bg-gradient-to-r from-[#82B2FA] to-[#FFFFFF] bg-clip-text text-transparent">
        Offer Settings
      </div>

      <div className="mt-14">
        <SidePick />
      </div>

      <div className="mt-10 flex justify-center">
        <div className="border box-border w-7/12 bg-[#3966a9] text-white rounded-2xl mb-10">
          <div className="flex flex-col">
            {/* Price per token */}
            <div className="mt-7 mx-16 border bg-[#5a88ce] rounded-xl">
              <div className="text-xl my-3 ml-10 font-semibold">
                PRICE PER TOKEN
              </div>

              <div className="ml-10 my-5 text-2xl text-white">
                <span className="mr-5">$ </span>
                <input
                  type="number"
                  placeholder="Enter your price"
                  className="bg-[#5a88ce] text-2xl border-none focus:outline-none
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance:textfield]"
                  onChange={(e) => setPricePerToken(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Amount */}
            <div className="mt-12 mx-16 border bg-[#5a88ce] rounded-xl">
              <div className="text-xl my-3 ml-10 font-semibold">AMOUNT</div>

              <div className="ml-10 my-5 flex flex-row gap-4 mr-5">
                <div className="">
                  <input
                    type="number"
                    placeholder="Enter Amount"
                    className="bg-[#5a88ce] text-2xl text-white border-none focus:outline-none pt-3 "
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>

                <div className="text-black w-full text-center">
                  <CustomDropdown
                    className="text-[#5a88ce]"
                    options={availableNetworks}
                    placeholder="Select Network"
                    state="selectedNetwork"
                  />
                </div>

                <div className="text-black w-full text-center">
                  <CustomDropdown
                    className="text-[#5a88ce]"
                    options={projectTokens}
                    placeholder="Select Token"
                    state="selectedToken"
                  />
                </div>
              </div>
            </div>

            {/* Collateral */}
            <div className="mt-7 mx-16 border bg-[#5a88ce] rounded-xl">
              <div className="text-xl my-3 ml-10 font-semibold">COLLATERAL</div>

              <div className="ml-10 my-5 flex flex-row gap-4">
                <div className="">
                  <input
                    type="number"
                    value={`${collateral}`}
                    className="bg-[#5a88ce] text-2xl text-white border-none focus:outline-none pt-3 read-only:text-white"
                    onChange={(e) => setCollateral(Number(e.target.value))}
                    readOnly
                  />
                </div>

                <div className="text-black w-full text-center grid grid-cols-2">
                  <div className=""></div>
                  <div className="mr-5">
                    <CustomDropdown
                      className="text-[#5a88ce]"
                      options={collateralTokens}
                      placeholder="Select Token"
                      state="selectedCollateralToken"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* <div
              className="mt-7 mx-16 my-14 py-4 border text-[#5a88ce] bg-white rounded-3xl text-3xl text-center flex justify-center items-center"
              onClick={handleDeposit}
            >
              Deposit
            </div> */}
            <button
              className="btn mt-7 mx-16 my-14  text-3xl text-center h-16  bg-[#ffffff] hover:bg-[#2d4466] rounded-2xl text-[24px] text-[#7BA9EF]"
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

export default CreateOfferPage;
