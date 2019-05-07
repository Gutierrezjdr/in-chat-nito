var express = require('express');
var session = require('express-session');
var router = express.Router();
var db= require("../db.js");
//var user =require('../control/appControl.js'); //Gets user functions
var mysql = require('mysql')


var conn=db;

 
router.get('/:name', function(req, res, next) {
    //console.log(req.params.name);
    var username=req.params.name;
    console.log("Username given:" + username );
    if(username ==undefined){
        res.status(404).send("User Not input");
    } else {

    
    conn.query('SELECT * FROM user_table WHERE username= ?',username,function(err,rows){

        //runs if err has input after select user

        if(err){
            res.status(404).send("User Does Not Exist");
        }

        if(rows.length === 0){
            //console.log("This row is empty!");

            res.status(404).send("User Does Not Exist");
        }
        else{

            console.log(rows[0]);
           
            //console.log(rows[0].userID); //Outputs user ID
            //Returns userID and username
            
            res.cookie('userID', (rows[0].userID).toString());
            res.cookie('username',(rows[0].username).toString());
            
            res.cookie({maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 3000, httpOnly:false});
            //console.log(req.cookies);
            res.status(200).send("User Login Succesful");



        }
    });
    }


});

module.exports=router;