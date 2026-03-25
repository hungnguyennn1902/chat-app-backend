'use strict';

import { Created, OK } from "../core/success.response.js";
import ConversationService from "../services/conversation.service.js";

class ConversationController{

    static async createConversation(req, res) {
        new Created({
            message: 'Conversation created successfully',
            data: await ConversationService.createConversation(req, res)
        }).send(res)
    }

    static async getConversations(req, res) {
        new OK({
            message: 'Conversations retrieved successfully',
            data: await ConversationService.getConversations(req, res)
        }).send(res)
    }

    static async getMessages(req, res) {
        new OK({
            message: 'Messages retrieved successfully',
            data: await ConversationService.getMessages(req, res)
        }).send(res)
    }
}
export default ConversationController