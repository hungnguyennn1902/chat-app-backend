'use strict'
import express from 'express'
import asyncHandler from '../../helpers/asyncHandler.js'
import UserController from '../../controllers/user.controller.js'
const router = express.Router()

router.get('/me', asyncHandler(UserController.getProfile))

export default router