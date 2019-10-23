var mongoose=require("mongoose");

var favouriteShema=new mongoose.Schema({
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "game"
        }
});

module.exports=mongoose.model("Favourite", favouriteShema);