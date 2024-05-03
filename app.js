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
app.use(cors({
    origin: "*",
    credentials: true
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