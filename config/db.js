const { default: mongoose } = require("mongoose")
require('dotenv').config();
 
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Dabatase Connection Successful")
    } catch (error) {
        console.error('Getting error to connect to DB',error)
        throw new Error(`❌ DB Connection Error: ${error.message}`);
    }
}


module.exports = connectDB