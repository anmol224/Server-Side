var express = require('express');
var router = express.Router();
const bodyparser=require('body-parser')
var users=require('../models/user');
var passport=require('passport')
const { ExpectationFailed } = require('http-errors');
const user = require('../models/user');
router.use(bodyparser.json())
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.end('respond with a resource');
});
router.post('/signup',(req,res,next) =>
{
users.register(new users({username:req.body.username}),req.body.password,
(err,user) =>
{
  if(err){
    res.statusCode=500;
    res.setHeader('Content-Type','application/json')
    res.json({err:err})
    
  }
  else
  {
    passport.authenticate('local')(req,res,() =>
    {
      res.statusCode=200;
      res.setHeader('Content-Type','application/json')
      res.json({success:true,status:'Registration Successfull!'})
    })
  }
})
})

router.post('/login',passport.authenticate('local'),(req,res,next)=>
{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json')
  res.json({success:true,status:'You are logged in'})
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
