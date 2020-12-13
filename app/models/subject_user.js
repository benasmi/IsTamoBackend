'subject_user strict';
const dbConn = require('../db');

//Mark object create
var SubjectUser = function(subjectUser) {}

SubjectUser.getSubjects = async (data) => {
    const [result,fields] = await dbConn.query("SELECT SUBJECT.* FROM SUBJECT_USER " +
    "LEFT JOIN SUBJECT ON SUBJECT.id=fk_subjectId " + 
    "WHERE fk_userId=COALESCE(?,fk_userId)", [data.userId])
    return result
}

SubjectUser.findSubjectUser = async (data) => {
    const [result,fields] = await dbConn.query("SELECT * FROM SUBJECT_USER " +
    "WHERE id=COALESCE(?,id) and fk_userId=COALESCE(?,fk_userId) and fk_subjectId=COALESCE(?,fk_subjectId)", 
    [data.id, data.userId, data.subjectId])
    return result[0]
}

SubjectUser.createSubjectUser = async (data) => {
    const [result,fields] = await dbConn.query("INSERT INTO SUBJECT_USER " +
    "(fk_subjectId, fk_userId) VALUES " +
    "(?,?)", [data.subjectId, data.userId])
    return await SubjectUser.findSubjectUser({userId: result.insertId})
}

SubjectUser.updateSubjectUser = async (data) => {
    await dbConn.query("UPDATE SUBJECT_USER SET " +
    "fk_subjectId=COALESCE(?,fk_subjectId), fk_userId=COALESCE(?,fk_userId) " +
    "WHERE id=?", 
    [data.subjectId, data.userId, data.id])
    return await SubjectUser.findSubjectUser({userId: data.id})
}

SubjectUser.removeSubjectUser = async (data) => {
    const removed = SubjectUser.findSubjectUser({userId: data.id})
    await dbConn.query("DELETE FROM SUBJECT_USER " +
    "WHERE id=?", [data.id])
    return removed
}

module.exports = SubjectUser