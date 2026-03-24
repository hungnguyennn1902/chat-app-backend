import { OK } from "../core/success.response.js"
import MessageService from "../services/message.service.js"
class MessageController {
    static async sendDirectMessage(req, res) {
        new OK({
            message: 'Message sent successfully',
            data: await MessageService.sendDirectMessage(req, res)
        }).send(res)
    }
    static async sendGroupMessage(req, res) {

    }
}
export default MessageController