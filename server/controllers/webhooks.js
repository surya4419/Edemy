import { Webhook } from "svix"; 
import User from "../models/User.js";
import mongoose from "mongoose";

// Api controller function to clerk user with database
export const clerkWebhooks = async (req, res) => {
    try {
        // Verify webhook signature
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Verify MongoDB connection
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection not ready");
        }


        const { data, type } = req.body;

        if (!data || !type) {
            throw new Error("Invalid webhook payload");
        }

        switch (type) {
            case "user.created": {
                // Validate required fields
                if (!data.id || !data.email_addresses?.[0]?.email_address) {
                    throw new Error("Missing required user fields");
                }

                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    imageUrl: data.image_url || ''
                };

                const createdUser = await User.create(userData);
                console.log(`User created: ${createdUser._id}`);
                res.status(201).json({ success: true, userId: createdUser._id });
                break;
            }


            case "user.updated": {
                if (!data.id) {
                    throw new Error("Missing user ID for update");
                }

                const userData = {
                    email: data.email_addresses?.[0]?.email_address || '',
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    imageUrl: data.image_url || ''
                };

                const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
                if (!updatedUser) {
                    throw new Error(`User not found: ${data.id}`);
                }
                console.log(`User updated: ${updatedUser._id}`);
                res.json({ success: true, userId: updatedUser._id });
                break;
            }


            case "user.deleted": {
                if (!data.id) {
                    throw new Error("Missing user ID for deletion");
                }

                const deletedUser = await User.findByIdAndDelete(data.id);
                if (!deletedUser) {
                    throw new Error(`User not found: ${data.id}`);
                }
                console.log(`User deleted: ${deletedUser._id}`);
                res.json({ success: true, userId: deletedUser._id });
                break;
            }

            default:
                console.log(`Unhandled webhook event type: ${type}`);
                res.status(200).json({ success: true, message: "Event type not handled" });
                break;
        }
    } catch (err) {
        console.error("Webhook error:", err);
        res.status(500).json({
            success: false,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}
