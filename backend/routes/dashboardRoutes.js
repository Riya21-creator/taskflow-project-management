const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async(req, res) => {
    try {
        const taskFilter = req.user.role === "Admin" ? {} : { assignedTo: req.user._id };
        const projectFilter = req.user.role === "Admin" ? {} : { members: req.user._id };

        const totalProjects = await Project.countDocuments(projectFilter);
        const totalTasks = await Task.countDocuments(taskFilter);
        const todoTasks = await Task.countDocuments({...taskFilter, status: "Todo" });
        const inProgressTasks = await Task.countDocuments({...taskFilter, status: "In Progress" });
        const completedTasks = await Task.countDocuments({...taskFilter, status: "Done" });

        const overdueTasks = await Task.countDocuments({
            ...taskFilter,
            dueDate: { $lt: new Date() },
            status: { $ne: "Done" }
        });

        res.json({
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks
        });
    } catch (error) {
        res.status(500).json({ message: "Dashboard data failed" });
    }
});

module.exports = router;