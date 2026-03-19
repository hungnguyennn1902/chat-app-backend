import { NotFoundError, UnauthorizedError } from "../core/error.response.js"
import jwt from 'jsonwebtoken'
import User from "../models/User.js"
const protectedRoute = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const accessToken = authHeader && authHeader.split(' ')[1]

    if(!accessToken) {
        throw new UnauthorizedError('Access token is missing')
    }

    // Verify access token and extract user info
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
        if(err) {
            throw new UnauthorizedError('Invalid access token')
        }
        const user = User.findById(decodedUser.id).select(
            {
                hashedPassword: 0,
                _v: 0,
                createdAt: 0,
                updatedAt: 0
            }
        ).lean()
        if(!user) {
            throw new NotFoundError('User not found')
        }
        req.user = user
        next()
    })
}
export default protectedRoute