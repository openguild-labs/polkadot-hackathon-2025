import { useState, useRef, useEffect } from "react";
import { availableNetworks } from "../constants";
import useAvailableChain, {
  AvailableChainState,
  useCombinedStore,
  useCreateOfferStore,
  useProjectBasisStore,
} from "../zustand/store";
import Image from "next/image";

interface CustomDropdownProps {
  className: string;
  options: {
    id: string;
    name: string;
    image: string;
    address?: string;
  }[];
  placeholder?: string;
  state: string;
}

const CustomDropdown = ({
  className,
  options,
  placeholder,
  state,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(placeholder);
  const { tokenAddress, setTokenAddress } = useCombinedStore();
  // const { chain, setChain } = useProjectBasisStore();
  // const setChain = useAvailableChain((state: AvailableChainState) => state.setChain);

  // const globalState = useCombinedStore((store) => store[state]);
  // const setGlobalState = useCombinedStore((store) => store[`set${state.charAt(0).toUpperCase()}${state.slice(1)}`]);
  // const globalState = useCombinedStore((store) => store[state as keyof typeof store]);
  // const setGlobalState = useCombinedStore((store: { [key: string]: any }) => store[`set${state.charAt(0).toUpperCase()}${state.slice(1)}`]);
  const setGlobalState = useCombinedStore((store) => {
    const setterName = `set${state.charAt(0).toUpperCase()}${state.slice(1)}`;
    return (
      (store as any)[setterName] ||
      (() => console.error(`Setter ${setterName} is not defined.`))
    );
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // const options = availableNetworks;

  // const handleOnclick = () => {
  //     console.log(chain);
  // }

  // const options = [
  //     {
  //         value: "ethereum",
  //         label: "Ethereum",
  //         icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022",
  //     },
  //     {
  //         value: "polygon",
  //         label: "Polygon",
  //         icon: "https://cryptologos.cc/logos/polygon-matic-logo.png?v=022",
  //     },
  //     {
  //         value: "bsc",
  //         label: "Binance Smart Chain",
  //         icon: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=022",
  //     },
  // ];

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Toggle */}
      <button
        className={`w-full px-4 py-4 text-left bg-[#f3f3f3] border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none flex items-center justify-center ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption !== placeholder ? (
          <div className="flex items-center">
            {/* Display selected option image */}
            <Image
              src={
                options.find((option) => option.name === selectedOption)
                  ?.image || ""
              }
              alt={selectedOption || "default"}
              className="w-6 h-6 mr-2"
              width={24}
              height={24}
            />
            {selectedOption}
          </div>
        ) : (
          <span className="text-center w-full">{selectedOption}</span>
        )}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-3xl shadow-lg mt-2 z-10 max-h-72 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className="px-4 py-3 flex items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedOption(option.name);
                setIsOpen(false);
                setGlobalState(option.name);

                if (option.address) {
                  const updatedTokenAddress = [...tokenAddress];

                  if (state === "selectedToken") {
                    updatedTokenAddress[0] = option.address;
                    // updatedTokenAddress[2] = option.symbol;
                  } else if (state === "selectedCollateralToken") {
                    updatedTokenAddress[1] = option.address;
                  }

                  setTokenAddress(updatedTokenAddress);
                }

              }}
            >
              <Image
                src={option.image}
                alt={option.name}
                className="w-6 h-6 mr-2"
                width={24}
                height={24}
              />
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
