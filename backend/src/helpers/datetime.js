const moment = require('moment-timezone');

const currentDateTime = moment.tz(new Date(), 'Asia/Manila').format('YYYY-MM-DDTHH:mm:ss');
const currentDateTimeInt = Date.now();

module.exports.currentTime = currentDateTime;
module.exports.currentDateTimeInt = currentDateTimeInt;