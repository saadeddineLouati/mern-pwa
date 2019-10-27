var mongoose=require("mongoose");

var faqSchema=new mongoose.Schema({
    question:String,
    answer: String,
    created_at: {type: Date, default: Date.now}
});

module.exports=mongoose.model("Faq", faqSchema);