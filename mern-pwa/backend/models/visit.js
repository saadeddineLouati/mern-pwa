var mongoose=require("mongoose");

var visitShema=new mongoose.Schema({
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

module.exports=mongoose.model("Visit", visitShema);