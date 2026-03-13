import app from './src/app.js'
import dotenv from 'dotenv'
dotenv.config()
import config from './src/configs/config.js'
const PORT = config.app.port

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed gracefully')
        process.exit(0)
    })
})