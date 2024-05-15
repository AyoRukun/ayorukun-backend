module.exports = class AppError{
    AppError(message, code){
        this.message = message
        this.code = code
    }
}
