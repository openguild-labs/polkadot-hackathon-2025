import { useState } from 'react';
import { GoPlus } from 'react-icons/go';

export default function Faq() {
  const [openAccordion, setOpenAccordion] = useState<number>(-1);

  const faqData = [
    {
      question: "What is Bifrost Bridge about?",
      answer: "Bifrost is a decentralized aggregation layer that enables seamless cross-chain transactions with enhanced security and privacy.",
    },
    {
      question: "How does Bifrost ensure security?",
      answer: "Bifrost employs cutting-edge FROST signature scheme and powerful slashing mechanics, which ensure decentralized authority and punish malicious actors.",
    },
    {
      question: "What is the FROST Algorithm?",
      answer: "The FROST Algorithm is a cutting-edge technology used by Bifrost to ensure decentralized authority and provide the fastest transaction speeds in the market.",
    },
    {
      question: "How does Bifrost handle liquidity?",
      answer: 'Bifrost relies on "LOCK AND MINT" and atomic swaps as its primary bridging techniques. Additionally, it incentivizes users to rebalance liquidity through lower fees.',
    },
    {
      question: "What are dark pools?",
      answer: "Dark pools in Bifrost protect transaction data even from the platform itself, ensuring maximum privacy.",
    },
  ];

  return (
    <div className="Faqbg text-white w-full overflow-hidden h-screen flex justify-center items-center " id="faq">
      <div className="md:mb-20 sm:mb-20  w-4/6 md:w-11/12 sm:w-11/12 h-full pt-52 space-x-24 md:space-x-0 sm:space-x-0 md:space-y-3 sm:space-y-3 flex md:flex-col sm:flex-col justify-between">
        <div className="w-3/5 md:w-4/5 sm:w-4/5">
          <div className="flex flex-col space-y-4">
            <div className="text-3xl font-extrabold text-gray-100">Frequently Asked Questions</div>
            <div className="text-gray-300">
              Have a question that is not answered? You can contact us at hello@Bifrost.io
            </div>
          </div>
        </div>
        <div className="w-full">
          {faqData.map((faq, index) => (
            <div key={index} className="w-full">
              <div
                className="border p-3 border-opacity-60 rounded-md glassmorphicFAQ flex items-center justify-between cursor-pointer"
                onClick={() => setOpenAccordion(openAccordion === index ? -1 : index)}
              >
                {faq.question} <GoPlus className="text-3xl" />
              </div>
              <div
                className={`overflow-hidden transition-all p-3 glassmorphicFAQ duration-300 ease-in-out z-50 ${
                  openAccordion === index ? 'opacity-100 my-3 max-h-screen' : 'max-h-0 opacity-0'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
