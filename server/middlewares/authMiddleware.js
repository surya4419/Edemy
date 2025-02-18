import { clerkClient } from "@clerk/express";

//middleware - protects educator rights
export const protectEducator = async (req, res, next) => {
    try {
        // Verify Authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized - Missing token" });
        }

        const userId = req.auth.userId;
        const response = await clerkClient.users.getUser(userId);

        if(response.publicMetadata.role !== "educator"){
            return res.status(403).json({success:false, message:"unauthorized access"});
        }
        next();
    } catch (error) {
        res.status(500).json({success:false, message: error.message});
    }
}
