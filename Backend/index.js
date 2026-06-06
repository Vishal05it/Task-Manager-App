const connectToDB = require("./connectToDB");
const PORT = process.env.PORT || 7000;
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const userRouter = require("./Router/user.router");
const taskRouter = require("./Router/task.router");
const verifyRouter = require("./Router/Redirect/verify.router");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
connectToDB();
app.use(cors({
    origin: "https://task-manager-app-beta-rosy.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use("/user/api", userRouter);
app.use("/task/api", taskRouter);
app.use("/verifylogin/api", verifyRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});