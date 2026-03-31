import jwt from 'jsonwebtoken'
import User from '../models/User.js'
export const socketAuthMiddleware = async (socket, next) => {
    try{
        const token = socket.handshake.auth?.token
        if(!token) {
            console.error('Socket authentication error: No token provided')
            return next(new Error('Authentication error: No token provided'))
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(!decoded){
            console.error('Socket authentication error: Invalid token')
            return next(new Error('Authentication error: Invalid token'))
        }

        const user = await User.findById(decoded.id).select('-hashedPassword').lean()

        if(!user) {
            console.error('Socket authentication error: User not found')

            return next(new Error('Authentication error: User not found'))
        }
        socket.user = user
        next()
        
    }catch(error) {
        console.error('Socket authentication error:', error)
        next(new Error('Authentication error'))
    }
}