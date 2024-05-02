//import express
const express = require('express');

//import express router
const router = express.Router();

//import controller
const controller = require('../controllers/userController');
const auth = require('../middlewares/auth');

//define endpoints
router.post('/', controller.register);
router.post('/login', controller.login);
router.get('/me', auth.isAuth, controller.getCurrentUser);
router.get('/logout', auth.isAuth, controller.logout);
router.post("/forgetPassword", controller.forgetPassword);
router.put("/resetPassword/:resetToken", controller.resetPassword);

//export the router
module.exports = router;

