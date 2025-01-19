import { signAndConfirmTransactionFe } from "../createNFT/ultilityFunc";

const callback = (signature, result) => {
   console.log("Signature ", signature);
   console.log("result ", result);
};

export const updateBorrowNFT= (network, authority_address, borrower, nft_address, price, expiration) => {
    const axios = require("axios");

    let formData = new FormData();
    formData.append("network", "devnet");
    formData.append("update_authority_address", authority_address);
    formData.append("token_address", nft_address);
    formData.append("attributes", `[{ "trait_type": "edification", "value": "100" , "vault_address": "${process.env.NEXT_PUBLIC_ADDRESS_VAULT}", "price": "${price}", "expiration": "${expiration}", "lender": "${authority_address}", "borrower": "${borrower}"}]`);

    axios.request(
        {
            // Endpoint to send files
            url: "https://api.shyft.to/sol/v2/nft/update",
            method: "POST",
            headers: {
               "Content-Type": "multipart/form-data",
               "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
               Accept: "*/*",
               "Access-Control-Allow-Origin": "*",
            },
      
            // Attaching the form data
            data: formData,
         }
    )
    .then(async(res) => {
        if (res.data.success === true) {
            const transaction = res.data.result.encoded_transaction;
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

export const updateRevertNFT = (authority_address, nft_address) => {
    const axios = require("axios");

    const FormData = require("form-data");
    let data = new FormData();
    data.append("network", "devnet");
    data.append("update_authority_address", authority_address);
    data.append("token_address", nft_address);
    data.append("symbol", "Reverted");

    let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.shyft.to/sol/v2/nft/update",
    headers: { 
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY, 
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
    console.log( JSON.stringify(response.data));
    })
    .catch((error) => {
    console.log(error);
    });

}