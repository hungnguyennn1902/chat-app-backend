'use strict'


import FriendService from '../services/friend.service.js'
import { Created, NoContent, OK } from '../core/success.response.js'

class FriendController {

    static async sendFriendRequest(req, res) {
        new Created({
            message: 'Friend request sent successfully',
            data: await FriendService.sendFriendRequest(req, res)
        }).send(res)
    }

    static async acceptFriendRequest(req,res){
        new OK({
            message: 'Friend request accepted successfully',
            data: await FriendService.acceptFriendRequest(req, res)
        }).send(res)
    }

    static async declineFriendRequest(req,res){
        new NoContent({
            message: 'Friend request declined successfully',
            data: await FriendService.declineFriendRequest(req, res)
        }).send(res)
    }

    static async getAllFriends(req,res){
        new OK({
            message: 'Friends retrieved successfully',
            data: await FriendService.getAllFriends(req, res)
        }).send(res)
    }

    static async getFriendRequests(req,res){
        new OK({
            message: 'Friend requests retrieved successfully',
            data: await FriendService.getFriendRequests(req, res)
        }).send(res)
    }
}
export default FriendController