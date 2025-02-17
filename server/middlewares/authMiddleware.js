import { clerkClient } from "@clerk/express";

//middleware - protects educator rights
export const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)

        if(response.publicMetadata.role !== "eductator"){
            return res.json({success:false, message:"unauthorized access"})
        }
        next()
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}