const jwt = require('jsonwebtoken');

const {Blacklist,User_Login}= require('../sequelize');


function blacklistToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("black")
  if (token == null)
    return res.sendStatus(401);


  Blacklist.findOne({ where: {token: token } })
    .then((found) => {

      if (found){
        console.log("this")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
          const login = await User_Login.findOne({where:{ user_id : payload.id, token_id: payload.token_id}});
          login.logged_out=true;
          login.token_deleted=true;
          await login.save();
        });
        details={
          "Status":"Failure",
          "Details":'Token blacklisted. Cannot use this token.'
        }

        return res.status(401).json(details);
      }
      else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
          if (err)
            return res.sendStatus(403);
          if(payload){
            const login = await User_Login.findOne({where:{ user_id : payload.id, token_id: payload.token_id}})
            if(login.token_deleted==true){
              login.logged_out=true;
              await login.save()
              const blacklist_token = Blacklist.create({
                token:token
              });
            }
            else{
              login.logged_out=true;
              login.token_deleted=true;
              await login.save();
              const blacklist_token = Blacklist.create({
                token:token
              });
            }
          }
          next();
        });
      }
    });
}

module.exports = blacklistToken
