require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const helmet = require('helmet');
const logger = require('morgan');

const app = express();

const port = process.env.PORT || 4500


// Getting data in json format

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Setting up cors

var cors = require('cors');
var corsOption = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Using Helmet

app.use(helmet())

// Logger

app.use(logger('common'))

//Setting swagger Documentation

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'Node-Js-Auth API',
    version: '1.0.0',
    description: 'Documentation for Node-Js Auth backend API',
  },
  host: 'localhost:4500',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js','./models/User.js'],
  
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});


//Importing Routes
const login = require('./routes/loginUser');
const register = require('./routes/registerUser');
const logout=require('./routes/logout')
const forgetPassword = require('./routes/forgotPassword');
const resetPassword = require('./routes/resetPassword')
const updatePassword = require('./routes/updatePassword')
const updatePasswordViaEmail = require('./routes/updatePasswordViaEmail');
const findUsers = require('./routes/findUsers')
const deleteUser = require('./routes/deleteUser')
const updateUser = require('./routes/updateUser')
const user_logins = require('./routes/user_logins')

//Using imported Routes
app.use('/api/v1', login);
app.use('/api/v1', register);
app.use('/api/v1', logout);
app.use('/api/v1', forgetPassword);
app.use('/api/v1', resetPassword);
app.use('/api/v1', updatePassword);
app.use('/api/v1', updatePasswordViaEmail);
app.use('/api/v1', findUsers);
app.use('/api/v1', deleteUser);
app.use('/api/v1', updateUser);
app.use('/api/v1', user_logins);



//==================================================================================================================================

app.get('/', function (req, res) {
  console.log('route / is accessed.');
  res.send('Hi');
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
