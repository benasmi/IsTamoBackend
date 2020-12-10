'system strict';
const dbConn = require('../db');

//System object create
var System = function(system) {}

System.getParams = async () => {
    const [result,fields] = await dbConn.query("SELECT * FROM GLOBAL_SETTINGS ORDER BY id DESC LIMIT 1")
    return result[0]
}

System.updateParams = async (data) => {
    const params = await System.getParams()
    const id = params.id

    await dbConn.query("UPDATE GLOBAL_SETTINGS SET " + 
    "version=COALESCE(?,version), theme=COALESCE(?,theme), alter_date=NOW(), " + 
    "school_name=COALESCE(?,school_name), school_address=COALESCE(?,school_address), " +
    "school_number=COALESCE(?,school_number) " + 
    "WHERE id=?", [data.version, data.theme, data.school_name, 
        data.school_address, data.school_number, id])

    return await System.getParams()
}

module.exports = System