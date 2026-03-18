'use strict'
const StatusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204
}
const ReasonStatusCode = {
    OK: 'OK',
    CREATED: 'Created!',
    NO_CONTENT: 'No Content'
}
class SuccessResponse {
    constructor({ message, status = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, data = {} }) {
        this.message = message || reasonStatusCode
        this.status = status
        this.data = data
    }
    send(res) {
        return res.status(this.status).json(this)
    }
}
class OK extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, data })
    }
}
class Created extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, status: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED, data })
    }
}
class NoContent extends SuccessResponse {
    constructor({ message, data }) {
        super({ message, status: StatusCode.NO_CONTENT, reasonStatusCode: ReasonStatusCode.NO_CONTENT, data })
    }
}
export { OK, Created, NoContent, SuccessResponse }
