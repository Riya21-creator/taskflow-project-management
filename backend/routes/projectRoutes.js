const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, async(req, res) => {
    try {
        const { title, description, members } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const project = await Project.create({
            title,
            description,
            createdBy: req.user._id,
            members: members || []
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: "Project creation failed", error: error.message });
    }
});

router.get("/", protect, async(req, res) => {
    try {
        let projects;

        if (req.user.role === "Admin") {
            projects = await Project.find()
                .populate("createdBy", "name email")
                .populate("members", "name email role");
        } else {
            projects = await Project.find({ members: req.user._id })
                .populate("createdBy", "name email")
                .populate("members", "name email role");
        }

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch projects" });
    }
});

router.get("/users", protect, adminOnly, async(req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

router.get("/:id", protect, async(req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("members", "name email role");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch project" });
    }
});

router.delete("/:id", protect, adminOnly, async(req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;