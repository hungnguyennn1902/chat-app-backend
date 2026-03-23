import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import router from './routes/index.js'
const app = express()
import cors from 'cors'
import cookieParser from 'cookie-parser'

//init middlewares
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(cors({origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true}))


//init db
import './dbs/mongodb.js'

//init routes
app.use(router)

//handling errors
app.use((req, res, next)=>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next)=>{
    const statusCode = error.status || 500
    res.status(statusCode).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

export default app