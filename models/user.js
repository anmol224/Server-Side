const mongoose=require('mongoose')
const schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose')
const User=new schema({
    
   
    admin:{
        type:Boolean,
        default:false
    }

})
User.plugin(passportLocalMongoose);
module.exports=mongoose.model('user',User)