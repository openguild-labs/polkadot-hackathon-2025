
import axios from "axios";
import { signAndConfirmTransactionFe } from "./ultilityFunc";

const callback = (signature, result) => {
   console.log("Signature ", signature);
   console.log("result ", result);
   if (signature.err === null) {
      setMinted(saveMinted);
      setStatus("success: Successfully Signed and Minted.");
   }
};

export const mintNow = (
   network,
   publicKey,
   name,
   desc,
   file,
   type,
   supply
) => {

   let formData = new FormData();
   formData.append("network", network);
   formData.append("wallet", publicKey);
   formData.append("name", name);
   formData.append("symbol", "Solana NFT");
   formData.append("description", desc);
   formData.append(
      "attributes",
      JSON.stringify([{ trait_type: "edification", value: "100" , type : type, supply: supply}]),
   );
   formData.append("external_url", "");
   formData.append("max_supply", "0");
   formData.append("royalty", "5");
   formData.append("file", file);

   axios({
      // Endpoint to send files
      url: "https://api.shyft.to/sol/v1/nft/create_detach",
      method: "POST",
      headers: {
         "Content-Type": "multipart/form-data",
         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
         Accept: "*/*",
         "Access-Control-Allow-Origin": "*",
      },

      // Attaching the form data
      data: formData,
   })
      // Handle the response from backend here
      .then(async (res) => {
         console.log(res);
         if (res.data.success === true) {
            const transaction = res.data.result.encoded_transaction;
            console.log("mint", res.data.result.mint);
            const ret_result = await signAndConfirmTransactionFe(
               network,
               transaction,
               callback,
            );
            console.log(ret_result);
            console.log("data", res.data);
         }
      })

      // Catch errors if any
      .catch((err) => {
         console.warn(err);
      });

};
