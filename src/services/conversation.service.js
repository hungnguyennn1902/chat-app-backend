import { BadRequestError } from '../core/error.response.js'
import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
class ConversationService {
    static async createConversation(req, res) {
        const { type, name, memberIds } = req.body
        const userId = req.user._id

        if (!type || (type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            throw new BadRequestError('Invalid conversation data')
        }

        let conversation

        if (type === 'direct') {
            const paticipantId = memberIds[0]
            conversation = await Conversation.findOne({
                type: 'direct',
                "participants.userId": {
                    $all: [userId, paticipantId]
                }
            })
            if (!conversation) {
                conversation = await Conversation.create({
                    type: 'direct',
                    participants: [
                        { userId },
                        { userId: paticipantId }
                    ],
                    lastMessageAt: new Date(),
                })
            }
        }

        if (type === 'group') {
            conversation = await Conversation.create({
                type: 'group',
                participants: [
                    { userId },
                    ...memberIds.map(id => ({ userId: id }))
                ],
                group:{
                    name,
                    createdBy: userId
                },
                lastMessageAt: new Date(),
            })
        }

        if (!conversation) {
            throw new BadRequestError('Invalid conversation type')
        }

        await conversation.populate([
            { path: 'participants.userId', select: 'displayName avatarUrl' },
            {
                path: 'seenBy',
                select: 'displayName avatarUrl'
            },
            { path: "lastMessage.senderId", select: 'displayName avatarUrl' }
        ])

        return conversation
    }

    static async getConversations(req, res) {
        const userId = req.user._id
        const conversations = await Conversation.find({
            "participants.userId": userId
        }).sort({ lastMessageAt: -1, createdAt: -1 }).populate(
            [
                { path: 'participants.userId', select: 'displayName avatarUrl' },
                {
                    path: 'seenBy',
                    select: 'displayName avatarUrl'
                },
                { path: "lastMessage.senderId", select: 'displayName avatarUrl' }
            ]
        )

        const formatted = conversations.map((c) => {
            const participants = (c.participants || []).map((p) => ({
                _id: p.userId?._id,
                displayName: p.userId?.displayName,
                avatarUrl: p.userId?.avatarUrl,
                joinedAt: p.joinedAt
            }))
            return {
                ...c.toObject(),
                unreadCount: c.unreadCount || {},
                participants
            }
        })

        return formatted
    }

    static async getMessages(req, res) {
        const { conversationId } = req.params
        const {limit = 50, cursor} = req.query
        const query = { conversationId }
        if (cursor) {
            query.createdAt = { $lt: new Date(cursor) }
        }
        let messages = await Message.find(query).sort({ createdAt: -1 }).limit(Number(limit)+1)

        let nextCursor = null

        if(messages.length > Number(limit)){
            const nextMessage = messages[messages.length - 1]
            nextCursor = nextMessage.createdAt.toISOString()
            messages.pop()
        }
        messages.reverse()
        return{
            messages,
            nextCursor
        }

    }

    static async getUserConversationsForSocketIO(userId) {
        try{
            const conversations = await Conversation.find(
                {"participants.userId": userId},
                {_id: 1}
            )
            return conversations.map(c => c._id.toString())
        }catch(error) {
            console.error('Error fetching user conversations for Socket.IO:', error)
        }
    }
}
export default ConversationService