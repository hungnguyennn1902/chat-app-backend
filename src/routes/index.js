'use strict'
import express from 'express'
import accessRouter from './access/index.js'
import userRouter from './user/index.js'
import protectedRoute from '../middlewares/authMiddleware.js'
const router = express.Router()

router.use('/v1/api/auth', accessRouter)
router.use(protectedRoute)
router.use('/v1/api/users', userRouter)

export default router

