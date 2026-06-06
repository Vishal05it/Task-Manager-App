const express = require("express");
const { default: mongoose } = require("mongoose");
const userRouter = express.Router();
const userModel = require("../Schema/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(402).json({
                message: "Email already registered",
                success: false,
            });
        }
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        const refUser = {};
        refUser.email = email;
        refUser.name = name;
        refUser.password = newPassword;
        const newUser = await userModel.create(refUser);
        const sendUser = await userModel.findById(newUser._id).select("-password");
        return res.status(200).json({
            message: "Account created successfully",
            success: true,
            user: sendUser,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const userFound = await userModel.findOne({ email });
        if (!userFound) {
            return res.status(404).json({
                message: "Email not registered",
                success: false,
            });
        }
        let matchPassword = await bcrypt.compare(password, userFound.password);
        if (!matchPassword) {
            return res.status(401).json({
                message: "Invalid Email or Password",
                success: false,
            });
        }
        const SECRET_KEY = process.env.SECRET_KEY;
        const taskAuthToken = jwt.sign({ userId: userFound._id }, SECRET_KEY);
        const sendUser = await userModel.findById(userFound._id).select("-password");
        res.cookie("taskAuthToken", taskAuthToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        return res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: sendUser,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
userRouter.delete("/logout", async (req, res) => {
    try {
        res.clearCookie("taskAuthToken");
        res.status(200).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
module.exports = userRouter;