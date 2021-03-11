let mongoose=require("mongoose")
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/authUsers', {useNewUrlParser: true});

const db = mongoose.model('User', new Schema({ email: {type:String,required:true},password:{type:String}}));
module.exports=db;
