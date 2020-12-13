'news strict';
const dbConn = require('../db');

//News object create
var News = function(news) {
   
}

News.find = async (data) => {
    const [news, fields] = await dbConn.query("SELECT NEWS.* FROM NEWS " +
    "WHERE " + 
    "id=COALESCE(?,id) and title LIKE CONCAT(CONCAT('%', COALESCE(?, title)), '%') and " + 
    "content LIKE CONCAT(CONCAT('%', COALESCE(?, content)), '%') and " + 
    "insertion_date BETWEEN COALESCE(?,insertion_date) AND COALESCE(?,insertion_date) and " + 
    "alter_date BETWEEN COALESCE(?,alter_date) AND COALESCE(?,alter_date)", 
    [data.id, data.title, data.content, data.insertion_date_from, 
        data.insertion_date_to, data.alter_date_from, data.alter_date_to])
    return news
}

News.findOne = async (data) => {
    const result = await News.find(data)
    return result[0]
}

News.create = async (data) => {
    const [result, fields] = await dbConn.query("INSERT INTO NEWS (fk_userId, title, content) VALUES (?,?,?)",
    [data.userId, data.title, data.content])
    return await News.find({ id: result.insertId })
}

News.update = async (data) => {
    const [result, fields] = await dbConn.query("UPDATE NEWS SET " + 
    "title = COALESCE(?, title), " + 
    "content = COALESCE(?, content), alter_date = NOW() " + 
    "WHERE id=?", [data.title, data.content, data.id])
    return await News.find({ id: data.id })
}

News.delete = async (data) => {
    const [result, fields] = await News.find({ id: data.id })
    await dbConn.query("DELETE FROM NEWS " + 
    "WHERE id=?", [data.id])
    return result
}

News.getUpvotes = async (data) => {
    const [result,fields] = await dbConn.query("SELECT * FROM UP_VOTES " + 
    "WHERE fk_newsId=COALESCE(?,fk_newsId) and fk_userId=COALESCE(?,fk_userId)", 
    [data.newsId, data.userId])
    return result
}

News.countUpvotes = async (data) => {
    const [result,fields] = await dbConn.query("SELECT COUNT(id) as count FROM UP_VOTES " + 
    "WHERE fk_newsId=COALESCE(?,fk_newsId) and fk_userId=COALESCE(?,fk_userId)", 
    [data.newsId, data.userId])
    return result[0].count
}

News.upvote = async (data) => {
    if (!data || !data.userId || !data.newsId) 
        throw new Error("Missing parameters")

    const [result,fields] = await dbConn.query("INSERT IGNORE INTO UP_VOTES (fk_userId, fk_newsId)" + 
    "VALUES (?, ?)", [data.userId, data.newsId])

    return await News.getUpvotes({ id: data.newsId, userId: data.userId })
}

News.downvote = async (data) => {
    if (!data || !data.userId || !data.newsId) 
        throw new Error("Missing parameters")

    const [result,fields] = await dbConn.query("DELETE FROM UP_VOTES " + 
    "WHERE fk_userId=? and fk_newsId=?", [data.userId, data.newsId])

    return await News.getUpvotes({ id: data.newsId, userId: data.userId })
}

module.exports = News