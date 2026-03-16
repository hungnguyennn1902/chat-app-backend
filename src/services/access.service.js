'use strict'
import brcypt from 'bcrypt'
import { BadRequestError, ConflictRequestError } from "../core/error.response"

class AccessService {
    static async signUp({username, password, email, firstName, lastName}) {
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
    }
}
export default AccessService