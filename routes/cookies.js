var express = require('express');
var router = express.Router();
var db= require("../db.js");
//var user =require('../control/appControl.js'); //Gets user functions
var mysql = require('mysql')


var conn=db;

 
router.get('/', function(req, res, next) {

	if(req.cookies==null)
	{
		console.log("Error"+err);
		res.status(404).send("No User logged in");
	} else{
		console.log(JSON.stringify(req.cookies));
	res.status(200).send(JSON.stringify(req.cookies));
	}
	
});

router.post('/', function(req, res, next) {
	console.log("This is the body ");
	console.log(req.body.input);
	console.log(req.body.value);

	//var input=req.params.name;
	res.cookie(req.body.input,req.body.value);
	
	res.status(200).send("ALL Good");//.send(req.params);
});

router.post('/:name', function(req, res, next) {
	console.log("This is the body ");
	
	var input=req.params.name;
	res.cookie('page',input);
	
	res.status(200).send("ALL Good");//.send(req.params);
});


module.exports=router;