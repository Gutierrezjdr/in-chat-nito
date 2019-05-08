var express = require('express');
var router = express.Router();
var db= require("../db.js");
//var user =require('../control/appControl.js'); //Gets user functions
var mysql = require('mysql')


var conn=db;

 
router.post('/', function(req, res, next) {
	
	
	if(req.cookies.userID && req.cookies.username){
		
			res.clearCookie('userID');
			res.clearCookie('username');
			res.clearCookie('page');
			res.clearCookie('courses');
			
			res.status(200).send("Cookie cleared");
			//throw new Error('Cookie not cleared');
	}else{
			//res.status(404).send("No User Signed In");
			
	}
	

});

module.exports=router;