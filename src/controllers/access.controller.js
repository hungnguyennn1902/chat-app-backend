'use strict'

import { Created, OK } from "../core/success.response.js"
import AccessService from "../services/access.service.js"
class AccessController {
    static async signUp(req, res, next) {
        new Created({
            message: 'User created successfully',
            data: await AccessService.signUp(req.body)
        }).send(res)
    }
    static async signIn(req, res, next) {
        new OK({
            message: 'User signed in successfully',
            data: await AccessService.signIn(req.body)
        }).send(res)
    }


}

export default AccessController