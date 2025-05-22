const { userSchema } = require('../validators/userInputValidator')
const { hashPassword, compareHashPassword } = require("../utils/authHelpers")
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res, next) => {

}


module.exports = { registerUser }