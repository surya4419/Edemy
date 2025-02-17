import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"


export const getUserData = async (req,res) =>{
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success:false, message:" user not found"})
        }

        res.json({success:true, user})
    } catch (error) {
        res.json({success:false , message: error.message})
    }
}

// users enrolled  courses with lectures links
export const userEnrolledCourses = async(req,res) => {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate("enrolledCourses")

        res.json({success:true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success:false , message: error.message})
        
    }
}

 //purchase course data
 export const purchaseCourse = async (req,res) => {
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData || !courseData){
            return res.json({success:false, message:" user or course not found"})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId: userId,
            amount:(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        //stripe gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLocaleLowerCase()

        //creating line items for stripe
        const line_items = [{
            "price_data": {
                currency,
                product_data:{
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) *100
            },
            "quantity": 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url : `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata:{
                purchaseId : newPurchase._id.toString()
            }
        })

        res.json({success: true, session_url: session.url})
        
    } catch (error) {
        res.json({success:false, message: error.messsage})
    }
 }

 //update user course progress\

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.body
        const {courseId,lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true, message:"lecture completed "})
            }

            progressData.lectureCompleted.push(lectureId)
            return progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({success:true, message:"course progress updated "})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//get user course progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.body
        const {courseId,lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId, courseId})
        res.json({success:true, progressData})

    } catch (error) {
        res.json({success:false, message:error.message})
        
    }
}

//add user rating to course
export const addUserRating = async (req, res) => {
    const userId = req.auth.userId
    const {courseId, rating} = req.body

    if(!courseId || !rating || rating < 1 || rating >5){
        return res.json({success:false, message:"invalid details/rating "})
    }
    try {
        const course = await Course.findById(courseId)

        if(!course){
            return res.json({success:false, message:"course not found"})
        }
        const user = await User.findById(userId)

        if(!user || !user.enrolledCourses.includes(courseId)){
            return res.json({success:false, message:"you are not enrolled in this course "})
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if(existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating
        }else{
            course.courseRatings.push({userId, rating})
        }
        await course.save()

        return res.json({success:true, message:'Rating added'})

    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}