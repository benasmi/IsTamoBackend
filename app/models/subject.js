'subject strict';
const dbConn = require('../db');

//Mark object create
var Subject = function(subject) {}

Subject.getSubject = async (data) => {
    const [subject,f] = await dbConn.query("SELECT * FROM SUBJECT " +
    "WHERE id=?", [data.subjectId])
    return subject[0]
}

module.exports = Subject