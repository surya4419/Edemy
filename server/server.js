import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import morgan from "morgan";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Initialize Express
const app = express();

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    await connectCloudinary();

    // Middleware
    app.use(cors());
    app.use(morgan("dev"));
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(clerkMiddleware());

    // Verify Clerk webhook secret middleware
    app.use("/clerk", (req, res, next) => {
      if (!process.env.CLERK_WEBHOOK_SECRET) {
        return res.status(500).json({ error: "CLERK_WEBHOOK_SECRET not configured" });
      }
      next();
    });

    // Log all incoming requests
    app.use((req, res, next) => {
      console.log(`Incoming request: ${req.method} ${req.path}`);
      next();
    });

    // Routes
    app.get("/", (req, res) => res.send("API Working"));
    app.post("/clerk", clerkWebhooks);
    app.use("/api/educator", express.json(), educatorRouter);
    app.use("/api/course",express.json(), courseRouter)
    app.use("/api/user",express.json(), userRouter)


    // Port configuration
    const PORT = process.env.PORT || 5000;
    
    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit process with failure
  }
};

// Start the server
startServer();
 