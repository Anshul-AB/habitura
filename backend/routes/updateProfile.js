const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/userSchema");
const upload = require("../multerconfig");
const bcryptjs = require("bcryptjs");

// Update profile photo 
router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  upload.single("profilePicture"),
  async (req, res) => {
    // const  {profilePicture}  = req.file;
    const user = req.user;
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // console.log("Uploaded file:", req.file);

      const { originalname, filename, path } = req.file;

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          profilePicture: `${req.protocol}://${req.get(
            "host"
          )}/file-uploads/${filename}`,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        path: updatedUser.profilePicture,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// Get user info
router.get(
  "/getProfile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      const userData = await User.findById(user._id);

      if (!userData) {
        return res.status(404).json({ error: "Profile not found" });
      }

      // console.log(userData.profilePicture);

      return res.status(200).json({
        profilePicture: userData.profilePicture,
        fullname: userData.fullname,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// update password and name
router.put(
  "/info",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      const { fullname, currentPassword, newPassword } = req.body;

      if (!currentPassword && newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change the password.",
        });
      }

      const userData = await User.findById(user._id);

      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // If the user is trying to change the password
      if (newPassword) {
        const isMatch = await bcryptjs.compare(currentPassword, userData.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Incorrect current password" });
        }

        // Hash the new password and update it
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);
        userData.password = hashedPassword;
      }

      // Update fullname
      userData.fullname = fullname || userData.fullname;
      await userData.save();

      return res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);


module.exports = router;
