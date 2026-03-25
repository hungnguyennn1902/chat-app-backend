'use strict'
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    hashedPassword:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true
    },
    displayName:{
        type:String,
        required:true,
        trim:true
    },
    avatarUrl:{
        type:String, // CDN Link
        default:null
    },
    avatarId:{
        type:String, // Cloudinary public_id
        default:null
    },
    bio: {
        type: String,
        maxLength: 500
    },
    phone:{
        type:String,
        sparse:true
    }
},{
    timestamps:true
})
const User = mongoose.model("User", userSchema)
export default User