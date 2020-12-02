const mongoose=require('mongoose')
const schema=mongoose.Schema;
const User=new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }

})
module.exports=mongoose.model('user',User)