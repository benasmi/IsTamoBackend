'subject_user strict';
const dbConn = require('../db');

//Mark object create
var SubjectUser = function(subjectUser) {}

SubjectUser.getSubjects = async (data) => {
    const [subjects,fields] = await dbConn.query("SELECT SUBJECT.* FROM SUBJECT_USER " +
    "LEFT JOIN SUBJECT ON SUBJECT.id=fk_subjectId " + 
    "WHERE fk_userId=?", [data.userId])
    return subjects
}

module.exports = SubjectUser