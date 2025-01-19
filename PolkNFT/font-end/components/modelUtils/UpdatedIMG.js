import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function UpdatedIMG({ name }) {
   const [url, setUrl] = useState("");
   const [isUpload, setUpload] = useState(false);
   const [img, setImg] = useState("");
   const [addressWallet, setAddressWallet] = useState(
      "J5HxijcGXuzj9K7ynxenKjrUeekDewy7HYW3q3jx5mci",
   );

   const updateURL = async (e) => {
      setUrl(URL.createObjectURL(e.target.files[0]));
      setUpload(true);
   };

   //    async function fetchData(walletAddress) {
   //       try {
   //         const config = {
   //           method: "get",
   //           maxBodyLength: Infinity,
   //           url: `http://localhost:3000/api/user?walletAddress=${walletAddress}`,
   //           headers: {}
   //         };

   //         const response = await axios.request(config);
   //         return response.data;
   //       } catch (error) {
   //         throw error;
   //       }
   //    }

   //    useEffect(() => {
   //       fetchData(walletAddress)
   //          .then((data) => {
   //             if (name === "Background") {
   //                console.log(data[0].bgImg);
   //                if (data[0].bgImg !== undefined){
   //                   setImg(data[0].bgImg);
   //                   setUpload(true);
   //                }
   //             } else {
   //                if (data[0].avtImg !== undefined){
   //                   setImg(data[0].avtImg);
   //                   setUpload(true);
   //                }
   //             }
   //          })
   //          .catch((error) => {
   //             console.error(error);
   //   });
   //    console.log(isUpload);
   //    },[])

   //    async function updateData(walletAddress, dataToUpdate) {
   //       try {
   //           const config = {
   //               method: "put",
   //               maxBodyLength: Infinity,
   //               url: `http://localhost:3000/api/user`,
   //               headers: {},
   //               data: JSON.stringify({
   //                   walletAddress,
   //                   ...dataToUpdate // Spread the dataToUpdate object to include either bgImg or avtImg
   //               })
   //           };

   //           const response = await axios.request(config);
   //           return response.data;
   //       } catch (error) {
   //           throw error;
   //       }
   //   }

   //    const updateImg = (e) => {
   //       if(name == "Background") {
   //          const urlImg = "example url"; // modify url image here
   //          setImg(urlImg);
   //          setUpload(true);
   //          updateData(walletAddress,{ bgImg: urlImg});

   //       } else {
   //          const urlImg = "https://www.jquery-az.com/html/images/banana.jpg"; // modify url image here
   //          setImg(urlImg);
   //          setUpload(true);
   //          updateData(walletAddress,{avtImg: urlImg});

   //       }

   //    };

   return (
      <>
         {/* {isUpload == false ? (
            <div
               className={` ${name == "Background" ? "w-full h-[80%]" : "rounded-lg border-[5px] border-[#2FAEAC] w-[20%] max-lg:w-[25%] max-md:w-[35%] max-sm:w-[50%] h-full"} flex flex-col gap-2 bg-gray-800  justify-center items-center`}
            >
               <div className=" w-full justify-center flex items-center">
                  <input
                     onChange={(e) => updateURL(e)}
                     type="file"
                     className={` ${name == "Background" ? "w-[10%]" : "w-[80%]"} text-white`}
                  ></input>
               </div>
               <svg
                  height="32"
                  viewBox="0 0 24 24"
                  width="32"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     className=" text-white fill-white"
                     d="m20 6.52897986v12.97202254c0 1.3807119-1.1192881 2.5-2.5 2.5h-11c-1.38071187 0-2.5-1.1192881-2.5-2.5v-15.00000002c0-1.38071188 1.11928813-2.5 2.5-2.5h8.9720225c.1327463-.00841947.2709238.03583949.3815309.14644661l4 4c.1106071.11060712.1548661.24878464.1464466.38153087zm-5-3.52797748h-8.5c-.82842712 0-1.5.67157287-1.5 1.5v15.00000002c0 .8284271.67157288 1.5 1.5 1.5h11c.8284271 0 1.5-.6715729 1.5-1.5v-12.50000002h-3.5c-.2761424 0-.5-.22385763-.5-.5zm1 .70710678v2.29289322h2.2928932zm-4 6.99899764v6.7928932c0 .2761424-.2238576.5-.5.5s-.5-.2238576-.5-.5v-6.7928932l-2.14644661 2.1464466c-.19526215.1952621-.51184463.1952621-.70710678 0-.19526215-.1952622-.19526215-.5118446 0-.7071068l2.99999999-2.99999999c.1952622-.19526215.5118446-.19526215.7071068 0l3 2.99999999c.1952621.1952622.1952621.5118446 0 .7071068-.1952622.1952621-.5118446.1952621-.7071068 0z"
                  />
               </svg>
            </div>
         ) : (
            <>
               {name == "Background" && img ? (
                  <img
                     src={img}
                     alt=""
                     className="w-full h-[90%] bg-no-repeat bg-center object-cover"
                  />
               ) : (
                  <div className="w-[20%] max-lg:w-[30%] max-md:w-[40%] max-sm:w-[50%] h-full rounded-lg border-[5px] border-[#2FAEAC]">
                     <img
                        src={"https://ivory-necessary-cougar-154.mypinata.cloud/ipfs/QmXpH4idDQ1oq1qAz32YXMU8d4hwFCtEaWhM2gjqXgf6oG"}
                        alt=""
                        className={`${name == "Background" ? "w-full h-full bg-no-repeat bg-center object-cover" : "object-cover h-full w-full rounded-sm"}`}
                     />
                  </div>
               )}
            </>
         )} */}
         {name == "Background" ? (
            <img
               src={"../../images/bannerIMG/background.gif"}
               alt=""
               className="w-full h-[90%] bg-no-repeat bg-center object-cover"
            />
         ) : (
            <div className="w-[20%] max-lg:w-[30%] max-md:w-[40%] max-sm:w-[50%] h-full rounded-lg border-[5px] border-[#2FAEAC]">
               <img
                  src={"../../images/bannerIMG/avartar.jpg"}
                  alt="avatar"
                  className={`${name == "Background" ? "w-full h-full bg-no-repeat bg-center object-cover" : "object-cover h-full w-full rounded-sm"}`}
               />
            </div>
         )}
      </>
   );
}

export default UpdatedIMG;
