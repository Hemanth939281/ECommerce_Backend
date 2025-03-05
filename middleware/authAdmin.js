const Users = require("../Models/userModel");

const authAdmin = async (req, res, next) =>{
    try {
        const user = await Users.findById(req.user.id)
        if(!user || user.role!== 1){
            return res.status(403).json({message:"Unauthorized access"})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
    next()
}

module.exports = authAdmin;