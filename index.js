const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const UsersRouter = require("./routers/users")
const PendingRouter = require("./routers/pending")
const AssetRouter = require("./routers/asset")
const ConsumableRouter = require("./routers/consumable");
const NotificationRouter = require("./routers/notifications");
const notification = require("./module/notification");
const Asset = require("./module/assets")
const Pending = require("./module/pendings")
const Consumable = require("./module/consumable")
const user = require("./module/users");
const CronJob = require("./middleware/cron");
const http = require('http');
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
  }); 
require("dotenv/config");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));
app.get("/", (req, res) => {
  res.send("oke123");
});

socketIo.on("connection", (socket) => { ///Handle khi có connect từ client tới
  // console.log("New client connected" + socket.id); 

  socket.on("borrow_asset",async function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    // console.log("data", data);
    try {
      const newNotification = new notification({
         assetName: data.assetName,
         userID: data.userID,
         title: data.title
      })
        await newNotification.save()
     
  } catch (error) {
    console.log("err", error);
  }
    socketIo.emit("borrow_asset", "successfuly");// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("reset_user", async function(){
    const getUser = await user.find();
    socketIo.emit("reset_user", getUser);
  })
  socket.on("reset_asset", async function(){
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
    socketIo.emit("reset_asset", getAssets);
  })
  socket.on("reset_pending", async function(){
    const getPending = await Pending.find().populate("assetID").populate("employeeID").exec();
    socketIo.emit("reset_pending", getPending);
  })
  socket.on("reset_consumable", async function(){
    const getConsumable = await Consumable.find();
    socketIo.emit("reset_consumable", getConsumable);
  })

  socket.on("allow_borrow_asset",async function(data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
    try {
      const newNotification = new notification({
        assetName: data.assetName,
         userID: data.userID,
         title: data.title
      })
        await newNotification.save()
     
  } catch (error) {
    console.log("err", error);
  }
    socketIo.emit("allow_borrow_asset", "successfuly");// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});
app.use("/api/user", UsersRouter)
app.use("/api/asset", AssetRouter)
app.use("/api/pending", PendingRouter)
app.use("/api/consumable", ConsumableRouter)
app.use("/api/notification", NotificationRouter) 


console.log(process.env.MONGODB_URL);
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true }, function(err) {
    if (err) throw err;
    CronJob(socketIo)
    console.log("connect DB");
})


server.listen(5000);