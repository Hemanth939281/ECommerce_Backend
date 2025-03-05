const mongoose = require("mongoose");
require("dotenv").config()
const mongodbConn = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
            console.log("Mongodb connected");
        }
    
    catch(error){
        console.log("Error connecting mongodb : ",error);
    }
}

module.exports = mongodbConn;