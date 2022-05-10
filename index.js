//importing packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

//importing routes
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

//middleWare
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

//using multer to upload and store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log(res.data);
    return res.status(200).json("File Uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});

//connecting MongoDb
dotenv.config();
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => {
    console.log("connected to mongodb");
  }
);

//routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Backend server is running at ${port}`);
});
