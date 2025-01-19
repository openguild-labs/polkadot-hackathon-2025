import React from "react";

interface ProgressBarProps {
  steps: { name: string }[];
  currentStep: number;
}

const VerticalProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative flex flex-col items-start mx-auto">
      {/* Full Background Line */}
      <div className="absolute top-4 bottom-4 left-[14px] w-1 bg-gray-300"></div>
      
      {/* Gradient Progress Line */}
      <div
        className="absolute left-[14px] w-1 bg-gradient-to-b from-[#82B2FA] via-blue-400 to-[#FB418D]"
        style={{
          height: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
      ></div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div key={index} className="relative flex items-center mb-8 last:mb-0">
          {/* Circle */}
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full z-10 ${
              index < currentStep
                ? "bg-[#82B2FA]"
                : index === currentStep
                ? "bg-[#FB418D]"
                : "bg-gray-300"
            }`}
          ></div>

          {/* Step Name */}
          <div className="ml-6 text-white font-medium">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

export default VerticalProgressBar;
