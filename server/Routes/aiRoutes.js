import express from 'express'
import protect from '../middlewares/authmiddleware.js'
import { enhanceJobDescription, enhanceSummary, uploadresume } from '../controller/aiController.js'

const aiRouter = express.Router()



aiRouter.post('/enhance-pro-sum',protect,enhanceSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume',protect,uploadresume)
export default aiRouter