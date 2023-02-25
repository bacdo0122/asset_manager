const express = require("express");
const notificationWare = require("../middleware/notification");
const notification = require("../module/notification");
const router = express.Router()

router.get("/", notificationWare , async (req,res)=>{
    // console.log("role:", req.user.role);
    try {
        if(req.user.role === "admin"){
            const getnotification = await notification.find({
                title: {
                    $in: ["borrow_asset", "expired_asset"]
                }
            }).populate("userID").exec();
            res.json(getnotification)

        }
        else{
            const getnotification = await notification.find({
                title:"allow_borrow_asset"    
            }).populate("userID").exec();
            const getnotificationByUser = getnotification.filter(item => item.userID.username === req.user.username)
            res.json(getnotificationByUser)
        }
    } catch (error) {
        res.status(400).json({message:error})
    } 
}) 

router.post("/add", async (req,res)=>{
   
    try {
        const newNotification = new notification({
           assetName: req.body.assetName,
           userID: req.body.userID,
           title: req.body.title
        })
          await newNotification.save()
        res.status(200).json("successfuly!")
    } catch (error) {
        res.status(400).json({message: error})
    }
})

router.delete("/delete/:id", async (req,res)=>{
    try {
        const deleteOne = await notification.deleteOne({_id: req.params.id})
        res.status(200).json(deleteOne)
    } catch (error) {
        res.status(400).json({message: error})
    }
})

module.exports = router; 