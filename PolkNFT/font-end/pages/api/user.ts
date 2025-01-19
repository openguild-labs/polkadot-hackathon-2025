import { NextApiRequest, NextApiResponse } from "next";
import User from "../../(models)/user";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { walletAddress } = req.query;

            // Implement logic to fetch users or specific user data
            const users = await User.find({ walletAddress }); // Example: Fetch all users

            return res.status(200).json(users);
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Error", error });
        }
    } else if (req.method === "POST") {
        try {
            const { walletAddress, ...userData } = req.body;

            // Check if the user with the given walletAddress already exists
            const existingUser = await User.findOne({ walletAddress });

            // If the user already exists, do nothing
            if (existingUser) {
                return res.status(200).json({ message: "User already exists", user: existingUser });
            }

            // If the user does not exist, create a new user with the provided walletAddress and userData
            await User.create({ walletAddress, ...userData });

            return res.status(201).json({ message: "User created" });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Error", error });
        }
    } else if (req.method === "PUT") {
        try {
            const data = JSON.parse(Object.keys(req.body)[0])
            const { walletAddress, ...userData } = data;
            console.log(data);
            if (!walletAddress) {
                return res.status(400).json({ message: "Wallet address is required" });
            }

            // Build update object
            const updateData = { $set: userData };

            // Find the user by ID and update its data
            const updatedUser = await User.findOneAndUpdate({walletAddress}, updateData, { new: true });

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({ message: "User updated", user: updatedUser });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Error", error });}
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}