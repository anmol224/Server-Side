const express=require('express')
const bodyParser=require('body-parser')
const leaderRouter=express.Router();
const leaders=require('../models/leaders');
var authenticate=require('../authenticate')
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
.post(authenticate.verifyUser,(req,res,next)=>
{
   if(req.user.admin==true)
   {
    leaders.create(req.body)
    .then((leader) =>
    {
        res.setHeader('Content-Type','application/json')
        res.statusCode=200
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
       var err=new Error( "You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }

})
.put(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
    {
        res.statusCode=403
    res.end('PUT operation not supported')
    }
    else
    {
        var err=new Error( "You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true)
   {
    leaders.remove()
    .then((leader) =>
    {
        res.setHeader('Content-Type','application/json')
        res.statusCode=200
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
    var err=new Error( "You are not authorized to perform this operation!")
    err.status=403;
    return next(err);
   }
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
.put(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
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
    }
    else
    {
        var err=new Error( "You are not authorized to perform this operation!")
    err.statusCode=403;
    return next(err);
    }

})
.post(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
    {
        res.statusCode=403;
    res.end("Post operation not supported")
    }
    else
    {
        var err=new Error( "You are not authorized to perform this operation!")
    err.statusCode=403;
    return next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
  if(req.user.admin==true)
  {
    leaders.findByIdAndRemove(req.params.leaderId)

    .then((leader) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader)
    },(err) => next(err))
    .catch((err) => next(err))
  }
  else
  {
    var err=new Error( "You are not authorized to perform this operation!")
    err.statusCode=403;
    return next(err);
  }
})
module.exports =  leaderRouter;
