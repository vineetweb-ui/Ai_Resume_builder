import express from 'express'
import protect from '../middlewares/authmiddleware.js'
import { createresume, deleteresume, getPublicResumebyid, getresumeByID, updateResume } from '../controller/resumeController.js'
import upload from '../configs/multer.js'

const resumeRouter = express.Router()
 

resumeRouter.post('/create',protect,createresume)
resumeRouter.put('/update',protect,upload.single('image'),updateResume)
resumeRouter.delete('/delete/:resumeId',protect,deleteresume)
resumeRouter.get('/get/:resumeId',protect,getresumeByID)
resumeRouter.get('/public/:resumeId',getPublicResumebyid)
export default resumeRouter

