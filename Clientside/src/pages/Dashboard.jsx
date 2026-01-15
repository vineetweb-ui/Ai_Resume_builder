import { FilePenLineIcon, Loader, LoaderCircleIcon, PencilIcon, PlusIcon, ToyBrick, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  const {user,token}= useSelector(state=>state.auth)
  const colors=["#9333ea","#d97706","#dc2626","#0284c7","#16a34a"]
  const [allresumes,setallresumes]= useState([])
  const [createresume,setcreateresume]=useState(false)
  const[Uploadresume,setuploadresume]=useState(false)
  const[resume,setresume]=useState(null)
  const[editresume,seteditresume]=useState('')
  const[title,settitle]=useState('')
  const [isloading,setloading]= useState(false)
  const navigate = useNavigate()
  const resumeloader=async () => {
    try {
     const {data}= await api.get('/api/users/resumes',{headers:{Authorization:token}})
     setallresumes(data.resumes)
    } catch (error) {
       toast.error(error?.response?.data?.message || error.message)
    }
  }
  const creatresumefun= async (event) => {
   try {
     event.preventDefault()
     const {data}= await api.post('/api/resumes/create',{title},{headers:{Authorization:token}})
     setallresumes([...allresumes,data.resume])
     settitle('')
     setcreateresume(false)
     navigate(`/app/builder/${data.resume._id}`)
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
   }
  }
  const uploadResumefun=async (event) => {
    event.preventDefault()
    setloading(true)
    try {
      const resumeText = await pdfToText(resume)
      const {data}= await api.post('/api/ai/upload-resume',{title,resumeText},{headers:{Authorization:token}})
      settitle('')
      setresume(null)
      setuploadresume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setloading(false)
   
  }
  const edittitlefun =async(event)=>{
 try {
  event.preventDefault()
  const {data}= await api.put("/api/resumes/update",{resumeId:editresume,resumedata :{title}},{headers:{Authorization:token}})
  setallresumes(allresumes.map(resume=>resume._id === editresume ? {...resume,title}:resume))
  settitle('')
  seteditresume('')
  toast.success(data.message)
 } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
 }
   
  }
  const deleteresume= async (resumeId) => {
   try {
     const confirm = window.confirm('Are you Sure to delete it permanently ?')
    if(confirm){
     const { data}= await api.delete(`/api/resumes/delete/${resumeId}`, { headers :{Authorization:token}})
     setallresumes(allresumes.filter(resume=>resume._id !== resumeId))
     toast.success(data.message)
    }
   } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
   }
  }
  useEffect(()=>{
    resumeloader()
  },[])
  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 
        bg-clip-text text-transparent sm:hidden'> Welcome, Vinee</p>
        <div className='flex gap-4'>
          <button onClick={()=>{setcreateresume(true)}} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed
          border-slate-300 group hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full'/>
            <p className='text-sm group  transition-all duration-300'>Create Resume</p>
          </button>
            <button onClick={()=>setuploadresume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed
          border-slate-300 group hover:border-purple-500 hover:text-purple-600 hover:shadow-lg transition-all duration-300 cursor-pointer'>
            <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
            <p className='text-sm group  transition-all duration-300'>Upload Existing</p>
          </button>
        </div>
        <hr className='border-slate-300 my-6 sm:w-[350px]'/>

     
      <div  className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
        

       {allresumes
  .filter(r => r && r.title)
  .map((resume, index) => {
        const basecolor= colors[index % colors.length]
        return(
          <button key={resume._id || index}
 onClick={() => {
  if (!resume?._id) return
  navigate(`/app/builder/${resume._id}`)
}} className='relative  w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border
           group hover:shadow-lg transition-all duration-300 
           cursor-pointer' style={{background:`linear-gradient(135deg, ${basecolor}10,${basecolor}40 )`,borderColor:basecolor + '40'}}>
            <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{color:basecolor}}/>
            <p className='text-sm group-hover:scale-105 transition-all px-2 text-center 'style={{color:basecolor}}>{resume.title}</p>
            <p className='absolute bottom-1 text-[11px] 
            text-slate-400  group-hover:text-slate-500 transition-all duration-300 px-2 text-center'
             style={{color:basecolor+'90'}}> Updated on {new Date(resume.updatedAt).toLocaleDateString()}</p>
             <div onClick={e=>e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden '>
              <TrashIcon onClick={()=>deleteresume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
              <PencilIcon onClick={()=>{seteditresume(resume._id);settitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
             </div>
          </button>
        )
        })}
        
      </div>
{createresume &&(
  <form onSubmit={creatresumefun} onClick={()=>setcreateresume(false)}className='fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center'>
    <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
      <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
      <input type='text'  value={title} onChange={(e)=>settitle(e.target.value)} placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
      <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
      <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=>{
        setcreateresume(false); settitle('')
      }}/>
    </div>
  </form>
) }
{Uploadresume &&(
 <form onSubmit={uploadResumefun} onClick={()=>setuploadresume(false)}className='fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center'>
    <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
      <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
      <input onChange={(e)=>settitle(e.target.value)} value={title} type='text' placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
      <div>
<label htmlFor='resume-input' className='block text-sm text-slate-700'>
  Select resume file
  <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500
  hover:text-green-700 cursor-pointer transition-colors'>

    {
      resume ?(
        <p className='text-green-700'>{resume.name}</p>
      ):(
       <>
        <UploadCloud className='size-14 stroke-1'/>
        <p>Upload resume</p>
        </>
        
      )
    }
    
  </div>
</label>
<input type='file' id='resume-input' accept='.pdf' hidden onChange={(e)=>setresume(e.target.files[0])}/>
      </div>
      <button disabled={isloading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
        {isloading && <LoaderCircleIcon className='size-4 animate-spin text-white'/>}
        {isloading ? "Uploading...":"Upload Resume"}
        
        </button>
      <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=>{
        setuploadresume(false); settitle('')
      }}/>
    </div>
  </form>
  )
}
{editresume &&(
  <form onSubmit={edittitlefun} onClick={()=>seteditresume('')}className='fixed inset-0 bg-black/70 backdrop-blur  bg-opacity-50 z-10 flex items-center justify-center'>
    <div onClick={e=>e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
      <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
      <input onChange={(e)=>settitle(e.target.value)} value={title} type='text' placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
      <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update Resume</button>
      <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=>{
        seteditresume(''); settitle('')
      }}/>
    </div>
  </form>
) }
 </div>
    </div>
   
  )
}

export default Dashboard