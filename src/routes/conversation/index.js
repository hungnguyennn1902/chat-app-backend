'use strict'
import express from 'express'
import ConversationController from '../../controllers/conversation.controller.js'
import asyncHandler from '../../helpers/asyncHandler.js'
const router = express.Router()

router.get('/', asyncHandler(ConversationController.getConversations))
router.post('/', asyncHandler(ConversationController.createConversation))
router.get('/:conversationId/messages', asyncHandler(ConversationController.getMessages))
router.patch('/:conversationId/seen', asyncHandler(ConversationController.markAsSeen))

export default router