const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const UserLoginModel = require('./models/User_Login')
const BlacklistTokenModel = require('./models/BlacklistToken')

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USER'], process.env['DB_PASSWORD'], {
  host: process.env['DB_HOST'],
  dialect:  'postgres',
  protocol: 'postgres',
  port:     process.env['DB_PORT'],
  dialectOptions: {
    "ssl": {
      "require":true,
      "rejectUnauthorized": false
    }
  },
  define: {
    timestamps: false
  },

  pool: {
      max: 20,
      min: 0,
      idle: 5000
  },
  logging:false
});

const User = UserModel(sequelize, Sequelize);
const User_Login = UserLoginModel(sequelize, Sequelize);
const BlacklistToken = BlacklistTokenModel(sequelize, Sequelize);

sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('db and tables have been created');
});

module.exports = {User, User_Login, BlacklistToken};
