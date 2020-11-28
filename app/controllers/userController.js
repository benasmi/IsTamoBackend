'use strict';

const User = require('../model/user');

exports.create = function(req, res) {
    const new_employee = {name: "Name"}

    //handles null error 
   if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    }else{
        User.create(new_employee, function(err, employee) {
            console.log("PAteka")
            if (err)
            res.send(err);
            res.json({error:false,message:"Employee added successfully!",data:employee});
        });
    }
};
