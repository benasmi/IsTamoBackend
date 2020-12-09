'user strict';
const db = require('../db');
var dbConn = require('../db');

//User object create
var User = function(user){
   
};

User.find = async (fields, values) => {
    if (fields.constructor === Array && values.constructor === Array) {
        if (fields.length != values.length) throw new Error("Argument lengths mismatch")

        let query = "select * from USERS where ?? = ?"
        let args = [fields[0], values[0]]

        for (let i = 1; i < fields.length; i++) {
            query += " and ?? = ?" 
            args.push(fields[i], values[i])
        }

        return await dbConn.query(query, args);
    } else if (typeof fields === 'string' && !(values instanceof Array)) {
        return await dbConn.query("select * from USERS where ?? = ?", [fields, values]);
    } else throw new Error("Bad parameters")
}

User.findOne = async (fields, values) => {
    const [rows,flds] = await User.find(fields, values)
    return rows[0]
}

User.getRelatedUsers = async (userid) => {
    const [rows,fields] = await dbConn.query('select * from USERS where fk_userId=?', [userid])
    return rows
}

User.updateRefreshToken = async (userid, token) => {
    return await dbConn.query('update USERS set refresh_token=? where id=?', [token, userid]);
}

User.getAllMarks = async (userid) => {
    const [enrollments,fields] = await dbConn.query('select * from SUBJECT_USER where fk_userId=?', [userid])

    let result = []
    for (let i = 0; i < enrollments.length; i++) {
        const [subject,fields] = await dbConn.query('select * from SUBJECT where ' + 
            'id = ?', [enrollments[i].fk_subjectId])
        const [marks,fields2] = await dbConn.query('select * from MARK where ' + 
            'fk_subjectId=? and fk_userId=?', [subject[0].id, userid])

        subject[0].marks = marks
        result.push(subject[0])
    }

    return result
}

module.exports = User;