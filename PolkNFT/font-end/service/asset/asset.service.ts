import API from "../config";

interface createAssetDto {
   nftId: string;
   startAt: string;
   endAt: string;
   userId: string;
   image: string;
   type: string;
}

interface updateAssetDto {
   startAt: string;
   endAt: string;
   listPrice: number;
   userId: string;
}

export class AssetService {
   async getAllOwnAsset(userId: string) {
      try {
         const response = await fetch(
            `http://localhost:3005/api/v1/asset/${userId}`,
         );
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         return data;
      } catch (err) {
         console.log(err);
      }
   }

   async getAllAsset() {
      try {
         const response = await fetch(
            "http://localhost:3005/api/v1/asset",
         );
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         return data;
      } catch (err) {
         console.log(err);
      }
   }

   async updateAsset(id: string, data: updateAssetDto) {
      try {
         const res = await fetch(`http://localhost:3005/api/v1/asset/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         const result = await res.json();

         if (res.ok) {
            return result;
         } else {
            console.log("Bug!");
         }
      } catch (error) {
         console.log(error);
      }
   }

   async createNewAsset(data: createAssetDto) {
      try {
         const res = await fetch("http://localhost:3005/api/v1/asset/newAsset", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         });

         const result = await res.json();

         if (res.ok) {
            return res;
         } else {
            console.log("Bug!");
         }
      } catch (error) {
         console.log(error);
      }
   }

   async removeAsset(id: string) {
      try {
         const res = await fetch(`http://localhost:3005/api/v1/asset/${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
         });

         const result = await res.json();

         if (res.ok) {
            return res;
         } else {
            console.log("Bug!");
         }
      } catch (error) {
         console.log(error);
      }
   }
}

const assetService = new AssetService();

export { assetService };
