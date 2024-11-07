const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const passport = require("passport");
const Task = require("../models/taskSchema");
const {redis} = require('../redisClient')

// Create Task
router.post(
  "/addTask",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get the authenticated user from req.user
      const user = req.user;
      const { task } = req.body;

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Please log in." });
      }

      const addTask = new Task({
        task,
        user: user._id,
      });
      await addTask.save();

      user.taskList.push(addTask);
      await user.save();

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      res.status(200).json({ message: "Task added", addTask });
    } catch (error) {
      console.error("Error adding Task:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// GET all tasks
router.get(
  "/getAllTasks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    try {
      // If cached tasks are found, return them
      const cachedTasks = await redis.get(`tasks:${user._id}`);
      if (cachedTasks) {
        // console.log("Returning tasks from Redis cache");
        return res.status(200).json(JSON.parse(cachedTasks));
      }

      // get tasks form db
      const getUser = await User.findById(user._id).populate("taskList");
      if (!getUser) {
        return res.status(404).json({ message: "User Not Found." });
      }

      // Sort tasks by order after they are populated
      const sortedTasks = getUser.taskList.sort((a, b) => a.order - b.order);

      await redis.set(
        `tasks:${user._id}`,
        JSON.stringify(sortedTasks),
        "EX",
        3600
      );

      // console.log("Returning tasks from database");
      return res.status(200).json(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete Task
router.delete(
  "/deleteTask/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      const taskExists = await Task.findByIdAndDelete(id);

      if (!taskExists) {
        return res.status(404).json({ message: "Task Not Found" });
      }
      // Remove the task reference from the user's taskList
      await User.findByIdAndUpdate(user._id, { $pull: { taskList: id } });

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting Task:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete all tasks
router.delete(
  "/deleteAllTasks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      if (user.taskList.length === 0) {
        return res.status(200).json({ message: "No tasks to delete" });
      }

      // Update user's task list to an empty array
      const userUpdate = User.findByIdAndUpdate(user._id, {
        $set: { taskList: [] },
      });

      // Clear the cache for the user's tasks
      const clearCache = redis.del(`tasks:${user._id}`);

      // Execute both tasks in parallel
      await Promise.all([userUpdate, clearCache]);

      res.status(200).json({ message: "All tasks deleted successfully" });
    } catch (error) {
      console.error("Error deleting tasks:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Update Task
router.put(
  "/updateTask/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { task } = req.body;
      const id = req.params.id;
      const user = req.user;

      const updateTask = await Task.findByIdAndUpdate(
        id,
        { task },
        { new: true } // This option ensures the updated document is returned
      );

      if (!updateTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      res.status(200).json({ message: "Task Updated", updateTask });
    } catch (error) {
      console.error("Error updating Task:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Task Completion Date
router.post(
  "/completionTask/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    const user = req.user;

    try {
      const updateTaskStatus = await Task.findByIdAndUpdate(
        id,
        { $addToSet: { completionDates: new Date(date) } },
        { new: true }
      );

      if (!updateTaskStatus) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      res
        .status(200)
        .json({ message: "Task completed for today", updateTaskStatus });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error completing task" });
    }
  }
);

// Completion Date removal
router.post(
  "/removeCompletionDate/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    const user = req.user;

    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { $pull: { completionDates: new Date(date) } },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      res
        .status(200)
        .json({ message: "Completion date deleted for a task", task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error completing task" });
    }
  }
);

// is Completed
router.post(
  "/statusUpdate/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { isCompleted } = req.body;
    const user = req.user;

    try {
      const task = await Task.findByIdAndUpdate(
        id,
        { isCompleted },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`tasks:${user._id}`);

      return res
        .status(200)
        .json({ message: "Status updated successfully", task });
    } catch (error) {
      console.error("Error changing status of task", error);
      return res.status(500).json({ message: "Error changing status of task" });
    }
  }
);

// Update task order based on their new indices
router.put(
  "/order",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { taskOrder } = req.body;
    const user = req.user;

    try {
      // Loop through each task and update the order field in MongoDB
      for (let i = 0; i < taskOrder.length; i++) {
        const taskId = taskOrder[i];

        await Task.findOneAndUpdate(
          { _id: taskId, user: user._id },
          { order: i },
          { new: true }
        );
      }
      // Clear the user's tasks cache after updating order
      await redis.del(`tasks:${user._id}`);
      return res
        .status(200)
        .json({ message: "Task order updated successfully" });
    } catch (error) {
      console.error("Error updating task order:", error);
      res.status(500).json({ error: "Failed to update task order" });
    }
  }
);

module.exports = router;
