var mongoose = require("mongoose");

var passportLocalMongose = require("passport-local-mongoose"); 


var UserShema = new mongoose.Schema({
    number:String,
    username: {type: String, unique: true, required: true},
    fullname:String,
    gender:String,
    email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    nationality:String,
    subsType:String,
    subsDate: {type: Date, default: Date.now},
    validateUntil: {type: Date, default: Date.now},
    picture:String,
    admin:String,
    renwable: String,
    score: Number,
    lang:{type: String, default: 'en'},
    favourites:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "game"
        }
    ]
});

UserShema.plugin(passportLocalMongose);
module.exports = mongoose.model("User", UserShema);