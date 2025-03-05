const Users = require('../Models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email });
            if (user) return res.status(400).json({ msg: "Email already exists" });
            if (password.length < 6) return res.status(400).json({ msg: "Password must be at least 6 characters long" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new Users({ name, email, password: hashedPassword });
            await newUser.save();

            const accessToken = createAccesstoken({ id: newUser._id });
            const refreshToken = createRefreshtoken({ id: newUser._id });

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: "/users/refreshtoken",

            });
            

            res.json({
                msg: "User registered successfully",
                accessToken
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    
    refreshtoken: async (req, res) => {
        try {
            console.log(req.cookies)
            const rf_token = req.cookies.refreshtoken; 
            if (!rf_token) return res.status(400).json({ msg: "Please register or login hell" });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login or register" });
                
                const accessToken = createAccesstoken({ id: user.id });
                res.json({ user, accessToken });
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    login: async (req, res) => {
        try{
            const {email, password} = req.body;
            const user = await Users.findOne({email});
            if (!user) return res.status(400).json({msg:"user does not exist"});
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({msg:"incorrect password"});
            const accessToken = createAccesstoken({ id: user._id });
            const refreshToken = createRefreshtoken({ id: user._id });

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                path: "/users/refreshtoken",
                

            });
            res.json({accessToken});
        }
        catch(err){
            res.status(500).json({msg:err.message});
        }
    },

    logout: async (req, res) => {
        try{
            res.clearCookie('refreshtoken',{path:'/users/refreshtoken'})
            return res.json({msg:"Log Out"})
        }
        catch(err){
            res.status(500).json({msg:err.message});
        }
    },

    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("-password");
            if(!user) return res.status(401).json({msg:"User not found"});
            req.user =  user
            res.json(req.user)
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
};

const createAccesstoken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

const createRefreshtoken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); 
}

module.exports = userCtrl;
