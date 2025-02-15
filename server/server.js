import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./configs/mongodb.js"
import { clerkWebhooks } from "./controllers/webhooks.js"
import morgan from "morgan"

// Initialize Express
const app = express()

// Connect to database
;(async () => {
  await connectDB()
})()


// Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Verify Clerk webhook secret middleware
app.use("/clerk", (req, res, next) => {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
        return res.status(500).json({ 
            error: "CLERK_WEBHOOK_SECRET not configured" 
        })
    }
    next()
})

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`)
    next()
})

// Routes
app.get("/", (req, res) => res.send("API Working"))
app.post("/clerk", clerkWebhooks)

// Port configuration
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
