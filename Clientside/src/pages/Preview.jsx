import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/Home/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const {resumeId}=useParams()
  const [resumedata,Setresumedata]=useState(null)
  const [isloading,setisloading]=useState(true)
  const loadresume=async()=>{
  
    try {
      const {data}= await api.get("/api/resumes/public/"+ resumeId )
      Setresumedata(data.resume)
    } catch (error) {
      console.log(error.message)
    }
    finally{
      setisloading(false)
    }
  }
  useEffect(()=>{
    loadresume()
  },[resumeId])
  return resumedata ? (
    <div className='bg-slate-100'>
<div className='max-w-3xl mx-auto py-10'>
  <ResumePreview data={resumedata} template={resumedata.template} accentcolor={resumedata.accent_color} classes='py-4 bg-white'/>
</div>
    </div>
  ):(
<div>
  {isloading ? <Loader/>:(
    <div className='flex flex-col items-center justify-center h-screen'>
    <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
    <a href='/' className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
      <ArrowLeftIcon className='mr-2 size-4'/> Go to home page
    </a>
    </div>
  )}
</div>
  )
}

export default Preview