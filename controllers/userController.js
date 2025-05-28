const { userRegisterSchema, userLoginSchema } = require('../validators/userInputValidator')
const { hashPassword, compareHashPassword } = require("../utils/authHelpers")
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {
    if(!req.body){
        res.status(400).json({"message":"All fields are required!"})
    }
    try {
        const validateData = userRegisterSchema.parse(req.body)
        const {username} = validateData 
        console.log(username)
        const isUserAlreadyExists = await User.find({username})
        console.log(isUserAlreadyExists)
        if(isUserAlreadyExists.length){
            return res.status(409).json({"message":"User Already Exists,Please try with different credentials!"})
        }
        const hashedPassword = await hashPassword(validateData.password)
        const user = await User.create({
            username: validateData.username,
            password: hashedPassword,
            email: validateData.email
        })
        const token = await jwt.sign({id:user._id},process.env.JWT_SECRET)
        console.log(token)
        return res.status(201).json({ 'message':`Welcome ${user.username}`,'token':token })
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern)[0]; // e.g. 'username' or 'email'
            return res.status(400).json({
                success: false,
                message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists`,
            });
        }

        // ✅ Zod validation errors
        if (err.name === 'ZodError') {
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


const loginUser = async (req,res,next)=>{
    try {
        // parse data and validate through ZOD
        const validateData = userLoginSchema.parse(req.body)

        // Hash password if data is valid
        const hashedPassword = await hashPassword(validateData.password)

    } catch (error) {
        console.error(error)
    }
}


module.exports = { registerUser ,loginUser}