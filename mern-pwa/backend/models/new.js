var mongoose=require("mongoose");

var newSchema=new mongoose.Schema({
    caption: String,
    created_at: {type: Date, default: Date.now},
    game: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: "game"
        
    },
    country: String,
    maxAge: String,
    minAge: String,
    sexe: String
});

module.exports=mongoose.model("New", newSchema);