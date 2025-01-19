import { NextApiRequest, NextApiResponse } from "next";
import User from "../../(models)/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { walletAddress, lendingGrantId } = req.body;

            const updatedUser = await User.findOneAndUpdate(
                { walletAddress: walletAddress }, // Query to find the user by walletAddress
                { $push: { lendingGrantId: lendingGrantId } }, // Push the lending grant ID to the array
                { new: true } // Return the updated document
            );

            // If user is not found
            if (!updatedUser) {
                console.log("User not found");
                return null;
            }

            // User found and lending grant ID pushed successfully

            return res.status(200).json({ user: updatedUser });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Error", error });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}