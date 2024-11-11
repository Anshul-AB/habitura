const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Habit = require("../models/habitSchema");
const passport = require("passport");
const mongoose = require("mongoose");
const redis = require("../redisClient");

// Create Habit
router.post(
  "/addHabit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get the authenticated user from req.user
      const user = req.user;
      // console.log(req.user)

      const { habit, startDate, endDate } = req.body;

      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Please log in." });
      }

      const addHabit = new Habit({
        habit,
        user: user._id,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate,
      });
      await addHabit.save();

      user.habitList.push(addHabit);
      await user.save();

      // Clear the cache after the operation
      await redis.del(`habits:${user._id}`);

      res
        .status(200)
        .json({ message: "Habit added", habitList: user.habitList, user });
    } catch (error) {
      console.error("Error adding habit:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Update Habit
router.put(
  "/updateHabit/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { habit, startDate, endDate } = req.body;
      const id = req.params.id;
      const user = req.user;

      const updatedHabit = await Habit.findByIdAndUpdate(
        id,
        { habit, startDate, endDate },
        { new: true } // This option ensures the updated document is returned
      );

      if (!updatedHabit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Clear the cache after the operation
      await redis.del(`habits:${user._id}`);
      await redis.del(`habits:${id}`);

      res.status(200).json({ message: "Habit Updated", updatedHabit });
    } catch (error) {
      console.error("Error updating Habit:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

// Delete Habit
router.delete(
  "/deleteHabit/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      const habitExists = await Habit.findByIdAndDelete(id);

      if (!habitExists) {
        return res.status(404).json({ message: "Habit Not Found" });
      }
      // Remove the habit reference from the user's habitList
      await User.findByIdAndUpdate(user._id, { $pull: { habitList: id } });

      // Clear the cache after the operation
      await redis.del(`habits:${user._id}`);

      res.status(200).json({ message: "Habit deleted successfully" });
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get Habit Info
router.get(
  "/getHabit/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const habit = await Habit.findById(id);

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      res.status(200).json(habit);
    } catch (error) {
      console.error("Error fetching habit:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all habits of a user
router.get(
  "/getHabitslist",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user._id;

      // If cached habits are found, return them
      const cachedHabits = await redis.get(`habits:${userId}`);
      if (cachedHabits) {
        // console.log("Returning habits from Redis cache");
        return res.status(200).json(JSON.parse(cachedHabits));
      } else {
        console.log("No Cached habit found");
      }

      const user = await User.findById(userId).populate("habitList");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await redis.set(
        `habits:${userId}`,
        JSON.stringify(user.habitList),
        "EX",
        3600
      );
      // console.log("Returning habits from database");

      res.status(200).json(user.habitList);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Completion Habit
router.post(
  "/completionHabit/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    const user = req.user;

    try {
      const updatedHabit = await Habit.findByIdAndUpdate(
        id,
        { $addToSet: { completionDates: new Date(date) } },
        { new: true }
      );

      if (!updatedHabit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`habits:${user._id}`);

      res
        .status(200)
        .json({ message: "Habit completed for today", habit: updatedHabit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error completing habit" });
    }
  }
);

// Remove Completion Habit
router.post(
  "/removeCompletionDate/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    const { date } = req.body;
    const user = req.user;

    try {
      const habit = await Habit.findByIdAndUpdate(
        id,
        { $pull: { completionDates: new Date(date) } },
        { new: true }
      );

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`habits:${user._id}`);
      await redis.del(`habits:${id}`);

      res
        .status(200)
        .json({ message: "Completion date deleted for a habit", habit });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error completing habit" });
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
      const habit = await Habit.findByIdAndUpdate(
        id,
        { isCompleted },
        { new: true }
      );

      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Clear the cache for the user's habits after the update
      await redis.del(`habits:${user._id}`);
      await redis.del(`habits:${id}`);

      return res
        .status(200)
        .json({ message: "Status updated successfully", habit });
    } catch (error) {
      console.error("Error changing status of habit", error);
      return res
        .status(500)
        .json({ message: "Error changing status of habit" });
    }
  }
);

// Uncheck all habits
router.post(
  "/uncheckAll",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      await Habit.updateMany(
        { user: user._id },
        { $set: { isCompleted: false } }
      );
      const updatedHabits = await Habit.find({ user: user._id });

      // Clear the cache for the user's habits after the update
      await redis.del(`habits:${user._id}`);
      await redis.del(`habits:${id}`);

      res.status(200).json({
        message: "All habits unchecked successfully",
        habitList: updatedHabits,
      });
    } catch (error) {
      res.status(500).json({ message: "Error unchecking habits", error });
    }
  }
);

// GET request for retrieving habit details with calculations (using Aggregating Framework MongoDB)
router.get(
  "/getHabitDetails/:habitId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { habitId } = req.params;
    const user = req.user;

    try {
      // Check if habit details are cached
      const cachedHabitDetails = await redis.get(`habits:${habitId}`);
      if (cachedHabitDetails) {
        return res.status(200).json(JSON.parse(cachedHabitDetails));
      }

      // Aggregate basic habit details
      const habitDetails = await Habit.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(habitId) } },
        {
          $project: {
            formattedStartDate: {
              $dateToString: { format: "%b %d, %Y", date: "$startDate" },
            },
            formattedEndDate: {
              $dateToString: { format: "%b %d, %Y", date: "$endDate" },
            },
            startDate: 1,
            endDate: 1,
            completionDates: 1,
          },
        },
      ]);

      if (!habitDetails || habitDetails.length === 0) {
        return res.status(404).json({ message: "Habit not found" });
      }

      // Calculate challenge status and streaks in JavaScript for flexibility and simplicity
      const habit = habitDetails[0];
      const today = new Date();
      const startDate = new Date(habit.startDate);
      const endDate = habit.endDate ? new Date(habit.endDate) : null;
      const totalDays = endDate
        ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
        : null;
      const completedDays = habit.completionDates.length;
      const isChallengeCompleted = totalDays && completedDays >= totalDays;

      // Determine challenge status
      let challengeStatus;
      if (totalDays === null || totalDays <= 0) {
        challengeStatus = "No challenge";
      } else if (totalDays === 0) {
        challengeStatus = "Invalid date range";
      } else if (isChallengeCompleted) {
        challengeStatus = "🏆 Challenge completed";
      } else {
        challengeStatus = `🎯 ${completedDays} / ${totalDays} Days Challenge`;
      }

      // Calculate streaks
      const streaks = calculateStreaks(habit.completionDates, today);
      const streakStatus =
        streaks.currentStreak > 1
          ? `🔥 ${streaks.currentStreak} Days Streak`
          : streaks.currentStreak === 1
          ? "🔥 1 Day Streak"
          : null;

      // Format response
      const response = {
        formattedStartDate: habit.formattedStartDate,
        formattedEndDate: habit.formattedEndDate,
        challengeStatus,
        streakStatus,
        streaks,
      };

      // await redis.setex(`habits:${habitId}`, 3600, JSON.stringify(response));

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching habit details" });
    }
  }
);

// Function to calculate streaks
function calculateStreaks(completionDates, today) {
  // Reset the time to midnight for all dates
  // completionDates = completionDates.map((date) => new Date(date.setHours(0, 0, 0, 0)));
  today = new Date(today.setHours(0, 0, 0, 0));
  completionDates.sort((a, b) => a - b);

  let maxStreak = 0,
    currentStreak = 0;
  let prevDate = null;

  for (const date of completionDates) {
    const dayDiff = prevDate ? (date - prevDate) / (1000 * 60 * 60 * 24) : null;

    if (prevDate === null) {
      currentStreak = 1;
    } else if (dayDiff === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }

    prevDate = date;
  }

  maxStreak = Math.max(maxStreak, currentStreak);

  // Check if the streak includes today
  const dayDiffToday = (today - prevDate) / (1000 * 60 * 60 * 24);
  if (dayDiffToday === 1) {
    currentStreak++;
  } else if (dayDiffToday > 1) {
    currentStreak = 0;
  }

  return { currentStreak, maxStreak };
}

module.exports = router;
