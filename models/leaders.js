const mongoose=require('mongoose')
const schema=mongoose.Schema;
const leaders=new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        required:true
    }

})
const leader=mongoose.model('leader',leaders)
module.exports=leader