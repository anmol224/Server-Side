const express=require('express')
const bodyParser=require('body-parser')
const leaderRouter=express.Router();
const leaders=require('../models/leaders');

leaderRouter.route('/')

.get((req,res,next) =>
{
    leaders.find({})
    .then((leader) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))
})
.post((req,res,next)=>
{
   leaders.create(req.body)
   .then((leader) =>
   {
       res.setHeader('Content-Type','application/json')
       res.statusCode=200
       res.json(leader)
   },(err) => next(err))
   .catch((err) => next(err))

})
.put((req,res,next) =>
{
    res.statusCode=403
    res.end('PUT operation not supported')
})
.delete((req,res,next) =>
{
   leaders.remove()
   .then((leader) =>
   {
       res.setHeader('Content-Type','application/json')
       res.statusCode=200
       res.json(leader)
   },(err) => next(err))
   .catch((err) => next(err))
})

leaderRouter.route('/:leaderId')
.get((req,res,next)=>
{
    leaders.findById(req.params.leaderId)
    .then((leader) =>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))
})
.put((req,res,next) =>
{
    leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{
        new:true
    })
    .then((leader) =>
    {
        res.statusCode=200
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))

})
.post((req,res,next) =>
{
    res.statusCode=403;
    res.end("Post operation not supported")
})
.delete((req,res,next) =>
{
   leaders.findByIdAndRemove(req.params.leaderId)

   .then((leader) =>
   {
       res.statusCode=200;
       res.setHeader('Content-Type','application/json')
       res.json(leader)
   },(err) => next(err))
   .catch((err) => next(err))
})
module.exports =  leaderRouter;
