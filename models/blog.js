
var mongoose = require("mongoose");
 
var blogSchema = new mongoose.Schema({
   title: String,
   content: String,
   published: Date, 
   updated: Date, 
   author :{
   	id : {
   		type : mongoose.Schema.Types.ObjectId,
   		ref : "User"
   	} ,
   	username : String
   } ,
   image: String, 
   tags: String 
});

module.exports = mongoose.model("Blog", blogSchema);