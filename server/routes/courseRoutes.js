import express from 'express';
import { getAllCourses, getCourseId } from '../controllers/courseController.js';

const courseRouter = express.Router()

courseRouter.get("/all", getAllCourses)
courseRouter.get("/:id", getCourseId)

export default courseRouter