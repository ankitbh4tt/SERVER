const {
  userRegisterSchema,
  userLoginSchema,
} = require("../validators/userInputValidator");
const { hashPassword, compareHashPassword } = require("../utils/authHelpers");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const validateData = userRegisterSchema.parse(req.body);
    const { username, email } = validateData;
    const isUserAlreadyExists = await User.findOne({ username });
    if (isUserAlreadyExists) {
      return res.status(409).json({
        message:
          "User Already Exists with this username,Please try with different one!",
      });
    }
    const isExistingEmail = await User.findOne({ email: email.toLowerCase() });
    if (isExistingEmail) {
      return res.status(409).json({
        message: "User already exists with this email,Please try another one!",
      });
    }
    const hashedPassword = await hashPassword(validateData.password);
    const user = await User.create({
      username: validateData.username,
      password: hashedPassword,
      email: validateData.email.toLowerCase(),
    });
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(201)
      .json({ message: `Welcome ${user.username}`, token: token });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    // parse data and validate through ZOD
    const validateData = userLoginSchema.parse(req.body);
    // Hash password if data is valid
    const user = await User.findOne({
      email: validateData.email.toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({ error: "Invalid Credentials!" });
    }

    // found user now try to compare password using bcrypt
    const isCorrectPassword = await compareHashPassword(
      validateData.password,
      user.password
    );
    if (!isCorrectPassword) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    // eslint-disable-next-line no-undef
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(201)
      .json({ message: "Logged in successfully!", token: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { registerUser, loginUser };
