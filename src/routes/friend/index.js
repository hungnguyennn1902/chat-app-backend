'use strict'
import express from 'express'
import FriendController from '../../controllers/friend.controller.js'
import asyncHandler from '../../helpers/asyncHandler.js'
const router = express.Router()

router.post('/requests', asyncHandler(FriendController.sendFriendRequest))
router.post('/requests/:requestId/accept', asyncHandler(FriendController.acceptFriendRequest))
router.post('/requests/:requestId/decline', asyncHandler(FriendController.declineFriendRequest))
router.get('/', asyncHandler(FriendController.getAllFriends))
router.get('/requests', asyncHandler(FriendController.getFriendRequests))

export default router