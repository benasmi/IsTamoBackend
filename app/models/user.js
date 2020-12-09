'user strict';
const db = require('../db');
var dbConn = require('../db');
const crypto = require('crypto')

//User object create
var User = function(user){
   
};

User.find = async (fields, values) => {
    let users
    if (fields.constructor === Array && values.constructor === Array) {
        if (fields.length != values.length) throw new Error("Argument lengths mismatch")

        let query = "select * from USERS where ?? = ?"
        let args = [fields[0], values[0]]

        for (let i = 1; i < fields.length; i++) {
            query += " and ?? = ?" 
            args.push(fields[i], values[i])
        }

        [users, flds] = await dbConn.query(query, args);

    } else if (typeof fields === 'string' && !(values instanceof Array)) {
        [users, flds] = await dbConn.query("select * from USERS where ?? = ?", [fields, values]);
    } else throw new Error("Bad parameters")

    users.forEach(user => {
        delete user.password
        delete user.refresh_token
    })

    return users
}

User.findOne = async (fields, values) => {
    const users = await User.find(fields, values)
    return users[0]
}

User.getRelatedUsers = async (userid) => {
    const [users,fields] = await dbConn.query('select * from USERS where fk_userId=?', [userid])

    users.forEach(user => {
        delete user.password
        delete user.refresh_token
    })

    return users
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

User.create = async (user) => {
    // todo: backend validations
    user.password = crypto.createHash('sha256').update(user.password).digest('hex');
    await dbConn.query('INSERT INTO USERS ' + 
    '(fk_userId, fk_roleId, name, surname, birthday, email, password, address, id_code) ' +
    'VALUES (?,?,?,?,?,?,?,?,?)', [user.parent, user.roleId, user.name, user.surname, user.birthday, 
        user.email, user.password, user.address, user.id_code])
    delete user.password
    return user
}

User.update = async (user) => {
    // todo: backend validations
    if (user.password)
        user.password = crypto.createHash('sha256').update(user.password).digest('hex');
    await dbConn.query('UPDATE USERS SET ' + 
    'fk_userId=COALESCE(?,fk_userId), fk_roleId=COALESCE(?,fk_roleId), name=COALESCE(?,name), ' + 
    'surname=COALESCE(?,surname), birthday=COALESCE(?,birthday), email=COALESCE(?,email), ' + 
    'password=COALESCE(?,password), address=COALESCE(?,address), id_code=COALESCE(?,id_code) ' +
    ' WHERE id=?', [user.parent, user.roleId, user.name, user.surname, user.birthday, 
        user.email, user.password, user.address, user.id_code, user.id])
    const result = await User.findOne('id', user.id)
    delete result.password
    delete result.refresh_token
    return result
}

User.delete = async (userid) => {
    await dbConn.query("DELETE FROM USERS WHERE id=?", [userid])
}

module.exports = User;