var jwt = require('jsonwebtoken');
var customId = require("custom-id");
var {User_Login}= require('../sequelize')

var createToken = async function(req) {
 
    const token_id = await customId({
      user_id : req.auth.id,
      date : Date.now(),
      randomLength: 4 
    });
    var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress

    const user_logins=await User_Login.findAll({where:{ user_id: req.auth.id ,token_deleted:false, ip_address:ip, device: req.headers["user-agent"]}});
    user_logins.forEach(async(login) => {
      if(login){
        login.token_deleted=true;
        await login.save()
      }      
    });
    
    // console.log(ip)
    // console.log(req.remoteAddress)
    const token_secret=await customId({
      token_secret : ip,
      date : Date.now(),
      randomLength: 8 
    });

    const token = await User_Login.create({
      user_id : req.auth.id,
      token_id : token_id,
      token_secret : token_secret ,
      ip_address : ip ,
      device : req.headers["user-agent"]
    });

    const token_user = { id:req.auth.id , token_id: token_id  };
    const accessToken = await jwt.sign(token_user, process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
};

module.exports = {
  generateToken: async function(req, res, next) {
      req.token = await createToken(req);
      return next();
  },

  sendToken: function(req, res) {

      if(req.auth.register==false){
        message='user found & logged in'
      }
      else{
        message='user created'
      }
      const accessToken= {  auth: true,
      token: req.token,
      message: message}
      
      res.setHeader('x-auth-token', req.token);
    return res.status(200).json(accessToken);

    //   res.setHeader('x-auth-token', req.token);
    //   return res.status(200).send(JSON.stringify(req.user));
  }
};