const express = require("express");
const CronJob = require("../middleware/cron");
const Asset = require("../module/assets");
const router = express.Router()

router.get("/", async (req,res)=>{
    try {
        const getAssets = await Asset.aggregate([
       
            {
              "$group": {
                '_id': "$name",
                "id": {
                    "$first": "$_id"
                },
                "category": {
                    "$first": "$category"
                  },
                "purchaseCost": {
                    "$first": "$purchaseCost"
                  },
                "availability": {
                    "$sum": {
                        "$cond": [
                          { "$ne": ["$status", "unused"] },
                          0,
                          1
                        ]
                      }
                  },
                "img": {
                    "$first": "$img"
                }
              }
            },
            {
                "$project":{
                    "_id": "$_id",
                    "id": "$id",
                    "category": "$category",
                    "purchaseCost": "$purchaseCost",
                    "availability": "$availability",
                    "img": "$img",
                    "status": {
                        "$cond": [
                            { "$gt": ["$availability", 0] },
                            "active",
                            "unavailable"
                          ]
                    }
                }
            }
          ])
        res.json(getAssets)
    } catch (error) {
        res.status(400).json({message:error})
    } 
}) 
router.get("/getMany/:name", async (req,res)=>{
    try {
        const getAssets = await Asset.find({name: req.params.name})
        res.status(200).json(getAssets)
    } catch (error) { 
        res.status(400).json({message:error})

    }
})

router.get("/getAssetByUser/:username", async (req,res)=>{
    console.log("user:", req.params.username);
    try {
        const getAssets = await Asset.find({local: req.params.username})
        res.status(200).json(getAssets)
    } catch (error) { 
        res.status(400).json({message:error})

    }
})

const updateState = async (id) => {
    try {
        await Asset.updateOne({
            _id: id
        },
        {
            $set: {
                status: "pending",
            }
        }
        )

    } catch (error) {
        console.log("err:", error);
    } 
}

router.post("/borrow/:name", async (req,res)=>{
    try {
        const getAssets = await Asset.findOne({name: req.params.name, status: "unused"})
        updateState(getAssets._id)
        res.status(200).json(getAssets)
    } catch (error) { 
        res.status(400).json({message:error})

    }
})

router.get("/getStatus/:type", async (req,res)=>{
    try {
        const getAssets = await Asset.find({status: `${req.params.type}`})
        res.status(200).json(getAssets)
    } catch (error) { 
        res.status(400).json({message:error})

    }
})


router.get("/getAll", async (req,res)=>{
    try {
        const getAssets = await Asset.find()
        res.status(200).json(getAssets)
    } catch (error) { 
        res.status(400).json({message:error})

    }
})

router.get("/getOne/:id", async (req,res)=>{
    try {
        const getAsset = await Asset.findById(req.params.id)
        res.status(200).json(getAsset)
    } catch (error) {
        res.status(400).json({message:error})

    }
})

router.post("/add", async (req,res)=>{
   
    try {

        for(let i = 0; i < Number(req.body.stock); i++){
            const newAsset = new Asset({
                seri: req.body.seri,
                purchaseCost: req.body.purchaseCost,
                purchaseDate: req.body.purchaseDate,
                shoppingPlace: req.body.shoppingPlace,
                name: req.body.name,
                category: req.body.category,
                stock:req.body.stock,
                outOfDate: req.body.outOfDate,
                description: req.body.description,
                img: req.body.img
            })
              await newAsset.save()
        }
        res.status(200).json("successfuly!")
    } catch (error) {
        res.status(400).json({message: error})
    }
})

router.put("/update/:id", async (req,res)=>{
    try {
        const updateAsset = await Asset.updateOne({
            _id: req.params.id
        },
        {
            $set: {
                seri: req.body.seri,
                purchaseCost: req.body.purchaseCost,
                purchaseDate: req.body.purchaseDate,
                shoppingPlace: req.body.shoppingPlace,
                name: req.body.name,
                category: req.body.category,
                stock:req.body.stock,
                outOfDate: req.body.outOfDate,
                description: req.body.description,
                status: req.body.status,
                img: req.body.img
            }
        }
        )
        res.json(updateAsset)
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.delete("/delete/:id", async (req,res)=>{
    try {
        const getAsset = await Asset.findById(req.params.id)
        const removeAsset = await Asset.deleteOne({_id:req.params.id})
        await Asset.updateMany({name: getAsset.name}, {
            $inc: {
                stock: -1
            }
        })
        res.status(200).json(removeAsset)
    } catch (error) {
        res.status(400).json({message:error})

    }
})

router.post("/repay/:id",async (req,res)=>{
    try {
      const repay =   await Asset.updateOne({
            _id: req.params.id
        },
        {
            $set: {
                local: "",
                status: "unused",
            }
        }
        )
        res.status(200).json(repay)
    } catch (error) {
        res.status(400).json({message:error})

    }
})

 

module.exports = router; 