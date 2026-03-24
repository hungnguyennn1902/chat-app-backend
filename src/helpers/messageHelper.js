export const updateConversationAfterMessageSent = (conversation, message, senderId) =>{
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage:{
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt
        }
    })

    conversation.participants.forEach((p) => {
        const memberId = p.userId.toString()
        const isSender = memberId === senderId.toString()
        const prevCount = conversation.unreadCount.get(memberId)
        conversation.unreadCount.set(memberId, isSender ? 0 : (prevCount || 0) + 1)
    })

}