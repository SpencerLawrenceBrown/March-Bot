var express 	= require('express');
var router 		= express.Router();

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
});

module.exports = router;