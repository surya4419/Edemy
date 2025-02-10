import React, { useContext, useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from "../../components/student/Loading"
import { assets } from '../../assets/assets'



const CourseDetails = () => {

  const {id} = useParams()

  //const [courseData, setCourseData] = useState(null)
  const [courseData, setCourseData] = useState(null)

  const {allCourses, calculateRating} = useContext(AppContext)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse)
  }

  useEffect(()=>{
    fetchCourseData()
  },[])
  
  return courseData ?  (
    <>
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left">
      
      <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

      {/* left column */}
      <div className='max-w-xl z-10 text-gray-500'>
        <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>          
        <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{__html:courseData.courseDescription.slice(0,200)}}></p>

        {/*revie and rating */}
           <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
                <p>{calculateRating(courseData)}</p>
                <div className='flex'>
                  {[...Array(5)].map((_, i)=>(<img key={i} src={i< Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='' className='w-3.5 h-3.5' />))} 
                </div>
                <p className='text-blue-600'>({courseData.courseRatings.length}{courseData.courseRatings.length >1 ? "ratings":"rating"})</p>  

                <p>{courseData.enrolledStudents.length}{courseData.enrolledStudents.length > 1 ? "students" : "student"}</p>                     
            </div>       
            <p className='text-sm'>Course by <span className='text-blue-600 underline'>ElonMusk</span></p>
      </div>

      {/*right column */}
      <div>

      </div>
    </div>
    </>
  ): <Loading />
}

export default CourseDetails
