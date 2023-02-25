const mongoose = require("mongoose")
const { Schema } = mongoose;
const ConsumableSchema = mongoose.Schema({
    id:{
        type: Number,
        require: true
    },
   seri: {
      type: String,
      require: true
  },
  purchaseCost: {
      type: Number,
      require: true
  },
  purchaseDate: {
      type:Date,
      require:true
  },
  shoppingPlace: {
      type: String,
      require: true
  },
  name: {
      type: String,
      require: true
  },
  category: {
      type: String,
      require: true,
  },
  img:{
   type: String,
   default: "a.jpg"
},
description: {
   type:String,
   require:true
},
   status: {
      type:String,
      default: "active"
   }
},
{ timestamps: true }
)

module.exports = mongoose.model("consumables", ConsumableSchema)