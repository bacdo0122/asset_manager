const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router()
const user = require("../module/users")
const bcrypt = require('bcryptjs');

router.get("/", async (req,res)=>{
    try {
        const getUser = await user.find();
        res.json(getUser)
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.post("/add", async (req,res)=>{
    try {
        const checkUsername = await user.findOne({username: req.body.username})
        console.log("checkUsername:", checkUsername);
        if(checkUsername)  throw Error ('username exsited!')
       else{
        const newUser = new user(req.body)
        await newUser.save();
        res.json("successfully!")
       }
    } catch (error) {
        res.status(400).json({message:error})

    }
})


router.get("/:username", async (req,res)=>{
    try {
        const getUser = await user.findOne({username: req.params.username});
        res.json(getUser)
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.put("/edit/:id", async (req,res)=>{
    try {
        const updateUser = await user.updateOne({
            username: req.params.id
        },
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                dateOfBirth: req.body.dateOfBirth,
                department: req.body.department,
                employeeID: req.body.employeeID,
                img: req.body.img
            }
        }
        )
        res.json(updateUser)
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.delete("/delete/:id", async (req,res)=>{
    try {
        const removeUser = await user.deleteOne({_id:req.params.id})
        res.json(removeUser)
    } catch (error) {
        res.status(400).json({message:error})

    }
})

router.get("/getMe/confirm", auth, async (req,res)=>{
    res.status(200).json(req.user)
})

router.post("/login", async (req,res)=>{
    try {
        const { username, password } = req.body
        const findUser = await user.findByCredentials(username, password)
        if (!findUser) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await findUser.generateAuthToken()
        res.status(200).json({ user: findUser, token:token })
    } catch (error) {
        console.log("err", error);
        res.status(400).send({message: error})
    }
})

module.exports = router;