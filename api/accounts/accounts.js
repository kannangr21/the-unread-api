const express = require('express');
const router = express.Router();

const User = require('../../models/user');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/register', async(req, res) => {
    const userName = req.body.userName;
    const email = req.body.email;
    const displayName = req.body.displayName;
    const profileUrl = req.body.profileUrl;

    const newUser = new User({
        userName: userName,
        email: email,
        displayName: displayName,
        profileUrl: profileUrl
    });

    await newUser.save()
        .then((result) => res.json({success:true, message: "User Created Successfully"}, 201))
        .catch((err) => {
            if(err && err.code === 11000)
            res.status(409).json({success:false, message: err});
            else{
            console.log("Error in register : ", err);
        res.status(500).json({message:"Internal Server Error"})}
    });
});

router.get('/user/:email', async (req, res) => {
    const email = req.params.email;
    const getUser = await User.findOne({email: email});
    if(getUser){
        res.status(200).json(getUser);
    } else {
        res.status(404).json({success: false, message: "User Not Found"});
    }
});

router.get('/getAllUsers', async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

module.exports = router;