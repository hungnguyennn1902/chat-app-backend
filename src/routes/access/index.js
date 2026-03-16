'use strict'
import express from 'express'
import AccessController from '../../controllers/access.controller.js'
import asyncHandler from '../../helpers/asyncHandler.js'
const router = express.Router()

router.post('/user/signup', asyncHandler(AccessController.signUp))
router.post('/user/signin', asyncHandler(AccessController.signIn))

export default router