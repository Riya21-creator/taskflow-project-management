const express = require("express");
const Task = require("../models/Task");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, async(req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

        if (!title || !description || !project || !assignedTo || !dueDate) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo,
            status,
            priority,
            dueDate
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Task creation failed", error: error.message });
    }
});

router.get("/", protect, async(req, res) => {
    try {
        let tasks;

        if (req.user.role === "Admin") {
            tasks = await Task.find()
                .populate("project", "title")
                .populate("assignedTo", "name email");
        } else {
            tasks = await Task.find({ assignedTo: req.user._id })
                .populate("project", "title")
                .populate("assignedTo", "name email");
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});
router.get("/project/:projectId", protect, async(req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate("project", "title")
            .populate("assignedTo", "name email");

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project tasks" });
    }
});

router.put("/:id", protect, async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (req.user.role !== "Admin" && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        task.status = req.body.status || task.status;
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;

        const updatedTask = await task.save();

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Task update failed" });
    }
});

router.delete("/:id", protect, adminOnly, async(req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;