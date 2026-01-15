import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  
  const { password } = req.body;
  const Image = req.files.logoUrl.tempFilePath;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadImage = await cloudinary.uploader.upload(Image);

    console.log(uploadImage);
    

    const newUser = new User({
      _id: new mongoose.Types.ObjectId,
      channelName: req.body.channelName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });

    let user = await newUser.save();

    res.status(201).json({
      success: true,
      message: "user created successfully",

      user,
    });
  } catch (error) {
    console.log("error in creating user", error.message);
    res.status(500).json({
      success: false,
      message: "error in creating user",
      error:error.message
    });
  }
});

export default router;
