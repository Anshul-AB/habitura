const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/userSchema");
const DailyProgress = require("../models/dailyProgressSchema");

router.get(
  "/dailyTasks",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      // Using aggregation to fetch user, habits, and tasks in one go
      const userWithProgress = await User.aggregate([
        { $match: { _id: user._id } },
        {
          $lookup: {
            from: "habits",
            localField: "habitList",
            foreignField: "_id",
            as: "habits",
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "taskList",
            foreignField: "_id",
            as: "tasks",
          },
        },
        {
          $project: {
            totalHabits: { $size: "$habits" },
            totalTasks: { $size: "$tasks" },
            completedHabits: {
              $size: {
                $filter: {
                  input: "$habits",
                  as: "habit",
                  cond: { $eq: ["$$habit.isCompleted", true] },
                },
              },
            },
            completedTasks: {
              $size: {
                $filter: {
                  input: "$tasks",
                  as: "task",
                  cond: { $eq: ["$$task.isCompleted", true] },
                },
              },
            },
          },
        },
      ]);

      if (!userWithProgress.length) {
        return res.status(404).json({ message: "User not found" });
      }

      const { totalHabits, totalTasks, completedHabits, completedTasks } =
        userWithProgress[0];
      const totalDailyTasks = totalHabits + totalTasks;

      if (totalDailyTasks === 0) {
        return res
          .status(200)
          .json({ message: "No tasks or habits found for today" });
      }

      // Calculate progress
      const totalDailyTasksCompleted = completedHabits + completedTasks;
      let todayProgress = (totalDailyTasksCompleted / totalDailyTasks) * 100;
      todayProgress = parseFloat(todayProgress.toFixed(2));

      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if there's already an entry for today's progress
      let dailyProgress = await DailyProgress.findOne({
        user: user._id,
        date: today,
      });

      if (dailyProgress) {
        dailyProgress.progressPercentage = todayProgress;
        await dailyProgress.save();
      } else {
        dailyProgress = new DailyProgress({
          date: today,
          progressPercentage: todayProgress,
          user: user._id,
        });
        await dailyProgress.save();
      }

      // Fetch all progress records for the user
      const allProgress = await DailyProgress.find({ user: user._id }).sort({
        date: -1,
      });

      // Data update through Socket.io
      const calculatedProgress = allProgress.map((item)=>{
        return item.progressPercentage
      })
      const io = req.app.get("io");
      // console.log(" Emitting progressUpdate event for user:", user._id, calculatedProgress);
      io.emit("progressUpdate", { userId: user._id, calculatedProgress });

      return res.status(200).json({
        message: "All Progress Data:",
        allProgress,
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while calculating daily progress",
        error: error.message,
      });
    }
  }
);

module.exports = router;
