import { signAndConfirmTransactionFe } from "../createNFT/ultilityFunc";

const callback = (signature, result) => {
   console.log("Signature ", signature);
   console.log("result ", result);
};

export const repayment = (network, lender, borrower, stakeSOL) => {
   const axios = require("axios");

   let data = JSON.stringify({
      network: "devnet",
      from_address: lender,
      to_address: borrower,
      amount: stakeSOL
   });

   let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.shyft.to/sol/v1/wallet/send_sol",
      headers: {
         "Content-Type": "application/json",
         "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
      },
      data: data,
   };

   axios
      .request(config)
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
      .catch((error) => {
         console.log(error);
      });
};
