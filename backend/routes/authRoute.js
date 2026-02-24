const express = require("express");
const User = require("../models/userSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimiter");
const bcrypt = require("bcryptjs/dist/bcrypt");
const router = express.Router();
require("dotenv").config();
const generator = require('generate-password');



// Signup route
router.post("/signup", signupLimiter , async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const findUser = await User.findOne({ email });
    if (findUser) {
      return res
        .status(403)
        .json({ error: "A user with this email already exists" });
    }
    // Hash password
    const saltRounds = 10;
    const hashPassword = await bcryptjs.hash(password, saltRounds);

    const addUser = { fullname, email, password: hashPassword };
    const newUser = await User.create(addUser);

    // Create token
    const genToken = jwt.sign(
      { email: email, id: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "10d" }
    );
    res.status(201).json({
      success: "User registered successfully",
      newUser,
      token: genToken,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({ error: "Invalid Credentials" });
  }
  const isPasswordValid = await bcryptjs.compare(password, findUser.password);
  if (!isPasswordValid) {
    return res.status(403).json({ err: "Invalid credentials" });
  }

  // create token
  const genToken = jwt.sign(
    { email: email, id: findUser._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10d" }
  );

  return res.status(200).json({
    success: "User Logged In successfully",
    token: genToken,
    id: findUser._id,
  });
});

// social media logins
router.post("/socialLogin", loginLimiter, async (req, res) => {
  const { name, email, platform, id, profilePicture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const existingLogin = user.socialLogins.find(
        (item) => item.platform === platform && item.id === id
      );

      if (existingLogin) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10d",
        });

        return res.status(200).json({ success: true, user, token });
      } else {
        user.socialLogins.push({ platform, id });
        user.fullname = name;
        user.profilePicture = profilePicture;

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10d",
        });

        return res.status(200).json({ success: true, user, token });
      }
    }

    const newUser = new User({
      email,
      fullname: name,
      profilePicture: profilePicture,
      socialLogins: [{ platform, id }],
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "10d",
    });

    res.status(200).json({ success: true, newUser, token });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ success: false, error: "Error saving user" });
  }
});

// Guest User login
router.post("/guestUser", loginLimiter, async(req, res)=>{
try{
 let isGuest;
 isGuest = true

const password = generator.generate({
	length: 10,
	numbers: true
});
  const saltRounds = 10;
  const hashPassword = await bcryptjs.hash(password, saltRounds)
  const fullName = "Guest User"

  const addUser = {fullName, password:hashPassword, isGuest}
  const newUser = await User.create(addUser)

  const genToken = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn:"5d"} )
  res.status(201).json({message:"Guest user created successfully",
    newUser,
    token:genToken
  })
  }catch(error){
    console.error("Error in creating Guest user:", error);
    return res.status(500).json({ error: "Internal server error", error });
  }

})

module.exports = router;
