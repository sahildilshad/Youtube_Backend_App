import mongoose from "mongoose";
import express from "express";
import cloudinary from "../config/cloudinary.js";
import { checkAuth } from "../middleware/auth.middleware.js";
import Video from "../models/video.model.js";
import upload from "../config/multer.js";

const router = express.Router();

// upload video
router.post("/upload", checkAuth, upload.single("video"), async (req, res) => {
  console.log("REQ BODY:", req.body); // title, description, category, tags
  console.log("REQ FILE:", req.file); // video file info

  if (!req.file) return res.status(400).json({ message: "Video missing" });

  const { title, description, category, tags } = req.body;

  try {
    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Title/description/category missing" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: "videos",
    });



    const newVideo = new Video({
      title,
      description,
      category,
      tags: tags ? tags.split(",") : [],
      user_id: req.user._id,
      videoUrl: result.secure_url,
      videoId: result.public_id,
    });

    await newVideo.save();

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// update video (only meta data change not video)

router.put("/update/:id", checkAuth, async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const videoId = req.params.id;

    let video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        error: "video not found",
      });
    }

    // check owner

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "unathorized" });
    }



    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags ? tags.split(",") : video.tags;

    await video.save();

    res.status(201).json({
      message: "vedio updated for successfully ",
      video,
    });
  } catch (error) {
    console.log("error in logging", error.message);
    res.status(500).json({
      success: false,
      message: "error in logining",
      error: error.message,
    });
  }
});

// video delete

router.delete("/delete/:id", checkAuth, async (req, res) => {
  try {
    const videoId = req.params.id;

    // find video
    const video = await Video.findById(videoId);

    //if video not found
    if (!video) {
      return res.status(404).json({
        message: "video not found",
      });
    }

    // check the user is right user to delete video

    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "unathorized",
      });
    }

    if (video.videoPublicId) {
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video",
      });
    }

    await Video.findByIdAndDelete(videoId);

    res.status(200).json({
      message: "video delete successfully",
    });
  } catch (error) {
    console.log("error in logging", error.message);
    res.status(500).json({
      success: false,
      message: "error in logining",
      error: error.message,
    });
  }
});

export default router;
