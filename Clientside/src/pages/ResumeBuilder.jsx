import React, { useEffect, useState } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, ToyBrick, User } from 'lucide-react'
import Personalinforform from '../components/Personalinforform'
import ResumePreview from '../components/Home/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProffesionalSummary from '../components/ProffesionalSummary'
import ExperinceForm from '../components/ExperinceForm'
import EducationForm from '../components/EducationForm'
import Projectform from '../components/Projectform'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
  const{resumeId}= useParams()
  const {token}= useSelector(state=>state.auth)
  const[resumedata,Setresumedata]=useState({
    _id:"",
    title:"",
    personal_info:{},
    professional_summary:"",
    experience:[],
    education:[],
    project:[],
    skills:[],
    template:"classic",
    accent_color:"#3B82f6",
    public:false,


  })

  const loadexistingresume= async () => {
   try {
   const { data} = await api.get('/api/resumes/get/' + resumeId,{headers:{ Authorization:token}})
   if(data.resume){
    Setresumedata(data.resume)
    document.title = data.resume.title
   }
   } catch (error) {
    console.log(error.message)
   }
  }
  const [activesectionindex,setactivesectionindex]=useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections=[
    {id:"personal", name:"personal-info",icon: User},
    {id:"summary",name:"Summary",icon:FileText},
     {id:"experience",name:"Experience",icon:Briefcase},
     {id:"education",name:"Education",icon:GraduationCap},
     {id:"projects",name:"Projects",icon:FolderIcon},
     {id:"skills",name:"Skills",icon:Sparkles}
  ]
  const activesection=sections[activesectionindex]
useEffect(() => {
  if (resumeId) {
    loadexistingresume();
  }
}, [resumeId]);

const Changeresumevisiblity= async()=>{
  try {
    const formdata = new FormData()
    formdata.append("resumeId",resumeId)
    formdata.append("resumedata",JSON.stringify({public:!resumedata.public}))

    const {data} = await api.put("/api/resumes/update",formdata,{headers:{Authorization:token}})
     Setresumedata({...resumedata,public:!resumedata.public})
     toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume :",error)
  }
}
const handleshare =()=>{
  const Frontendurl = window.location.href.split("/app/")[0]
  const resumeUrl= Frontendurl + "/view/"+ resumeId;
  if(navigator.share){
    navigator.share({url:resumeUrl,text:"My Resume"})
  }else{
    alert("Share not supported on this browser")
  }
}
const DownloadResume=()=>{
  window.print()
}
const saveResume = async ()=>{
  try {
    let updateResumeData = structuredClone(resumedata)

    //remoce image
    if(typeof resumedata.personal_info.image ==='object'){
      delete updateResumeData.personal_info.image
    }
    const formdata = new FormData();
    formdata.append("resumeId",resumeId)
    formdata.append("resumedata",JSON.stringify(updateResumeData))
    if (resumedata.personal_info.image instanceof File) {
  formdata.append("image", resumedata.personal_info.image)
}

    const {data}= await api.put("/api/resumes/update",formdata,{headers:{Authorization:token}})
 if (data?.resume) {
  Setresumedata(prev => ({
    ...prev,
    ...data.resume
  }));
}

 toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume :",error)
  }
}

  return (
    <div>
     <div className='max-w-7xl mx-auto px-4 py-6'>
      <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
      <ArrowLeftIcon className='size-4'/>Back to Dashboard
      </Link>
     </div>
     <div className='max-w-7xl mx-auto px-4 pb-8'>
     <div className='grid lg:grid-cols-12 gap-8'>
    {/* left pannel form */}
    <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
        {/* progress bar using activesectionindex */}
        <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
        <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-300' style={{width:`${activesectionindex * 100 / (sections.length -1)}%`}}/>
        {/* section navigation */}
        <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
          <div className='flex  items-center gap-2'>
            <TemplateSelector selectedTemplate={resumedata.template} onchange={(template)=>Setresumedata(prev=>({...prev,template}))}/>
            <ColorPicker selectedcolors={resumedata.accent_color} onchange={(color)=>Setresumedata(prev=>({...prev,accent_color:color}))}/>
          </div>
          <div className='flex items-center'>
            {activesectionindex !==0 &&(
              <button onClick={()=>setactivesectionindex((previndex)=>Math.max(previndex -1,0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 
              transition-all' disabled={activesectionindex===0}>
                <ChevronLeft className='size-4'/>Previous
              </button>
            )}
            <button onClick={()=>setactivesectionindex((previndex)=>Math.min(previndex +1,sections.length-1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
  activesectionindex === sections.length - 1 ? 'opacity-50' : ''
}`}
 disabled={activesectionindex=== sections.length-1}>
               Next <ChevronRight className='size-4'/>
              </button>
          </div>
        </div>
        {/* from content */}
        <div className='space-y-6'>
          {activesection.id ==='personal'&&(
          <Personalinforform data={resumedata.personal_info} onChange={(data)=>Setresumedata(prev=>({...prev,personal_info:data}))} removeBackground={removeBackground}
          setremoveBackground={setRemoveBackground}/>
          )}
          {activesection.id ==='summary'&&(
            <ProffesionalSummary data={resumedata.professional_summary} onchange={(data)=>Setresumedata(prev=>({...prev,professional_summary:data}))} Setresumedata={Setresumedata}/>
          )}
          {activesection.id ==="experience" &&(
            <ExperinceForm data={resumedata.experience} onchange={(data)=>Setresumedata(prev=>({...prev,experience:data}))}/>
          )}
          {activesection.id ==="education"&&(
            <EducationForm data={resumedata.education} onchange={(data)=>Setresumedata(prev=>({...prev,education:data}))}/>
          )}
          {activesection.id ==="projects"&&(
            <Projectform data={resumedata.project} onchange={(data)=>Setresumedata(prev=>({...prev,project:data}))}/>
          )}
          {activesection.id ==="skills"&&(
            <SkillsForm data={resumedata.skills} onchange={(data)=>Setresumedata(prev=>({...prev,skills:data}))}/>
          )}
        </div>
        <button onClick={()=>{toast.promise(saveResume,{loading:"Saving..."})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6  text-sm'>
          Save Changes
        </button>
      </div>
    </div>
    {/* Right_panel preview */}
    <div className='lg:col-span-7 max-lg:mt-6'>
      <div className='relative w-full'>
      <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
        {resumedata.public &&(
          <button onClick={handleshare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300
           hover:ring transition-colors'>
            <Share2Icon className='size-4'/> Share
          </button>
        )}
        <button onClick={Changeresumevisiblity} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-lg ring-purple-300
           hover:ring transition-colors'>
          {resumedata.public ? <EyeIcon className='size-4'/>:<EyeOffIcon className='size-4'/>
        }
        {resumedata.public ?"Public":"Private"}
        </button>
        <button onClick={DownloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600
        rounded-lg ring-green-300 hover:ring transition-colors'>
          <DownloadIcon className='size-4'/>Download
        </button>
      </div>
      </div>
    <ResumePreview data={resumedata} template={resumedata.template} accentcolor={resumedata.accent_color}/>
    </div>
     </div>
 
     </div>
      </div>
  )
}

export default ResumeBuilder