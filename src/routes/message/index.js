'use strict'
import express from 'express'
import MessageController from '../../controllers/message.controller.js'
import asyncHandler from '../../helpers/asyncHandler.js'
const router = express.Router()

router.post('/direct', asyncHandler(MessageController.sendDirectMessage))
router.post('/group', asyncHandler(MessageController.sendGroupMessage))

export default router