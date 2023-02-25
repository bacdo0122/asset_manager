const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const Userchema = mongoose.Schema({
  name: {
    type: String,
    require:true
  },
  phone: {
    type: String,
    require:true
  },
  address: {
    type: String,
    require:true
  }
  ,
  gender: {
    type: String,
    enum: ["female", "male"],
    default: "male",
  }
  ,
  username: {
    type: String,
    require:true
  }
  ,
  employeeID: {
    type: String,
    require:true
  }
  ,
  email: {
    type: String,
    require:true
  }
  ,
  department: {
    type: String,
    require:true
  }
  ,
  dateOfBirth: {
    type: Date,
    required: true,
  }
  ,
  password: {
    type: String,
    require:true,
    
  },
   img: {
    type: String,
    default: "a.jpg"
},
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee"
  }
 
},{ timestamps: true }
);



Userchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
  // console.log("token:1", token);
  return token
}


Userchema.statics.findByCredentials = async (username, password) => {
  // Search for a user by username and password.
  
  const User = await user.findOne({ username} )
  if (!User) {
      throw new Error({ error: 'Invalid login credentials' })
  }
  return User
}
const user = mongoose.model("users", Userchema)
module.exports = user