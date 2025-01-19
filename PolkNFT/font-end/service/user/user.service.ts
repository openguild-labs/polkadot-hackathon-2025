import API from "../config";

interface CreateUserDto {
   name: string;
   avatar: string;
}

interface updateProfile {
   marketId: string;
}

export class UserService {
   async getProfile(userId: string) {
      try {
         const response = await fetch(
            `http://localhost:3005/api/v1/user/${userId}/profile`,
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

   async getProfileByName(name: string) {
      try {
         const response = await fetch(
            `http://localhost:3005/api/v1/user/${name}/profileByName`,
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

   async updateProfile(userId: string, data: updateProfile) {
      try {
         const res = await fetch(`http://localhost:3005/api/v1/user/${userId}/profile`, {
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

   async createNewUser(data: CreateUserDto) {
      try {
         const res = await fetch("http://localhost:3005/api/v1/user/profile", {
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

   async getAllUser() {
      try {
         const response = await fetch("http://localhost:3005/api/v1/user");
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }
         const data = await response.json();
         return data;
      } catch (err) {
         console.log(err);
      }
   }
}

const userService = new UserService();

export { userService };
