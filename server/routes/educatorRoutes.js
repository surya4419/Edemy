import express from "express"
import { addCourse, updateRoleToEducator } from "../controllers/educatorController"  
import upload from "../configs/multer"
import { protectEducator } from "../middlewares/authMiddleware"

const educatorRouter = express.Router()

//Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator)
educatorRouter.post("/add-course", upload.single("image"),protectEducator, addCourse)

export default educatorRouter;