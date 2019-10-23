var mongoose=require("mongoose");
var searchable = require('mongoose-regex-search');
var gameShema=new mongoose.Schema({
    title:String,
    kind:String,
    studioName:String,
    pervPublished:String,
    mode:String,
    rating:String,
    grades:String,
    icon:String,
    description:String,
    gameLink:String,
    trailer:String,
    images:Array,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

gameShema.plugin(searchable);
module.exports=mongoose.model("game", gameShema);
