'scedule strict';
const dbConn = require('../db');

//Mark object create
var Schedule = function(schedule) {}

Schedule.getScheduleInfo = async (data) => {
    const [info,f] = await dbConn.query("SELECT * FROM SCHEDULE " +
        "WHERE id=?", [data.scheduleId])
    return info[0]
}

module.exports = Schedule
