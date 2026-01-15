import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt'

const Userschema = new mongoose.Schema({
    name:{type: String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
},{timestamps:true})

Userschema.methods.comparepassword = function(password){
    return bcrypt.compareSync(password,this.password)

}
const User = mongoose.model("User",Userschema)

export default User