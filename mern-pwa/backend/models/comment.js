var mongoose=require("mongoose");

var commentsShema=new mongoose.Schema({
    text:String,
    created_at: {type: Date, default: Date.now},
    author: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    }
});

module.exports=mongoose.model("Comment", commentsShema);