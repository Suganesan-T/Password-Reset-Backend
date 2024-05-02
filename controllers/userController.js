//import userRegister from models
const User = require("../models/userRegister");

//import bcrypt for password hashing
const bcrypt = require("bcrypt");

const sendEmail = require("../utils/email");

const crypto = require("crypto")

//import jwt for token generation
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

//define the user controller
const userController = {
    //define register method
    register: async (req, res) => {
        try {
            const { username, password, name } = req.body

            //check if username already exists
            const user = await User.findOne({ username })
            if (user) {
                return res.status(400).json({
                    message: "User already exists"
                })
            }

            //hash password
            const passwordHash = await bcrypt.hash(password, 10)

            //create new user
            const newUser = new User({
                username,
                passwordHash,
                name
            })
            //save user to database
            const savedData = await newUser.save()

            //return a success message with user data
            res.status(200).json({
                message: "User registered successfully",
                data: savedData
            })

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body

            //find user by username
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({
                    message: "User not found"
                })
            }

            //compare password
            const isMatch = await bcrypt.compare(password, user.passwordHash)
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid password"
                })
            }

            //if password is correct generate a token for the user
            const token = jwt.sign({ 
                username: user.username,
                id: user._id,
                name: user.name
            },JWT_SECRET)

            //set a cookie with the token
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) //set the cookie to expire in 7 days
            })
            //return a success message with user data
            res.status(200).json({
                message: "User logged in successfully",
                token
            })

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    //get the current loggedin user
    getCurrentUser: async (req, res) => {
        try {
            //get userid from request object

            const userId = req.userId;

            //find user by id from the database
            const user = await User.findById(userId).select("-passwordHash -__v");

            //if user not in exist
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                })
            }
            //return a success message with user data
            res.status(200).json({
                message: "User found",
                data: user
            })

        } catch (error) {
            res.status(500).json({
                message: error.message
            })  
        }
    },

    logout: async (req, res) => {
        try {
            //clear the cookie
            res.clearCookie("token");
            //return a success message
            res.status(200).json({
                message: "Logged out successfully"
            })

        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    forgetPassword: async (request, response) => {
        const { username } = request.body;
    
        const user = await User.findOne({ username });
    
        if (!user) {
          return response.status(400).json({ message: "User not found" });
        }
    
        const resetToken = user.createResetPasswordToken();
    
        await user.save();
    
        // create a reset url
        const resetUrl = `${request.protocol}://${request.get(
          "host"
        )}/api/users/resetPassword/${resetToken}`;
    
        const message = `We have received a password reset request. Please use the link below to reset your password.\n\n${resetUrl}\n\nThis password link will be valid only for 10 minutes.\n\nIf you havn't initiated the request, please ignore the link.`;
    
        // we need to send the reset token to the user
    
        try {
          await sendEmail({
            email: user.username,
            subject: `Password change request received`,
            message: message,
          });
          response.json({
            status: "success",
            message: "Password reset link sent to the user email",
          });
        } catch (error) {
          (user.passwordResetToken = undefined),
            (user.passwordResetExpires = undefined);
          await user.save();
          console.log(error);
          response.status(500).json({
            message:
              "There was an error sending password reset email. Please try again later",
          });
        }
      },
      resetPassword: async (request, response) => {
        try {
          const { resetToken } = request.params;
    
          const passwordResetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
    
          const user = await User.findOne({
            passwordResetToken: passwordResetToken,
            passwordResetTokenExpires: { $gt: Date.now() },
          });
    
          if (!user) {
            return response
              .status(400)
              .json({ message: "Invalid Token or has expired" });
          }
    
          const passwordHash = await bcrypt.hash(request.body.password, 10);
    
          user.passwordHash = passwordHash;
          user.passwordResetToken = undefined;
          user.passwordResetTokenExpires = undefined;
          user.passwordChangedAt = Date.now();
          await user.save();
    
          response.json({ message: "Password changed successfully!" });
        } catch (error) {
          response.status(500).json({ message: error.message });
        }
      },
}
module.exports = userController;