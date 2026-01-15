import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import User from "../models/User.js";
import  jwt from 'jsonwebtoken'
import Resume from "../models/resume.js";


const generatetoken =(userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'7d'})
    return token

}
 export const Userregister= async (req,res) => {
try {
        const {name,email,password}= req.body
    if(!name ||!email||!password){
        return res.status(400).json({
            message:"Missing required field"
        })
    }
   const user = await User.findOne({email})
   if(user){
    return res.status(400).json({
        message:"User already exist"
    })
   }
   const hashedpassword = await bcrypt.hash(password,10)
   const newUser= await User.create({
    name,email,password:hashedpassword
   })
  
   const token = generatetoken(newUser._id)
   newUser.password = undefined
   return res.status(201).json({message:"User create succesfully",token,user:newUser})
} catch (error) {
    return res.status(500).json({message:error.message})
}
}
//control for user login
 export const loginuser = async (req,res) => {
try {
        const {email,password}= req.body
  
   const user = await User.findOne({email})
   if(!user){
    return res.status(400).json({
        message:"Invalid email or password"
    })
   }
   //if password correct
//    if(!user.comparepassword(password)){
//     return res.status(400).json({
//         message:"Invalid email or password"
//     })
//    }
// const isMatch = await user.comparepassword(password)
// if (!isMatch) {
//   return res.status(400).json({
//     message: "Invalid email or password"
//   })
// }

  //const isMatch = await user.comparepassword(password)
//if (!isMatch) {

  //return succes message
   const token = generatetoken(user._id)
   user.password = undefined
   return res.status(200).json({message:"Login succesfully",token,user})
} catch (error) {
    return res.status(400).json({message:error.message})
}
}
//controller for getting user by id
//get:/api/users/data
 export const getUserbyid= async (req,res) => {
      try {
        const userId= req.userId
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        user.password= undefined;
        return res.status(200).json({user})
      } catch (error) {
         return res.status(400).json({message:error.message})
      }
}
//controller for getting user resumes
//GET: /api/users/resumes
 export const getUserResumes = async (req,res)=>{
    try {
        const userId = req.userId
        // return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}