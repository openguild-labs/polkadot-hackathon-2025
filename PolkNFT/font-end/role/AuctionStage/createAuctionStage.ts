import { auctionService } from "@/service";

export const mintNFT = async(name: string,  wallet: any, connected: boolean, img?: string, type?: string, description?: string) => {
   
   if (!connected) {
      alert("Please connect wallet!");
   } else {
   //    const usedAddress = await wallet.getUsedAddresses();
   //    const address = usedAddress[0];

   //    // create forgingScript
   //    const forgingScript = ForgeScript.withOneSignature(address);

   //    const assetMetadata: AssetMetadata = {
   //       name: name,
   //       image: img || "https://shorturl.at/9tFJR", // Shortened CID
   //       mediaType: `image/${type || "jpg"}`,
   //       description: description,
   //   };

   //    const asset: Mint = {
   //       assetName: name,
   //       assetQuantity: "1",
   //       metadata: assetMetadata,
   //       label: "721",
   //       recipient: address,
   //    };

   //    const tx = new Transaction({ initiator: wallet });
   //    tx.mintAsset(forgingScript, asset);

   //    const unsignedTx = await tx.build();
   //    const signedTx = await wallet.signTx(unsignedTx);
   //    const txHash = await wallet.submitTx(signedTx);

      // return txHash
   }
};
