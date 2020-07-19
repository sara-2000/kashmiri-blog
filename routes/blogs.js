
var express    = require("express"),
	router     = express.Router(),
	Blog = require("../models/blog"),
	middleware = require("../middleware");

var multer = require('multer');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    	return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});

var cloudinary = require('cloudinary');
cloudinary.config({ 
	cloud_name: 'dh2bhwtur', 
	api_key:"711544293299258", 
	api_secret:"ezyc3NldJmid5evFFHb9B2iSRbs"
});
// INDEX ROUTE - displays list of blogs
router.get("/" , function(req , res){
	//get all blogs from the db
	Blog.find({} , function(err , allBlogs){
		if(err){
			console.log(err);
		}else{
			res.render("blogs/index" , {blog: allBlogs });
		}
	});
});

// CREATE ROUTE - adds new blog to db
router.post("/" , middleware.isLoggedIn , upload.single('image') ,function(req , res){
	var author = {
		id : req.user._id,
		username : req.user.username
	};
	//get data from form 
	var newBlog = {
		title: req.body.title,
		content: req.body.content,
		// published: req.body.published, 
		// updated: req.body.updated, 
		author: author,
		image: req.body.image, 
		tags: req.body.tags 
	} ;
	console.log(req.file);
	console.log(req.body);
	cloudinary.uploader.upload(req.file.path, function(result) {
		console.log("/////////////////////////////////////////////////////");
		console.log(result);
	// add cloudinary url for the image to the campground object under image property
		image = result.secure_url;
		newBlog.image = image;
		//create a new blog and add to database
		Blog.create(newBlog , function(err , newlyCreated){
			if(err){
				console.log(err);
			}else{
				//redirect back to blogs page
				req.flash("success" , "Successfully created blog");
				res.redirect("/blogs");
			}
		});
	});
});


//NEW ROUTE - displays form to make new blog
router.get("/new" , middleware.isLoggedIn , function(req , res){
	res.render("blogs/new");
});

//SHOW ROUTE - shows info about one blog
router.get("/:id" , function(req , res){
	//find the blog with the provided id
	Blog.findById(req.params.id , function(err , foundBlog){
		if(err || !foundBlog){
			console.log(err);
			req.flash("error" , "Sorry , Blog not found");
			res.redirect("/blogs");
		}else{
			//render show template with that blog
			res.render("blogs/show" , {blog:foundBlog});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit" , middleware.checkBlogOwnership , function(req , res){
	Blog.findById(req.params.id , function(err , foundBlog){
			res.render("blogs/edit" , {blog : foundBlog});
	});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id" , middleware.checkBlogOwnership , function(req , res){
	Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updated){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id" , middleware.checkBlogOwnership , function(req , res){
	Blog.findByIdAndRemove(req.params.id , function(err , deleted){
		if(err){
			res.redirect("/blogs");
		}else{
			req.flash("success" , "Successfully deleted blog");
			res.redirect("/blogs");
		}
	});
});

module.exports = router;