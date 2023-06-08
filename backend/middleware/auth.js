const JWTService = require('../services/JWTService');
const UserDTO = require('../DTO/user');
const User = require('../models/users');


 const  auth = async(req,res,next) =>{
   try {
    const {accessToken,refreshToken} = req.cookies;
    if(!accessToken || !refreshToken ){
        const error ={
            status: 401,
            message: 'Unauthorized'
        }
        return next(error);
    }
    let _id
    try {

        _id = JWTService.VerifyAccessToken(accessToken)._id;

        
    } 
    catch (error) {
        return next(error);
    }
    let user;
    try {
           user = await  User.findOne({_id:_id});

    } catch (error) {
        return next(error);
    }
    const userDTO  = new UserDTO(user);

    req.user = userDTO;
    next();

   } catch (error) {
    return next(error);
   }


}

module.exports = auth;