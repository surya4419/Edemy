import React from 'react'
import {assets, dummyEducatorData} from "../../assets/assets"
import { Link } from 'react-router-dom'
import {UserButton, useUser} from "@clerk/clerk-react"

const Navbar = () => {

  const educatorData = dummyEducatorData
  const {user} = useUser()

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to="/">
      <img src={assets.logo} alt="logo" className='w-28 lg:w-32'/>
      </Link>     
      <div className='flex items-center gap-5 text-gray-500'>
        <p>Hi! {user ? user.fullName : "Developers"}</p>
        {user ? <UserButton />: <img className='max-w-8' src={assets.profile_img}/>}
      </div>
    </div>
  )
}

export default Navbar
