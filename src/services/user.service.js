'use strict'

import { NotFoundError } from "../core/error.response.js"

class UserService {
    static async getProfile(req, res, next) {
        const user = req.user
        if(!user) {
            throw new NotFoundError('User not found')
        }
        return user
    }
}

export default UserService