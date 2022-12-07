const router = require("express").Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

// ! update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // re-set password
        if (req.body.password) {
            try {
                const salt = await bcryptjs.genSalt(10);
                req.body.password = await bcryptjs.hash(req.body.password, salt);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        };
        // re-set new user data
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been updated");
        }
        catch (err) {
            return res.status(500).json(err);
        };
    }
    else {
        return res.status(403).json("You can update only your account!");
    }
});

// ! delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        // re-set new user data
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }
        catch (err) {
            return res.status(500).json(err);
        };
    }
    else {
        return res.status(403).json("You can delete only your account!");
    }
});

// ! get a user 
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // only take the other data
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other);
    }
    catch (err) {
        return res.status(500).json(err);
    }
});

// ! follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json("user has been followed");
            }
            else {
                res.status(403).json("You already follow this user")
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can't follow yourself");
    }
});

// ! unfollow a user 
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json("user has been unfollowed");
            }
            else {
                res.status(403).json("You don't follow this user")
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can't unfollow yourself");
    }
});


module.exports = router;
