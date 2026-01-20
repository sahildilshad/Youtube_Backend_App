import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";

dotenv.config();

// connect database
const app = express();

app.use(express.json());

connectDB();

// Request body ko parse karta hai

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/video", videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on the ${PORT}`);
});
