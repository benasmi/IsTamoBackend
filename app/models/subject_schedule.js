'subject_schedule strict';
const dbConn = require('../db');

//Mark object create
var SubjectSchedule = function(subjectSchedule) {}

SubjectSchedule.getSchedule = async (data) => {
    const [schedule,f] = await dbConn.query("SELECT * FROM SUBJECT_SCHEDULE " +
    "WHERE fk_subjectId=?", [data.subjectId])
    return schedule
}

SubjectSchedule.getSubjectSchedule = async (data) => {
    const [result,fields] = await dbConn.query("SELECT * FROM SUBJECT_SCHEDULE " +
    "WHERE id=?", [data.id])
    return result[0]
}

SubjectSchedule.createSubjectSchedule = async (data) => {
    const [result,fields] = await dbConn.query("INSERT INTO SUBJECT_SCHEDULE " +
    "(week_day, subject_time, fk_subjectId, fk_roomId, fk_scheduleId) VALUES " +
    "(?,?,?,?,?)", [data.weekDay, data.subjectTime, data.subjectId, data.roomId, data.scheduleId])
    return await SubjectSchedule.getSubjectSchedule({id: result.insertId})
}

SubjectSchedule.updateSubjectSchedule = async (data) => {
    await dbConn.query("UPDATE SUBJECT_SCHEDULE SET " +
    "week_day=COALESCE(?,week_day), subject_time=COALESCE(?,subject_time), " +
    "fk_subjectId=COALESCE(?,fk_subjectId), fk_roomId=COALESCE(?,fk_roomId), " +
    "fk_scheduleId=COALESCE(?,fk_scheduleId) " +  
    "WHERE id=?", [data.weekDay, data.subjectTime, data.subjectId, 
        data.roomId, data.scheduleId, data.id])
    return await SubjectSchedule.getSubjectSchedule({id: data.id})
}

SubjectSchedule.removeSubjectSchedule = async (data) => {
    const removed = SubjectSchedule.getSubjectSchedule({id: data.id})
    await dbConn.query("DELETE FROM SUBJECT_SCHEDULE " +
    "WHERE id=?", [data.id])
    return removed
}

module.exports = SubjectSchedule