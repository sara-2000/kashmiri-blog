var Blog    = require("../models/blog");
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function( req , res , next) {
	//if the user logged in
	if(req.isAuthenticated()){
		Blog.findById(req.params.id , function(err , foundBlog){
			if(err || !foundBlog){
				req.flash("error" , "Sorry , Blog not found");
				res.redirect("back");
			}else{
				//does user own the blog?
				if(foundBlog.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error" , "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	//else redirect
	}else{
		req.flash("error" , "You need to be logged in do to that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error" , "You need to be logged in do to that");
		res.redirect("/login");
	}
}


module.exports = middlewareObj;