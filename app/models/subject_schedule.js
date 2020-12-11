'subject_schedule strict';
const dbConn = require('../db');

//Mark object create
var SubjectSchedule = function(subjectSchedule) {}

SubjectSchedule.getSchedule = async (data) => {
    const [schedule,f] = await dbConn.query("SELECT * FROM SUBJECT_SCHEDULE " +
    "WHERE fk_subjectId=?", [data.subjectId])
    return schedule
}

module.exports = SubjectSchedule