const express=require('express')
const promoRouter=express.Router();
const bodyParser=require('body-parser')
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
.put((req,res,next) =>
{
    res.statusCode=403;
    res.end("Put operation not Supported")
})
.post((req,res,next) =>
{
    promotions.create(req.body)
    .then((promo) =>
    {
        console.log('Promotion created ',promo)
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete((req,res,next) =>
{
    promotions.remove({})
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err))
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
.put((req,res,next) =>
{
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
})
.post((req,res,next) => 
{
    res.statusCode=403;
    res.end("Post operation not Supported")
})
.delete((req,res,next) =>
{
    promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err))
})
module.exports=promoRouter;
