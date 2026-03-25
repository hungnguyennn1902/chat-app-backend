import { Created, OK } from "../core/success.response.js"
import MessageService from "../services/message.service.js"
class MessageController {
    static async sendDirectMessage(req, res) {
        new Created({
            message: 'Message sent successfully',
            data: await MessageService.sendDirectMessage(req, res)
        }).send(res)
    }
    static async sendGroupMessage(req, res) {
        new Created({
            message: 'Message sent successfully',
            data: await MessageService.sendGroupMessage(req, res)
        }).send(res)
    }
}
export default MessageController