import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully");
        
    } catch (error) {
        console.log(error.message);
        throw new Error("Something went Wrong",error)
        
    }
}

