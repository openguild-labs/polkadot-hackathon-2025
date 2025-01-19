"use client";
import React, { useState } from "react";
import AIConsultancy from "@/role/AIConsultancy/AIConsultancy";
function AISupport() {
   const [inputPrompt, setInputPrompt] = useState("");
   const [isGenerating, setIsGenerating] = useState(false);

   const handleGenerate = async () => {
      if (inputPrompt.trim() !== "") {
         try {
            setIsGenerating(true);
            const consultancy = await AIConsultancy(inputPrompt);
            console.log(consultancy);

            const AIText = document.querySelector("#AIResponse");
            if (AIText) {
               AIText.innerHTML = consultancy;
            } else {
               console.error("AI Text Container not found");
            }
         } catch (error) {
            console.error("Error generating text:", error);
         } finally {
            setIsGenerating(false);
         }
      }
   };

   return (
      <div
         id="AIConsultancy"
         className=" w-full justify-center items-center flex flex-col gap-10 border-x-4 border-[#F7F7F9] z-30 text-white px-10 py-5"
      >
         <div className=" w-full flex-col flex gap-2 text-white">
            <p className=" text-4xl font-semibold">AI Consultancy</p>
            <p className=" text-sm text-fuchsia-600">
               With AI, You will have your questions about NFT Marketplace answered and it
               will advise you on everything.
            </p>
         </div>
         <div className="rounded-lg border bg-[#142120] text-card-foreground shadow-sm w-full p-5 mx-auto md:max-w-lg justify-center items-center flex-col flex">
            <div className=" w-full p-6 pt-0 flex flex-row space-x-2 relative">
               <input
                  className=" w-[70%] px-2 bg-transparent border-[1px] border-white rounded-lg placeholder:text-gray-300"
                  type="text"
                  placeholder="What do you need?"
                  value={inputPrompt}
                  onChange={(event) => setInputPrompt(event.target.value)}
                  required
               />
               <button
                  className={` ${isGenerating ? "bg-gray-400 cursor-not-allowed" : ""} cursor-pointer hover:bg-[#2C282F] text-white whitespace-nowrap inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[30%]`}
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="radix-:Rl6ula:"
                  data-state="closed"
                  onClick={() => handleGenerate()}
               >
                  Send Messages
               </button>
            </div>
            <div className=" w-full flex justify-start items-center flex-col gap-2">
               <p>Answer the Questions:</p>
               <article className=" w-full min-h-[20vh] break-words bg-transparent border-[1px] border-white rounded-lg placeholder:text-gray-300 p-2">
                  <p id="AIResponse"></p>
               </article>
            </div>
         </div>
      </div>
   );
}

export default AISupport;
