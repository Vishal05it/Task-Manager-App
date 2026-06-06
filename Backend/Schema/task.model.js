const mongooose = require("mongoose");
const taskSchema = mongooose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [40, "Title must be at most 40 characters long"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [1000, "Description must be at most 1000 characters long"],
    },
    status: {
        type: String,
        enum: ["incomplete", "complete"],
        required: [true, "Task status is required"],
        default: "incomplete",
    },
    createdBy: {
        type: mongooose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Author's ID is required"],
    },
    addedMs: {
        type: Number
    }
}, {
    timestamps: true, strict: true
});
const taskModel = mongooose.model("task", taskSchema);
module.exports = taskModel;