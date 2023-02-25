const mongoose = require("mongoose")
const { Schema } = mongoose;
const PendingSchema = mongoose.Schema({
   assetID:{
    type: String,
    ref:"assets"
   },
   employeeID:{
    type: Schema.Types.ObjectId,
    ref: "users"
   }
},
{ timestamps: true }
)

module.exports = mongoose.model("pendings", PendingSchema)