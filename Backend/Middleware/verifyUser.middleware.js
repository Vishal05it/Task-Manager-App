const jwt = require("jsonwebtoken");
const userModel = require("../Schema/user.model");
const verifyUser = async (req, res, next) => {
    try {
        let taskAuthToken = req.cookies.taskAuthToken;
        if (!taskAuthToken) {
            return res.status(404).json({
                message: "Token not found",
                success: false,
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
        const userExist = await userModel.findById(decode.userId);
        if (!userExist) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        req.userId = decode.userId;
        return next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Token expired",
            success: false,
        });
    }
}
module.exports = verifyUser;