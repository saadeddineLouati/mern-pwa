var mongoose=require("mongoose");

var viewsShema=new mongoose.Schema({
    date : {type: Date, default: Date.now},
    author: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "game"
    }
});

module.exports=mongoose.model("View", viewsShema);