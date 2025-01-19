import API from "../config";

interface createAutionMarketDto {
   name: string;
   image: string;
   userId: string;
}

export class AuctionService {
   async getOtherAuction(userId: string) {
      try {
         const response = await fetch(
            `http://localhost:3005/api/v1/auction-market/${userId}/findOtherMarket`,
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

   async getDeatail(userId: string) {
      try {
         const response = await fetch(
            `http://localhost:3005/api/v1/auction-market/${userId}`,
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

   async updateAuction(id: string, data: createAutionMarketDto) {
      try {
         const res = await fetch(`http://localhost:3005/api/v1/auction-market/${id}`, {
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

   async createNewAuction(data: createAutionMarketDto) {
      try {
         const res = await fetch("http://localhost:3005/api/v1/auction-market/newMarket", {
            method: "POST",
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

   async removeAuction(id: string) {


      try {
         const res = await fetch(`http://localhost:3005/api/v1/auction-market/${id}`, {
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

const auctionService = new AuctionService();

export { auctionService };
