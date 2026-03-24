import { BadRequestError } from "../core/error.response.js"
import Conversation from "../models/Conversation.js"
import Message from "../models/Message.js"
import { updateConversationAfterMessageSent } from "../helpers/messageHelper.js"
class MessageService {
    static async sendDirectMessage(req, res) {
        const { recipientId, content, conversationId } = req.body
        const senderId = req.user._id

        let conversation

        if (!content) {
            throw new BadRequestError('Message content cannot be empty')
        }

        if (conversationId) {
            conversation = await Conversation.findById(conversationId)
        }

        if (!conversation) {
            conversation = await Conversation.create({
                type: 'direct',
                participants: [
                    { userId: senderId, joinedAt: new Date() },
                    { userId: recipientId, joinedAt: new Date() }
                ],
                lastMessageAt: new Date(),
                unreadCounts: new Map()
            })
        }

        const message = await Message.create({
            conversationId: conversation._id,
            content,
            senderId
        })
        updateConversationAfterMessageSent(conversation, message, senderId)

        await conversation.save()

        return {message}

    }
    static async sendGroupMessage(req, res) {

    }
}
export default MessageService