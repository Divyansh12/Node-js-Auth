/* eslint-disable no-console */
const {User} = require('../sequelize');
const router = require("express").Router();
const bcrypt = require("bcryptjs");

var { generateToken, sendToken } = require('../utils/token.utils');

/**
 * @swagger
 * /loginUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Login
 *     summary: Logs in a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - username
 *           - password
 *     responses:
 *       '200':
 *         description: User found and logged in successfully
 *       '401':
 *         description: Bad username, not found in db
 *       '403':
 *         description: Username and password don't match
 */

router.post('/loginUser', async (req, res, next) => {
  //check if the username does not exist
  const userexists = await User.findOne({ where: {username: req.body.username  } });
  if (!userexists)
    return res.status(401).send('Username or password is wrong');

  //check password
  const validPass = await bcrypt.compare(req.body.password, userexists.password);
  if (!validPass)
    return res.status(403).send('Password is incorrect');

  req.user=userexists
  req.auth={
    id:req.user.id,
    register:false
  }
  next();
},generateToken,sendToken);

 
module.exports = router;
