import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import assets from '../assets/assets';

const ProfilePage = () => {

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate=useNavigate();
  const [name,setName]= useState("Shubham Raj")
  const [bio,steBio]=useState("Hello i am shubham Raj")

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center '>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
      <form className='flex flex-col gap-5 p-10 flex-1'>
        <h3 className='text-lg'>Profile Details</h3>
        <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
          <img src= {selectedImg ? URL.createObjectURL(selectedImg): assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
          upload profile picture
        </label>
        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
        <textarea placeholder='Write profile bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>     
      </form>
      <img src="" alt="" />
      </div> 
      
    </div>
  )
}

export default ProfilePage
