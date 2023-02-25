const mongoose = require("mongoose")
const { Schema } = mongoose;
const NotificationSchema = mongoose.Schema({
   assetName:{
    type: String,
    require:true
   },
   userID:{
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null
   },
   title: {
    type:String,
    require: true
   }
},
{ timestamps: true }
)

module.exports = mongoose.model("notifications", NotificationSchema)