import { Plus, Sparkle, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({data,onchange}) => {
const[newSkill,setNewskill]= useState("")
const Addskill =()=>{
    if(newSkill.trim() && ! data.includes(newSkill.trim())){
        onchange([...data,newSkill.trim()])
        setNewskill("")
    }
}
const Removeskill = (indextoremove) =>{
    onchange(data.filter((_,index)=>index !== indextoremove))
}
const handlekeypress= (e)=>{
 if(e.key==="Enter"){
    e.preventDefault();
    Addskill();
 }
}
  return (
    <div className='space-y-4'>
        <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Skills</h3>
            <p className='text-sm text-gray-500'>Add your technical and soft skills</p>
        </div>
<div className='flex gap-2'>
<input placeholder='Enter a skill (e.g. javascript,Project managment' className='flex-1 px-3 py-2 text-sm'
 onChange={(e)=>setNewskill(e.target.value)} value={newSkill} onKeyDown={handlekeypress}/>
 <button onClick={Addskill} disabled={!newSkill.trim} className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50
  disabled:cursor:not-allowed'>
    <Plus className='size-4'/>Add
  </button>
</div>
{data.length > 0 ?(
    <div className='flex flex-wrap gap-2'>
        {data.map((skill,index)=>(
            <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                {skill}
                <button onClick={()=>Removeskill(index)} className='ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors'>
                    <X className='w-3 h-3'/>
                </button>
            </span>
        ))}
    </div>

):(
    <div className='text-center py-6 text-gray-500'>
        <Sparkle className='w-10 h-10 mx-auto mb-2 text-gray-300'/>
        <p>No skills added yet.</p>
        <p className='text-sm'>Add your technical and soft skills above.</p>
    </div>
)}
<div className='bg-blue-50 p-3 rounded-lg'>
    <p className='text-sm text-blue-800'><strong>Tip:</strong> Add 8-12 relevant skills. Include both technical skills(programming languages,tools) and soft skills (communication,leadership).</p>
</div>
    </div>
  )
}

export default SkillsForm