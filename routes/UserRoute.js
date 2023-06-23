const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../middlewares/validationMiddleware");

// Register
router.post("/register", async (req, res) => {
    const { error } = await registerValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    // Checking if user is already in database
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).json({
            message: 'Email is already exist',
        });
    }
    const userExist = await User.findOne({username: req.body.username});
    if (userExist) {
        return res.status(400).json({
            message: 'User is already exist',
        });
    }
 
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({
            message: 'Email, password or username is empty',
        });
    }
 

    try {
        // gennerate hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassord = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassord
        });

        await newUser.save();
        return res.status(200).json({
            message: "Profile created successfully",
        })
        
    } catch (error) {
        return res.status(500).json(error);
    }
})

// Login
router.post("/login", async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
        });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // Checking if user is already in database
    if (!user) {
        return res.status(400).json({
            message: "Wrong email or password",
        });
    }
    
    // PASSWORD IS CORRECT
    const validPassword = await bcrypt.compare( password, user.password );
    if (!validPassword) {
        return res.status(400).json({
            message: "Wrond email or password",
        });
    }

    return res.status(200).json({
        message: 'Success',
        user: user.username,
        _id: user._id,
    });
})


module.exports = router;