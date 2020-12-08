'user strict';
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
    } else if (fields.constructor === String && values.constructor === String) {
        return await dbConn.query("select * from USERS where ?? = ?", [fields, values]);
    } else throw new Error("Bad parameters")
}

User.findOne = async (fields, values) => {
    const [rows,flds] = await User.find(fields, values)
    return rows[0]
}

User.updateRefreshToken = async (userid, token) => {
    return await dbConn.query('update USERS set refresh_token=? where id=?', [token, userid]);
}

module.exports = User;