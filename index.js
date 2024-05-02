//import mongoose 
const mongoose = require('mongoose');

//import config module
const config = require('./utils/config');

//import app module
const app = require('./app');


console.log('Connecting to MongoDB...');

//connect to MongoDB using mongoose
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        //start server
        app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
    })
    .catch(err => {
        console.log('Error connecting to MongoDB', err)
    })

