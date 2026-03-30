import dotenv from 'dotenv'
dotenv.config()
import config from './src/configs/config.js'
const PORT = config.app.port
import { httpServer } from './src/socket/index.js'
const server = httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed gracefully')
        process.exit(0)
    })
})