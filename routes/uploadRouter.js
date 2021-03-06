const express=require('express');
var multer=require('multer')
const bodyparser=require('body-parser')
const uploadRouter=express.Router();
var authenticate=require('../authenticate');

uploadRouter.use(bodyparser.json())
const storage=multer.diskStorage(
    {
        destination:(req,file,cb) =>
        {
            cb(null,'public/images')
        },
        filename:(req,file,cb) =>
    {
            cb(null,file.originalname)   
    }
    }
    
)
const imageFileFilter=(req,file,cb) =>
{
    if(!file.originalname.match(/\.(jpg|png|jpeg|gif)$/))
    {
        return cb(new Error('You can upload only image files ',false))
    }
    else
    {
        return cb(null,true)
    }
}
const upload=multer({
storage:storage,
fileFilter:imageFileFilter
})
uploadRouter.route('/')
.get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    res.status=403;
    res.end('GET operation not supported on /imageUpload')
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    res.status=403;
    res.end('PUT operation not supported on /imageUpload')
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,upload.single('imageFile'),(req,res)=>
{
    res.status=200;
    res.setHeader('Content-Type','application/json')
    res.end(req.file)
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>
{
    res.status=403;
    res.end('DELETE operation not supported on /imageUpload')
})
module.exports=uploadRouter;