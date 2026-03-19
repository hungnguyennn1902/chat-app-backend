'use strict'

import { OK } from "../core/success.response.js"
import UserService from "../services/user.service.js"

class UserController {
    static async getProfile(req, res, next) {
        new OK({
            message: 'User profile retrieved successfully',
            data: await UserService.getProfile(req, res, next)
        }).send(res)
    }
}

export default UserController