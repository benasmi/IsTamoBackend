'mark strict';
const dbConn = require('../db');

//Mark object create
var Mark = function(mark) {
   
}

Mark.find = async (data) => {
    const [marks,fields] = await dbConn.query("SELECT * FROM MARK " + 
    "WHERE id=COALESCE(?,id) and fk_subjectId=COALESCE(?,fk_subjectId) " + 
    "and fk_userId=COALESCE(?,fk_userId) and IFNULL(mark_type, '') LIKE COALESCE(?,mark_type,'%%') and " + 
    "insertion_date BETWEEN COALESCE(?,insertion_date) AND COALESCE(?,insertion_date) and " + 
    "alter_date BETWEEN COALESCE(?,alter_date) AND COALESCE(?,alter_date) and " + 
    "mark BETWEEN COALESCE(?,mark) AND COALESCE(?,mark)",
    [data.id, data.subjectId, data.userId, data.mark_type, data.insertion_date_from,
    data.insertion_date_to, data.alter_date_from, data.alter_date_to, data.mark_from, data.mark_to])

    return marks
}

Mark.findOne = async (data) => {
    const result = await Mark.find(data)
    return result[0]
}

Mark.create = async (data) => {
    console.log(data)
    if (!data || !data.subjectId || !data.userId || data.description === undefined || !data.mark)
        throw new Error("Missing parameters")

    const [result,fields] = await dbConn.query("INSERT INTO MARK " + 
    "(mark, fk_subjectId, fk_userId, mark_type, description) VALUES " + 
    "(?,?,?,?,?)", [data.mark, data.subjectId, data.userId, data.mark_type,
    data.description])

    return await Mark.findOne({id: result.insertId})
}

Mark.update = async (data) => {
    console.log(data)
    if (!data || !data.id)
        throw new Error("Missing parameters")

    const [result,fields] = await dbConn.query("UPDATE MARK " + 
    "SET mark=COALESCE(?,mark), fk_subjectId=COALESCE(?, fk_subjectId), " + 
    "mark_type=COALESCE(?,mark_type), description=COALESCE(?,description), " +
    "fk_userId=COALESCE(?,fk_userId), alter_date=NOW()" +
    "WHERE id=?", [data.mark, data.subjectId, data.mark_type,
    data.description, data.userId, data.id])
        console.log(result)
    return await Mark.findOne({id: data.id})
}

Mark.delete = async (data) => {
    const deleted = await Mark.findOne({id: data.id})
    await dbConn.query("DELETE FROM MARK WHERE id=?", [data.id])
    return deleted
}

Mark.getAverage = async (data) => {
    const [marks,fields] = await dbConn.query("SELECT AVG(mark) as average FROM MARK " + 
    "WHERE fk_subjectId=COALESCE(?,fk_subjectId) " + 
    "and fk_userId=COALESCE(?,fk_userId) and IFNULL(mark_type, '') LIKE COALESCE(?,mark_type,'%%')", 
    [data.subjectId, data.userId, data.mark_type])

    return marks
}

module.exports = Mark