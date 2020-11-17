const express=require('express');
const bodyParser=require('body-parser');
const dishRouter=express.Router();
dishRouter.use(bodyParser.json())
const mongoose=require('mongoose')
const dishes=require('../models/dishes')
dishRouter.route('/')

.get((req,res,next) =>
{
    dishes.find({})
    .then((dishes) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
    },(err) =>next(err))
    .catch((err) => next(err))
})
.put((req,res,next) =>
{
    res.statusCode=403;
    res.end("Sorry put operation not supported")
})
.post((req,res,next) =>
{
    dishes.create(req.body)
    .then((dish) =>
    {
        console.log("Dish Created ",dish)
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete((req,res,next) =>
{
    dishes.remove({})
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err))
});

dishRouter.route('/:dishId')
.get((req,res,next) =>
{
    dishes.findById(req.params.dishId)
    .then((dish) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err))   
})
.post((req,res,next) =>
{
    res.statusCode=403;
    res.end('Post operation not supported on /dishes/:'+ req.params.dishId)
})
.put((req,res,next) =>
{
    dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{
        new:true
    })
    .then((dish) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete((req,res,next) => 
{
    dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },(err) => next(err))
    .catch((err) => next(err))
})
module.exports=dishRouter;
