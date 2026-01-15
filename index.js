import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";

import { connectDB } from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

// connect database
const app = express();

connectDB();

// Request body ko parse karta hai
app.use(bodyParser.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on the ${PORT}`);
});
