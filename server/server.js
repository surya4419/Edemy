import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./configs/mongodb.js"
import { clerkWebhooks } from "./controllers/webhooks.js"

//initialize Express
const app = express()

//connect db
await connectDB()

//middleware
app.use(cors())

//routes
app.get("/", (req,res) => res.send("API Working"))
app.post("/clerk",express.json(), clerkWebhooks)

//port
const PORT = process.env.PORT || 5000

//run app
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))