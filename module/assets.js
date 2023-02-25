const mongoose = require("mongoose")
const AutoIncrement = require("mongoose-sequence")(mongoose)
const AssetsSchema = mongoose.Schema({ 
    _id: {
        type:Number,
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
    stock:{
        type:Number,
        require:true
    },
    img:{
        type: String,
        default: "a.jpg"
    },
    outOfDate:{
        type:Date,
        require:true
    },
    description: {
        type:String,
        require:true
    },
    status: {
        type: String,
        default: "unused"
    },
    local: {
        type:String,
        default: ""
    }
},
{ timestamps: true, _id:false }
)
AssetsSchema.plugin(AutoIncrement);

module.exports = mongoose.model("assets", AssetsSchema)