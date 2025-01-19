import { assetService } from "@/service";

export const createAsset = async (
   nftId: string,
   startAt: string,
   endAt: string,
   userId: string,
   image: string,
   type: string
) => {
   const newAsset = await assetService.createNewAsset({nftId, startAt, endAt, userId, image, type});

   return newAsset;
};
