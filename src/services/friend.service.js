'use strict'

import { BadRequestError, ForbiddenError, NotFoundError } from "../core/error.response.js"
import FriendRequest from "../models/FriendRequest.js"
import Friend from "../models/Friend.js"
import User from "../models/User.js"

class FriendService {
    static async sendFriendRequest(req, res) {
        const { to, message } = req.body
        const from = req.user._id

        let userA = from.toString()
        let userB = to.toString()
        if (userA === userB) {
            throw new BadRequestError('You cannot send a friend request to yourself')
        }
        const userExist = await User.exists({ _id: to })
        if (!userExist) {
            throw new NotFoundError('User not found')
        }
        
        if (userA > userB) {
            [userA, userB] = [userB, userA]
        }
        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({ userA, userB }),
            FriendRequest.findOne({
                $or: [
                    { from, to },
                    { from: to, to: from }
                ]
            }
            )
        ])
        if (alreadyFriends) {
            throw new BadRequestError('You are already friends with this user')
        }
        if (existingRequest) {
            throw new BadRequestError('A friend request already exists between you and this user')
        }
        const request = await FriendRequest.create({ from, to, message })
        return request
    }

    static async acceptFriendRequest(req, res) {
        const { requestId } = req.params
        const userId = req.user._id
        const request = await FriendRequest.findById(requestId)
        if (!request) {
            throw new NotFoundError('Friend request not found')
        }
        if (request.to.toString() !== userId.toString()) {
            throw new ForbiddenError('You are not authorized to accept this friend request')
        }

        const friend = await Friend.create({
            userA: request.from,
            userB: request.to
        })

        const from = User.findById(request.from).select('_id displayName avatarUrl').lean()

        await request.deleteOne()

        return from

    }

    static async declineFriendRequest(req, res) {
        const { requestId } = req.params
        const userId = req.user._id
        const request = await FriendRequest.findById(requestId)
        if (!request) {
            throw new NotFoundError('Friend request not found')
        }
        if (request.to.toString() !== userId.toString()) {
            throw new ForbiddenError('You are not authorized to decline this friend request')
        }
        await request.deleteOne()
        return
    }

    static async getAllFriends(req, res) {
        const userId = req.user._id
        const friendShip = await Friend.find({
            $or: [
                { userA: userId },
                { userB: userId }
            ]
        }).populate('userA', '_id displayName avatarUrl')
        .populate('userB', '_id displayName avatarUrl')
        .lean()
        if (!friendShip.length) {
            return []
        }
        const friends = friendShip.map((f)=> f.userA._id.toString() === userId.toString() ? f.userB : f.userA)
        return friends


    }

    static async getFriendRequests(req, res) {
        const userId = req.user._id
        const populateFields = "_id username displayName avatarUrl"
        const [sent, received] = await Promise.all([
            FriendRequest.find({ from: userId }).populate('to', populateFields).lean(),
            FriendRequest.find({ to: userId }).populate('from', populateFields).lean()
        ])
        return {
            sent,
            received
        }
    }

}
export default FriendService