'scedule strict';
const dbConn = require('../db');

//Mark object create
var Schedule = function(schedule) {}

Schedule.getScheduleInfo = async (data) => {
    const [info,f] = await dbConn.query("SELECT * FROM SCHEDULE " +
        "WHERE id=?", [data.scheduleId])
    return info[0]
}

Schedule.createSchedule = async (data) => {
    const [result,fields] = await dbConn.query("INSERT INTO SCHEDULE " +
    "(name, description) VALUES " +
    "(?,?)", [data.name, data.description])
    return await Subject.getSubject({scheduleId: result.insertId})
}

Schedule.updateSchedule = async (data) => {
    await dbConn.query("UPDATE SCHEDULE SET " +
    "name=COALESCE(?,name), description=COALESCE(?,description), " +
    "alter_date=NOW() WHERE id=?", 
    [data.name, data.description, data.scheduleId])
    return await Subject.getSubject({scheduleId: data.scheduleId})
}

Schedule.removeSchedule = async (data) => {
    const removed = Subject.getSubject({scheduleId: data.scheduleId})
    await dbConn.query("DELETE FROM SCHEDULE " +
    "WHERE id=?", [data.scheduleId])
    return removed
}


module.exports = Schedule
