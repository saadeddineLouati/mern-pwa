var mongoose=require("mongoose");

var searchSchema=new mongoose.Schema({
    date : {type: Date, default: Date.now},
    author: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    text: String
});

module.exports=mongoose.model("Search", searchSchema);