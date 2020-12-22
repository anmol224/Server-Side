var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var user=require('./models/user')
var jwtStrategy=require('passport-jwt').Strategy;
var Extractjwt=require('passport-jwt').ExtractJwt;
var jwt=require('jsonwebtoken');
var config=require('./config')
exports.local=passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
exports.getToken=function(user){
    return jwt.sign(user,config.secretKey,{
        expiresIn:3600
    })
}
var opts={};
opts.jwtFromRequest=Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=config.secretKey;
exports.jwtPassport=passport.use(new jwtStrategy(opts,
    (jwt_payload,done)=>
    {
        console.log("JWT_PAYLOAD",jwt_payload);
        user.findOne({_id:jwt_payload._id},(err,user)=>
        {
            if (err){
                return done(err,false)
            }
            else if(user){
                return done(null,user)
            }
            else{
                return done(null,false)
            }
        })
    }))
    exports.verifyUser=passport.authenticate('jwt',{session:false})