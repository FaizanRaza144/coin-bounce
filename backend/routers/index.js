const express = require("express");
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const router = express.Router();
const auth = require('../middleware/auth');
const commentController = require('../controller/commentController');


router.get('/test',(req,res)=>{
    res.json({msg:"testing purpose"})
})

//user
//login
router.post('/login',authController.login);

//register
router.post('/register',authController.register);

//logout
router.post('/logout',auth,authController.logout);
//refresh-token
router.get('/refresh',authController.refresh);


//blog
//crud
//Create a new blog
router.post('/blog',auth,blogController.create);
//read all blogs - homa page
router.get('/blog/all',auth,blogController.getAll);
//read a specific blog by id
router.get('/blog/:id',auth,blogController.getById);
//update
router.put('/blog',auth,blogController.update);
//delete
router.delete('/blog/:id',auth,blogController.delete);

//comments
//create comments
router.post('/comment',auth, commentController.create);

//REad comments by blog id
router.get('/comment/:id',auth,commentController.getById);



module.exports = router;