import { signAndConfirmTransactionFe } from "../createNFT/ultilityFunc";

const callback = (signature, result) => {
   console.log("Signature ", signature);
   console.log("result ", result);
};

export const cancelLend = (network, listState, lender) => {
    const axios = require("axios");

      let data = JSON.stringify({
      "network": network,
      "marketplace_address": process.env.NEXT_PUBLIC_ADDRESS_VAULT,
      "list_state": listState,
      "seller_wallet": lender,
      "fee_payer": lender
      });

         let config = {
         method: "post",
         maxBodyLength: Infinity,
         url: process.env.NEXT_PUBLIC_VAULT_CANCEL_LEND,
         headers: { 
            "Content-Type": "application/json", 
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY
         },
         data : data
         };

         axios.request(config)
            .then(async(res) => {
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

}
