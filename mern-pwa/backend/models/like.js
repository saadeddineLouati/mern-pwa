var mongoose=require("mongoose");

var likeSchema=new mongoose.Schema({
    created_at: {type: Date, default: Date.now},
    author: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    comment: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
        
    }
});

module.exports=mongoose.model("Like", likeSchema);