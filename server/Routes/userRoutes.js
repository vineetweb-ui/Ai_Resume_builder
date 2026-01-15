import express from 'express'
import { getUserbyid, getUserResumes, loginuser, Userregister } from '../controller/Usercontroller.js';
import protect from '../middlewares/authmiddleware.js';

const userouter = express.Router();
userouter.post('/register',Userregister)
userouter.post('/login',loginuser)
userouter.get('/data',protect,getUserbyid)
userouter.get('/resumes',protect,getUserResumes)


export default userouter