const express=require('express');
const bodyParser=require('body-parser');
const dishRouter=express.Router();
dishRouter.use(bodyParser.json())
var authenticate=require('../authenticate')
const mongoose=require('mongoose')
const dishes=require('../models/dishes')
dishRouter.route('/')

.get((req,res,next) =>
{
    dishes.find({})
   // .populate('comments.author')
    .then((dishes) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dishes)
    },(err) =>next(err))
    .catch((err) => next(err))
})
.put(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true)
   {
    res.statusCode=403;
    res.end("Sorry put operation not supported")
   }
   else
   {
       err=new Error("You are not authorized to perform this operation!")
        err.status=404;
        return next(err)
    }
})
.post(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
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
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
    {
        dishes.remove({})
    .then((resp) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err))
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }
});

dishRouter.route('/:dishId')
.get((req,res,next) =>
{
    dishes.findById(req.params.dishId)
    //.populate('comments.author')
    .then((dish) =>
    {
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(dish)
    },(err) => next(err))
    .catch((err) => next(err))   
})
.post(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
    {
        res.statusCode=403;
        res.end('Post operation not supported on /dishes/:'+ req.params.dishId)
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }
    
    
   
})
.put(authenticate.verifyUser,(req,res,next) =>
{
    if(req.user.admin==true)
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
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err);
    }
})
.delete(authenticate.verifyUser,(req,res,next) => 
{
    if(req.user.admin==true)
    {
        dishes.findByIdAndRemove(req.params.dishId)
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
        return next(err);
    }
})
dishRouter.route('/:dishId/comments')

.get((req,res,next) =>
{
    dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>
    {
        if(dish!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments)
        }
        else
        {
            err=new Error('Dish' + req.params.dishId + 'Not found')
            err.status=404;
            return next(err)
        }
       
    },(err) =>next(err))
    .catch((err) => next(err))
})
.put(authenticate.verifyUser,(req,res,next) =>
{
    res.statusCode=403;
    res.end("Sorry put operation not supported on dishes/" + req.params.dishId + "/comments")
})
.post(authenticate.verifyUser,(req,res,next) =>
{

    dishes.findById(req.params.dishId)
    .then((dish) =>
    {
       if(dish!=null)
       {
           req.body.author=req.user._id;
           dish.comments.push(req.body)
           dish.save()
           .then((dish) =>
           {
               dishes.findById(dish._id)
               .populate('comments.author')
               .then((dish)=>
               {
                res.statusCode=200;
                res.setHeader("Content-Type","application/json")
                res.json(dish)
               })
           },err => next(err))
       }
       else
       {
           err=new Error('Dish' + req.params.dishId + 'Not Found')
           err.status=404;
           return next(err) 
       }
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete(authenticate.verifyUser,(req,res,next) =>
{
   if(req.user.admin==true)
   {
    dishes.findById(req.params.dishId)
    .then((dish) =>
    {
        if(dish!=null)
        {
            for(var i=dish.comments.length-1;i>=0;i--)
                {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
            dish.save()
            .then((dish) =>
            {
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            },(err) => next(err))

        }
        else
        {
            err=new Error('Dish' + req.params.dishId + 'Not Found')
            err.status=404;
            return next(err)
        }
       
    },(err) => next(err))
    .catch((err) => next(err))
   }
   else
   {
    var err=new Error('You are not authorized to perform this operation!')
    err.status=404;
    return next(err) 
   }
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) =>
{
    dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) =>
    {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(dish.comments.id(req.params.commentId))
        }
        else if(dish==null)
        {
            err=new Error('Dish ' + req.params.dishId + 'Not Found' )
            err.status=404;
            return next(err)
        }
        else
        {
            err=new Error('Comment ' + req.params.commentId + 'Not Found' )
            err.status=404;
            return next(err)
        }

    },(err) => next(err))
    .catch((err) => next(err))   
})
.post(authenticate.verifyUser,(req,res,next) =>
{
    res.statusCode=403;
    res.end('Post operation not supported on /dishes/:'+ req.params.dishId + '/comments/' + req.params.commentId)
})
.put(authenticate.verifyUser,(req,res,next) =>
{
    dishes.findById(req.params.dishId)
    .then((dish) =>
    {
        var authorId=dish.comments.id(req.params.commentId).author;
        if((req.user._id).equals(authorId))
        {
        if(dish!=null && dish.comments.id(req.params.commentId)!=null)
        {
            if(req.body.rating)
            {
                dish.comments.id(req.params.commentId).rating=req.body.rating;
            }
            if(req.body.comment)
            {
                dish.comments.id(req.params.commentId).comment=req.body.comment;
            }
            dish.save()
            .then((dish) =>
            {
                dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>
                {
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
                })
                
            },(err) => next(err))
        }
        else if(dish==null)
        {
            err=new Error('Dish ' + req.params.dishId + 'Not Found')
            err.status=404;
            return next(err)
        }
        else
        {
            err=new Error('Comment ' + req.params.commentId + 'Not Found')
            err.status=404;
            return next(err)
        }
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err)
    }
    },(err) => next(err))
    .catch((err) => next(err))
})
.delete(authenticate.verifyUser,(req,res,next) => 
{
   dishes.findById(req.params.dishId)
   .then((dish) => 
   {
    var authorId=dish.comments.id(req.params.commentId).author;
    if((req.user._id).equals(authorId))
    {
       if(dish!=null && dish.comments.id(req.params.commentId)!=null)
       {
            dish.comments.id(req.params.commentId).remove()
            dish.save()
            .then((dish) =>
            {
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(dish)
            },(err) => next(err))
       }
       else if(dish == null)
       {
           err= new Error('Dish ' + req.params.dishId + 'Not Found')
           err.status=404;
           return next(err)
       }
       else
       {
           err= new Error('Comment ' + req.params.commentId  + 'Not Found')
            err.status=404;
            return next(err)
        }
    }
    else
    {
        var err=new Error("You are not authorized to perform this operation!")
        err.status=403;
        return next(err)
    }
   },(err) => next(err))
   .catch((err) => next(err))
})
module.exports=dishRouter;
