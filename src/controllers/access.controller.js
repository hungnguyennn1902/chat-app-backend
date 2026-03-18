'use strict'

import { Created, NoContent, OK } from "../core/success.response.js"
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
            data: await AccessService.signIn(req, res)
        }).send(res)
    }

    static async signOut(req, res, next) {
        new NoContent({
            message: 'User signed out successfully',
            data: await AccessService.signOut(req, res)
        }).send(res)
    }

}

export default AccessController