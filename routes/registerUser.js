/* eslint-disable arrow-parens */
/* eslint-disable no-console */
const {User} = require('../sequelize');
const bcrypt = require("bcryptjs");
const router = require("express").Router();

var { generateToken, sendToken } = require('../utils/token.utils');


/**
 * @swagger
 * /registerUser:
 *   post:
 *     tags:
 *       - Users
 *     name: Register
 *     summary: Register a new user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: object
 *           properties:
 *             first_name:
 *               type: string
 *             last_name:
 *               type: string
 *             username:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - username
 *           - email
 *           - password
 *     responses:
 *       '200':
 *         description: User created
 *       '403':
 *         description: Username or email already taken
 */

router.post('/registerUser', async (req, res , next) => {

  const userexists = await User.findOne({ where: {username: req.body.username ,email: req.body.email } });

  console.log(userexists)
  if (userexists)
    return res.status(400).send({
      message: 'username or email already taken',
    });

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const saveduser = await User.create({
      email:req.body.email,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashedPassword
    });
    req.user=saveduser;
    req.auth={
      id:req.user.id,
      register:true
    }

    next();
  } catch (err) {
    console.log(err);

    return res.status(400).send(err);
  }
},generateToken,sendToken);


module.exports=router;