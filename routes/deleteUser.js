/* eslint-disable no-console */
const {User} = require('../sequelize');
const router = require('express').Router();
const authenticateToken = require('../middlewares/authenticateToken');

/**
 * @swagger
 * /deleteUser:
 *   delete:
 *     tags:
 *       - Users
 *     name: Delete User
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         in: query
 *         schema:
 *           $ref: '#/definitions/User'
 *           type: string
 *         required:
 *           - username
 *     responses:
 *       '200':
 *         description: User deleted from db
 *       '403':
 *         description: Authentication error
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */

router.delete('/deleteUser', authenticateToken,(req, res, next) => {
     
        User.destroy({
          where: {
            username: req.query.username,
          },
        })
          .then((userInfo) => {
            if (userInfo === 1) {
              console.log('user deleted from db');
              res.status(200).send('user deleted from db');
            } else {
              console.error('user not found in db');
              res.status(404).send('no user with that username to delete');
            }
          })
          .catch((error) => {
            console.error('problem communicating with db');
            res.status(500).send(error);
          });
      
});

module.exports=router;