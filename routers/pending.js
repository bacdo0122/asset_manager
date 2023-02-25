const express = require("express");
const consumable = require("../module/consumable");
const Pending = require("../module/pendings");
const Asset = require("../module/assets");
const router = express.Router()

router.get("/",  async (req,res)=>{
    try {
        const getPending = await Pending.find().populate("assetID").populate("employeeID").exec();
        res.json(getPending)
    } catch (error) {
        res.status(400).json({message:error})
    } 
}) 

router.post("/add", async (req,res)=>{
   
    try {
        const newPending = new Pending({
           assetID: req.body.assetID,
           employeeID: req.body.employeeID,
        })
          await newPending.save()
        res.status(200).json("successfuly!")
    } catch (error) {
        res.status(400).json({message: error})
    }
})

router.delete("/delete/:id/:assetID", async (req,res)=>{
    try {
        const removePending = await Pending.deleteOne({_id:req.params.id})
        await Asset.updateOne({
            _id: req.params.assetID
        },
        {
            $set: {
                status: "unused",
            }
        }
        )
        res.status(200).json(removePending)
    } catch (error) {
        res.status(400).json({message:error})
    }
}) 

router.post("/accept/:id/:username", async (req,res)=>{
  
    try {
         const newConsumable = new consumable({
           id: req.body.assetID._id,
           seri: req.body.assetID.seri,
           purchaseCost: req.body.assetID.purchaseCost,
           purchaseDate: req.body.assetID.purchaseDate,
           shoppingPlace: req.body.assetID.shoppingPlace,
           name: req.body.assetID.name,
           category: req.body.assetID.category,
           img: req.body.assetID.img,
           description: req.body.assetID.description,
           status: "expired",
         })
         await newConsumable.save()
         await Pending.deleteOne({_id:req.params.id})
         await Asset.updateOne({
            _id: req.body.assetID._id
        },
        {
            $set: {
                status: "active",
                local: req.params.username
            }
        }
        )
        res.status(200).json("successfully")
    } catch (error) {
        res.status(400).json({message:error})
    }
})

module.exports = router; 