var express    = require("express"),
	router     = express.Router(),
	passport   = require("passport"),
	User 	   = require("../models/user");	 

//root route
router.get("/" , function(req , res){
	res.render("landing");
});

//show regiter form
router.get("/register" , function(req , res){
	res.render("register");
});

//handling sign up logic
router.post("/register" , function(req , res){
	var newUser = new User({username : req.body.username});
	User.register( newUser , req.body.password , function(err , user){
		if(err){
			req.flash("error" , err.message);
		    res.redirect("/register");
		}
		passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Welcome to YelpCamp " + user.username);
			res.redirect("/blogs");
		});
	});
});

//show login form
router.get("/login" , function(req , res){
	res.render("login");
});

//handling login logic
router.post("/login" , passport.authenticate("local" , 
	{
	successRedirect : "/blogs",
	failureRedirect : "/login"
    }) , function(req , res){
});
 
//logout route
router.get("/logout" , function(req , res){
	req.logout();
	req.flash("success" , "You logged out");
	res.redirect("/blogs");
});

module.exports = router;