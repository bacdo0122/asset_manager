var mongoose = require('mongoose');
const Asset = require("./module/assets")
const Consumable = require("./module/consumable")
const Notification = require("./module/notification")
const checkOutDate = async (socketIo) => {
  
    try {
      const getAll = await Asset.find();
      // Get today's date
      var todaysDate = new Date();
      for await(let asset of getAll){
          var inputDate = new Date(asset.outOfDate);
        if(todaysDate.setHours(23,59,59,0) > inputDate.setHours(0,0,0,0) ){
            await Asset.deleteOne({_id:asset._id})
            const newConsumable = new Consumable({
                id: asset._id,
                seri: asset.seri,
                purchaseCost: asset.purchaseCost,
                purchaseDate: asset.purchaseDate,
                shoppingPlace: asset.shoppingPlace,
                name: asset.name,
                category: asset.category,
                img: asset.img,
                description: asset.description,
                status: "expired"
            })
            await newConsumable.save()
            const newNotification = new Notification({
                assetName: asset.name,
                title: "expired_asset"
            }) 
            await newNotification.save()
            socketIo.emit("expired_asset", "asset expired")
            // console.log("expired", newNotification);
        }
      }
        // res.json("success")
    } catch (error) {
        // res.status(400).json({message:error})
    } 
}

module.exports = checkOutDate;