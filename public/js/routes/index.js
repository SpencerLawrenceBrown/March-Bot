var express 	= require('express');
var router 		= express.Router();
var chatBackend = require("../../../app/chat/brain");

//Take the text
chatBackend.init();

router.use(function(req, res, next){
	//Do logging
	console.log(req.method, req.url);
	next();
});

router.get("/", function(req, res){
	res.render('pages/index');
});

router.get("/incoming", function(req, res){
	console.log(req.query);
	//chatBackend.analyze(req.body.from.endpoint, req.body.to.endpoint, req.body.message);
	res.status(200);
	res.end("Message Received");
});

module.exports = router;