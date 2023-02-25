const express = require("express");
const Consumable = require("../module/consumable");
const router = express.Router()

router.get("/",  async (req,res)=>{
    try {
        const getConsumable = await Consumable.find();
        res.json(getConsumable)
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.post("/add", async (req,res)=>{
    const newConsumable = new Consumable({
        id:req.body.id,
        seri: req.body.seri,
        purchaseCost: req.body.purchaseCost,
        purchaseDate: req.body.purchaseDate,
        shoppingPlace: req.body.shoppingPlace,
        name: req.body.name,
        category: req.body.category,
        img: req.body.img,
        description: req.body.description,
        status: req.body.status,
    })
    try {
        await newConsumable.save()
    } catch (error) {
        res.status(400).json({message:error})
    } 
})

router.delete("/delete/:id", async (req,res)=>{
    try {
        const removeConsumable = await Consumable.deleteOne({_id:req.params.id})
     
        res.status(200).json(removeConsumable)
    } catch (error) {
        res.status(400).json({message:error})
    }
}) 

module.exports = router; 