const { userSchema } = require('../validators/userInputValidator')
const { hashPassword, compareHashPassword } = require("../utils/authHelpers")
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {
    try {
        const validateData = userSchema.parse(req.body)
        const hashedPassword = await hashPassword(validateData.password)
        const user = await User.create({
            username: validateData.username,
            password: hashedPassword,
            email: validateData.email
        })
        const token = await jwt.sign(user.email,process.env.JWT_SECRET)
        console.log(token)
        return res.json({ 'message':`Welcome ${user.username}`,'token':token })
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0]; // e.g. 'username' or 'email'
            return res.status(400).json({
                success: false,
                message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`,
            });
        }

        // ✅ Zod validation errors
        if (Array.isArray(err.errors)) {
            return res.status(400).json({
                success: false,
                errors: err.errors.map(e => e.message),
            });
        }

        // ✅ Fallback for other errors
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong",
        });
    }
}


module.exports = { registerUser }