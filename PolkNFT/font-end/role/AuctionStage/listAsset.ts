import { assetService } from "@/service";
import { TAsset } from "@/types/user.type";

export const listAsset = async (wallet: any, asset: TAsset, price: number) => {
   // const tx = new Transaction({ initiator: wallet });
   // tx.setMetadata(674, {
   //    msg: [`You are bidding ${price} for nft ${asset.nftId.substring(0, 4)}...${asset.nftId.substring(asset.nftId.length - 5)}`],
   // });

   // const unsignedTx = await tx.build();
   // const signedTx = await wallet.signTx(unsignedTx);
   // const txHash = await wallet.submitTx(signedTx);

   const updateOwnership = await assetService.updateAsset(asset.id, {
      startAt: asset.startAt,
      endAt: asset.endAt,
      listPrice: price,
      userId: asset.userId,
   });
};
