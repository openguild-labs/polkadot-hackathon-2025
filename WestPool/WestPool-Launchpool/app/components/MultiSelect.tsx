import { useEffect, useRef, useState } from "react";
import { useProjectDetailStore } from "../zustand/store";

interface MultiSelectProps {
  options: {
    id: string;
    name: string;
  }[];
  placeholder?: string;
  state: string;
}

const MultiSelect = ({
  options,
  placeholder = "Select options",
  state,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const setGlobalState = useProjectDetailStore((store) => {
    const setterName = `set${state.charAt(0).toUpperCase()}${state.slice(1)}`;
    return (
      (store as any)[setterName] ||
      (() => console.error(`Setter ${setterName} is not defined.`))
    );
  });

  const toggleOption = (optionName: string) => {
    const updatedOptions = selectedOptions.includes(optionName)
      ? selectedOptions.filter((item) => item !== optionName)
      : [...selectedOptions, optionName];

    setSelectedOptions(updatedOptions);
    setGlobalState(updatedOptions);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle */}
      <button
        className="w-full px-4 py-4 text-left bg-[#f3f3f3] border border-gray-300 rounded-3xl focus:ring-2 focus:ring-[#2a5697] focus:outline-none flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option, index) => (
              <span
                key={index}
                className="bg-[#2a5697] text-white px-3 py-1 rounded-full text-sm"
              >
                {option}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-3xl shadow-lg mt-2 z-10 max-h-72 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              className={`px-4 py-3 flex items-center hover:bg-gray-100 cursor-pointer ${selectedOptions.includes(option.name) ? "bg-gray-200" : ""
                }`}
              onClick={() => toggleOption(option.name)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.name)}
                readOnly
                className="checkbox"
              />
              <span className="ml-5">{option.name} Pool</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;