import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

//init middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(helmet())
app.use(compression())
//init db
import './dbs/mongodb.js'
//init routes

//handing error

export default app