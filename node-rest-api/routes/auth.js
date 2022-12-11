const router = require("express").Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { restart } = require("nodemon");

//! Register

router.post("/register", async (req, res) => {
    try {
        // ! generate new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);

        // ! create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            city: req.body.city,
            from: req.body.from,
            relationship: req.body.relationship,
            desc: req.body.desc
        });

        // ! save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

// ! login

router.post("/login", async (req, res) => {
    try {
        // ! find user through email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found")
        }
        // ! check password validation
        const validPassword = await bcryptjs.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(400).json("the password is not valid");
        }
        else res.status(200).json(user)

    }
    catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;