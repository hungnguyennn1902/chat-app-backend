import mongoose from "mongoose";
import config from "../configs/config.js";
const { host, port, name } = config.db
const connectionString = `mongodb://${host}:${port}/${name}`
const connectDB = async () => {
    try {
        await mongoose.connect(connectionString)
        console.log("DB connected successfully")
    } catch (error) {
        console.error("DB connection failed", error)
        process.exit(1)
    }
}
await connectDB()
