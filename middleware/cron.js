const cron = require('cron');
const checkOutDate = require("../cronJob")
const CronJob = async(socket) => {
  
    try {
        const job = new cron.CronJob({
            cronTime: "44 22 * * *", // Chạy Jobs vào 23h30 hằng đêm
            onTick: function() {
                checkOutDate(socket)
            },
            start: true, 
            timeZone: 'Asia/Ho_Chi_Minh' // Lưu ý set lại time zone cho đúng 
          });
          
          job.start();
    } catch (error) {
        // res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
module.exports = CronJob