const jwt = require('jsonwebtoken');

const {BlacklistToken,User_Login}= require('../sequelize');

const Blacklist=BlacklistToken

//MIDDLEWARE TO AUTHENTICTAE TOKEN BEFORE ACCESSING PROTECTED ROUTES
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  // token_bl = Blacklist.findOne({ where: {token: token } });
  console.log("token")
  if (token == null)
    return res.sendStatus(401);

  // Blacklist.findOne({ token: token }, function (err, found) {
  //   if (found){
  //     details={
  //       "Status":"Failure",
  //       "Details":'Token blacklisted. Cannot use this token.'
  //     }
  //
  //     return res.status(401).json(details);
  //   }
  //   else {
  //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //       if (err)
  //         return res.sendStatus(403);
  //       console.log(user)
  //       req.user = user;
  //       next();
  //     });
  //   }
  // });

  Blacklist.findOne({ where: {token: token } })
      .then((found) => {
        console.log("this")

        if (found){
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
                const blacklist_token = Blacklist.create({
                  token:token
                });
                return res.sendStatus(401)
              }
            }
            req.user = payload;
            next();
          });
        }
      });

}

module.exports = authenticateToken
