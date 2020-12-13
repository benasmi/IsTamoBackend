'subject strict';
const dbConn = require('../db');

//Mark object create
var Subject = function(subject) {}

Subject.getSubject = async (data) => {
    const [subject,f] = await dbConn.query("SELECT * FROM SUBJECT " +
    "WHERE id=?", [data.subjectId])
    return subject[0]
}

Subject.getSubjects = async (data) => {
    const [subjects,f] = await dbConn.query("SELECT * FROM SUBJECT", [data.subjectId])
    return subjects
}

Subject.createSubject = async (data) => {
    const [result,fields] = await dbConn.query("INSERT INTO SUBJECT " +
    "(name, description, hours) VALUES " +
    "(?,?,?)", [data.name, data.description, data.hours])
    return await Subject.getSubject({subjectId: result.insertId})
}

Subject.updateSubject = async (data) => {
    await dbConn.query("UPDATE SUBJECT SET " +
    "name=COALESCE(?,name), description=COALESCE(?,description), hours=COALESCE(?,hours), " +
    "alter_date=NOW() WHERE id=?", 
    [data.name, data.description, data.hours, data.subjectId])
    return await Subject.getSubject({subjectId: data.subjectId})
}

Subject.removeSubject = async (data) => {
    const removed = Subject.getSubject({subjectId: data.subjectId})
    await dbConn.query("DELETE FROM SUBJECT " +
    "WHERE id=?", [data.subjectId])
    return removed
}

module.exports = Subject