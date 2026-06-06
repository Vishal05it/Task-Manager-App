const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],

    },
    email: {
        type: String,
        match: [/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim, "Invalid email!"],
        lowercase: true,
        required: [true, "Email is required"],
        unique: [true, "Email already registered"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 3 characters long"],

    }
}, { timestamps: true, strict: true });
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;