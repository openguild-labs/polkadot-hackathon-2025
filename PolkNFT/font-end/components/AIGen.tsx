"use client";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import CardMedia from "@mui/material/CardMedia";
import NFTGeneration from "@/role/AIGeneration/AIGeneration";

const style = {
   position: "absolute" as "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 400,
   bgcolor: "#dedbc2",
   border: "2px solid #000",
   boxShadow: 24,
   p: 4,
};

function AIGen() {
   const [open, setOpen] = useState(false);
   const [imgSelected, setImgSelected] = useState("");
   const [inputPrompt, setInputPrompt] = useState("");
   const [AIUrls, setAIUrls] = useState<string[]>([]);
   const [isGenerating, setIsGenerating] = useState(false);

   const openClick = (e: string) => {
      setImgSelected(e);
      setOpen(true);
   };

   const imageList = [
      "./images/bannerIMG/PAP.png",
      "./images/bannerIMG/darkMonkey.png",
      "./images/bannerIMG/102-EVOL-Chux.png",
   ];

   const handleGenerate = async () => {
      if (inputPrompt.trim() !== "") {
         try {
            setIsGenerating(true);
            const urls = await NFTGeneration(inputPrompt);
            setAIUrls(urls);
         } catch (error) {
            console.error("Error generating image:", error);
         } finally {
            setIsGenerating(false);
         }
      }
   };

   return (
      <div
         id="ImgGen"
         className=" w-full z-30 flex flex-col gap-5 justify-center items-center text-white px-10 py-5 border-x-4 border-[#F7F7F9]"
      >
         <div className=" w-full gap-2 flex-col flex ">
            <p className=" text-4xl font-semibold">AI IMG Generation</p>
            <p className=" text-fuchsia-600">
               Create{" "}
               <span className=" text-white bg-gradient-to-r from-[#BE409E] to-[#1B8D87] rounded-lg p-1">
                  Powerful
               </span>{" "}
               AI Art or Image in seconds
            </p>
         </div>
         <div className=" w-full justify-center items-center flex gap-5">
            <input
               className=" w-[60%] p-5 rounded-xl bg-slate-900 shadow-inner shadow-violet-500 "
               placeholder="What do you want to generate?"
               onChange={(event) => setInputPrompt(event.target.value)}
               value={inputPrompt}
            />
            <button
               onClick={() => handleGenerate()}
               className={` ${
                  isGenerating ? "bg-gray-400 cursor-not-allowed" : ""
               } p-5 bg-[#DF5C16] rounded-xl`}
            >
               Generate
            </button>
         </div>
         <div className=" flex gap-5">
            {imageList.concat(AIUrls).map((e, index) => (
               <div key={index}>
                  <div
                     onClick={() => openClick(e)}
                     className=" w-[10vw] h-[20vh] border-2 border-green-400 rounded-lg cursor-pointer"
                     key={index}
                  >
                     <img
                        className=" h-full w-full rounded-lg object-cover"
                        src={e}
                        alt=""
                     />
                  </div>
                  <Modal open={open == true} onClose={() => setOpen(false)}>
                     <Box sx={style}>
                        <Card sx={{ maxWidth: 345 }}>
                           <CardMedia
                              component="img"
                              height="194"
                              image={imgSelected}
                              alt="Paella dish"
                           />
                        </Card>
                        <Box
                           sx={{
                              position: "absolute" as "absolute",
                              top: "10%",
                              right: "10%",
                              width: 30,
                              height: 30,
                              borderRadius: 1,
                              justifyContent: "center",
                              alignItems: "center",
                              display: "flex",
                           }}
                        >
                           <Box
                              sx={{
                                 position: "absolute" as "absolute",
                                 top: "10%",
                                 right: "10%",
                                 width: 20,
                                 height: 20,
                                 borderRadius: 1,
                                 justifyContent: "center",
                                 alignItems: "center",
                                 display: "flex",
                              }}
                           >
                              <a href={imgSelected} download>
                                 <img src="./images/icons/download.png" alt="Download" />
                              </a>
                           </Box>
                        </Box>
                     </Box>
                  </Modal>
               </div>
            ))}
         </div>
      </div>
   );
}

export default AIGen;
