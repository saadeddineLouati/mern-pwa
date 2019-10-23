var mongoose=require("mongoose");

var topSchema=new mongoose.Schema({
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

module.exports=mongoose.model("Top", topSchema);