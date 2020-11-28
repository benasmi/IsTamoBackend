'user strict';
var dbConn = require('../config/db_connection');

//User object create
var User = function(user){
    this.email     = user.email;
   
};

User.create = function (newUser, result) {    
    dbConn.query("INSERT INTO USERS set ?", newUser, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

module.exports= User;