import { assetService } from "@/service";
import { TAsset } from "@/types/user.type";

export const claimAsset = async (
   wallet: any,
   asset: TAsset,
) => {
   //  const tx = new Transaction({ initiator: wallet });
   //  const address = (await wallet.getUsedAddresses())[0];
   //  tx.setMetadata(674, {
   //     msg: [
   //        `You are claim nft ${asset.nftId.substring(0, 4)}...${asset.nftId.substring(asset.nftId.length - 5)}`,
   //     ],
   //  });
 
   //  const unsignedTx = await tx.build();
   //  const signedTx = await wallet.signTx(unsignedTx);
   //  const txHash = await wallet.submitTx(signedTx);

   //  if (txHash.length > 0) {
   //      const updateOwnership = await assetService.updateAsset(asset.id, {
   //         startAt: asset.startAt,
   //         endAt: asset.endAt,
   //         listPrice: 0,
   //         userId: asset.userId,
   //      });
   //   }
};
