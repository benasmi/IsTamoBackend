'user strict';
const db = require('../db');
var dbConn = require('../db');
const crypto = require('crypto')

//User object create
var User = function(user){
   
};

User.find = async (data) => {
    const [users,fields] = await dbConn.query("SELECT * FROM USERS WHERE " + 
    "fk_roleId=COALESCE(?,fk_roleId) and IFNULL(fk_userId,'0')=COALESCE(?,fk_userId,'0') and " + 
    "name=COALESCE(?,name) and surname=COALESCE(?,surname) and birthday=COALESCE(?,birthday) and " + 
    "email=COALESCE(?,email) and address LIKE CONCAT(CONCAT('%', COALESCE(?, address)), '%') and " + 
    "password=COALESCE(?,password) and id=COALESCE(?,id)", 
    [data.roleId, data.userId, data.name, data.surname, data.birthday, data.email, data.address, data.password, data.id])

    users.forEach(user => {
        delete user.password
        delete user.refresh_token
    })

    return users
}

User.findOne = async (data) => {
    const users = await User.find(data)
    return users[0]
}

User.getRelatedUsers = async (data) => {
    const [users,fields] = await dbConn.query('select * from USERS where fk_userId=?', [data.userId])

    users.forEach(user => {
        delete user.password
        delete user.refresh_token
    })

    return users
}

User.updateRefreshToken = async (data) => {
    return await dbConn.query('update USERS set refresh_token=? where id=?', [data.token, data.userId]);
}

User.getAllMarks = async (data) => {
    const [enrollments,fields] = await dbConn.query('select * from SUBJECT_USER where fk_userId=?', [data.userid])

    let result = []
    for (let i = 0; i < enrollments.length; i++) {
        const [subject,fields] = await dbConn.query('select * from SUBJECT where ' + 
            'id = ?', [enrollments[i].fk_subjectId])
        const [marks,fields2] = await dbConn.query('select * from MARK where ' + 
            'fk_subjectId=? and fk_userId=?', [subject[0].id, data.userid])

        subject[0].marks = marks
        result.push(subject[0])
    }

    return result
}

User.create = async (user) => {
    // todo: backend validations
    user.password = crypto.createHash('sha256').update(user.password).digest('hex');
    const [result,fields] = await dbConn.query('INSERT INTO USERS ' + 
    '(fk_userId, fk_roleId, name, surname, birthday, email, password, address, id_code) ' +
    'VALUES (?,?,?,?,?,?,?,?,?)', [user.parent, user.roleId, user.name, user.surname, user.birthday, 
        user.email, user.password, user.address, user.id_code])
    delete user.password
    return await User.findOne({id: result.insertId})
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