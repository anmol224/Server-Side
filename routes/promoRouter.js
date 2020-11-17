const express=require('express')
const promoRouter=express.Router();
const bodyParser=require('body-parser')
promoRouter.use(bodyParser.json())
promoRouter.route('/')
.all((req,res,next) =>
{
    res.statusCode=200;
    res.setHeader('Content-type','text/plain')
    next();
})
.get((req,res,next) =>
{
    res.end("Will Send all promotions")

})
.put((req,res,next) =>
{
    res.statusCode=403;
    res.end("Put operation not Supported")
})
.post((req,res,next) =>
{
    res.end("Will update promotions with " + req.body.name +  " and with description " + req.body.description) 
})
.delete((req,res,next) =>
{
    res.end('Will delete all the promotions')
});

promoRouter.route('/:promoId')
.get((req,res,next) =>
{
    res.end("Will send promotion with id: " + req.params.promoId)
})
.put((req,res,next) =>
{
    res.write("Updating promotion woth Promoid: " + req.params.promoId + "\n")
    res.end("Updating promotions with " + req.body.name + " and description " + req.body.description)
})
.post((req,res,next) => 
{
    res.statusCode=403;
    res.end("Post operation not Supported")
})
.delete((req,res,next) =>
{
    res.end("Deleting promotion with Id " + req.params.promoId)
})
module.exports=promoRouter;
