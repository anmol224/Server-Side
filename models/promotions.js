const mongoose=require('mongoose')
const schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose)

const Currency=mongoose.Types.Currency;
const promotions=new schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true

    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Currency,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        featured:false
    }
},
{
    timestamps:true
})
var promos=mongoose.model('promo',promotions)
module.exports=promos;