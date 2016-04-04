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

router.post("/incoming", function(req, res){
	console.log(req.body);
	chatBackend.analyze(req.body.from.endpoint, req.body.to.endpoint, req.body.message);
});

module.exports = router;