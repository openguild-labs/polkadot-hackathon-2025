"use client";


import React from "react";

const WhyChoose = () => {
  const reasons = [
    {
      icon: "/assets/images/home/ic_support.png",
      label: "Flexibility",
      desc: "Insurance contracts are activated under all market conditions, including price increases and decreases",
    },
    {
      icon: "/assets/images/home/ic_explicit.png",
      label: "Transparency",
      desc: "Publicly disclosing contract statistics and transparently showcasing Hakifi's reserve fund",
    },
    {
      icon: "/assets/images/home/ic_services.png",
      label: "Zero Fee",
      desc:"There are no extra charges incurred from contract opening to expiration.",
    },
    {
      icon: "/assets/images/home/ic_security.png",
      label:"Inclusivity",
      desc: "Utilize Cover-to-Earn with CoFu to manage spot asset and derivative positions risk, and to earn returns.",
    },
  ];


  return (
    <section className="w-full">
      <div className="">
        <div className="flex flex-col sm:items-center mb-12 sm:mb-[50px] gap-y-2  w-full text-center">
          <p className="lg:text-base text-xs font-saira text-typo-secondary">
          Why you should
          </p>
          <p className="text-typo-primary font-determination uppercase lg:text-5xl text-3xl font-semibold">
          Choose <span className="text-typo-accent">Hakifi</span>
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 lg:gap-y-10 gap-y-4 gap-x-4 sm:gap-6">
          {reasons.map((reason, i) => (
            <div
              key={i}
              className="flex flex-col border border-t-8 rounded-[4px] border-background-primary lg:space-y-6 space-y-3 sm:px-4 lg:p-5 p-4 box-shadow box-radius bg-transparent lg:w-full w-[320px] mx-auto"
            >
              <div className="flex items-center justify-between space-x-5">
                <span className="text-xl font-bold text-typo-accent text- break-words font-determination uppercase">
                  {reason.label}
                </span>
                <div className="lg:w-[90px] lg:h-[90px] w-16 h-16 bg-light-2 flex items-center justify-center">
                  <img
                    className="lg:w-[90px] lg:h-[90px] h-16 w-16"
                    src={reason.icon}
                    alt=""
                  />
                </div>
              </div>
              <span
                title={reason.desc}
                className="text-sm mb-auto font-medium text-typo-primary font-saira"
              >
                {reason.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
