const express = require("express");
const taskRouter = express.Router();
const taskModel = require("../Schema/task.model");
const verifyUser = require("../Middleware/verifyUser.middleware");
taskRouter.get("/getalltasks", verifyUser, async (req, res) => {
    try {
        let { items = 5, page = 1 } = req.query;
        const totalDocs = await taskModel.countDocuments({ createdBy: req.userId });
        const lastPage = Math.ceil(totalDocs / items);
        if (page <= 0 || page > lastPage) {
            return res.status(404).json({
                message: "Page not found",
                success: false,
            });
        }
        let skipItems = (page - 1) * items;
        let allTasks = await taskModel.find({ createdBy: req.userId }).sort({ updatedAt: -1 }).limit(items).skip(skipItems);
        return res.status(200).json({
            message: "All your tasks found",
            allTasks,
            lastPage,
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
});
taskRouter.get("/getonetask/:taskId", verifyUser, async (req, res) => {
    try {
        let oneTask = await taskModel.findById(req.params.taskId).populate("createdBy");
        if (!oneTask) {
            return res.status(404).json({
                message: "Task not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Task found",
            success: true,
            task: oneTask,
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
taskRouter.post("/createtask", verifyUser, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = await taskModel.create({
            title, description, status: "incomplete", createdBy: req.userId, addedMs: Date.now(),
        });
        return res.status(200).json({
            message: "Task created successfully",
            success: true,
            task: newTask,
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
taskRouter.put("/updatetask/:taskId", verifyUser, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        let task = await taskModel.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false,
            });
        }
        if (task.createdBy != req.userId) {
            return res.status(401).json({
                message: "Cannot edit other user's task",
                success: false,
            });
        }
        const refTask = {};
        if (title) {
            refTask.title = title;
        }
        if (description) {
            refTask.description = description;
        }
        if (status) {
            refTask.status = status;
        }
        const updatedTask = await taskModel.findByIdAndUpdate(req.params.taskId, { ...refTask, addedMs: Date.now() }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({
                message: "Task updation failed",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Task updated successfully",
            success: true,
            task: updatedTask,
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
taskRouter.delete("/deletetask/:taskId", verifyUser, async (req, res) => {
    try {
        let task = await taskModel.findById(req.params.taskId);
        if (!task) {
            return res.status(404).json({
                message: "Task not found",
                success: false,
            });
        }
        if (task.createdBy != req.userId) {
            return res.status(401).json({
                message: "Cannot delete other user's task",
                success: false,
            });
        }
        const deletedTask = await taskModel.findByIdAndDelete(req.params.taskId);
        if (!deletedTask) {
            return res.status(404).json({
                message: "Task deletion failed",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Task deleted successfully",
            success: true,
            task: deletedTask,
        })
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
module.exports = taskRouter;