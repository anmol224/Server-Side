const express=require('express')
const bodyParser=require('body-parser')
const leaderRouter=express.Router();
leaderRouter.route('/')
.all((req,res,next) =>
{
    res.statusCode=200;
    res.setHeader('Content-type','text/plain')
    
})
.get((req,res,next) =>
{
    res.end("Will send all the leaders")
})
.post((req,res,next)=>
{
    res.end("Will create new leader " + req.body.name + " with description " + req.body.description)

})
.put((req,res,next) =>
{
    res.statusCode=403
    res.end('PUT operation not supported')
})
.delete((req,res,next) =>
{
    res.end("Delete operation not supported")
})

leaderRouter.route('/:leaderId')
.get((req,res,next)=>
{
    res.end(" Will send leader information with Id " + req.params.leaderId )
})
.put((req,res,next) =>
{
    res.write("Will update leader with Id " + req.params.leaderId + "\n")
    res.end("Updating with " + req.body.name + " with description " + req.body.description )
})
.post((req,res,next) =>
{
    res.statusCode=403;
    res.end("Post operation not supported")
})
.delete((req,res,next) =>
{
    res.end("Deleting leader with Id " + req.params.leaderId)
})
module.exports =  leaderRouter;
