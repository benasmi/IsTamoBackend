'room strict';
const dbConn = require('../db');

//Mark object create
var Room = function(room) {}

Room.getRoom = async (data) => {
    const [room,f] = await dbConn.query("SELECT * FROM ROOM " +
    "WHERE id=?", [data.roomId])
    return room[0]
}

Room.getRooms = async (data) => {
    const [rooms,f] = await dbConn.query("SELECT * FROM ROOM")
    return rooms
}

module.exports = Room