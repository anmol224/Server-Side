const express=require('express')
const promoRouter=express.Router();
const bodyParser=require('body-parser')
var authenticate=require('../authenticate')
promoRouter.use(bodyParser.json())
const promotions=require('../models/promotions')
promoRouter.route('/')

.get((req,res,next) =>
{
    promotions.find({})
    .then((promo) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err) => next(err))
    .catch((err) => next(err))

})
.put(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
     {
        res.statusCode=403;
        res.end("Put operation not Supported")
     }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err)
    }
})
.post(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true){
    promotions.create(req.body)
    .then((promo) =>
    {
        console.log('Promotion created ',promo)
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
 err=new Error("You are not authorized to perform this operation!")
    err.status=403;
    return next(err)
   }
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true){
    promotions.remove({})
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
    var err=new Error("You are not authorized to perform this operation!")
    err.status=403;
    return next(err)
   }
});

promoRouter.route('/:promoId')
.get((req,res,next) =>
{
    promotions.findById(req.params.promoId)
    .then((promo) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err) => next(err))
    .catch((err) => next(err))
})
.put(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true){
    promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{
        new:true
    })
    .then((promo) =>
    {
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
    var err=new Error("You are not authorized to perform this operation!")
    err.status=403;
    return next(err)
   }
})
.post(authenticate.verifyUser,(req,res,next) => 
{
    if(req.user.admin==true)
    {
        res.statusCode=403;
    res.end("Post operation not Supported")
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err)
    }
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true){
    promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
    var err=new Error("You are not authorized to perform this operation!")
    err.status=403;
    return next(err)
   }
})
module.exports=promoRouter;
