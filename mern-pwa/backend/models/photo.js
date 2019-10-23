var mongoose=require("mongoose");

var photosShema=new mongoose.Schema({
    name:String,
    caption:String,
    state:String,
    kind:String,
    uploaded_at: {type: Date, default: Date.now},
    uploaded_by: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports=mongoose.model("Photo", photosShema);