'use strict'
import brcypt from 'bcrypt'
import { BadRequestError, ConflictRequestError, UnauthorizedError } from "../core/error.response.js"
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import Session from '../models/Session.js'
import crypto from 'crypto'
const accessTokenTTL = '30m' 
const refreshTokenTTL = 14*24*60*60*1000 // 14 days in milliseconds
class AccessService {
    static async signUp({username, password, email, firstName, lastName}) {

        // Validate input
        if(!username || !password || !email || !firstName || !lastName) {
            throw new BadRequestError('Missing required fields')
        }

        // Check if user already exists
        const duplicate = await User.findOne({$or: [{username}, {email}]}).lean()
        if(duplicate) {
            throw new ConflictRequestError('Username or email already exists')
        }

        // Hash password
        const hashedPassword = await brcypt.hash(password, 10)

        // Create user
        const user = await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        })

        return {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    }
    static async signIn(req, res) {

        const {username, password} = req.body

        // Validate input
        if(!username || !password) {
            throw new BadRequestError('Missing username or password')
        }

        // Find user
        const user = await User.findOne({username}).lean()
        if(!user) {
            throw new UnauthorizedError('Invalid username or password')
        }

        // check password
        const isMatch = await brcypt.compare(password, user.hashedPassword)
        if(!isMatch) {
            throw new UnauthorizedError('Invalid username or password')
        }

        // Create access token with user info and access token secret
        const accessToken = jwt.sign(
            {id: user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: accessTokenTTL}
        )

        // Create refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex')

        // Store refresh token in DB
        await Session.create({
            userId: user._id,
            refreshToken,
            expiresAt: new Date(Date.now() + refreshTokenTTL)
        })

        // Return refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: refreshTokenTTL
        })

        return {
            id: user._id,
            username: user.username,
            email: user.email,
            accessToken
        }
    }

    static async signOut (req, res) {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken
        
        // Delete session from DB
        await Session.deleteOne({refreshToken})

        // Clear cookie
        res.clearCookie('refreshToken')
        
        return;
    }

    static async refreshToken(req, res) {
        // Get refresh token from cookie
        const refreshToken = req.cookies?.refreshToken
        if(!refreshToken) {
            throw new UnauthorizedError('No refresh token provided')
        }

        // Find session in DB
        const session = await Session.findOne({refreshToken}).lean()
        if(!session) {
            throw new UnauthorizedError('Invalid refresh token')
        }
        if(new Date() > session.expiresAt) {
            throw new UnauthorizedError('Refresh token expired')
        }

        // Create new access token
        const accessToken = jwt.sign(
            {id: session.userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: accessTokenTTL}
        )
        return { accessToken }

    }
}
export default AccessService