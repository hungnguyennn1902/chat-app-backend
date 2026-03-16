'use strict'

import { Created } from "../core/success.response"
import AccessService from "../services/access.service.js"
class AccessController {
    static async signUp(req, res, next) {
        new Created({
            message: 'User created successfully',
            data: await AccessService.signUp(req.body)
        }).send(res)
    }
}

export default AccessController