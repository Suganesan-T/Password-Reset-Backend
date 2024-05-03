//require express
const express = require('express');

//import userRoute from routes

const userRoute = require('./routes/userRoute');

//create express app
const app = express();

//require cors
const cors = require('cors');

//require cookie-parser
const cookieParser = require('cookie-parser');

//requrie morgan
const morgan = require('morgan');

//use cors app
const allowedOrigins = ['https://cerulean-pastelito-5561d7.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Check if the request origin is allowed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


//use cookie-parser app
app.use(cookieParser());

//use morgan app
app.use(morgan('dev'));

//middlewares
app.use(express.json());

//define edn points
app.use('/api/users', userRoute);

//export app
module.exports = app;