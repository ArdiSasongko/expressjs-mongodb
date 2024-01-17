class Error{
    constructor(error, StatusCode, message){
        this.error = error,
        this.StatusCode = StatusCode,
        this.message = message
    }
}

class Success{
    constructor(error, StatusCode, message, data){
        this.error = error,
        this.StatusCode = StatusCode,
        this.message = message
        this.data = data
    }
}

module.exports = { Error, Success }