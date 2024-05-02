const jwt = require('jsonwebtoken')
const User = require('../models/userRegister')
const config = require('../utils/config')

const auth = {
    isAuth: async (req, res, next) => {
        try {
            //get the token from the request cookies
            const token = req.cookies.token
            //if there is no token, return 401
            if (!token) {
                return res.status(401).json({ error: 'Unauthorized' })
            }
            //verify the token
            try {
                const decoded = jwt.verify(token, config.JWT_SECRET)
                //get the user id from the dedoded token and
                //and attach it to the request object
                req.userId = decoded.id

                //call the next middleware
                next()
            } catch (error) {
                res.status(401).json({ error: 'Invalid Token' })
            }

        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }
}
module.exports = auth