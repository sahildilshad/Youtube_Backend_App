import express from "express"
import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";

dotenv.config();
const app = express()


// connect database

connectDB()

app.get("/",(req,res)=>{
    res.send("hello node js")
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`server is running on the ${PORT}`);
})