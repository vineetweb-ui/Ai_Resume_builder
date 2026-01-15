import mongoose from "mongoose";
const connectDB= async()=>{
    try {
        mongoose.connection.on("connected",()=>{console.log("Database connected successfully")})
        let MongodbURI = process.env.MONGODB_URI;
        const projectName = 'Resume-builder'
        if (!MongodbURI){
            throw new Error("mongob_uri environment variable not set")
        }
        if(MongodbURI.endsWith('/')){
            MongodbURI = MongodbURI.slice(0,-1)
        }
        await mongoose.connect(`${MongodbURI}/${projectName}`)
        
    } catch (error) {
        console.log(`Error connecting to mongodb${error}`)
    }
}
export default connectDB