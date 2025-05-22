const bcrypt = require('bcrypt')

const hashPassword = async(plainPassword)=>{
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword,saltRounds)
        return hashedPassword;
    } catch (error) {
        console.error(error)
        throw new Error("Error while hasing password")
    }
}


const compareHashPassword = async (plainPassword,hashedPassword)=>{
    try {
        const match = await bcrypt.compare(plainPassword,hashedPassword)
        return match;
    } catch (error) {
        throw new Error("Error while comparing password")
    }
}



module.exports = {hashPassword,compareHashPassword}