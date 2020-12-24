const mongoose=require('mongoose')
const schema=mongoose.Schema;
var passportLocalMongoose=require('passport-local-mongoose')
const User=new schema({
    
   userName:{
       type:String,
       default:''
   },
   lastName:{
       type:String,
       default:''
   },
    admin:{
        type:Boolean,
        default:false
    }

})
User.plugin(passportLocalMongoose);
module.exports=mongoose.model('user',User)