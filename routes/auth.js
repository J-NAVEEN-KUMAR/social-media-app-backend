const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//User Register route
router.post("/register", async (req, res) => {
  try {
    //encrypting the password given by the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //creating the new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save the user into the database and respond
    const user = await newUser.save();
    // res.status(200).json(user);
    res.status(200).send("Registration successful! Please login.");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//User Login route
router.post("/login", async (req, res) => {
  try {
    //validating the email
    const user = await User.findOne({ email: req.body.email });
    !user &&
      res
        .status(404)
        .json("User with this email doesn't exists. Please register.");

    //comparing the password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(404).json("The entered password is incorrect");

    //sending response if both username and password matches
    res.status(200).json("Hurray! Logged in successfully.");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
