//import mongoose
const mongoose = require('mongoose');
const crypto = require('crypto');

//create schema

const Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    passwordResetToken:{
        type: String,
    },
    passwordResetTokenExpires:{
        type: Date,
    },
    passwordChangedAt:{
        type: Date,
    }
})

Schema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
}
//export schema
module.exports = mongoose.model('User', Schema);