//import dotenv package
require('dotenv').config();

//create all necessary configuration variables

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PWD = process.env.EMAIL_PWD;

//export all configuration variables
module.exports = {
    MONGODB_URI,
    PORT,
    JWT_SECRET,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PWD
}