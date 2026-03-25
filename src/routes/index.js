'use strict'
import express from 'express'
import accessRouter from './access/index.js'
import userRouter from './user/index.js'
import protectedRoute from '../middlewares/authMiddleware.js'
import friendRouter from './friend/index.js'
import messageRouter from './message/index.js'
import conversationRouter from './conversation/index.js'
const router = express.Router()

router.use('/v1/api/auth', accessRouter)
router.use(protectedRoute)
router.use('/v1/api/users', userRouter)
router.use('/v1/api/friends', friendRouter)
router.use('/v1/api/messages', messageRouter)
router.use('/v1/api/conversations', conversationRouter)



export default router

