const express = require("express");
const verifyRouter = express.Router();
const jwt = require("jsonwebtoken");
verifyRouter.get("/verify", async (req, res) => {
    try {
        let taskAuthToken = req.cookies.taskAuthToken;
        if (!taskAuthToken) {
            return res.status(404).json({
                message: "Token not found",
                success: false
            });
        }
        const SECRET_KEY = process.env.SECRET_KEY;
        let decode = jwt.verify(taskAuthToken, SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
        return res.status(200).json({
            message: "User is logged in",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.redirect(new URL("/login", req.url));
    }
})
module.exports = verifyRouter;