const jwt = require('jsonwebtoken');
const {ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET} = require('../conifg/index')
const RefreshToken = require ('../models/token')



class JWTService {


    //Sign Access Token
    static SignAccessToken(payload,expiryTime){
        return jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn:expiryTime});
    }


    //Sign Refresh Token
   static  SignRefreshToken(payload,expiryTime){
        return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn:expiryTime})
    }


    //Verify Access Token
  static  VerifyAccessToken(token){
        return jwt.verify(token,ACCESS_TOKEN_SECRET);
    }


    //Verify Refresh Token
   static VerifyRefreshToken(token){
        return jwt.verify(token,REFRESH_TOKEN_SECRET);
    }

    //Store Refresh Token
      static async  StoreRefreshToken(token,userID){
        try{
            const newToken = new RefreshToken({
                token:token,
                userID:userID
            });
            //stores in DB
            await newToken.save();
        }
        catch(error){
            console.log(error);
        }
    }
}

module.exports = JWTService;