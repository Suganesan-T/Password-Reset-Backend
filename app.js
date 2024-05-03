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
    origin: "http://localhost:5175",
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5175');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


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