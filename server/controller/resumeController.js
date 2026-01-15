import imagekit from "../configs/imagekit.js"
import Resume from "../models/resume.js"
import fs from 'fs'

//controller for create resume



// POST:/api/resumes/create
export const createresume= async (req,res) => {
   try {
     const userId = req.userId
    const {title}= req.body
     
    // create new resume
    const newREsume= await Resume.create({userId,title})
    return res.status(201).json({message:"resume create successfully",resume:newREsume})

   } catch (error) {
    return res.status(400).json({message:error.message})
   }
}
// controller for delete the resume
// DELETE:/api/resumes.delete
 export const deleteresume = async (req,res) => {
    try {
       const userId = req.userId
       const {resumeId}= req.params
       await Resume.findOneAndDelete({userId,_id:resumeId})
       return res.status(200).json({message:"resume delted succesfully"})

    } catch (error) {
          return res.status(400).json({message:error.message})
    }
}
//get user resume by id
//GET: /api/resume/get
export const getresumeByID=async (req,res) => {
    try {
    const userId = req.userId
    const {resumeId}=req.params
    const resume = await Resume.findOne({userId,_id:resumeId})
    if(!resume){
        return res.status(404).json({message:"resume not found"})
    }
    resume.__v = undefined;
    resume.createdAt= undefined;
    resume.updatedAt = undefined
    return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({messgae:error.message})
    }
}
// get resume id by public
// get :/api.resumes/public
export const getPublicResumebyid = async (req,res) => {
    try {
        const {resumeId}= req.params;
        const resume = await Resume.findOne({public:true,_id:resumeId})
        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }
        return res.status(200).json({resume})
    } catch (error) {
         return res.status(404).json({message:error.message})
    }
    
}
/// put resume 
///updat resume //put:/api/resumes/update
export const updateResume=async (req,res) => {
    try {
        const userId = req.userId
        const {resumeId,resumedata,removeBackground}=req.body
        const image = req.file;

        let resumeDatacopy 
        if(typeof resumedata === 'string'){
            resumeDatacopy= await JSON.parse(resumedata)
        }
        else{
          resumeDatacopy = JSON.parse(JSON.stringify(resumedata))

        }
        if(image){
            const bgRemove = removeBackground === 'true'

            const imagebufferdata = fs.createReadStream(image.path)
        const response = await imagekit.files.upload({
                        file: imagebufferdata,
                        fileName: 'resume.png',
                        folder:"user-resumes",
                        transformation:{
                            pre: 'w-300,h-300,fo-face,z-0.75' + (bgRemove ? ',e-bgremove' : '')

                        }
});
resumeDatacopy.personal_info.image = response.url
        }
        const resume = await Resume.findOneAndUpdate({userId,_id:resumeId},resumeDatacopy,{new:true})
        return res.status(200).json({message:"Saved successfully",resume})
    } catch (error) {
       
          return res.status(400).json({message:error.message})
          
    }
}