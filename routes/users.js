var express = require('express');
var router = express.Router();
const bodyparser=require('body-parser')
var users=require('../models/user');
const { ExpectationFailed } = require('http-errors');
router.use(bodyparser.json())
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end('respond with a resource');
});
router.post('/signup',(req,res,next) =>
{
users.findOne({username:req.body.username})
.then((user) =>
{
  if(user!=null){
    var err=new Error('User' + req.body.username+ 'already exists')
    err.status=403;
    next(err)
  }
  else
  {
  users.create({username:req.body.username,password:req.body.password})
  }
  
})
.then((user)=>
{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json')
  res.json({status:'Registration successfull',user:user})
 
},(err) => next(err))
.catch((err) => next(err))
})
router.post('/login',(req,res,next)=>
{
  if(!req.session.user){
    var authHeader=req.headers.authorization
    if(!authHeader){
      var err=new Error('You are not an authenticated user')
      res.setHeader('www-Authenticate','Basic')
      err.status=401;
      return next(err)
    }
    var auth=new Buffer.from(authHeader.split(' ')[1],"base64").toString().split(':');
    var username=auth[0]
    var password=auth[1]
    users.findOne({username:username})
    .then((user) =>
    {
      if(user === null){
        var err=new Error('User does not exists')
        err.statusCode=403;
        return next(err)
      }
      else if(user.password!==password)
        {
          var err= new Error("Your password is incorrect")
          err.statusCode=403;
          return next(err)
        }
        else if(user.username===username && user.password===password){
          req.session.user='Authenticated'
          res.statusCode=200;
          res.setHeader('Content-Type','application/text')
          res.write('You are now authenticated')
        }
    })
    .catch((err) => next(err))
    
    
  }
  else{
    res.statusCode=200;
    res.setHeader('Content-type','text/plain')
    res.end('you are already authenticated')
  }
 
})
router.get('/logout',(req,res,next) =>
{
  if(req.session){
    req.session.destroy()
    res.clearCookie("session-id")
    res.redirect('/')
  }
  else
  {
    var err= new Error("YOU are not logged in")
    err.statusCode=403;
    next(err)
  }
})
module.exports = router;
